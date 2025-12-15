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

        box.setFromObject(scene);

        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) * scale;

        const cam = camera as THREE.PerspectiveCamera;
        const fov = cam.fov;
        const fitHeightDistance = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)));
        const distance = fitHeightDistance * 1.1;  // 1.25 → 1.1 (더 가깝게)

        cam.position.z = distance;
        cam.updateProjectionMatrix();

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
}: {
    className?: string;
    modelPath: string;
    modelScale?: number;
    rotateY?: number;
}) {
    const url = `${import.meta.env.BASE_URL}${modelPath}`;

    return (
        <div className={className} style={{ width: "100%", height: "100%" }}>
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 5], fov: 45 }}  // 10 → 5 (더 가깝게)
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