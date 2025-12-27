import React, { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { motion, useAnimate, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { LegoFace3D } from './LegoFace3D';
import SkillSection from './SkillSection';
import ProjectDetailCard from './ProjectDetailCard';
import { CustomCursor } from './CustomCursor';
import GallerySection from './GallerySection';
// import { LegoPart3D } from "./LegoPart3D";
console.log('IntroSection render', Date.now());

type FaceExpression = 'sad' | 'neutral' | 'happy' | 'sweat' | 'blank';
const COLORS = [
  '#8F1E20', '#F25F09', '#ffc147', '#8E00BD', '#a6b551', '#B7156C', '#8F1E20'
];

const BG_CREAM = "#ffedcb";
const BEAM_COLOR = "#ffc147";
const PROJECT_TEXT_COLOR = "#8E00BD";


// 파츠들에 넘길 최종 rotateY


const PartPNG = ({
  src,
  className,
  alt = "",
}: { src: string; className?: string; alt?: string }) => (
  <img
    src={`${import.meta.env.BASE_URL}${src}`}
    alt={alt}
    className={className}
    draggable={false}
    style={{ display: "block" }}
  />
);

const FaceLoadingPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-32 h-32 rounded-full bg-[#FCBB09] animate-pulse" />
  </div>
);

// S2 DATA
const S2_CONTENT = [
  {
    keyword: "LAYOUT",
    splits: ["LAY", "O", "UT"],
    top: "불편한",
    bottom: "에 생기를 불어넣어"
  },
  {
    keyword: "PLAY",
    splits: ["P", "LAY"],
    top: "사용자가 즐겁게",
    bottom: "하는 흐름을 만들며,"
  },
  {
    keyword: "OUT",
    splits: ["O", "U", "T"],
    top: "책임감 있게 결과물로",
    bottom: "완성하는 디자이너 김민경입니다."
  }
];

const PART_DESCRIPTIONS = [
  {
    title: "Navigation Headlight",
    description: "무엇을 가장 먼저 해결해야하는지 찾아냅니다.",
    details: "창업과 기획 경험을 바탕으로, 프로젝트 초기 단계의 모호한 요구사항을 명확한 목표로 구체화하여 흔들리지 않는 방향성을 제시합니다.",
  },
  {
    title: "Insight Mask",
    description: "사용자보다 먼저 불편함을 감지합니다. ",
    details: "사소한 불편함도 지나치지 못하는 성향을 발휘하여, 사용자가 겪을 수 있는 이탈 요소를 미리 발견하고 매끄러운 UX/UI 흐름으로 개선합니다.",
  },
  {
    title: "Layout Harness",
    description: "뒤죽박죽 섞인 정보들을 이해하기 쉬운 구조로 정리합니다.",
    details: "디자인과 퍼블리싱(Code)을 모두 고려하여, 복잡한 데이터를 시각적 위계에 맞춰 재배치하고 구현 가능성이 높은 최적의 구조를 설계합니다..",
  },
  {
    title: "Responsibility Legs",
    description: "맡은 일은 마지막까지 책임감을 가지고 작업합니다",
    details: "단순한 완료가 아닌 완벽한 마무리를 지향합니다. 난관에 부딪혀도 포기하지 않고 끈기 있게 문제를 해결하여 안정적인 결과물을 전달합니다.",
  },
];

const RESUME_DATA = [
  {
    id: "01",
    title: "FOUNDATION",
    content: [
      { type: "text", text: "Media & Film" }
    ]
  },
  {
    id: "02",
    title: "CERTIFICATION",
    content: [
      { type: "text", text: "웹디자인 기능사" },
      { type: "text", text: "컴퓨터그래픽스 운용기능사" }
    ]
  },
  {
    id: "03",
    title: "FIELD",
    content: [
      {
        type: "job",
        role: "Founder · namodog",
        tasks: ["제품 기획 · 제작 관리", "상세페이지 제작 · 쇼핑몰 운영"],
      },
      {
        type: "job",
        role: "SeedGrow",
        tasks: ["제품 촬영 · 편집", "상세페이지 기획", "제품 · 재고 · 입출고 관리"]
      }
    ]
  }
];

// CONSTANTS
const BRICK_LABELS = ["BUILD", "PROJECT", "STACK", "GALLERY", "CONTACT"];

const FONT_SIZE_CSS = 'min(14vw, 200px)';
const FONT_FAMILY = 'Kanit, sans-serif';


// --- PROJECT KIT BOX ---
const ProjectKitBox = ({
  isVisible,
  project,
  onOpen,
}: {
  isVisible: boolean;
  project: typeof PROJECT_DATA[0];
  onOpen: () => void;
}) => (
  <motion.div
    className="relative z-[90] cursor-pointer -bottom-[100px]"
    onClick={onOpen}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, scale: 0.92, y: 40 }}
    animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 40 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* ✅ 키트 이미지(통째로) */}
    <img
      src={`${import.meta.env.BASE_URL}${project.image}`} // PROJECT_DATA의 image 경로 사용
      alt={`${project.title} kit`}
      draggable={false}
      className="w-[85vw] max-w-[1000px] aspect-[16/10] md:w-[80vw] object-contain select-none"
      style={{ display: "block" }}
    />
  </motion.div>
);

const PROJECT_DATA = [
  {
    id: 1,
    title: "WELLIO",
    subtitle: "가족 건강 공유 앱, 웰리오",
    image: "images/project2.png",
    detailImgSrc: "images/info1.png",
    description: "가족의 건강을 하나로 연결하는 경험.병원 탐색, 건강 기록, 커뮤니티 기능을 중심으로 한 가족 헬스케어 서비스 웰리오의 UX/ UI를 설계한 프로젝트입니다.분산된 정보 구조를 정리하고 직관적인 사용 흐름을 통해, 누구나 쉽게 건강을 관리할 수 있는 친화적인 경험을 제공합니다.",
    tags: ["UI/UX", "Mobile App", "Mobile App", "Vibe Coding"],
    specs: { period: "25.08.13 - 25.08.27,", role: "병원리스트/정보/접수/결제/병원 후기&찜한병원/캘린더 메인 디자인, 로고/아이콘 제작, AI 앱버전 개발", tech: "Figma,REACT,Typescript,Illustrator" },

    buttons: [
      { label: "기획서 보기", url: "https://www.figma.com/proto/YgY5CNo9U0iNRQcw6MiKZ5/3%EC%A1%B0-Ai--Wellio?page-id=10897%3A59342&node-id=10897-59350&viewport=639%2C155%2C0.1&t=uDXy317GRj0LX8Jv-1&scaling=scale-down&content-scaling=fixed", type: "gray" },
      { label: "프로토타입", url: "https://www.figma.com/proto/YgY5CNo9U0iNRQcw6MiKZ5/3%EC%A1%B0-Ai--Wellio?page-id=8657%3A13196&node-id=8877-12777&viewport=8295%2C4598%2C0.26&t=3BuPl2X1rPy84xHQ-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=8877%3A13597", type: "gray" },
      { label: "AI 웰리오 앱", url: "https://wellio-iota.vercel.app/", type: "primary" }, // 강조 버튼
    ]
  },
  {
    id: 2,
    title: "BEAUTY OF JOSEON",
    subtitle: "조선미녀 반응형 웹사이트 리뉴얼",
    image: "images/project1.png",

    detailImgSrc: "images/info2.png",
    description: "한국 전통 미학을 현대적으로 재해석한 경험. K-뷰티 브랜드 조선미녀의 글로벌 사용자를 고려해 웹사이트를 리뉴얼한 프로젝트입니다. 브랜드 스토리와 제품 정보를 명확히 정리하고 가독성과 사용성을 개선해, 신뢰감 있는 브랜드 경험을 제공합니다.",
    tags: ["UX/UI", "Design System", "Renewal"],
    specs: {
      period: "25.09.19 - 25.10.24",
      role: "Header&Footer/메인(1204-360 개발, SHOP디자인 및 개발, 아이콘 제작, 신제품/인트로 영상",
      tech: "Figma, html, css, js, Midjourney, Illustrator"
    },
    buttons: [
      {
        label: "기획서 보기", url: "https://www.figma.com/deck/YP3BTYoRHbMzOydhFS5qoO/-%ED%8C%80%ED%94%8C1-3%EC%A1%B0--%EA%B2%B0%EA%B3%BC%EB%B3%B4%EA%B3%A0%EC%84%9C_%EB%AC%B8%EC%96%B4%EC%A7%80%EC%A7%80%EB%A7%88?node-id=2078-4602&viewport=-3134%2C-1274%2C0.5&t=MZGqIbqakXF0yVpw-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1", type: "gray"
      },
      { label: "웹사이트 보기", url: "https://ddongbae-i.github.io/boj_en/", type: "gray" },
    ]
  },
  {
    id: 3,
    title: "QooQoo",
    subtitle: "쿠우쿠우 반응형 웹사이트 리뉴얼",
    image: "images/project3.png",

    detailImgSrc: "images/info3.png",
    description: `함께하는 맛의 행복. 쿠우쿠우 고급화 전략에 맞춰 웹사이트를 리뉴얼한 프로젝트입니다.\n기존 웹사이트에 부족했던 메뉴, 쿠우쿠우 상점, 멤버쉽, 슬로건, 가독성 등을 개선하고 고급스러우면도 친화적인 디자인으로 쿠우쿠우 브랜드 이미지를 상승시킴과 동시에 방문자들의 니즈를 충족할 컨텐츠를 제공합니다`,
    tags: ["Renewal", "Brand Design", "Responsive"],
    specs: {
      period: "25.07 - 25.09",
      role: "기획, 반응형 디자인",
      tech: "Figma, HTML/CSS, React, Firefly, Midjourney, Photoshop "
    },
    buttons: [
      {
        label: "Web(1920)", url: "https://www.figma.com/proto/ovfWPSdRr3myp4oidk8kwX/%EA%B9%80%EB%AF%BC%EA%B2%BD?page-id=2224%3A832&node-id=2224-833&viewport=506%2C284%2C0.11&t=gb20orGuQ99jHPkH-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=2224%3A833", type: "gray"
      },
      {
        label: "Tablet(1024)", url: "https://www.figma.com/proto/ovfWPSdRr3myp4oidk8kwX/%EA%B9%80%EB%AF%BC%EA%B2%BD?page-id=2224%3A832&node-id=2229-2328&viewport=506%2C284%2C0.11&t=gb20orGuQ99jHPkH-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=2224%3A833", type: "gray"
      },
      { label: "Tablet(744", url: "https://www.figma.com/proto/ovfWPSdRr3myp4oidk8kwX/%EA%B9%80%EB%AF%BC%EA%B2%BD?page-id=2224%3A832&node-id=2229-3754&viewport=316%2C427%2C0.18&t=D3dfPhSgangy8CES-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=2224%3A833", type: "gray" },
      { label: "Mobile(412)", url: "https://ddongbae-i.github.io/boj_en/", type: "gray" },
    ]

  },
];
// --- TOOLTIP COMPONENT ---

