import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimate, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { LegoFace3D } from './LegoFace3D';
// import { LegoPart3D } from "./LegoPart3D";

const COLORS = [
  '#8F1E20', '#F25F09', '#FCBB09', '#8E00BD', '#2B7000', '#B7156C', '#8F1E20'
];

const BG_CREAM = "#FFF2D5";
const BEAM_COLOR = "#FCBB09";
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
    details: "프로젝트의 방향성을 설정하고 핵심 문제를 정의하는 역할을 합니다.",
  },
  {
    title: "Insight Mask",
    description: "사용자보다 먼저 불편함을 감지합니다. ",
    details: "사용성 테스트와 휴리스틱 평가를 통해 잠재적인 UX 문제를 사전에 발견합니다.",
  },
  {
    title: "Layout Harness",
    description: "뒤죽박죽 섞인 정보들을 이해하기 쉬운 구조로 정리합니다.",
    details: "사용성 테스트와 휴리스틱 평가를 통해 잠재적인 UX 문제를 사전에 발견합니다.",
  },
  {
    title: "Responsibility Legs",
    description: "맡은 일은 마지막까지 책임감을 가지고 작업합니다",
    details: "사용성 테스트와 휴리스틱 평가를 통해 잠재적인 UX 문제를 사전에 발견합니다.",
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
        achievement: "Achievement: 똑딱이 인식표 최초 개발"
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
const BRICK_COLORS = [
  { main: "#ef4444", side: "#b91c1c", top: "#f87171" },
  { main: "#f59e0b", side: "#b45309", top: "#fbbf24" },
  { main: "#10b981", side: "#047857", top: "#34d399" },
  { main: "#3b82f6", side: "#1d4ed8", top: "#60a5fa" },
  { main: "#8b5cf6", side: "#6d28d9", top: "#a78bfa" }
];

const FONT_SIZE_CSS = 'min(14vw, 200px)';
const FONT_FAMILY = 'Kanit, sans-serif';


// --- PROJECT KIT BOX ---
const ProjectKitBox = ({ isVisible }: { isVisible: boolean }) => (
  <motion.div
    className="absolute z-[90]"
    style={{
      left: "40%",
      top: "60%",
      transform: "translate(-50%, -50%) rotate(-5deg)",
    }}
    initial={{ opacity: 0, scale: 0.8, y: 100 }}
    animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 100 }}
    transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
  >
    <div className="w-[60vw] max-w-[500px] aspect-[16/10] bg-[#e5e5e5] shadow-2xl relative overflow-hidden rounded-sm border border-white/20">
      <div className="absolute inset-0 bg-[#d4d4d4] flex items-center justify-center overflow-hidden">
        <div className="absolute w-full h-full bg-[#d6d3cd]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#b0a89e] blur-3xl opacity-50 rounded-full"></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      <div className="absolute top-6 left-6">
        <div className="bg-[#8F1E20] text-white text-xs font-black italic px-2 py-0.5 inline-block" style={{ fontFamily: FONT_FAMILY }}>PLAYOUT</div>
      </div>
      <div className="absolute top-6 right-6 text-white font-serif tracking-widest text-sm opacity-90 font-bold">
        BEAUTY OF JOSEON
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white/20 text-6xl font-black">KIT</div>
      </div>

      <div className="absolute bottom-6 left-6 text-white" style={{ fontFamily: FONT_FAMILY }}>
        <div className="text-4xl font-black mb-0 leading-none">10+</div>
        <div className="text-[10px] opacity-70 mb-3 tracking-wider">2509191024</div>
        <div className="h-0.5 w-8 bg-white/70 mb-2"></div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold">840</span>
          <span className="text-[10px] opacity-70">hours/pcs</span>
        </div>
      </div>
    </div>
  </motion.div>
);

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
}) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        className="absolute flex items-center pointer-events-auto"
        style={{
          left: "calc(100% - 40px)",
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
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <div
            className="w-4 h-4 rounded-full bg-[#2b2b2b]"
            style={{ boxShadow: "0 0 0 3px #FFF2D5" }}
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
          className="bg-[#FDD130] border-[3px] border-[#2b2b2b] shadow-[4px_4px_0_0_#2b2b2b] flex-shrink-0"
          style={{ width: "280px", padding: "20px 24px" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="font-bold text-[#2b2b2b] italic text-[20px] mb-2" style={{ fontFamily: 'Kanit, sans-serif' }}>
            {title}
          </h3>
          <p className="text-[#333] text-[14px] font-medium leading-[1.5]">
            {description}
          </p>

          {/* + 버튼 */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={onToggle}
              className="w-10 h-10 border-[2px] border-[#2b2b2b] bg-white flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5]"
            >
              <svg
                width="20" height="20" viewBox="0 0 20 20" fill="none"
                style={{ transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              >
                <path d="M10 4V16M4 10H16" stroke="#2b2b2b" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* 확장 컨텐츠 */}
          <AnimatePresence>
            {isExpanded && details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t-2 border-[#2b2b2b]/30">
                  <p className="text-[#555] text-[13px] leading-[1.6]">{details}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
  onHover?: (index: number | null) => void;
}> = ({ index, style, id, shouldFloat, isMenuOpen = false, hoveredIndex = null, onHover }) => {
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
      style={{ ...style, zIndex: baseZIndex } as React.CSSProperties}
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
  onClick
}: {
  className?: string,
  isOpen: boolean,
  onClick: () => void
}) => (
  <div
    onClick={onClick}
    className={`fixed top-[40px] right-[180px] z-50 flex flex-col justify-center items-end gap-1 cursor-pointer pointer-events-auto ${className}`}
  >
    <img
      src={`${import.meta.env.BASE_URL}images/hamburger_line1.svg`}
      alt=""
      className="w-8 h-[10px]"
    />
    <img
      src={`${import.meta.env.BASE_URL}images/hamburger_line2.svg`}
      alt=""
      className="w-8 h-[6px]"
    />
    <motion.img
      src={`${import.meta.env.BASE_URL}images/hamburger_line3.svg`}
      alt=""
      className="w-8 h-[6px] origin-right"
      animate={isOpen ? { rotate: -20, y: -6 } : { rotate: 0, y: 0 }}
      transition={{ duration: 0.3 }}
    />
  </div>
);

// --- MAIN SECTION ---

const IntroSection: React.FC = () => {
  const [scope, animate] = useAnimate();

  const safeAnimate = async (selector: string, keyframes: any, options?: any) => {
    const el = document.querySelector(selector);
    if (!el) return;
    await animate(selector, keyframes, options);
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isNaturalScrolling, setIsNaturalScrolling] = useState(false);
  const [naturalScrollY, setNaturalScrollY] = useState(0);

  const [phase, setPhase] = useState(0);
  const [expandedTooltip, setExpandedTooltip] = useState<number | null>(null);

  const faceScale =
    phase >= 23 ? 0.5 :
      phase >= 14 ? 0.28 :
        phase >= 9 ? 1 :
          0.8;


  const showHat = phase >= 15 && phase < 23;
  const followParts = phase >= 2 && phase <= 12;
  const fixedPartsY = phase >= 14 && phase < 23 ? 25 : 0;
  const partsRotateY = followParts ? 0 : fixedPartsY;
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(null);

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
    { top: "25%", left: "15%" },
    { top: "20%", right: "15%" },
    { top: "60%", left: "10%" },
    { top: "55%", right: "12%" },
    { top: "80%", left: "55%" }
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

  const getStackPosition = (index: number) => {
    const hamburgerEl = document.getElementById("hamburger");
    const el = document.getElementById(`block-${index}`);
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

  const getHamburgerAbsorbPosition = (index: number) => {
    const hamburgerEl = document.getElementById("hamburger");
    const el = document.getElementById(`block-${index}`);
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
          await runStepA_StackAndEnter();
          setPhase(11);
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
        isAnimatingRef.current = true;
        setPhase(24);
        setTimeout(() => { isAnimatingRef.current = false; }, 1000);
      } else if (currentPhase === 24) {
        isAnimatingRef.current = true;
        setPhase(25);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      }

    } else {
      if (currentPhase === 25) {
        isAnimatingRef.current = true;
        setPhase(24);
        setTimeout(() => { isAnimatingRef.current = false; }, 800);
      } else if (currentPhase === 24) {
        isAnimatingRef.current = true;
        setPhase(23);
        setTimeout(() => { isAnimatingRef.current = false; }, 1000);
      } else if (currentPhase === 23) {
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

  const runStepA_StackAndEnter = async () => {
    const stackAnims: Promise<any>[] = [];
    const order = [4, 3, 2, 1, 0];

    for (let i = 0; i < order.length; i++) {
      const idx = order[i];
      const coords = getStackPosition(idx);

      stackAnims.push(
        (async () => {
          await safeAnimate(
            `#block-${idx}`,
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
      const coords = getHamburgerAbsorbPosition(i);
      enterAnims.push(
        safeAnimate(
          `#block-${i}`,
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
          safeAnimate(`#block-${i}`,
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
    const pourAnims = [];
    for (let i = 0; i < 5; i++) {
      const coords = getStackPosition(i);
      const delay = (4 - i) * 0.15;
      pourAnims.push(
        safeAnimate(`#block-${i}`,
          { x: coords.x, y: coords.y, scale: 1, opacity: 1 },
          { delay: delay, duration: 0.5, ease: "backOut" }
        )
      );
    }
    await Promise.all(pourAnims);
  };

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
    const bgAnim = animate(scope.current, { backgroundColor: "#E5E5E5" }, { duration: 0.8, ease: "easeInOut" });
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

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX - window.innerWidth / 2);
    mouseY.set(clientY - window.innerHeight / 2);
  };

  const scrollOffset = phase >= 16 ? -300 : (isNaturalScrolling ? Math.max(-300, -naturalScrollY) : 0);
  const tooltipCounterRotateY = phase >= 14 && phase < 23 ? -25 : 0;
  const tooltipCounterRotateX = phase >= 14 && phase < 23 ? -3 : 0;
  const globalY = phase >= 23 ? "-80vh" : "0px";

  return (
    <div
      ref={scope}
      tabIndex={0}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full flex flex-col items-center justify-center bg-[#E5E5E5] overflow-hidden outline-none"
    >
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
        className="absolute left-0 w-full h-full"
        style={{ zIndex: 10 }}
        initial={{ x: "-120%" }}
        animate={
          phase >= 14
            ? { x: 0, y: `calc(-57vh + ${scrollOffset}px)` }
            : phase >= 13
              ? { x: 0, y: 0 }
              : { x: "-120%", y: 0 }
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
              height: "300vh",
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

      {/* Project Kits Beam (Yellow) */}
      <motion.div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: BEAM_COLOR,
          clipPath: "polygon(75% 0%, 95% 100%, 10% 100%)",
          zIndex: 85,
        }}
        initial={{ opacity: 0 }}
        animate={phase >= 24 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div
          className="absolute font-black italic"
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: "clamp(32px, 4vw, 60px)",
            color: PROJECT_TEXT_COLOR,
            top: "25%",
            left: "40%",
            transform: "rotate(-57deg)",
            transformOrigin: "center center",
            whiteSpace: "nowrap"
          }}
        >
          PROJECT KITS
        </div>
      </motion.div>

      {/* PROJECT KIT BOX */}
      <ProjectKitBox isVisible={phase >= 25} />

      {/* Purple Background Section */}
      <motion.div
        className="absolute w-full h-full"
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
            initial={{ x: "-25vw", y: "12vh" }}
            animate={phase >= 23 ? { x: 0, y: 0 } : { x: "-25vw", y: `calc(12vh + ${scrollOffset}px)` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ zIndex: 120 }} // 전체 래퍼 기준
          >

            {/* ✅ (1) LABEL BETWEEN HAT ↔ FACE */}
            <AnimatePresence>
              {phase < 21 && (
                <motion.div
                  className="absolute pointer-events-none flex items-center gap-[120px]"
                  style={{
                    left: "20%",
                    transform: "translateX(-50%)",
                    zIndex: 50, // 라벨은 항상 위
                  }}
                  initial={{ opacity: 1 }}
                  animate={{ top: "12px", opacity: 1 }}
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
            </AnimatePresence>

            {/* =========================
      2) FACE SLOT (zIndex: 30)
     ========================= */}
            <div
              className="relative flex flex-col items-center"
              style={{ width: "240px", height: "240px", zIndex: 30 }}
            >
              <PartTooltip
                title={PART_DESCRIPTIONS[1].title}
                description={PART_DESCRIPTIONS[1].description}
                isVisible={phase === 17}
                details={PART_DESCRIPTIONS[1].details}
                isExpanded={expandedTooltip === 1}
                onToggle={() => setExpandedTooltip(expandedTooltip === 1 ? null : 1)}
                lineLength={80}
              />
            </div>

            {/* ✅ (2) LABEL BETWEEN FACE ↔ BODY */}
            <AnimatePresence>
              {phase < 21 && (
                <motion.div
                  className="absolute pointer-events-none flex items-center gap-[120px]"
                  style={{
                    left: "20%",
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
            </AnimatePresence>

            {/* =========================
      3) BODY (zIndex: 20)
     ========================= */}
            <motion.div
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
              <div className="relative flex flex-col items-center">
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
                  counterRotateY={tooltipCounterRotateY}
                  counterRotateX={tooltipCounterRotateX}
                  lineLength={80}
                />
              </div>
            </motion.div>

            {/* ✅ (3) LABEL BETWEEN BODY ↔ LEGS */}
            <AnimatePresence>
              {phase < 21 && (
                <motion.div
                  className="absolute pointer-events-none flex items-center gap-[120px]"
                  style={{
                    left: "20%",
                    transform: "translateX(-50%)",
                    zIndex: 50,
                  }}
                  initial={{ opacity: 1 }}
                  animate={{ top: "440px", opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-[28px] font-normal text-[#2b2b2b]">3</span>
                  <div className='flex gap-8'>
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
            </AnimatePresence>

            {/* =========================
      5) LEGS (zIndex: 10)
     ========================= */}
            <motion.div
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
              <div className="relative flex flex-col items-center">
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
            </motion.div>
          </motion.div>


          {/* 오른쪽 플레이스홀더 */}
          <motion.div
            className="absolute"
            style={{
              left: "140px",
              top: "-23vh",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: (phase >= 16 && phase < 22) ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-[540px] flex flex-col items-center justify-center p-8">
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

              <AnimatePresence mode="wait">
                {phase < 21 ? (
                  <motion.div
                    key="placeholder"
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center py-20"
                  >
                    <div className="text-[128px] font-normal font-kanit text-[#333333]">?</div>
                    <div className="mt-6 text-[24px] font-normal tracking-wider text-[#333333] font-kanit text-center">
                      ASSEMBLED CHARACTER
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="assembled"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
                    className="w-full text-left"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-[32px] font-bold text-[#131416] font-kanit mb-1">ASSEMBLED CHARACTER</h2>
                      <p className="text-[14px] text-[#777777] font-normal">이 캐릭터는 다음 요소로 구성되어 있습니다.</p>
                    </div>

                    <div className="space-y-4 b">
                      {RESUME_DATA.map((section) => (
                        <div key={section.id} className="border-t border-[#bbbbbb] pt-4 first:border-none first:pt-0">
                          <h3 className="text-[16px] font-medium text-[#5F677C] font-kanit mb-1">BUILD {section.id} · {section.title}</h3>
                          <div className="pl-0">
                            {section.content.map((item: any, idx) => (
                              <div key={idx} className="mb-3 last:mb-0">
                                {item.type === 'text' && (
                                  <div className="text-[20px] font-bold text-[#383D47]">{item.text}</div>
                                )}
                                {item.type === 'job' && (
                                  <div className="mb-1 last:mb-0">
                                    <div className="text-[20px] font-bold text-[#383D47] mb-1">{item.role}</div>
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
      <div className="absolute top-0 left-0 w-full h-full max-w-[1920px] pointer-events-none px-6 md:px-16 xl:px-[180px] z-50">
        <div className="w-full h-24 flex items-center justify-between">
          <div className="w-20 h-20" />
          <div id="hamburger" className="w-10 h-10 flex items-center justify-center pointer-events-auto">
            {(phase >= 9 && phase <= 12) && <HamburgerIcon isOpen={phase >= 12} onClick={handleHamburgerClick} />}
          </div>
        </div>
      </div>

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
                        left: "-40px",
                        top: "20px",
                        y: 0,
                        scale: 0.4,
                        opacity: 1,
                      }
                      : {
                        left: "50%",
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

          {(phase >= 9 && phase <= 12) && (
            <div className="absolute inset-0 pointer-events-none z-[110]">
              {BLOCK_POSITIONS.map((pos, i) => (
                <FloatingMenuBlock
                  key={i}
                  index={i}
                  id={`block-${i}`}
                  shouldFloat={phase === 9}
                  isMenuOpen={phase === 12}
                  hoveredIndex={hoveredBlockIndex}
                  onHover={setHoveredBlockIndex}
                  style={pos}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 얼굴 컨테이너 */}
      <motion.div
        id="face-container"

        className="absolute pointer-events-none"
        style={{
          width: "700px",
          height: "700px",
          perspective: 1000,
          zIndex: 100,
          overflow: "visible",
        }}
        initial={{ y: "150vh", rotateZ: -45, rotateX: 30, scale: 0.8 }}
        animate={

          phase >= 23
            ? {
              left: "90%",
              top: "10%",
              x: "-50%",
              y: "-50%",
              scale: 0.5,
              rotateZ: -15,
              rotateY: 0,
            }
            : phase >= 14
              ? {
                left: "6vw",
                top: "50%",
                x: "0",
                y: `calc(-50% + 13vh + ${scrollOffset}px)`,
                scale: 0.28,
                rotateX: 2,
                rotateZ: 0,
                rotateY: 25,
              }
              : phase >= 9
                ? {
                  x: "-50%",
                  y: "-50%",
                  left: "50%",
                  top: "50%",
                  scale: 1,
                  rotateZ: 0,
                  rotateY: 0,
                }
                : { y: "150vh" }
        }
        transition={{ duration: 1.0, ease: "easeInOut" }}
      >
        {showHat && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              x: "-30%",
              zIndex: 9999,
              scale: 1 / faceScale,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{
              top: phase >= 21 ? "40px" : "-420px",
              opacity: phase >= 23 ? 0 : 1,
              y: phase >= 21 ? 0 : -10,
            }}
            transition={{ duration: 0.6, ease: "backOut" }}
          >
            <div className="relative">
              <PartPNG
                src="images/hat.png"
                className="w-[280px] h-[280px] object-contain"
                alt="hat"
              />
            </div>

            {/* 모자 Tooltip - face-container 내부지만 showHat 블록 바깥 */}
            {phase === 16 && (
              <div
                className="absolute pointer-events-auto"
                style={{
                  left: "calc(50% + 160px)",
                  top: "50%",
                  zIndex: 10000,
                }}
              >
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-[#2b2b2b] flex-shrink-0"
                    style={{ boxShadow: "0 0 0 3px #FFF2D5" }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  />
                  <motion.div
                    className="h-[3px] bg-[#2b2b2b] flex-shrink-0"
                    initial={{ width: 0 }}
                    animate={{ width: 120 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  />
                  <motion.div
                    className="bg-[#FDD130] border-[3px] border-[#2b2b2b] shadow-[4px_4px_0_0_#2b2b2b] flex-shrink-0"
                    style={{ width: "280px", padding: "20px 24px" }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <h3 className="font-bold text-[#2b2b2b] italic text-[20px] mb-2" style={{ fontFamily: 'Kanit, sans-serif' }}>
                      {PART_DESCRIPTIONS[0].title}
                    </h3>
                    <p className="text-[#333] text-[14px] font-medium leading-[1.5]">
                      {PART_DESCRIPTIONS[0].description}
                    </p>
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => setExpandedTooltip(expandedTooltip === 0 ? null : 0)}
                        className="w-10 h-10 border-[2px] border-[#2b2b2b] bg-white flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5]"
                      >
                        <svg
                          width="20" height="20" viewBox="0 0 20 20" fill="none"
                          style={{ transform: expandedTooltip === 0 ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                        >
                          <path d="M10 4V16M4 10H16" stroke="#2b2b2b" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                    <AnimatePresence>
                      {expandedTooltip === 0 && PART_DESCRIPTIONS[0].details && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t-2 border-[#2b2b2b]/30">
                            <p className="text-[#555] text-[13px] leading-[1.6]">{PART_DESCRIPTIONS[0].details}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </div>
            )}
          </motion.div>

        )}



        <motion.div className="w-full h-full pointer-events-auto" style={{ transformStyle: "preserve-3d" }}>
          <LegoFace3D
            className="w-full h-full drop-shadow-2xl"
            followMouse={phase >= 2 && phase <= 12}
            fixedRotationY={phase >= 14 && phase < 23 ? 15 : 0}   // 좌우
            fixedRotationX={phase >= 14 && phase < 23 ? 3 : 0}   // 위아래 (음수=위를 봄, 양수=아래를 봄)
          />
        </motion.div>
      </motion.div>

      {/* 하단 안내 문구 */}
      {phase === 0 && <motion.div className="absolute bottom-10 text-gray-400 font-kanit font-semibold text-sm animate-bounce uppercase tracking-widest">Scroll to Start</motion.div>}
      {(phase === 3) && <motion.div className="absolute bottom-10 text-white/50 font-kanit text-xs uppercase tracking-widest" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Scroll to Merge</motion.div>}
      {(phase >= 4 && phase < 9) && <motion.div className="absolute bottom-10 text-white/50 font-kanit text-xs uppercase tracking-widest" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Scroll to Explore</motion.div>}
      {(phase === 9) && <motion.div className="absolute bottom-10 text-white/50 font-kanit text-xs uppercase tracking-widest" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Scroll to Build</motion.div>}
    </div>
  );
};

export default IntroSection;