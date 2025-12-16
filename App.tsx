import IntroSection from "./src/components/IntroSection";
import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

// 앱 시작 전에 GLB 미리 로드
const MODEL_PATH = `${import.meta.env.BASE_URL}models/lego_head.glb`;
useGLTF.preload(MODEL_PATH);

export default function App() {
  useEffect(() => {
    // 추가로 fetch도 해서 브라우저 캐시에 저장
    fetch(MODEL_PATH)
      .then(r => r.blob())
      .then(() => console.log('GLB preloaded successfully'))
      .catch(err => console.error('GLB preload failed:', err));
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <IntroSection />
    </div>
  );
}