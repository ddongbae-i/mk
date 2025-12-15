import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
    followMouse: boolean;
    fixedRotationY: number;
    fixedRotationX: number; // 🔥 추가
}

const LegoModel: React.FC<ModelProps> = ({ followMouse, fixedRotationY, fixedRotationX }) => {
    const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/lego_head.glb`);
    const modelRef = useRef<THREE.Group>(null);
    const [targetRotation, setTargetRotation] = useState({ y: 0, z: 0 });

    useEffect(() => {
        if (scene) {
            const box = new THREE.Box3().setFromObject(scene);
            const center = box.getCenter(new THREE.Vector3());
            scene.position.sub(center);
        }
    }, [scene]);

    useEffect(() => {
        // 🔥 마우스 추적이 꺼져있으면 고정 회전값 사용
        if (!followMouse) {
            setTargetRotation({
                y: THREE.MathUtils.degToRad(fixedRotationY),
                x: THREE.MathUtils.degToRad(fixedRotationX),
                z: 0
            });
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            const xNorm = (e.clientX / window.innerWidth) - 0.5;
            const yNorm = (e.clientY / window.innerHeight) - 0.5;

            setTargetRotation({
                y: xNorm * 0.8,
                x: -yNorm * 0.4,
                z: -xNorm * 0.2,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [followMouse, fixedRotationY, fixedRotationX]);


    useFrame(() => {
        if (modelRef.current) {
            modelRef.current.rotation.y += (targetRotation.y - modelRef.current.rotation.y) * 0.1;
            modelRef.current.rotation.x += (targetRotation.x - modelRef.current.rotation.x) * 0.1;  // ← 추가
            modelRef.current.rotation.z += (targetRotation.z - modelRef.current.rotation.z) * 0.1;
        }
    });

    return (
        <group ref={modelRef}>
            <primitive object={scene} scale={1.3} />
        </group>
    );
};

export const LegoFace3D: React.FC<{
    className?: string;
    followMouse?: boolean;
    fixedRotationY?: number;
    fixedRotationX?: number;  // ← 추가
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
                dpr={1}                          // ✅ 이 줄 추가 (핵심)
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

useGLTF.preload(`${import.meta.env.BASE_URL}models/lego_head.glb`);