import IntroSection from "./src/components/IntroSection";
import { useGLTF } from "@react-three/drei";

// 앱 시작 전에 GLB 미리 로드
useGLTF.preload('/models/lego_head.glb');

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <IntroSection />
    </div>
  );

}