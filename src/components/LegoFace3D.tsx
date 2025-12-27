import React, { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";

const MODEL_PATH = "/models/lego_head.glb";
const FACE_MAT_NAME = "FaceMaterial"; // ✅ 블렌더에서 얼굴(스티커) 재질 이름을 이걸로!

type Expression = "neutral" | "happy" | "sad" | "sweat" | "blank";

interface ModelProps {
    followMouse: boolean;
    fixedRotationY: number;
    fixedRotationX: number;
    spinY?: number;
    expression?: Expression;
    isShaking?: boolean;
}

const LegoModel: React.FC<ModelProps> = ({
    followMouse,
    fixedRotationY,
    fixedRotationX,
    spinY = 0,
    expression = "neutral",
    isShaking = false,
}) => {
    const { scene } = useGLTF(MODEL_PATH);
    const modelRef = useRef<THREE.Group>(null);

    const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0, z: 0 });
    const shakeOffset = useRef({ x: 0, y: 0 });

    // ✅ 표정 PNG 텍스처 로드
    const faceTex = useTexture({
        neutral: `${import.meta.env.BASE_URL}tex/face_neutral.png`,
        happy: `${import.meta.env.BASE_URL}tex/face_happy.png`,
        sad: `${import.meta.env.BASE_URL}tex/face_sad.png`,
        sweat: `${import.meta.env.BASE_URL}tex/face_sweat.png`,
        blank: `${import.meta.env.BASE_URL}tex/face_blank.png`,
    });

    // ✅ clone + "한 번만" 센터링
    const clonedScene = useMemo(() => {
        if (!scene) return null;
        const clone = scene.clone(true);

        // geometry/material 안전하게 독립시키기(깊은 clone 느낌)
        clone.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                obj.geometry = obj.geometry.clone();

                if (Array.isArray(obj.material)) {
                    obj.material = obj.material.map((m) => m.clone());
                } else if (obj.material) {
                    obj.material = obj.material.clone();
                }
            }
        });

        // ✅ 센터 기준 정리 (Center 컴포넌트 안 씀)
        const box = new THREE.Box3().setFromObject(clone);
        const center = box.getCenter(new THREE.Vector3());
        clone.position.sub(center);

        return clone;
    }, [scene]);

    // ✅ “얼굴 재질만” 텍스처 교체 → 머리 노랑 색감 유지됨
    useEffect(() => {
        if (!clonedScene) return;

        const t = faceTex[expression];
        if (!t) return;

        t.flipY = false;
        t.colorSpace = THREE.SRGBColorSpace;
        t.needsUpdate = true;

        clonedScene.traverse((obj) => {
            if (!(obj instanceof THREE.Mesh)) return;

            const applyToMaterial = (mat: THREE.Material) => {
                if (mat.name !== FACE_MAT_NAME) return mat;

                const m = (mat as THREE.MeshStandardMaterial).clone();
                m.map = t;  // ✅ 텍스처 할당 추가!
                m.color.setRGB(1, 1, 1);
                m.roughness = 1;
                m.metalness = 0;
                m.toneMapped = false;
                m.transparent = true;
                m.alphaTest = 0.01;
                m.needsUpdate = true;
                return m;
            };

            if (Array.isArray(obj.material)) {
                obj.material = obj.material.map(applyToMaterial);
            } else if (obj.material) {
                obj.material = applyToMaterial(obj.material);
            }
        });
    }, [clonedScene, faceTex, expression]);

    // ✅ 마우스 회전 or 고정 회전
    useEffect(() => {
        if (!followMouse) {
            setTargetRotation({
                x: THREE.MathUtils.degToRad(fixedRotationX),
                y: THREE.MathUtils.degToRad(fixedRotationY) + THREE.MathUtils.degToRad(spinY),
                z: 0,
            });
            return;
        }

        const onMove = (e: MouseEvent) => {
            const xNorm = e.clientX / window.innerWidth - 0.5;
            const yNorm = e.clientY / window.innerHeight - 0.5;

            setTargetRotation({
                x: -yNorm * 0.4,
                y: xNorm * 0.8 + THREE.MathUtils.degToRad(spinY),
                z: -xNorm * 0.2,
            });
        };

        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, [followMouse, fixedRotationX, fixedRotationY, spinY]);

    // ✅ 쉐이크(매 프레임 랜덤 주면 떨림이 자연스러움)
    useFrame(() => {
        if (!modelRef.current) return;

        const shakeX = isShaking ? (Math.random() - 0.5) * 0.12 : 0;
        const shakeY = isShaking ? (Math.random() - 0.5) * 0.12 : 0;

        const targetX = targetRotation.x + shakeX;
        const targetY = targetRotation.y + shakeY;

        modelRef.current.rotation.x += (targetX - modelRef.current.rotation.x) * 0.12;
        modelRef.current.rotation.y += (targetY - modelRef.current.rotation.y) * 0.12;
        modelRef.current.rotation.z += (targetRotation.z - modelRef.current.rotation.z) * 0.12;
    });

    if (!clonedScene) return null;

    return (
        // ✅ 얼굴이 위로 올라가 보이면 여기 y만 살짝 조절(-0.2 ~ 0.2 범위부터)
        <group ref={modelRef} position={[-0.9, -2.5, 0]}>
            <primitive object={clonedScene} scale={1.3} />
        </group>
    );
};

