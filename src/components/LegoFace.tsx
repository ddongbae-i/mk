import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";

export type LegoFaceProps = {
  className?: string;
};

function Model() {
  // ✅ GitHub Pages + 로컬 모두 안전한 경로
  const url = `${import.meta.env.BASE_URL}models/lego.glb`;
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      position={[0, -0.6, 0]}
      scale={1}
    />
  );
}

export const LegoFace: React.FC<LegoFaceProps> = ({ className }) => {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 0.2, 2.2], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 3]} intensity={1.2} />
        <directionalLight position={[-2, 1, 1]} intensity={0.6} />

        <Suspense fallback={null}>
          <Model />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
};

// ✅ preload도 동일 경로
useGLTF.preload(`${import.meta.env.BASE_URL}models/lego.glb`);
