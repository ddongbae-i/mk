import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/lego_head.glb';

interface ModelProps {
    followMouse: boolean;
    fixedRotationY: number;
    fixedRotationX: number;
    spinY?: number;
    expression?: 'sad' | 'neutral' | 'happy';
    isShaking?: boolean;
}

const LegoModel: React.FC<ModelProps> = ({
    followMouse,
    fixedRotationY,
    fixedRotationX,
    spinY = 0,
    expression = 'neutral',
    isShaking = false,
}) => {
    const { scene } = useGLTF(MODEL_PATH);
    const modelRef = useRef<THREE.Group>(null);
    const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0, z: 0 });
    const shakeOffset = useRef({ x: 0, y: 0 });

    const clonedScene = useMemo(() => {
        if (!scene) return null;
        const clone = scene.clone(true);
        const box = new THREE.Box3().setFromObject(clone);
        const center = box.getCenter(new THREE.Vector3());
        clone.position.sub(center);
        return clone;
    }, [scene]);

    // Shape Keys로 표정 변경 (GLB에 morph targets가 있는 경우)
    useEffect(() => {
        if (!clonedScene) return;

        clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
                child.morphTargetInfluences.fill(0);

                const morphDict = child.morphTargetDictionary;
                if (morphDict) {
                    if (expression === 'sad' && morphDict['sad'] !== undefined) {
                        child.morphTargetInfluences[morphDict['sad']] = 1;
                    } else if (expression === 'happy' && morphDict['happy'] !== undefined) {
                        child.morphTargetInfluences[morphDict['happy']] = 1;
                    }
                }
            }
        });
    }, [clonedScene, expression]);

    useEffect(() => {
        if (!followMouse) {
            setTargetRotation({
                x: THREE.MathUtils.degToRad(fixedRotationX),
                y: THREE.MathUtils.degToRad(fixedRotationY) + THREE.MathUtils.degToRad(spinY),
                z: 0
            });
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            const xNorm = (e.clientX / window.innerWidth) - 0.5;
            const yNorm = (e.clientY / window.innerHeight) - 0.5;

            setTargetRotation({
                x: -yNorm * 0.4,
                y: xNorm * 0.8 + THREE.MathUtils.degToRad(spinY),
                z: -xNorm * 0.2,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [followMouse, fixedRotationY, fixedRotationX, spinY]);

    useEffect(() => {
        if (isShaking) {
            shakeOffset.current = {
                x: (Math.random() - 0.5) * 0.3,
                y: (Math.random() - 0.5) * 0.3,
            };
        } else {
            shakeOffset.current = { x: 0, y: 0 };
        }
    }, [isShaking]);

    useFrame(() => {
        if (modelRef.current) {
            const targetX = targetRotation.x + (isShaking ? shakeOffset.current.x : 0);
            const targetY = targetRotation.y + (isShaking ? shakeOffset.current.y : 0);

            modelRef.current.rotation.x += (targetX - modelRef.current.rotation.x) * 0.1;
            modelRef.current.rotation.y += (targetY - modelRef.current.rotation.y) * 0.1;
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
    spinY?: number;
    expression?: 'sad' | 'neutral' | 'happy';
    isShaking?: boolean;
    onSpinComplete?: () => void;
}> = ({
    className,
    followMouse = true,
    fixedRotationY = 0,
    fixedRotationX = 0,
    spinY = 0,
    expression = 'neutral',
    isShaking = false,
    onSpinComplete,
}) => {
        const [internalSpinY, setInternalSpinY] = useState(0);
        const [isSpinning, setIsSpinning] = useState(false);
        const spinStartTime = useRef<number | null>(null);

        useEffect(() => {
            if (spinY === 360 && !isSpinning) {
                setIsSpinning(true);
                spinStartTime.current = Date.now();
            }
        }, [spinY]);

        useEffect(() => {
            if (!isSpinning) return;

            const spinDuration = 1500;
            let animationFrame: number;

            const animate = () => {
                if (spinStartTime.current === null) return;

                const elapsed = Date.now() - spinStartTime.current;
                const progress = Math.min(elapsed / spinDuration, 1);

                const eased = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                setInternalSpinY(eased * 360);

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    setIsSpinning(false);
                    setInternalSpinY(0);
                    onSpinComplete?.();
                }
            };

            animationFrame = requestAnimationFrame(animate);
            return () => cancelAnimationFrame(animationFrame);
        }, [isSpinning, onSpinComplete]);

        const effectiveSpinY = isSpinning ? internalSpinY : spinY;

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
                            spinY={effectiveSpinY}
                            expression={expression}
                            isShaking={isShaking}
                        />
                    </Center>
                </Canvas>
            </div>
        );
    };

useGLTF.preload(MODEL_PATH);