export const LegoFace3D = React.memo<{
    className?: string;
    followMouse?: boolean;
    fixedRotationY?: number;
    fixedRotationX?: number;
    spinY?: number;
    expression?: Expression;
    isShaking?: boolean;
    onSpinComplete?: () => void;
}>(({
    className,
    followMouse = true,
    fixedRotationY = 0,
    fixedRotationX = 0,
    spinY = 0,
    expression = "neutral",
    isShaking = false,
    onSpinComplete,
}) => {
    const [internalSpinY, setInternalSpinY] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const spinStartTime = useRef<number | null>(null);

    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (spinY === 360 && !isSpinning) {
            setIsSpinning(true);
            spinStartTime.current = Date.now();
        }
    }, [spinY, isSpinning]);

    useEffect(() => {
        if (!isSpinning) return;

        const duration = 1500;
        let raf = 0;

        const animate = () => {
            if (spinStartTime.current == null) return;

            const elapsed = Date.now() - spinStartTime.current;
            const progress = Math.min(elapsed / duration, 1);

            const eased =
                progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            setInternalSpinY(eased * 360);

            if (progress < 1) {
                raf = requestAnimationFrame(animate);
            } else {
                setIsSpinning(false);
                setInternalSpinY(0);
                onSpinComplete?.();
            }
        };

        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [isSpinning, onSpinComplete]);

    const effectiveSpinY = isSpinning ? internalSpinY : spinY;

    return (
        <div
            className={className}
            style={{
                width: "100%",
                height: "100%",
                overflow: "visible",
                display: "flex",           // ✅ 추가
                justifyContent: "center",  // ✅ 추가
                alignItems: "center",      // ✅ 추가
            }}
        >
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 8], fov: 45 }}
                resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
                style={{
                    background: "transparent",
                    overflow: "visible",
                    width: "700px",
                    height: "700px",
                    // maxWidth: "100%",
                    // maxHeight: "100%",
                }}
                gl={{
                    alpha: true,
                    antialias: true,
                    toneMapping: THREE.NoToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace, // ✅ 색감 고정
                }}
            >
                {/* ✅ 색감 안정: 과한 라이트 줄이고, 표정은 emissive로 보정했음 */}
                <ambientLight intensity={2.0} />
                <directionalLight position={[0, 0, 9]} intensity={1.0} />
                <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                <hemisphereLight intensity={0.35} groundColor="#ffffff" />
                <pointLight position={[0, 1, 6]} intensity={1.2} distance={30} />

                <Suspense fallback={null}>
                    <LegoModel
                        followMouse={followMouse}
                        fixedRotationY={fixedRotationY}
                        fixedRotationX={fixedRotationX}
                        spinY={effectiveSpinY}
                        expression={expression}
                        isShaking={isShaking}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
});

useGLTF.preload(MODEL_PATH);
