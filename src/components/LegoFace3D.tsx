import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Html } from '@react-three/drei';
import * as THREE from 'three';

// 모델 경로 상수
const MODEL_PATH = `${import.meta.env.BASE_URL}models/lego_head.glb`;

// 전역 로딩 상태 (컴포넌트 리렌더링에 영향 안 받음)
let isModelLoaded = false;

interface ModelProps {
    followMouse: boolean;
    fixedRotationY: number;
    fixedRotationX: number;
}

const LegoModel: React.FC<ModelProps> = ({ followMouse, fixedRotationY, fixedRotationX }) => {
    const { scene } = useGLTF(MODEL_PATH);
    const modelRef = useRef<THREE.Group>(null);
    const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0, z: 0 });
    const initializedRef = useRef(false);

    // 모델 로드 완료 시 중앙 정렬 (한 번만 실행)
    useEffect(() => {
        if (scene && !initializedRef.current) {
            const box = new THREE.Box3().setFromObject(scene);
            const center = box.getCenter(new THREE.Vector3());
            scene.position.sub(center);
            initializedRef.current = true;
            isModelLoaded = true;
        }
    }, [scene]);

    useEffect(() => {
        if (!followMouse) {
            setTargetRotation({
                x: THREE.MathUtils.degToRad(fixedRotationX),
                y: THREE.MathUtils.degToRad(fixedRotationY),
                z: 0
            });
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            const xNorm = (e.clientX / window.innerWidth) - 0.5;
            const yNorm = (e.clientY / window.innerHeight) - 0.5;

            setTargetRotation({
                x: -yNorm * 0.4,
                y: xNorm * 0.8,
                z: -xNorm * 0.2,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [followMouse, fixedRotationY, fixedRotationX]);


    useFrame(() => {
        if (modelRef.current) {
            modelRef.current.rotation.x += (targetRotation.x - modelRef.current.rotation.x) * 0.1;
            modelRef.current.rotation.y += (targetRotation.y - modelRef.current.rotation.y) * 0.1;
            modelRef.current.rotation.z += (targetRotation.z - modelRef.current.rotation.z) * 0.1;
        }
    });

    return (
        <group ref={modelRef}>
            <primitive object={scene} scale={1.3} />
        </group>
    );
};

// 로딩 플레이스홀더
const LoadingFallback = () => (
    <Html center>
        <div
            style={{
                width: '128px',
                height: '128px',
                borderRadius: '50%',
                backgroundColor: '#FCBB09',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
        />
    </Html>
);

export const LegoFace3D: React.FC<{
    className?: string;
    followMouse?: boolean;
    fixedRotationY?: number;
    fixedRotationX?: number;
}> = ({ className, followMouse = true, fixedRotationY = 0, fixedRotationX = 0 }) => {
    // 마운트 후 강제 리렌더링 (Suspense가 제대로 작동하도록)
    const [, forceUpdate] = useState(0);
    const mountedRef = useRef(false);

    useEffect(() => {
        if (!mountedRef.current) {
            mountedRef.current = true;
            // 약간의 딜레이 후 리렌더링해서 Canvas가 제대로 초기화되도록
            const timer = setTimeout(() => forceUpdate(n => n + 1), 100);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div
            className={className}
            style={{
                width: "100%",
                height: "100%",
                overflow: "visible",
            }}
        >
            <Canvas
                dpr={1}
                camera={{ position: [0, 0, 8], fov: 45 }}
                resize={{ scroll: false }}
                style={{
                    background: 'transparent',
                    overflow: "visible",
                }}
                gl={{
                    alpha: true,
                    antialias: true,
                    toneMapping: THREE.NoToneMapping,
                }}
                linear
                frameloop="always"
            >
                <ambientLight intensity={1.8} />
                <directionalLight position={[5, 5, 5]} intensity={1.8} />
                <directionalLight position={[-5, 5, -5]} intensity={1.2} />
                <hemisphereLight intensity={1.2} groundColor="#ffffff" />

                <Suspense fallback={<LoadingFallback />}>
                    <Center>
                        <LegoModel
                            followMouse={followMouse}
                            fixedRotationY={fixedRotationY}
                            fixedRotationX={fixedRotationX}
                        />
                    </Center>
                </Suspense>
            </Canvas>
        </div>
    );
};

// 프리로드
useGLTF.preload(MODEL_PATH);