import React from 'react';

export const LegoFace: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head Shape - Cylinder-ish projection handled by simple circle + shadow for 'flat' 3D look
          In a real 3D engine we'd use Three.js, but for this 2.5D anim, SVG is performant */}
      <defs>
        <radialGradient id="grad1" cx="30%" cy="30%" r="70%">
          <stop offset="0%" style={{ stopColor: "#ffe600", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#f5c600", stopOpacity: 1 }} />
        </radialGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>
      
      {/* Knob on top */}
      <rect x="35" y="2" width="30" height="15" rx="2" fill="#eab308" />
      <rect x="35" y="0" width="30" height="10" rx="4" fill="#facc15" />

      {/* Main Head */}
      <path
        d="M15,20 H85 A10,10 0 0 1 95,30 V85 A10,10 0 0 1 85,95 H15 A10,10 0 0 1 5,85 V30 A10,10 0 0 1 15,20 Z"
        fill="url(#grad1)"
        stroke="#eab308"
        strokeWidth="2"
      />

      {/* Eyes */}
      <circle cx="35" cy="50" r="6" fill="#1a1a1a" />
      <circle cx="65" cy="50" r="6" fill="#1a1a1a" />
      
      {/* Eye glint */}
      <circle cx="37" cy="48" r="2" fill="white" opacity="0.8" />
      <circle cx="67" cy="48" r="2" fill="white" opacity="0.8" />

      {/* Smile */}
      <path
        d="M30,65 Q50,85 70,65"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};