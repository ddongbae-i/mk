import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

function FitAndRender({
    url,
    scale = 1,
    rotateY = 0,
}: {
    url: string;
    scale?: number;
    rotateY?: number;
}) {
    const { scene } = useGLTF(url);
    const group = useRef<THREE.Group>(null);
    const { camera } = useThree();

    useEffect(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        scene.position.sub(center);

        // ✅ center 이동 반영해서 다시 측정
        box.setFromObject(scene);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) * scale;

        const cam = camera as THREE.PerspectiveCamera;
        const fov = cam.fov;
        const fitHeightDistance = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)));
        const distance = 1.25 * fitHeightDistance;

    }, [scene, camera, scale]);


    useFrame(() => {
        if (!group.current) return;
        const target = THREE.MathUtils.degToRad(rotateY);
        group.current.rotation.y += (target - group.current.rotation.y) * 0.12;
    });

    return (
        <group ref={group}>
            <primitive object={scene} scale={scale} />
        </group>
    );
}

export function LegoPart3D({
    className,
    modelPath,
    modelScale = 1.2,
    rotateY = 0,
    fitName,
    followMouse = false,

}: {
    className?: string;
    modelPath: string;
    modelScale?: number;
    rotateY?: number;
    fitName?: string;
    followMouse?: boolean;
}) {
    const url = `${import.meta.env.BASE_URL}${modelPath}`;

    return (
        <div className={className} style={{ width: "100%", height: "100%" }}>
            <Canvas
                dpr={[1, 2]}                 // ✅ 선명도
                camera={{ position: [0, 0, 8], fov: 45 }}
                style={{ width: "100%", height: "100%", background: "transparent" }}
                gl={{ alpha: true, antialias: true, toneMapping: THREE.NoToneMapping }}
            >
                <ambientLight intensity={1.6} />
                <directionalLight position={[5, 5, 5]} intensity={1.6} />
                <hemisphereLight intensity={1.0} groundColor="#ffffff" />
                <Center>
                    <FitAndRender url={url} scale={modelScale} rotateY={rotateY} />
                </Center>
            </Canvas>
        </div>
    );
}


useGLTF.preload(`${import.meta.env.BASE_URL}models/lego_body.glb`);
useGLTF.preload(`${import.meta.env.BASE_URL}models/lego_legs.glb`);
