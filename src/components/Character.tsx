// src/components/Character.tsx
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect } from "react";

type Expression = "neutral" | "happy" | "sad" | "sweat" | "blank";

export function Character({ expression = "neutral" }: { expression: Expression }) {
    const { nodes, materials } = useGLTF("/models/lego_head.glb") as any;

    const tex = useTexture({
        neutral: "/tex/face_neutral.png",
        happy: "/tex/face_happy.png",
        sad: "/tex/face_sad.png",
        sweat: "/tex/face_sweat.png",
        blank: "/tex/face_blank.png",
    });

    useEffect(() => {
        const t = tex[expression];
        if (!t) return;

        t.flipY = false;
        t.colorSpace = THREE.SRGBColorSpace;

        const mat = materials.FaceMaterial as THREE.MeshStandardMaterial;

        mat.map = null;
        mat.emissive = new THREE.Color(1, 1, 1);
        mat.emissiveMap = t;
        mat.emissiveIntensity = 1;
        mat.toneMapped = false;
        mat.transparent = true;
        mat.alphaTest = 0.01;

        mat.needsUpdate = true;
    }, [expression, tex, materials]);
    return <primitive object={nodes.Scene} />;
}