const PartTooltip = ({
  title,
  description,
  details,
  isVisible,
  isExpanded = false,
  onToggle,
  counterRotateY = 0,
  counterRotateX = 0,
  lineLength = 80,
  leftOffset = -90,
}: {
  title: string;
  description: string;
  details?: string;
  isVisible: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  counterRotateY?: number;
  counterRotateX?: number;
  lineLength?: number;
  leftOffset?: number;
}) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        className="absolute flex items-center pointer-events-auto"
        style={{
          left: `calc(100% + ${leftOffset}px)`,
          top: "50%",
          zIndex: 60,
          transform: `translateY(-50%) rotateY(${counterRotateY}deg) rotateX(${counterRotateX}deg)`,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 동그라미 포인트 */}
        <motion.div
          className="relative flex-shrink-0"
          style={{ zIndex: 500, position: "relative" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <div
            className="w-4 h-4 rounded-full bg-[#2b2b2b]"
            style={{ position: "relative", zIndex: 500 }}
          />
        </motion.div>

        {/* 연결선 */}
        <motion.div
          className="h-[3px] bg-[#2b2b2b] flex-shrink-0"
          initial={{ width: 0 }}
          animate={{ width: lineLength }}
          transition={{ duration: 0.3, delay: 0.15 }}
        />

        {/* 카드 */}
        <motion.div
          className="bg-[#f0f0f0] border-[3px] border-[#2b2b2b] shadow-[4px_4px_0_0_#2b2b2b]"
          style={{ width: "320px", padding: "20px 24px" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="font-bold text-[#2b2b2b] italic text-[26px] mb-2" style={{ fontFamily: 'Kanit, sans-serif' }}>
            {title}
          </h3>
          <p className="text-[#333] text-[18px] font-medium leading-[1.5]">
            {description}
          </p>

          {/* 확장 컨텐츠 - 버튼 위에 */}
          <AnimatePresence>
            {isExpanded && details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t-[1px] border-[#d9d9d9]">
                  <p className="text-[#555] text-[14px] leading-[1.5]">{details}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 버튼 - 항상 하단 고정 */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={onToggle}
              className="w-10 h-10 flex items-center justify-center cursor-pointer"
            >
              <svg
                width="20" height="20" viewBox="0 0 20 20" fill="none"
                style={{ transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              >
                <path d="M10 4V16M4 10H16" stroke="#2b2b2b" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
// --- COMPONENTS ---

const StrokedWordmark = ({
  className,
  style,
  align = "center",
  widthClass = "w-[80vw] max-w-[600px]",
}: {
  className?: string;
  style?: any;
  align?: "center" | "left";
  widthClass?: string;
}) => {
  const isLeft = align === "left";

  const textProps = {
    x: isLeft ? "0" : "50%",
    y: "55%",
    dominantBaseline: "central" as const,
    textAnchor: (isLeft ? "start" : "middle") as const,
    style: {
      fontFamily: FONT_FAMILY,
      fontWeight: 900,
      fontStyle: "italic",
      fontSize: "200px",
    },
  };

  return (
    <motion.div className={`relative inline-block ${className || ""}`} style={style}>
      <svg
        viewBox="0 0 600 180"
        className={`${widthClass} h-auto overflow-visible block`}
      >
        <text {...textProps} dx={isLeft ? "10" : undefined} fill="none" stroke="#F0F0F0" strokeWidth="28"
          strokeLinejoin="round" strokeLinecap="round">
          PLAYOUT
        </text>
        <text {...textProps} dx={isLeft ? "10" : undefined} fill="none" stroke="#8F1E20" strokeWidth="14"
          strokeLinejoin="round" strokeLinecap="round">
          PLAYOUT
        </text>
        <text {...textProps} dx={isLeft ? "10" : undefined} fill="#F0F0F0" stroke="none">
          PLAYOUT
        </text>
      </svg>
    </motion.div>
  );
};

// --- LEGO BRICK COMPONENT ---

const LegoBrick = ({ label, index, className }: { label: string, index: number, className?: string }) => {
  return (
    <div className={`${className} relative w-full h-full`}>
      <img
        src={`${import.meta.env.BASE_URL}images/brick_${index}.svg`}
        alt={label}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

// --- S2 SLOT MACHINE COMPONENTS ---
const SplitWordLayer = ({ parts, visibleIndex }: { parts: string[], visibleIndex: number }) => {
  return (
    <div className="flex select-none whitespace-nowrap">
      {parts.map((part, i) => (
        <span
          key={i}
          style={{
            opacity: i === visibleIndex ? 1 : 0,
            color: i === visibleIndex ? '#F0F0F0' : 'transparent',
            WebkitTextStroke: "0px transparent"
          }}
        >
          {part}
        </span>
      ))}
    </div>
  );
};

const SlotReel = ({
  activeIndex,
  prevIndex
}: {
  activeIndex: number,
  prevIndex: number
}) => {
  const content = S2_CONTENT[activeIndex];
  return (
    <div className="relative w-full h-full flex items-center overflow-visible">
      <AnimatePresence mode="popLayout">
        {[0, 1, 2].map((layerIndex) => (
          <motion.div
            key={`${content.keyword}-${layerIndex}`}
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
              delay: layerIndex * 0.08
            }}
            className="absolute left-0 top-0 origin-center whitespace-nowrap"
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: FONT_SIZE_CSS,
              lineHeight: 1.2,
            }}
          >
            <SplitWordLayer parts={content.splits} visibleIndex={layerIndex} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const S2SlotMachine = ({ activeIndex }: { activeIndex: number }) => {
  const content = S2_CONTENT[activeIndex];
  const prevIndex = Math.max(0, activeIndex - 1);

  return (
    <div className="relative flex flex-col items-start justify-center">
      <div
        className="opacity-0 pointer-events-none select-none"
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: FONT_SIZE_CSS,
          lineHeight: 1.2,
          fontWeight: 900,
          fontStyle: 'italic',
        }}
      >
        LAYOUT
      </div>
      <div className="absolute top-[-50px] left-0 w-[200%] overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={`top-${activeIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="whitespace-nowrap origin-bottom-left"
            style={{
              fontFamily: FONT_FAMILY, fontWeight: 400, fontSize: '48px', fontStyle: 'italic',
              color: '#F0F0F0', lineHeight: 1.2, transform: "skewX(-10deg)"
            }}
          >
            {content.top}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 flex items-center overflow-visible">
        <SlotReel activeIndex={activeIndex} prevIndex={prevIndex} />
      </div>
      <div className="absolute bottom-[-50px] left-0 w-[200%] overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bot-${activeIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="whitespace-nowrap origin-top-left"
            style={{
              fontFamily: FONT_FAMILY, fontWeight: 400, fontSize: '48px', fontStyle: 'italic',
              color: '#F0F0F0', lineHeight: 1.2, transform: "skewX(-10deg)"
            }}
          >
            {content.bottom}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};


const FloatingMenuBlock: React.FC<{
  index: number;
  style?: React.CSSProperties;
  id?: string;
  shouldFloat: boolean;
  isMenuOpen?: boolean;

  hoveredIndex?: number | null;
  onClick?: () => void;
  onHover?: (index: number | null) => void;
}> = ({ index, style, id, shouldFloat, isMenuOpen = false, hoveredIndex = null, onHover, onClick }) => {
  const label = BRICK_LABELS[index % BRICK_LABELS.length];
  const randomDelay = 0.4 + index * 0.2;

  const floatAnim = {
    opacity: 1,
    scale: 1,
    y: [0, -15, 0],
    x: [0, 8, 0],
    rotate: [0, index % 2 === 0 ? 5 : -5, 0],
  };

  const getHoverOffset = () => {
    if (!isMenuOpen || hoveredIndex === null) return 0;
    if (index === hoveredIndex) return 0;
    if (index < hoveredIndex) return -20;
    return 20;
  };

  const isHovered = isMenuOpen && hoveredIndex === index;
  const baseZIndex = isHovered ? 60 : 50 - index;

  return (
    <motion.div
      id={id}
      onClick={onClick}
      style={{ ...style, zIndex: baseZIndex } as React.CSSProperties}
      data-hoverable="true"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={shouldFloat ? floatAnim : { opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 0.8, delay: randomDelay },
        scale: { duration: 0.8, delay: randomDelay },
        ...(shouldFloat && {
          y: { duration: 4 + (index % 2), repeat: Infinity, ease: "easeInOut", delay: randomDelay + 0.5 },
          x: { duration: 5 + (index % 3), repeat: Infinity, ease: "easeInOut", delay: randomDelay + 0.5 },
          rotate: { duration: 6 + (index % 4), repeat: Infinity, ease: "easeInOut", delay: randomDelay + 0.5 },
        }),
      }}
      whileHover={!isMenuOpen ? {
        scale: 1.15,
        rotate: 0,
        y: -30,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      } : undefined}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => isMenuOpen && onHover?.(index)}
      onMouseLeave={() => isMenuOpen && onHover?.(null)}
      className="absolute w-40 h-24 md:w-52 md:h-32 cursor-pointer pointer-events-auto"
    >
      <motion.div
        className="w-full h-full"
        animate={isMenuOpen ? {
          y: getHoverOffset(),
          scale: isHovered ? 1.05 : 1,
        } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <LegoBrick label={label} index={index} />
      </motion.div>
    </motion.div>
  );
};

const HamburgerIcon = ({
  className,
  isOpen,
  onClick,
  invert = false,
}: {
  className?: string;
  isOpen: boolean;
  onClick: () => void;
  invert?: boolean;
}) => (
  <div
    onClick={onClick}
    className={`relative flex flex-col justify-center items-end gap-1 cursor-pointer pointer-events-auto ${className}`}
  >
    <img
      src={`${import.meta.env.BASE_URL}images/hamburger_line1.svg`}
      alt=""
      className="w-8 h-[10px] block"
      style={{ filter: invert ? "invert(1)" : "none" }}
    />
    <img
      src={`${import.meta.env.BASE_URL}images/hamburger_line2.svg`}
      alt=""
      className="w-8 h-[6px] block"
      style={{ filter: invert ? "invert(1)" : "none" }}
    />
    <motion.img
      src={`${import.meta.env.BASE_URL}images/hamburger_line3.svg`}
      alt=""
      className="w-8 h-[6px] origin-right block"
      style={{ filter: invert ? "invert(1)" : "none" }}
      animate={isOpen ? { rotate: -20, y: -6 } : { rotate: 0, y: 0 }}
      transition={{ duration: 0.3 }}
    />
  </div>
);


// 기존 FloatingMenuBlock 컴포넌트 끝난 후 (약 530줄 근처)에 추가

// ============================================================================
// 그룹 2: 햄버거 메뉴 전용 블록 (phase 10+)
// ============================================================================
const HamburgerMenuBlock: React.FC<{
  index: number;
  id?: string;
  isMenuOpen: boolean;
  hoveredIndex?: number | null;
  onClick?: () => void;
  onHover?: (index: number | null) => void;
}> = ({ index, id, isMenuOpen, hoveredIndex = null, onHover, onClick }) => {
  const label = BRICK_LABELS[index % BRICK_LABELS.length];
  const isHovered = isMenuOpen && hoveredIndex === index;
  const baseZIndex = isHovered ? 60 : 50 - index;

  return (
    <motion.div
      id={id}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: baseZIndex,
        visibility: 'hidden',  // ✅ 기본적으로 숨김 (useAnimate가 opacity 제어)
        pointerEvents: 'none', // ✅ 클릭 방지
      }}
      data-hoverable="true"
      initial={false}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => onHover?.(index)}
      onMouseLeave={() => onHover?.(null)}
      className="w-40 h-24 md:w-52 md:h-32 cursor-pointer pointer-events-auto"
    >
      <motion.div
        className="w-full h-full"
        animate={isMenuOpen ? {
          y: isHovered ? -10 : 0,
          scale: isHovered ? 1.05 : 1,
        } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <LegoBrick label={label} index={index} />
      </motion.div>
    </motion.div>
  );
};

// --- MAIN SECTION ---

const IntroSection: React.FC = () => {
  const [scope, animate] = useAnimate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [didIntroMenuAnim, setDidIntroMenuAnim] = useState(false);

  const safeAnimate = async (selector: string, keyframes: any, options?: any) => {
    const el = document.querySelector(selector);
    if (!el) return;
    await animate(selector, keyframes, options);
  };

  const handleMenuClick = async (index: number) => {
    const label = BRICK_LABELS[index];

    const targetByLabel: Record<string, number | null> = {
      BUILD: 14,
      PROJECT: 25,
      STACK: 26,
      GALLERY: 27,
      CONTACT: 28,
    };

    const target = targetByLabel[label];
    if (target == null) return;

    // ✅ 애니메이션 잠금
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // ✅ 메뉴가 열려있으면 "흡수"로 닫아주고
    if (menuOpen) await closeMenu();

    // ✅ 블럭 좌표/투명도 상태 초기화(중요)
    await resetMenuBlocks();

    // ✅ 네비 점프 전에 스크롤 오버레이/상태 정리 (2번 문제도 같이 해결)
    setIsNaturalScrolling(false);
    setNaturalScrollY(0);
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;

    setExpandedTooltip(null);
    setIsProjectOpen(false);

    // ✅ 이동
    setPhase(target);

    window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, 400);
  };


  const resetMenuBlocks = async () => {
    const jobs: Promise<any>[] = [];
    for (let i = 0; i < 5; i++) {
      const coords = getHamburgerAbsorbPosition(i);
      jobs.push(
        safeAnimate(
          `#menu-block-${i}`,
          { x: coords.x, y: coords.y, rotate: 0, scale: 0.2, opacity: 0 },
          { duration: 0.01 }
        )
      );
    }
    await Promise.all(jobs);
  };


  const headRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isNaturalScrolling, setIsNaturalScrolling] = useState(false);
  const [naturalScrollY, setNaturalScrollY] = useState(0);
  const [galleryFaceRotation, setGalleryFaceRotation] = useState(0);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const [isGalleryEntering, setIsGalleryEntering] = useState(true);
  const [phase, setPhase] = useState(0);
  const [expandedTooltip, setExpandedTooltip] = useState<number | null>(null);
  const [currentProject, setCurrentProject] = useState(0);
  const [isProjectOpen, setIsProjectOpen] = useState(false);

  const [faceExpression, setFaceExpression] =
    useState<FaceExpression>('neutral');

  const [isWinking, setIsWinking] = useState(false);
  const isShakingRef = useRef(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [headPosition, setHeadPosition] = useState(() => ({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.4 : 300,  // 40% 위치
  }));
  const lastShakeTimeRef = useRef(0); // 마지막 흔들림 시간 (쿨타임용)
  const [spinY, setSpinY] = useState(0);
  const handleSpinComplete = useCallback(() => {
    setSpinY(0);
  }, []);
  const [skillsCollected, setSkillsCollected] = useState(false);
  const [isSkillExiting, setIsSkillExiting] = useState(false);

  const headScale =
    phase >= 26 ? 1 :
      phase >= 23 ? 0.95 :
        phase >= 14 ? 0.45 :
          1.2;

  const showHat = phase >= 15 && phase < 26;
  const followParts = phase >= 2 && phase <= 12;
  const fixedPartsY = phase >= 14 && phase < 23 ? 25 : 0;
  const partsRotateY = followParts ? 0 : fixedPartsY;
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(null);
  const showMenuBlocks = menuOpen && phase >= 9;
  const phaseRef = useRef(phase);

  const isAnimatingRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [vw, setVw] = useState(() => window.innerWidth);
  const [vh, setVh] = useState(() => window.innerHeight);
  const faceRotateY = useTransform(mouseX, [-vw / 2, vw / 2], [-25, 25]);
  const faceRotateX = useTransform(mouseY, [-vh / 2, vh / 2], [20, -20]);


  const TEXT_ANCHOR_X = "12vw";

  const BLOCK_POSITIONS: React.CSSProperties[] = [
    { top: "25%", left: "clamp(2%, 10%, 20%)" },
    { top: "28%", right: "clamp(5%, 10%, 20%)" },
    { top: "55%", left: "clamp(3%, 12%, 15%)" },
    { top: "58%", right: "clamp(5%, 10%, 18%)" },
    { top: "80%", left: "50%", zIndex: 150 }
  ];

  const getTranslationToAlignCenters = (element: HTMLElement, targetCenter: { x: number, y: number }, container: HTMLElement) => {
    const r = element.getBoundingClientRect();
    const c = container.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    let matrix;
    try { matrix = new DOMMatrix(style.transform); } catch (e) { matrix = new DOMMatrix(); }
    const currentTx = matrix.m41;
    const currentTy = matrix.m42;
    const visualCenterX = (r.left - c.left) + r.width / 2;
    const visualCenterY = (r.top - c.top) + r.height / 2;
    const layoutCenterX = visualCenterX - currentTx;
    const layoutCenterY = visualCenterY - currentTy;
    return { x: targetCenter.x - layoutCenterX, y: targetCenter.y - layoutCenterY };


  };

  const getStackPosition = (index: number, prefix: string = 'menu-block') => {
    const hamburgerEl = document.getElementById("hamburger");
    const el = document.getElementById(`${prefix}-${index}`);
    const container = scope.current as HTMLElement | null;
    if (!hamburgerEl || !el || !container) return { x: 0, y: 0 };
    const hb = hamburgerEl.getBoundingClientRect();
    const c = container.getBoundingClientRect();
    const hbCenterX = (hb.left - c.left) + hb.width / 2;
    const screenBottom = window.innerHeight;
    const containerTop = c.top;
    const relativeBottom = screenBottom - containerTop;
    const marginBottom = 40;
    const blockHeight = el.offsetHeight;
    const overlap = blockHeight * 0.44;
    const effectiveHeight = blockHeight - overlap;
    const bottomBlockCenterY = (relativeBottom - marginBottom) - (blockHeight / 2);
    const targetCenterY = bottomBlockCenterY - ((4 - index) * effectiveHeight);
    return getTranslationToAlignCenters(el, { x: hbCenterX, y: targetCenterY }, container);
  };

  const getHamburgerAbsorbPosition = (index: number, prefix: string = 'menu-block') => {
    const hamburgerEl = document.getElementById("hamburger");
    const el = document.getElementById(`${prefix}-${index}`);
    const container = scope.current as HTMLElement | null;
    if (!hamburgerEl || !el || !container) return { x: 0, y: 0 };
    const hb = hamburgerEl.getBoundingClientRect();
    const c = container.getBoundingClientRect();
    const hbCenterX = (hb.left - c.left) + hb.width / 2;
    const hbCenterY = (hb.top - c.top) + hb.height / 2;
    return getTranslationToAlignCenters(el, { x: hbCenterX, y: hbCenterY }, container);
  };

  const handleScrollAction = async (direction: number) => {
    if (isAnimatingRef.current) return;
    if (isNaturalScrolling) return;

    if (menuOpen) {
      await closeMenu();
      return; // 첫 스크롤은 메뉴 닫기만
    }


    const currentPhase = phaseRef.current;

    if (direction > 0) {
      if (currentPhase === 0) {
        isAnimatingRef.current = true;
        setPhase(1);
        await runS1Animation();
        setPhase(3);
        isAnimatingRef.current = false;
      } else if (currentPhase === 3) {
        isAnimatingRef.current = true;
        setPhase(4);
        await runMergeAnimation();
        isAnimatingRef.current = false;
      } else if (currentPhase === 4) {
        isAnimatingRef.current = true;
        setPhase(5);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 5) {
        isAnimatingRef.current = true;
        setPhase(6);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 6) {
        isAnimatingRef.current = true;
        setPhase(7);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 7) {
        isAnimatingRef.current = true;
        setPhase(8);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 8) {
        isAnimatingRef.current = true;
        setPhase(9);
        setTimeout(() => { isAnimatingRef.current = false; }, 1000);
      } else if (currentPhase === 9) {
        isAnimatingRef.current = true;
        setPhase(10);

        try {
          await new Promise(r => setTimeout(r, 50));

          if (!didIntroMenuAnim) {
            await runStepA_StackAndEnter();   // 착착 + 쏙(흡수)
            setDidIntroMenuAnim(true);
            setMenuOpen(false);              // 흡수된 상태로 시작
          }

          setPhase(11); // phase는 “연출 완료 상태”로만 의미 부여
        } finally {
          isAnimatingRef.current = false;
        }

      } else if (currentPhase === 11) {
        isAnimatingRef.current = true;
        setPhase(13);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 13) {
        isAnimatingRef.current = true;
        setPhase(14);
        setTimeout(() => {
          setPhase(15);
          setIsNaturalScrolling(true);
          setNaturalScrollY(0);
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }
          isAnimatingRef.current = false;
        }, 1200);
      } else if (currentPhase === 16) {
        isAnimatingRef.current = true;
        setPhase(17);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 17) {
        isAnimatingRef.current = true;
        setPhase(18);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 18) {
        isAnimatingRef.current = true;
        setPhase(19);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 19) {
        isAnimatingRef.current = true;
        setPhase(20);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 20) {
        isAnimatingRef.current = true;
        setPhase(21);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 21) {
        isAnimatingRef.current = true;
        setPhase(22);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 22) {
        isAnimatingRef.current = true;
        setPhase(23);
        setTimeout(() => { isAnimatingRef.current = false; }, 1000);
      } else if (currentPhase === 23) {
        // 빔 + 프로젝트 동시 등장 (Phase 24 스킵)
        isAnimatingRef.current = true;
        setPhase(24);
        // 빔 애니메이션 후 바로 프로젝트 표시
        setTimeout(() => {
          setPhase(25);
          isAnimatingRef.current = false;
        }, 600);  // 빔 등장 시간
      } else if (currentPhase === 25) {
        if (currentProject < 2) {
          isAnimatingRef.current = true;
          setCurrentProject(prev => prev + 1);
          setTimeout(() => { isAnimatingRef.current = false; }, 1000);
        } else {
          // 다음 섹션으로
          isAnimatingRef.current = true;
          setPhase(26);
          setTimeout(() => { isAnimatingRef.current = false; }, 800);
        }
      }
      else if (currentPhase === 26) {
        // 스킬 섹션 → 갤러리 섹션 (흡수 애니메이션 후 전환)
        isAnimatingRef.current = true;
        setIsSkillExiting(true);  // 흡수 시작! onExitComplete에서 phase(27)로 전환됨
        setTimeout(() => { isAnimatingRef.current = false; }, 1500);
      }

    } else {

      if (currentPhase === 27) {
        // 갤러리 → 스킬 섹션으로 복귀
        isAnimatingRef.current = true;
        setPhase(26);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 26) {
        // 스킬 섹션 -> 프로젝트 섹션으로 복귀
        isAnimatingRef.current = true;
        setPhase(25);
        setTimeout(() => { isAnimatingRef.current = false; }, 1000);
      }
      else if (currentPhase === 25) {
        // ... (기존 25단계 로직 유지) ...
        if (currentProject > 0) {
          isAnimatingRef.current = true;
          setCurrentProject((prev) => prev - 1);
          setTimeout(() => { isAnimatingRef.current = false; }, 900);
        } else {
          isAnimatingRef.current = true;
          setPhase(24);  // ← 이걸
          setPhase(23);  // ← 이걸로 변경
          setTimeout(() => { isAnimatingRef.current = false; }, 800);
        }
      }
      else if (currentPhase === 23) {
        isAnimatingRef.current = true;
        setPhase(22);
        setTimeout(() => { isAnimatingRef.current = false; }, 1000);
      } else if (currentPhase === 22) {
        isAnimatingRef.current = true;
        setPhase(21);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 21) {
        isAnimatingRef.current = true;
        setPhase(20);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 20) {
        isAnimatingRef.current = true;
        setPhase(19);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 19) {
        isAnimatingRef.current = true;
        setPhase(18);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 18) {
        isAnimatingRef.current = true;
        setPhase(17);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 17) {
        isAnimatingRef.current = true;
        setPhase(16);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 16) {
        isAnimatingRef.current = true;
        setPhase(15);
        setIsNaturalScrolling(true);
        setNaturalScrollY(299);
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 299;
          }
          isAnimatingRef.current = false;
        }, 100);
      } else if (currentPhase === 15) {
        isAnimatingRef.current = true;
        setPhase(14);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 14) {
        isAnimatingRef.current = true;
        setPhase(13);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 13) {
        isAnimatingRef.current = true;
        setPhase(11);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 11) {
        // Blocked
      } else if (currentPhase === 9) {
        isAnimatingRef.current = true;
        setPhase(8);
        setTimeout(() => { isAnimatingRef.current = false; }, 1000);
      } else if (currentPhase === 8) {
        isAnimatingRef.current = true;
        setPhase(7);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 7) {
        isAnimatingRef.current = true;
        setPhase(6);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 6) {
        isAnimatingRef.current = true;
        setPhase(5);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 5) {
        isAnimatingRef.current = true;
        setPhase(4);
        setTimeout(() => { isAnimatingRef.current = false; }, 600);
      } else if (currentPhase === 4) {
        isAnimatingRef.current = true;
        setPhase(3);
        await runUnmergeAnimation();
        isAnimatingRef.current = false;
      } else if (currentPhase === 3) {
        isAnimatingRef.current = true;
        await runReverseS1Animation();
        setPhase(0);
        isAnimatingRef.current = false;
      }
    }
  };

  const lastDirRef = useRef<"L" | "R" | null>(null);
  const shakeCountRef = useRef(0);
  const lastEmitRef = useRef(0);


  // 기존 handleDrag 전체를 이걸로 교체
  const handleDrag = (_: any, info: any) => {
    const dx = info.delta?.x ?? 0;
    const now = performance.now();

    if (Math.abs(dx) < 6) return;

    const dir: "L" | "R" = dx > 0 ? "R" : "L";

    if (lastDirRef.current && dir !== lastDirRef.current) {
      shakeCountRef.current += 1;

      const threshold = 2;

      if (shakeCountRef.current >= threshold && now - lastEmitRef.current > 120) {
        lastEmitRef.current = now;
        shakeCountRef.current = 0;
        setShakeTrigger((p) => p + 1);

        // ✅ ref로 변경 - 리렌더링 없음
        isShakingRef.current = true;
        window.setTimeout(() => {
          isShakingRef.current = false;
        }, 150);
      }
    }

    lastDirRef.current = dir;
  };
  const runStepA_StackAndEnter = async () => {
    const stackAnims: Promise<any>[] = [];
    const order = [4, 3, 2, 1, 0];

    for (let i = 0; i < order.length; i++) {
      const idx = order[i];
      const coords = getStackPosition(idx, 'intro-block');

      stackAnims.push(
        (async () => {
          await safeAnimate(
            `#intro-block-${idx}`,
            {
              x: coords.x,
              y: [coords.y - 100, coords.y + 3, coords.y],
              rotate: 0,
              scale: [1, 1.02, 1]
            },
            {
              delay: i * 0.12,
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
              times: [0, 0.7, 1]
            }
          );
        })()
      );
    }

    await Promise.all(stackAnims);
    await new Promise((r) => setTimeout(r, 300));

    const enterAnims: Promise<any>[] = [];
    for (let i = 0; i < 5; i++) {
      const coords = getHamburgerAbsorbPosition(i, 'intro-block');
      enterAnims.push(
        safeAnimate(
          `#intro-block-${i}`,
          { x: coords.x, y: coords.y, scale: 0.2, opacity: 0 },
          { duration: 0.5, ease: "easeInOut", delay: i * 0.05 }
        )
      );
    }
    await Promise.all(enterAnims);
  };

  const handleHamburgerClick = async () => {
    if (isAnimatingRef.current) return;
    if (phase === 11) {
      isAnimatingRef.current = true;
      setPhase(12);
      await runStepB_PourOut();
      isAnimatingRef.current = false;
    } else if (phase === 12) {
      isAnimatingRef.current = true;
      const absorbAnims = [];
      for (let i = 0; i < 5; i++) {
        const coords = getHamburgerAbsorbPosition(i);
        absorbAnims.push(
          safeAnimate(`#menu-block-${i}`,
            { x: coords.x, y: coords.y, scale: 0.2, opacity: 0 },
            { duration: 0.4, ease: "backIn", delay: (4 - i) * 0.05 }
          )
        );
      }
      await Promise.all(absorbAnims);
      setPhase(11);
      isAnimatingRef.current = false;
    }
  };

  const runStepB_PourOut = async () => {
    // ✅ 먼저 visibility 활성화
    for (let i = 0; i < 5; i++) {
      const el = document.getElementById(`menu-block-${i}`);
      if (el) {
        el.style.visibility = 'visible';
        el.style.pointerEvents = 'auto';
      }
    }

    const pourAnims = [];
    for (let i = 0; i < 5; i++) {
      const coords = getStackPosition(i);
      const delay = (4 - i) * 0.15;
      pourAnims.push(
        safeAnimate(`#menu-block-${i}`,
          { x: coords.x, y: coords.y, scale: 1, opacity: 1 },
          { delay: delay, duration: 0.5, ease: "backOut" }
        )
      );
    }
    await Promise.all(pourAnims);
  };

  const openMenu = async () => {
    isAnimatingRef.current = true;
    setMenuOpen(true);

    await new Promise(r => setTimeout(r, 0));
    await runStepB_PourOut();

    isAnimatingRef.current = false;
  };

  const closeMenu = async () => {
    isAnimatingRef.current = true;

    const absorbAnims = [];
    for (let i = 0; i < 5; i++) {
      const coords = getHamburgerAbsorbPosition(i);
      absorbAnims.push(
        safeAnimate(
          `#menu-block-${i}`,
          { x: coords.x, y: coords.y, scale: 0.2, opacity: 0 },
          { duration: 0.4, ease: "backIn", delay: (4 - i) * 0.05 }
        )
      );
    }
    await Promise.all(absorbAnims);

    // ✅ 애니메이션 완료 후 완전히 숨기기
    for (let i = 0; i < 5; i++) {
      const el = document.getElementById(`menu-block-${i}`);
      if (el) {
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
      }
    }

    setMenuOpen(false);
    isAnimatingRef.current = false;
  };

  const handleHamburgerToggle = async () => {
    if (isAnimatingRef.current) return;
    if (!menuOpen) await openMenu();
    else await closeMenu();
  };

  useEffect(() => {
    if (phase === 27) {
      setIsGalleryEntering(true);
      setGalleryProgress(0);

      // 진입 애니메이션 완료 후
      setTimeout(() => {
        setIsGalleryEntering(false);
      }, 1200);  // 진입 애니메이션 시간
    }
  }, [phase]);



  useEffect(() => {
    // phase 10+ 진입 시 메뉴 블록들을 햄버거바 위치로 초기화
    if (phase >= 10 && didIntroMenuAnim) {
      resetMenuBlocks();
    }
  }, [phase, didIntroMenuAnim]);

  useEffect(() => {
    // phase가 바뀌면 자연스크롤은 무조건 끄기 (특히 메뉴 점프 대비)
    if (phase !== 15 && isNaturalScrolling) {
      setIsNaturalScrolling(false);
      setNaturalScrollY(0);
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
    }
  }, [phase, isNaturalScrolling]);


  useEffect(() => {
    // ✅ 11/12에서는 menuOpen을 유지, 그 외 구간 이동 시 닫기
    if (phase < 10) setMenuOpen(false);
  }, [phase]);

  // 다른 useEffect들 근처에 추가
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"], .cursor-pointer')) {
        setFaceExpression('blank');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"], .cursor-pointer')) {
        // ✅ 조건(if phase >= 26)을 제거하여 모든 페이즈에서 표정이 돌아오도록 수정
        setFaceExpression('neutral');
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"], .cursor-pointer')) {
        setFaceExpression('sweat');
        setTimeout(() => {
          // ✅ 여기도 조건 없이 일정 시간 뒤 기본 표정으로 복귀
          setFaceExpression('neutral');
        }, 400);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick);
    };
  }, []);
  useEffect(() => {
    if (phase === 26) {
      setSpinY(360);
      setHeadPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.3
      });
    }
  }, [phase]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleScrollActionRef = useRef(handleScrollAction);
  useEffect(() => {
    handleScrollActionRef.current = handleScrollAction;
  });

  useEffect(() => {
    if (!isNaturalScrolling || phase !== 15) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleNaturalScroll = () => {
      const scrollTop = container.scrollTop;
      setNaturalScrollY(scrollTop);

      if (scrollTop >= 300) {
        setIsNaturalScrolling(false);
        setPhase(16);
      }
    };

    container.addEventListener('scroll', handleNaturalScroll);
    return () => container.removeEventListener('scroll', handleNaturalScroll);
  }, [isNaturalScrolling, phase]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isNaturalScrolling) return;
      if (Math.abs(e.deltaY) > 10) {
        e.preventDefault();
        handleScrollActionRef.current(e.deltaY > 0 ? 1 : -1);
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartRef.current === null) return;
      if (isNaturalScrolling) return;
      const diff = touchStartRef.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 30) handleScrollActionRef.current(diff > 0 ? 1 : -1);
      touchStartRef.current = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isNaturalScrolling) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        handleScrollActionRef.current(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        handleScrollActionRef.current(-1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isNaturalScrolling]);

  const runS1Animation = async () => {
    const viewportHeight = window.innerHeight;
    const startY = viewportHeight * 1.3;
    await animate("#face-container", { y: [startY, -150], rotateZ: [-45, 10], rotateX: [30, 0] }, { duration: 0.8, ease: "circOut", times: [0, 1] });
    await animate("#face-container", { y: 0, rotateZ: 0 }, { duration: 0.2, ease: "easeIn" });
    setPhase(2);
    await new Promise(resolve => setTimeout(resolve, 20));
    const splitAnimations: any[] = [];
    splitAnimations.push(animate("#face-container", { y: [0, -20, 0] }, { duration: 0.4, ease: "easeOut" }));
    splitAnimations.push(animate(".split-part", { color: "#F0F0F0", fontWeight: 900, fontStyle: "italic" }, { duration: 0.2, ease: "easeOut" }));
    splitAnimations.push(animate(".hidden-char", { opacity: 1, width: "auto", scale: 1 }, { duration: 0.2, delay: 0.05 }));
    splitAnimations.push(animate("#split-play", { x: "-18vw" }, { duration: 0.5, ease: "backOut" }));
    splitAnimations.push(animate("#split-out", { x: "18vw" }, { duration: 0.5, ease: "backOut" }));
    splitAnimations.push(animate(scope.current, { backgroundColor: COLORS }, { duration: 2, ease: "linear" }));
    await Promise.all(splitAnimations);
  };

  const runReverseS1Animation = async () => {
    const viewportHeight = window.innerHeight;
    const startY = viewportHeight * 1.3;
    const faceAnim = animate("#face-container", { y: [0, -150, startY], rotateZ: [0, 10, -45], rotateX: [0, 0, 30] }, { duration: 0.8, ease: "easeInOut", times: [0, 0.3, 1] });
    const bgAnim = animate(scope.current, { backgroundColor: "#8F1E20" }, { duration: 0.8, ease: "easeInOut" });

    animate(".hidden-char", { opacity: 0, width: 0, scale: 0 }, { duration: 0.2 });
    animate("#split-play", { x: 0 }, { duration: 0.6, ease: "backInOut" });
    animate("#split-out", { x: 0 }, { duration: 0.6, ease: "backInOut" });
    animate(".split-part", { color: "#C7C7C7", fontWeight: 600, fontStyle: "normal" }, { duration: 0.4 });
    await Promise.all([faceAnim, bgAnim]);
  };

  const runMergeAnimation = async () => {
    const anims: any[] = [];
    anims.push(animate("#split-play", { x: "18vw" }, { duration: 0.5, ease: [0.22, 1, 0.36, 1] }));
    anims.push(animate("#face-container", { x: "-30vw" }, { duration: 0.5, ease: "easeInOut" }));
    anims.push(animate("#bang-char", { x: "20vw", opacity: 0 }, { duration: 0.2, delay: 0.35, ease: "easeOut" }));
    await Promise.all(anims);
  };

  const runUnmergeAnimation = async () => {
    const anims: any[] = [];
    anims.push(animate("#split-play", { x: "-18vw" }, { duration: 0.6, ease: "backOut" }));
    anims.push(animate("#face-container", { x: 0 }, { duration: 0.6, ease: "easeInOut" }));
    anims.push(animate("#bang-char", { x: 0, opacity: 1 }, { duration: 0.4, ease: "easeOut", delay: 0.2 }));
    await Promise.all(anims);
  };

  const prevMouseRef = useRef({ x: 0, y: 0, time: Date.now() });
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });
  const [absoluteMousePos, setAbsoluteMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX - window.innerWidth / 2);
    mouseY.set(clientY - window.innerHeight / 2);

    // 스킬 충돌용 절대 좌표 & 속도
    const now = Date.now();
    const dt = Math.max(now - prevMouseRef.current.time, 1);
    setMouseVelocity({
      x: (clientX - prevMouseRef.current.x) / dt * 16,
      y: (clientY - prevMouseRef.current.y) / dt * 16,
    });
    setAbsoluteMousePos({ x: clientX, y: clientY });
    prevMouseRef.current = { x: clientX, y: clientY, time: now };
  };

  const scrollOffset = phase >= 16 ? -300 : (isNaturalScrolling ? Math.max(-300, -naturalScrollY) : 0);
  const globalY = phase >= 23 ? "-80vh" : "0px";
  const finalExpression: FaceExpression =
    phase >= 26
      ? faceExpression
      : (faceExpression === 'blank' || faceExpression === 'sweat')
        ? faceExpression
        : (isWinking ? 'sweat' : 'neutral');
  return (
    <div
      ref={scope}
      tabIndex={0}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full flex flex-col items-center justify-center bg-[#e5e5e5] overflow-hidden outline-none"

    >
      <CustomCursor />
      {/* Phase 15에서 자연 스크롤을 위한 내부 컨테이너 */}
      <div
        ref={scrollContainerRef}
        className="absolute inset-0"
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          scrollbarGutter: "stable",
          pointerEvents: isNaturalScrolling ? "auto" : "none",
          opacity: isNaturalScrolling ? 1 : 0,
          zIndex: isNaturalScrolling ? 100 : -1,
        }}
      >
        <div style={{ height: 'calc(100% + 400px)', pointerEvents: 'none' }} />
      </div>

      {/* 크림 배경 + 타이틀 */}
      <motion.div
        className="absolute left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
        initial={{ x: "-120%" }}
        animate={
          phase >= 14
            ? { x: 0, y: `calc(-57vh + ${scrollOffset}px)` }
            : phase >= 13
              ? { x: 0, y: 0 }
              : { x: "-120%" }
        }
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ y: globalY }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <div
            className="absolute w-[200vw] bg-[#FFF2D5]"
            style={{
              height: "150vh",
              top: "85vh",
              left: "-50vw",
              transform: "skewY(8deg)",
              transformOrigin: "center top",
            }}
          />

          <div
            className="absolute font-black italic whitespace-nowrap"
            style={{
              fontSize: "clamp(48px, 11vw, 210px)",
              color: BG_CREAM,
              fontFamily: FONT_FAMILY,
              transform: "rotate(8deg)",
              transformOrigin: "left center",
              left: "4vw",
              top: "calc(85vh - 1.76em)",
              zIndex: 30,
            }}
          >
            HOW TO BUILD MK
          </div>
        </motion.div>
      </motion.div>

      {/* skill */}

      {phase >= 26 && (
        <motion.div
          className="absolute w-full"
          style={{ zIndex: 90, top: 0, height: "200vh" }}  // 높이 2배로
          initial={{ y: "100vh" }}  // 아래에서 시작
          animate={{ y: 0 }}
          exit={{ y: "100vh" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >

          <div className="absolute w-full bg-[#a6b551]" style={{ height: "100vh" }}>
            {phase >= 26 && (
              <SkillSection
                isActive={phase === 26}
                isExiting={isSkillExiting}
                onSkillsCollected={() => setSkillsCollected(true)}
                onExpressionChange={setFaceExpression}
                shakeTrigger={shakeTrigger}
                headRef={headRef}
                mousePos={absoluteMousePos}
                mouseVelocity={mouseVelocity}
                onExitComplete={() => {
                  setPhase(27);
                  setIsSkillExiting(false);
                }}
              />
            )}
          </div>
        </motion.div>
      )}

      {phase >= 27 && (
        <motion.div
          className="absolute w-full"
          style={{ zIndex: 95, top: 0, height: "100vh" }}
          initial={{ y: "100vh" }}
          animate={{ y: 0 }}
          exit={{ y: "100vh" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <GallerySection
            isActive={phase === 27}
            headRef={headRef}
            onProgressChange={setGalleryProgress}  // ← progress 전달받기
            onFaceRotation={setGalleryFaceRotation}
          />
        </motion.div>
      )}

      {/* Project Kits Beam (Yellow) */}
      <motion.div
        className="absolute pointer-events-none overflow-hidden"
        style={{
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 85,
        }}
        initial={{ opacity: 0 }}
        animate={phase >= 25 && phase < 26 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* ✅ key 추가해서 프로젝트 바뀔 때마다 애니메이션 재실행 */}
        <motion.div
          key={`beam-${currentProject}`}
          className="absolute"
          style={{
            width: "98vw",
            height: "110vh",
            background: BEAM_COLOR,
            transform: "rotate(-30deg)",
            transformOrigin: "top right",
            top: "0vh",
            right: "20vw",
          }}
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.1, 0.3, 1] }}
          transition={{
            duration: 0.6,
            times: [0, 0.3, 1],
            ease: "easeOut",
          }}
        />

        {/* 텍스트 */}
        <div
          className="absolute font-black italic"
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: "clamp(32px, 4vw, 50px)",
            color: PROJECT_TEXT_COLOR,
            top: "14%",
            left: "66%",
            transform: "rotate(-30deg) translateX(-50%)",
            transformOrigin: "left center",
            whiteSpace: "nowrap"
          }}
        >
          PROJECT KITS
        </div>
      </motion.div>

      {/* PROJECT KIT BOX */}
      <AnimatePresence mode="wait">
        {phase >= 25 && phase < 26 && (
          <motion.div
            key={PROJECT_DATA[currentProject].id}
            className="absolute z-[90]"
            style={{ left: "50%", top: "50%" }}
            initial={{
              opacity: 0,
              scale: 0.85,
              x: "-50%",
              y: "-45%",  // -50% + 약간 아래에서 시작
              filter: "brightness(0.7)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: "-50%",
              y: "-50%",
              filter: "brightness(1)",
              transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              opacity: 0,
              scale: 1.15,
              x: "-50%",
              y: "-55%",  // 위로 빠짐
              filter: "brightness(1.2)",
              transition: { duration: 0.35, ease: "easeIn" },
            }}
          >
            <ProjectKitBox
              isVisible={true}
              project={PROJECT_DATA[currentProject]}
              onOpen={() => setIsProjectOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purple Background Section */}
      <motion.div
        className="absolute w-full h-full pointer-events-none"
        style={{ zIndex: 80 }}
        initial={{ x: "120%" }}
        animate={
          phase >= 23
            ? { x: 0, y: "-130vh" }
            : phase >= 22
              ? { x: 0, y: 0 }
              : { x: "120%", y: 0 }
        }
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute w-[200vw] bg-[#8E00BD]"
          style={{
            height: "300vh",
            top: "85vh",
            left: "-50vw",
            transform: "skewY(-8deg)",
            transformOrigin: "center top",
          }}
        />
      </motion.div>


      <AnimatePresence>
        {isProjectOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" /* 배경 어둡게 */
            style={{ perspective: 1500 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ▼ 모달 크기를 여기서 조절합니다 (화면의 85%) */}
            <motion.div
              className="relative w-[85vw] h-[80vh] max-w-6xl"
              initial={{ rotateX: -30, opacity: 0, y: 100, scale: 0.9 }}
              animate={{ rotateX: 0, opacity: 1, y: 0, scale: 1 }}
              exit={{ rotateX: -30, opacity: 0, y: 100, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
            >

              {/* ▼ 새로 만든 상세 디자인 컴포넌트 */}
              <ProjectDetailCard
                onClose={() => setIsProjectOpen(false)}
                data={PROJECT_DATA[currentProject]}
              />

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 조립 가이드 섹션 (Parts Wrapper) */}
      {phase >= 15 && (
        <motion.div
          className="absolute z-[60] pointer-events-none"
          initial={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          animate={
            phase >= 23 ? {
              left: "85%", top: "10%",
              x: "-50%", y: "-50%",
              scale: 0.6,
              rotateZ: -25, rotateX: 30, rotateY: 15,
              opacity: 0
            } : {
              left: "50%", top: "50%",
              x: "-50%", y: "-50%",
              scale: 1,
              rotateZ: 0, rotateX: 0, rotateY: 0,
              opacity: 1
            }
          }
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* 캐릭터 파츠 - 스크롤 적용 */}
          <motion.div
            className="relative"
            initial={{ x: "-22vw", y: "8vh" }}
            animate={phase >= 23 ? { x: 0, y: 0 } : { x: "-25vw", y: `calc(22vh + ${scrollOffset}px)` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ zIndex: 120 }} // 전체 래퍼 기준
          >

            {/* ✅ (1) LABEL BETWEEN HAT ↔ FACE */}
            {/* <AnimatePresence>
              {phase < 21 && (
                <motion.div
                  className="absolute pointer-events-none flex items-center gap-[120px]"
                  style={{
                    left: "25%",
                    transform: "translateX(-50%)",
                    zIndex: 50, // 라벨은 항상 위
                  }}
                  initial={{ opacity: 1 }}
                  animate={{ top: "25px", opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-[28px] font-normal text-[#2b2b2b]">1</span>
                  <svg width="24" height="40" viewBox="0 0 24 40">
                    <path
                      d="M12,0 L12,32 M6,26 L12,34 L18,26"
                      stroke="#2b2b2b"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence> */}



            {/* <div
              // 1. relative -> absolute로 변경
              className="absolute flex flex-col items-center"
              style={{
                width: "280px",
                height: "280px",
                zIndex: 30,
                left: "50%",
                transform: "translateX(-50%)", 
                top: "100px",
              }}
            >
              <PartTooltip
                title={PART_DESCRIPTIONS[0].title}
                description={PART_DESCRIPTIONS[0].description}
                isVisible={phase === 16}
                details={PART_DESCRIPTIONS[0].details}
                isExpanded={expandedTooltip === 1}
                onToggle={() => setExpandedTooltip(expandedTooltip === 1 ? null : 1)}
                lineLength={80}
                leftOffset={-100}
              />
            </div> */}


            {/* <div
              className="absolute flex flex-col items-center"
              style={{
                width: "240px",
                height: "240px",
                zIndex: 30,
                left: "50%",
                transform: "translateX(-50%)",
                top: "150px",
              }}
            >
              <PartTooltip
                title={PART_DESCRIPTIONS[1].title}
                description={PART_DESCRIPTIONS[1].description}
                isVisible={phase === 17}
                details={PART_DESCRIPTIONS[1].details}
                isExpanded={expandedTooltip === 1}
                onToggle={() => setExpandedTooltip(expandedTooltip === 1 ? null : 1)}
                lineLength={80}
                leftOffset={-100}
              />
            </div> */}

            {/* ✅ (2) LABEL BETWEEN FACE ↔ BODY */}
            {/* <AnimatePresence>
              {phase < 21 && (
                <motion.div
                  className="absolute pointer-events-none flex items-center gap-[120px]"
                  style={{
                    left: "25%",
                    transform: "translateX(-50%)",
                    zIndex: 50,
                  }}
                  initial={{ opacity: 1 }}
                  animate={{ top: "208px", opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-[28px] font-normal text-[#2b2b2b]">2</span>
                  <svg width="24" height="40" viewBox="0 0 24 40">
                    <path
                      d="M12,0 L12,32 M6,26 L12,34 L18,26"
                      stroke="#2b2b2b"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence> */}

            {/* =========================
      3) BODY (zIndex: 20)
     ========================= */}
            {/* <motion.div
              className="absolute"
              style={{
                left: "59%",
                transform: "translateX(-50%)",
                zIndex: 20,
              }}
              animate={{
                top: phase >= 21 ? "110px" : "210px",
                opacity: phase >= 23 ? 0 : 1,
              }}
              transition={{ duration: 0.6, ease: "backOut" }}
            >
              <div className="relative flex flex-col items-center pointer-events-auto">
                <div className="relative" style={{ width: "280px", height: "280px" }}>
                  <PartPNG
                    src="images/lego_body.png"
                    alt="lego body"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>

                <PartTooltip
                  title={PART_DESCRIPTIONS[2].title}
                  description={PART_DESCRIPTIONS[2].description}
                  isVisible={phase === 18}
                  details={PART_DESCRIPTIONS[2].details}
                  isExpanded={expandedTooltip === 2}
                  onToggle={() => setExpandedTooltip(expandedTooltip === 2 ? null : 2)}
                  lineLength={80}
                  leftOffset={-120}
                />
              </div>
            </motion.div> */}

            {/* ✅ (3) LABEL BETWEEN BODY ↔ LEGS */}
            {/* <AnimatePresence>
              {phase < 21 && (
                <motion.div
                  className="absolute pointer-events-none flex items-center gap-[90px]"
                  style={{
                    left: "30%",
                    transform: "translateX(-50%)",
                    zIndex: 50,
                  }}
                  initial={{ opacity: 1 }}
                  animate={{ top: "440px", opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-[28px] font-normal text-[#2b2b2b]">3</span>
                  <div className='flex gap-12'>
                    <svg width="24" height="40" viewBox="0 0 24 40" className="translate-y-1">
                      <path
                        d="M12,0 L12,32 M6,26 L12,34 L18,26"
                        stroke="#2b2b2b"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <svg width="24" height="40" viewBox="0 0 24 40" className="-translate-y-2">
                      <path
                        d="M12,0 L12,32 M6,26 L12,34 L18,26"
                        stroke="#2b2b2b"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                </motion.div>
              )}
            </AnimatePresence> */}

            {/* =========================
      5) LEGS (zIndex: 10)
     ========================= */}
            {/* <motion.div
              className="absolute"
              style={{
                left: "51%",
                transform: "translateX(-50%)",
                zIndex: 10,
              }}
              animate={{
                top: phase >= 21 ? "240px" : "460px",
                opacity: phase >= 23 ? 0 : 1,
              }}
              transition={{ duration: 0.6, ease: "backOut" }}
            >
              <div className="relative flex flex-col items-center pointer-events-auto">
                <div className="relative" style={{ width: "280px", height: "280px" }}>
                  <PartPNG
                    src="images/lego_legs.png"
                    alt="lego legs"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>

                <PartTooltip
                  title={PART_DESCRIPTIONS[3].title}
                  description={PART_DESCRIPTIONS[3].description}
                  isVisible={phase === 19}
                  details={PART_DESCRIPTIONS[3].details}
                  isExpanded={expandedTooltip === 3}
                  onToggle={() => setExpandedTooltip(expandedTooltip === 3 ? null : 3)}
                  lineLength={80}
                />
              </div>
            </motion.div> */}
          </motion.div>


          {/* 오른쪽 플레이스홀더 */}
          <motion.div
            className="absolute"
            style={{
              left: "80px",
              top: "-30vh",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: (phase >= 16 && phase < 22) ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-[540px] h-[600px] flex flex-col items-center justify-center p-6">
              <motion.div
                className="absolute bg-[#2b2b2b]"
                style={{ top: 0, left: 0, height: 2 }}
                initial={{ width: 48 }}
                animate={{ width: phase >= 21 ? "100%" : 48 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bg-[#2b2b2b]"
                style={{ top: 0, left: 0, width: 2 }}
                initial={{ height: 48 }}
                animate={{ height: phase >= 21 ? "100%" : 48 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bg-[#2b2b2b]"
                style={{ bottom: 0, right: 0, height: 2 }}
                initial={{ width: 48 }}
                animate={{ width: phase >= 21 ? "100%" : 48 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bg-[#2b2b2b]"
                style={{ bottom: 0, right: 0, width: 2 }}
                initial={{ height: 48 }}
                animate={{ height: phase >= 21 ? "100%" : 48 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              <motion.div
                className="relative flex flex-col items-center justify-center p-8"
                transition={{ duration: 0.6, ease: "easeOut" }}
              ></motion.div>

              <AnimatePresence mode="wait">
                {phase < 21 ? (
                  <motion.div
                    key="placeholder"
                    initial={{ scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}  // 👈 나갈 때 살짝 커짐
                    className="flex flex-col px-8 mt-[-100px]"  // 👈 패딩 줄임
                  >
                    <div className="text-[100px] font-normal font-kanit text-[#333333] text-center">?</div>
                    <div className=" text-[20px] font-medium tracking-wider text-[#333333] font-kanit text-center">
                      ASSEMBLED CHARACTER
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="assembled"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                    className="w-full text-left"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-[32px] font-bold text-[#131416] font-kanit mb-1 -mt-[70px]">KIM MINKYEONG</h2>
                      <p className="text-[14px] text-[#777777] font-normal">이 캐릭터는 다음 요소로 구성되어 있습니다.</p>
                    </div>

                    <div className="space-y-4 b">
                      {RESUME_DATA.map((section) => (
                        <div key={section.id} className="border-t border-[#d9d9d9] pt-4 first:border-none first:pt-0">
                          <h3 className="text-[14px] font-medium text-[#5F677C] font-kanit mb-2">BUILD {section.id} · {section.title}</h3>
                          <div className="pl-0">
                            {section.content.map((item: any, idx) => (
                              <div key={idx} className="mb-1 last:mb-0">
                                {item.type === 'text' && (
                                  <div className="text-[16px] font-bold text-[#383D47]">{item.text}</div>
                                )}
                                {item.type === 'job' && (
                                  <div className="mb-1 last:mb-0">
                                    <div className="text-[16px] font-bold text-[#383D47] mb-1">{item.role}</div>
                                    <ul className="list-none space-y-1 text-[14px] text-[#383D47] pl-0">
                                      {item.tasks.map((task: string, tIdx: number) => (
                                        <li key={tIdx} className="before:content-['–'] before:mr-2 before:text-gray-400">
                                          {task}
                                        </li>
                                      ))}
                                      {item.achievement && (
                                        <li className="text-gray-800 font-semibold mt-1">
                                          * {item.achievement.replace('Achievement: ', '')}
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 햄버거 메뉴 */}
      <div className="fixed top-0 left-0 w-full h-24 max-w-[1920px] pointer-events-none px-6 md:px-16 xl:px-[180px] z-[999]">
        <div className="w-full h-full flex items-center justify-between">
          <motion.div
            id="hamburger"
            className="w-14 h-14 flex items-center justify-center pointer-events-auto rounded-full transition-colors duration-500"
            // ✅ phase가 9보다 클 때만 배경과 블러 효과 적용
            animate={{
              backgroundColor: phase > 9 ? "#8F1E20" : "rgba(255, 255, 255, 0)",
              boxShadow: phase > 9 ? "0 4px 6px rgba(0,0,0,0.05)" : "none"
            }}
            data-hoverable="true"
          >
            {/* 메뉴는 9단계부터 렌더링 */}
            {(phase >= 10) && (
              <HamburgerIcon
                isOpen={menuOpen}
                onClick={handleHamburgerToggle}
              />
            )}
          </motion.div>
          <div className="w-20 h-20" /> {/* 왼쪽 로고 여백 */}

        </div>
      </div>

      {phase >= 10 && (
        <div className="fixed inset-0 pointer-events-none z-[500]">
          {[0, 1, 2, 3, 4].map((i) => (
            <HamburgerMenuBlock
              key={`menu-${i}`}
              index={i}
              id={`menu-block-${i}`}
              isMenuOpen={menuOpen}
              hoveredIndex={hoveredBlockIndex}
              onHover={setHoveredBlockIndex}
              onClick={() => menuOpen && handleMenuClick(i)}
            />
          ))}
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className="relative w-full h-full max-w-[1920px] px-6 md:px-16 xl:px-[180px] flex items-center justify-between pointer-events-none">
        <div className="relative z-10 flex items-center justify-center overflow-visible w-full h-full">

          {(phase === 0 || phase === 1) && (
            <motion.div id="initial-layout" className="absolute z-10 select-none" style={{ fontFamily: FONT_FAMILY, fontWeight: 600, color: "#C7C7C7", fontSize: FONT_SIZE_CSS, lineHeight: 0.9 }}>
              LAYOUT
            </motion.div>
          )}

          {(phase >= 2 && phase <= 4) && (
            <motion.div id="split-wrapper" className="absolute flex items-center justify-center overflow-visible z-20" style={{ x: 0 }}>
              <motion.div id="split-play" className="split-part flex items-center" initial={{ color: "#C7C7C7", fontWeight: 600, fontStyle: "normal", x: 0 }} style={{ fontFamily: FONT_FAMILY, fontSize: FONT_SIZE_CSS, lineHeight: 0.9, marginRight: "-0.03em" }}>
                <motion.span className="hidden-char inline-block origin-right" initial={{ opacity: 0, width: 0, scale: 0.5 }}>P</motion.span><span>LAY</span>
              </motion.div>
              <motion.div id="split-out" className="split-part flex items-center" initial={{ color: "#C7C7C7", fontWeight: 600, fontStyle: "normal", x: 0 }} style={{ fontFamily: FONT_FAMILY, fontSize: FONT_SIZE_CSS, lineHeight: 0.9, marginLeft: "-0.03em" }}>
                <span>OUT</span><motion.span id="bang-char" className="hidden-char inline-block origin-left" initial={{ opacity: 0, width: 0, scale: 0.5 }}>!</motion.span>
              </motion.div>
            </motion.div>
          )}

          {/* LOGO LAYER */}
          <div className="absolute inset-0 z-50 pointer-events-none px-6 md:px-16 xl:px-[180px]">
            <AnimatePresence>
              {phase >= 8 && phase < 13 && (
                <motion.div
                  className="absolute"
                  initial={{
                    left: TEXT_ANCHOR_X,
                    top: "50%",
                    y: "-50%",
                    scale: 1,
                    opacity: 0,
                  }}
                  animate={
                    phase >= 9
                      ? {
                        left: "auto",      // ✅ left 해제
                        right: "-40px",    // ✅ 오른쪽으로
                        top: "20px",
                        y: 0,
                        scale: 0.4,
                        opacity: 1,
                      }
                      : {
                        left: "50%",
                        right: "auto",
                        top: "50%",
                        y: "-50%",
                        scale: 1,
                        opacity: 1,
                      }
                  }
                  transition={{
                    duration: 0.6,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  <StrokedWordmark
                    align={phase >= 9 ? "left" : "center"}
                    widthClass={phase >= 9 ? "w-[260px]" : "w-[80vw] max-w-[600px]"}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {(phase >= 5 && phase <= 7) && (
              <motion.div className="absolute z-30" initial={{ x: TEXT_ANCHOR_X, opacity: 0 }} animate={{ x: TEXT_ANCHOR_X, opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                <S2SlotMachine activeIndex={phase - 5} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 그룹 1: 인트로 메뉴 (phase 9에서만, 흡수 전까지) */}
          {(phase === 9 || phase === 10) && !didIntroMenuAnim && (
            <div className="absolute inset-0 pointer-events-none z-[110]">
              {BLOCK_POSITIONS.map((pos, i) => (
                <FloatingMenuBlock
                  key={`intro-${i}`}
                  index={i}
                  id={`intro-block-${i}`}
                  shouldFloat={true}
                  isMenuOpen={false}
                  hoveredIndex={hoveredBlockIndex}
                  onHover={setHoveredBlockIndex}
                  style={pos}
                  onClick={() => handleMenuClick(i)}  // ✅ 클릭 핸들러 연결
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* 얼굴 컨테이너 (최종 수정: 화살표 등장 타이밍 phase >= 14 적용) */}
      <motion.div
        id="face-container"
        ref={headRef}
        className={`absolute pointer-events-auto ${shakeTrigger > 0 && phase === 26 ? 'animate-shake' : ''}`}
        data-lego-head="true"
        style={{
          width: "700px",
          height: "700px",
          perspective: 1000,
          zIndex: 100,
          overflow: "visible",
          cursor: phase === 26 ? "grab" : "default",
          touchAction: "none",
        }}
        drag={phase === 26}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDrag={phase >= 26 ? handleDrag : undefined}
        // whileDrag={{ cursor: "grabbing", scale: 1.25 }}

        initial={{ y: "150vh", rotateZ: -45, rotateX: 30, scale: 0.8 }}

        animate={
          phase >= 27
            ? isGalleryEntering
              ? {
                left: "18%",  // START 위치와 맞춤
                top: "calc(100vh - 85px)",
                x: "-50%",    // 중앙 정렬
                y: "-50%",
                scale: 0.12,
                rotateZ: 0,
              }

              : {
                // 스크롤 중: 여기서 왼쪽으로 이동
                left: `calc(18% + ${galleryProgress * 62}vw)`,
                top: galleryProgress >= 0.98
                  ? "calc(100vh + 300px)"
                  : "calc(100vh - 85px)",
                x: 0,  // x는 항상 0으로 통일
                y: "-50%",
                scale: 0.12,
                rotateZ: galleryProgress * 720,
              }
            :
            phase >= 26
              ? {
                left: "calc(50% - 350px)",
                top: "calc(50% - 350px)",
                x: 0, y: 0, scale: 1.0,
                rotateZ: 0,
              }
              : phase >= 23
                ? { left: "95%", top: "20%", x: "-50%", y: "-50%", scale: 1.2 }
                : phase >= 14
                  ? {
                    // 조립 단계: 이미지가 너무 작아지지 않도록 scale 0.9~1.0 유지
                    left: "25vw",
                    top: "50%",
                    x: "-50%",
                    y: `calc(-30% + ${scrollOffset}px)`,
                    scale: 0.9,
                    rotateX: 0,
                    rotateZ: 0,
                    rotateY: 0
                  }
                  : phase >= 9
                    ? { left: "50%", top: "45%", x: "-50%", y: "-50%", scale: 0.8, rotateZ: 0, rotateY: 0 }
                    : { y: "150vh" }
        }
        transition={{
          duration: phase >= 27 ? 1.2 : 1.0,
          ease: phase >= 27 ? [0.34, 1.56, 0.64, 1] : "easeInOut"
        }}
      >

        {/* 1. HAT (모자) */}
        {showHat && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              x: "-40%",
              zIndex: 120,
              transformOrigin: "bottom center"
            }}
            animate={{
              top: phase >= 21 ? "10%" : "-9%",
              opacity: 1,
              y: phase >= 21 ? 20 : 0,
              scaleX: phase >= 23 ? -1 : 1,
              scale: phase >= 23 ? 2.1 : 1,
            }}
            transition={{ duration: 0.6, ease: "backOut" }}
          >
            <PartPNG src="images/hat.svg" className="w-[260px] h-[260px] object-contain" alt="hat" />
            <PartTooltip
              title={PART_DESCRIPTIONS[0].title}
              description={PART_DESCRIPTIONS[0].description}
              isVisible={phase === 16}
              details={PART_DESCRIPTIONS[0].details}
              isExpanded={expandedTooltip === 0}
              onToggle={() => setExpandedTooltip(expandedTooltip === 0 ? null : 0)}
              lineLength={80}
              leftOffset={-90}
            />
          </motion.div>
        )}

        {/* 2. HEAD (얼굴) */}
        {/* 2. HEAD (얼굴) */}
        <motion.div
          className="absolute pointer-events-auto"
          style={{
            width: "700px",
            height: "700px",
            left: "50%",
            x: "-50%",
            top: "-6%",
            transformStyle: "preserve-3d",
            zIndex: 100,
            display: "flex",           // ✅ flex로 변경
            justifyContent: "center",  // ✅ 추가
            alignItems: "center",      // ✅ 추가
          }}
        >
          {/* 내부 wrapper - absolute 제거 */}
          <motion.div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "700px",
              height: "700px",
            }}
            animate={{
              scale: headScale,  // ← width/height 대신 scale로 변경!
            }}
          >
            <Suspense fallback={<FaceLoadingPlaceholder />}>
              <LegoFace3D
                className="w-full h-full drop-shadow-2xl"
                followMouse={phase >= 2 && phase <= 12}
                fixedRotationY={phase >= 26 ? 0 : phase >= 23 ? -40 : (phase >= 14 && phase < 23 ? 25 : 0)}
                fixedRotationX={phase >= 14 && phase < 23 ? 3 : 0}
                spinY={phase === 26 ? spinY : 0}
                expression={finalExpression}
                isShaking={false}
                onSpinComplete={handleSpinComplete}  // ← 여기!
              />
            </Suspense>
          </motion.div>

        </motion.div>

        {/* --- 화살표 & 라벨 (조건 수정: phase >= 14 추가) --- */}
        <AnimatePresence>
          {/* ✅ phase >= 14 조건 추가로 초반에는 안 보이게 설정 */}
          {(phase >= 14 && phase < 21) && (
            <>
              {/* 라벨 1: 머리-몸통 사이 */}
              <motion.div
                className="absolute pointer-events-none flex items-center gap-[160px]"
                style={{ left: "20%", top: "18%", zIndex: 150 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-[clamp(20px,3vw,32px)] font-normal text-[#2b2b2b]">1</span>
                <svg width="20" height="40" viewBox="0 0 24 60" >
                  <path d="M12,0 L12,50 M6,42 L12,52 L18,42" stroke="#2b2b2b" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>

              {/* 라벨 2: 몸통-다리 사이 */}
              <motion.div
                className="absolute pointer-events-none flex items-center gap-[160px]"
                style={{ left: "26%", top: "53%", zIndex: 150 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-[32px] font-normal text-[#2b2b2b]">2</span>
                <div className="flex gap-6">
                  <svg width="20" height="40" viewBox="0 0 24 60" className="translate-y-2">
                    <path d="M12,0 L12,50 M6,42 L12,52 L18,42" stroke="#2b2b2b" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.div>

              <motion.div
                className="absolute pointer-events-none flex items-center gap-[100px]"
                style={{ left: "26%", top: "100%", zIndex: 150 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex gap-[120px]">
                  <span className="text-[32px] font-normal text-[#2b2b2b] -ml-2">3</span>
                  <div className="flex gap-[80px]">
                    <svg width="20" height="40" viewBox="0 0 24 60" className="translate-y-1">
                      <path d="M12,0 L12,50 M6,42 L12,52 L18,42" stroke="#2b2b2b" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <svg width="20" height="40" viewBox="0 0 24 60" className="-translate-y-2">
                      <path d="M12,0 L12,50 M6,42 L12,52 L18,42" stroke="#2b2b2b" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 3. BODY (몸통) */}
        {(phase >= 14) && (
          <motion.div
            className="absolute"
            style={{ left: "58%", x: "-50%", zIndex: 90 }}
            animate={{
              top: phase >= 21 ? "34.5%" : "53%",
              opacity: phase >= 23 ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: "backOut" }}
          >
            <div className="relative w-[400px] h-[400px]">
              <PartPNG src="images/lego_body.png" alt="lego body" className="w-full h-full object-contain" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <PartTooltip
                  title={PART_DESCRIPTIONS[2].title}
                  description={PART_DESCRIPTIONS[2].description}
                  isVisible={phase === 18}
                  details={PART_DESCRIPTIONS[2].details}
                  isExpanded={expandedTooltip === 2}
                  onToggle={() => setExpandedTooltip(expandedTooltip === 2 ? null : 2)}
                  lineLength={80}
                  leftOffset={40}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. LEGS (다리) */}
        {(phase >= 14) && (
          <motion.div
            className="absolute"
            style={{ left: "54%", x: "-50%", zIndex: 80 }}
            animate={{
              top: phase >= 21 ? "62%" : "101%",
              opacity: phase >= 23 ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: "backOut" }}
          >
            <div className="relative w-[400px] h-[400px]">
              <PartPNG src="images/lego_legs.png" alt="lego legs" className="w-full h-full object-contain" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <PartTooltip
                  title={PART_DESCRIPTIONS[3].title}
                  description={PART_DESCRIPTIONS[3].description}
                  isVisible={phase === 19}
                  details={PART_DESCRIPTIONS[3].details}
                  isExpanded={expandedTooltip === 3}
                  onToggle={() => setExpandedTooltip(expandedTooltip === 3 ? null : 3)}
                  lineLength={80}
                  leftOffset={60}
                />
              </div>
            </div>
          </motion.div>
        )}

      </motion.div>
      <AnimatePresence>
        {phase === 17 && (
          <motion.div
            style={{
              position: "absolute",
              left: "25vw",
              top: "50%",
              transform: `translate(-50%, calc(-30% + ${scrollOffset}px))`,
              zIndex: 200,
              pointerEvents: "auto",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 얼굴 중심에서 툴팁 위치 조정 */}
            <div style={{ position: "relative", left: "0px", top: "50px" }}>
              <PartTooltip
                title={PART_DESCRIPTIONS[1].title}
                description={PART_DESCRIPTIONS[1].description}
                isVisible={true}
                details={PART_DESCRIPTIONS[1].details}
                isExpanded={expandedTooltip === 1}
                onToggle={() => setExpandedTooltip(expandedTooltip === 1 ? null : 1)}
                lineLength={80}
                leftOffset={60}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* 하단 안내 문구 */}
      {phase === 0 && <motion.div className="absolute bottom-10 text-gray-400 font-kanit font-semibold text-sm animate-bounce uppercase tracking-widest">Scroll to Start</motion.div>}
      {(phase === 3) && <motion.div className="absolute bottom-10 text-white/50 font-kanit text-xs uppercase tracking-widest" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Scroll to Merge</motion.div>}
      {(phase >= 4 && phase < 9) && <motion.div className="absolute bottom-10 text-white/50 font-kanit text-xs uppercase tracking-widest" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Scroll to Explore</motion.div>}
      {(phase === 9) && <motion.div className="absolute bottom-10 text-white/50 font-kanit text-xs uppercase tracking-widest" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Scroll to Build</motion.div>}
    </div >
  );
};

export default IntroSection;