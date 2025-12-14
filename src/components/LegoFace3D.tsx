import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
    followMouse: boolean;
}

const LegoModel: React.FC<ModelProps> = ({ followMouse }) => {
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
        if (!followMouse) {
            setTargetRotation({ y: 0, z: 0 });
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            const xNorm = (e.clientX / window.innerWidth) - 0.5;

            setTargetRotation({
                y: xNorm * 0.8,
                z: -xNorm * 0.2,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [followMouse]);

    useFrame(() => {
        if (modelRef.current) {
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

export const LegoFace3D: React.FC<{
    className?: string;
    followMouse?: boolean;
}> = ({ className, followMouse = true }) => {
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
                camera={{ position: [0, 0, 8], fov: 45 }}
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
                    <LegoModel followMouse={followMouse} />
                </Center>
            </Canvas>
        </div>
    );
};

useGLTF.preload(`${import.meta.env.BASE_URL}models/lego_head.glb`);