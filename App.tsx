import IntroSection from "./src/components/IntroSection";
import { useEffect } from "react";


export default function App() {
  useEffect(() => {
    // GLB 파일 미리 fetch
    fetch('/models/lego-face.glb').then(r => r.blob());
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <IntroSection />
    </div>
  );

}

