// src/components/Character.tsx
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect } from "react";

type Expression = "neutral" | "happy" | "sad" | "sweat";

export function Character({ expression = "neutral" }: { expression: Expression }) {
    const { nodes, materials } = useGLTF("/model/character.glb") as any;

    const tex = useTexture({
        neutral: "/tex/face_neutral.png",
        happy: "/tex/face_happy.png",
        sad: "/tex/face_sad.png",
        sweat: "/tex/face_sweat.png",
    });

    useEffect(() => {
        const t = tex[expression];
        if (!t) return;

        t.flipY = false;
        t.colorSpace = THREE.SRGBColorSpace;

        const mat = materials.FaceMaterial as THREE.MeshStandardMaterial;
        mat.map = t;
        mat.needsUpdate = true;
    }, [expression, tex, materials]);

    return <primitive object={nodes.Scene} />;
}
