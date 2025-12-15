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
        // 모델의 바운딩 박스 계산
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // 모델을 원점으로 이동 (중앙 정렬)
        scene.position.x = -center.x;
        scene.position.y = -center.y;
        scene.position.z = -center.z;

        // 카메라 거리 자동 계산
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = (camera as THREE.PerspectiveCamera).fov;
        const cameraDistance = maxDim / (2 * Math.tan((fov * Math.PI) / 360));

        camera.position.set(0, 0, cameraDistance * 1.5);
        camera.lookAt(0, 0, 0);
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
    modelPath: string;
    modelScale?: number;
    rotateY?: number;
}) {
    const url = `${import.meta.env.BASE_URL}${modelPath}`;

    return (
        <div className={className} style={{ width: "100%", height: "100%" }}>
            <Canvas
                dpr={[1, 2]}
                camera={{
                    position: [0, 0, 5],
                    fov: 45,
                    near: 0.1,
                    far: 1000
                }}
                style={{ width: "100%", height: "100%", background: "transparent" }}
                gl={{ alpha: true, antialias: true, toneMapping: THREE.NoToneMapping }}
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