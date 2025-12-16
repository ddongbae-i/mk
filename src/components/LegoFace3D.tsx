import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
    followMouse: boolean;
    fixedRotationY: number;
    fixedRotationX: number;
}

const LegoModel: React.FC<ModelProps> = ({ followMouse, fixedRotationY, fixedRotationX }) => {
    // 경로 직접 하드코딩해서 테스트
    const modelPath = '/models/lego_head.glb';

    console.log('🎯 Attempting to load model from:', modelPath);

    const { scene, errors } = useGLTF(modelPath) as any;

    useEffect(() => {
        if (errors) {
            console.error('❌ GLB Load Error:', errors);
        }
        if (scene) {
            console.log('✅ GLB Loaded Successfully!', scene);
        }
    }, [scene, errors]);

    const modelRef = useRef<THREE.Group>(null);
    const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        if (scene) {
            const box = new THREE.Box3().setFromObject(scene);
            const center = box.getCenter(new THREE.Vector3());
            scene.position.sub(center);
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

    if (!scene) {
        console.log('⏳ Scene not ready yet...');
        return null;
    }

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
    fixedRotationX?: number;
}> = ({ className, followMouse = true, fixedRotationY = 0, fixedRotationX = 0 }) => {

    useEffect(() => {
        console.log('🚀 LegoFace3D component mounted');
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
                onCreated={() => console.log('🎨 Canvas created!')}
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
useGLTF.preload('/models/lego_head.glb');