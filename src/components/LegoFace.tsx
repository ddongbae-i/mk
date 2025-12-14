import React, { useEffect, useState } from 'react';

export const LegoFace: React.FC<{ className?: string }> = ({ className }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xNorm = (e.clientX / window.innerWidth) - 0.5;
      const yNorm = (e.clientY / window.innerHeight) - 0.5;

      // 움직임 범위 (30px)
      const MOVE_RANGE = 30;

      setPos({
        x: xNorm * MOVE_RANGE,
        y: yNorm * MOVE_RANGE
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // [중요 1] 부모 영역 밖으로 나가도 보이도록 설정 (혹시 모를 안전장치)
        overflow: "visible"
      }}
    >
      <img
        // 파일 경로는 본인 설정에 맞게 유지
        src={`${import.meta.env.BASE_URL}images/lego_face.svg`}
        alt="Lego Face"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",

          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: "transform 0.1s ease-out",
          willChange: "transform"
        }}
      />
    </div>
  );
};