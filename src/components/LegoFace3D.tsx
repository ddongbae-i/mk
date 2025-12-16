import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center, Html } from '@react-three/drei';
import * as THREE from 'three';

// 모델 경로를 상수로 정의
const MODEL_PATH = `${import.meta.env.BASE_URL}models/lego_head.glb`;

interface ModelProps {
    followMouse: boolean;
    fixedRotationY: number;
    fixedRotationX: number;
    onLoaded?: () => void;
}

const LegoModel: React.FC<ModelProps> = ({ followMouse, fixedRotationY, fixedRotationX, onLoaded }) => {
    const { scene } = useGLTF(MODEL_PATH);
    const modelRef = useRef<THREE.Group>(null);
    const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0, z: 0 });
    const [isReady, setIsReady] = useState(false);

    // 모델 로드 완료 시 중앙 정렬 + 클론
    useEffect(() => {
        if (scene) {
            // 씬 클론해서 사용 (여러 인스턴스 문제 방지)
            const clonedScene = scene.clone();
            const box = new THREE.Box3().setFromObject(clonedScene);
            const center = box.getCenter(new THREE.Vector3());
            clonedScene.position.sub(center);

            if (modelRef.current) {
                // 기존 자식들 제거
                while (modelRef.current.children.length > 0) {
                    modelRef.current.remove(modelRef.current.children[0]);
                }
                modelRef.current.add(clonedScene);
            }

            setIsReady(true);
            onLoaded?.();
        }
    }, [scene, onLoaded]);

    // 회전 타겟 설정
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

    // 부드러운 회전 애니메이션
    useFrame(() => {
        if (modelRef.current && isReady) {
            modelRef.current.rotation.x += (targetRotation.x - modelRef.current.rotation.x) * 0.1;
            modelRef.current.rotation.y += (targetRotation.y - modelRef.current.rotation.y) * 0.1;
            modelRef.current.rotation.z += (targetRotation.z - modelRef.current.rotation.z) * 0.1;
        }
    });

    return (
        <group ref={modelRef} scale={1.3} />
    );
};

// 로딩 플레이스홀더
const LoadingFallback = () => (
    <Html center>
        <div className="w-32 h-32 rounded-full bg-[#FCBB09] animate-pulse" />
    </Html>
);

// 에러 바운더리 컴포넌트
class ModelErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback?: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('LegoFace3D Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || null;
        }
        return this.props.children;
    }
}

export const LegoFace3D: React.FC<{
    className?: string;
    followMouse?: boolean;
    fixedRotationY?: number;
    fixedRotationX?: number;
}> = ({ className, followMouse = true, fixedRotationY = 0, fixedRotationX = 0 }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div
            className={className}
            style={{
                width: "100%",
                height: "100%",
                overflow: "visible",
                opacity: isLoaded ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
            }}
        >
            <ModelErrorBoundary
                fallback={
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-[#FCBB09]" />
                    </div>
                }
            >
                <Canvas
                    dpr={[1, 2]}
                    camera={{ position: [0, 0, 8], fov: 45 }}
                    resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
                    style={{
                        background: 'transparent',
                        overflow: "visible",
                    }}
                    gl={{
                        alpha: true,
                        antialias: true,
                        toneMapping: THREE.NoToneMapping,
                        powerPreference: "high-performance",
                    }}
                    linear
                    flat
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
                                onLoaded={() => setIsLoaded(true)}
                            />
                        </Center>
                    </Suspense>
                </Canvas>
            </ModelErrorBoundary>
        </div>
    );
};

// 프리로드 - 앱 시작 시 미리 로드
useGLTF.preload(MODEL_PATH);