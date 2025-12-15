import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
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
        // 1) 센터링
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        scene.position.sub(center);

        // 2) 모델 크기에 맞춰 카메라 거리 자동 설정
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) * scale;

        const fov = (camera as THREE.PerspectiveCamera).fov;
        const fitHeightDistance = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(fov / 2)));
        const fitWidthDistance = fitHeightDistance; // 대충 동일 처리
        const distance = 1.25 * Math.max(fitHeightDistance, fitWidthDistance);

        camera.position.set(0, 0, distance);
        camera.near = distance / 100;
        camera.far = distance * 100;
        camera.updateProjectionMatrix();
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
    modelPath: string;   // "models/lego_body.glb"
    modelScale?: number;
    rotateY?: number;
}) {
    const url = `${import.meta.env.BASE_URL}${modelPath.replace(/^\/+/, "")}`;

    return (
        <div className={className} style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <Canvas
                camera={{ fov: 45, position: [0, 0, 8] }}
                style={{ background: "transparent", overflow: "visible" }}
                gl={{ alpha: true, antialias: true, toneMapping: THREE.NoToneMapping }}
                dpr={1}
            >
                <ambientLight intensity={1.6} />
                <directionalLight position={[5, 5, 5]} intensity={1.6} />
                <hemisphereLight intensity={1.0} groundColor="#ffffff" />

                <FitAndRender url={url} scale={modelScale} rotateY={rotateY} />
            </Canvas>
        </div>
    );
}

useGLTF.preload(`${import.meta.env.BASE_URL}models/lego_body.glb`);
useGLTF.preload(`${import.meta.env.BASE_URL}models/lego_legs.glb`);
