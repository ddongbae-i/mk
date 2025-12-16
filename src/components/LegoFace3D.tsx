import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/lego_head.glb';

interface ModelProps {
    followMouse: boolean;
    fixedRotationY: number;
    fixedRotationX: number;
}

const LegoModel: React.FC<ModelProps> = ({ followMouse, fixedRotationY, fixedRotationX }) => {
    const { scene } = useGLTF(MODEL_PATH);
    const modelRef = useRef<THREE.Group>(null);
    const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0, z: 0 });

    // scene을 clone해서 사용 (여러 인스턴스 문제 방지)
    const clonedScene = useMemo(() => {
        if (!scene) return null;
        const clone = scene.clone(true);

        // 중앙 정렬
        const box = new THREE.Box3().setFromObject(clone);
        const center = box.getCenter(new THREE.Vector3());
        clone.position.sub(center);

        return clone;
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

    if (!clonedScene) return null;

    return (
        <group ref={modelRef}>
            <primitive object={clonedScene} scale={1.3} />
        </group>
    );
};

export const LegoFace3D: React.FC<{
    className?: string;
    followMouse?: boolean;
    fixedRotationY?: number;
    fixedRotationX?: number;
}> = ({ className, followMouse = true, fixedRotationY = 0, fixedRotationX = 0 }) => {
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
            >
                <ambientLight intensity={1.8} />
                <directionalLight position={[5, 5, 5]} intensity={1.8} />
                <directionalLight position={[-5, 5, -5]} intensity={1.2} />
                <hemisphereLight intensity={1.2} groundColor="#ffffff" />

                <Center>
                    <LegoModel
                        followMouse={followMouse}
                        fixedRotationY={fixedRotationY}
                        fixedRotationX={fixedRotationX}
                    />
                </Center>
            </Canvas>
        </div>
    );
};

// 프리로드
useGLTF.preload(MODEL_PATH);