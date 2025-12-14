import React, { useEffect, useState } from 'react';

export const LegoFace: React.FC<{ className?: string }> = ({ className }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xNorm = (e.clientX / window.innerWidth) - 0.5;
      const yNorm = (e.clientY / window.innerHeight) - 0.5;
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
    <div className={className} style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "visible" }}>
      <img
        src={`${import.meta.env.BASE_URL}images/lego_face.svg`}
        alt="Lego Face"
        style={{
          // [수정됨] 100%로 꽉 채우면 움직일 때 잘립니다. 
          // 85% 정도로 줄여서 사방에 여유 공간을 주세요.
          width: "85%",
          height: "auto",
          maxWidth: "500px", // 필요시 크기 조절

          objectFit: "contain", // 비율 유지하며 포함
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: "transform 0.1s ease-out",
          willChange: "transform"
        }}
      />
    </div>
  );
};