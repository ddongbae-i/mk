import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 임시 갤러리 이미지 데이터 (나중에 실제 이미지로 교체)
const GALLERY_IMAGES = [
    { id: 1, src: "https://picsum.photos/seed/gallery1/600/400", title: "Project Alpha", category: "UI/UX" },
    { id: 2, src: "https://picsum.photos/seed/gallery2/600/400", title: "Brand Identity", category: "Branding" },
    { id: 3, src: "https://picsum.photos/seed/gallery3/600/400", title: "UI Components", category: "Design System" },
    { id: 4, src: "https://picsum.photos/seed/gallery4/600/400", title: "Mobile App", category: "Mobile" },
    { id: 5, src: "https://picsum.photos/seed/gallery5/600/400", title: "Dashboard", category: "Web App" },
    { id: 6, src: "https://picsum.photos/seed/gallery6/600/400", title: "E-commerce", category: "Web" },
    { id: 7, src: "https://picsum.photos/seed/gallery7/600/400", title: "Landing Page", category: "Marketing" },
    { id: 8, src: "https://picsum.photos/seed/gallery8/600/400", title: "Portfolio", category: "Personal" },
];

interface GallerySectionProps {
    isActive: boolean;
    headRef: React.RefObject<HTMLElement>;
    onProgressChange?: (progress: number) => void;
    onFaceRotation?: (rotation: number) => void;
    onGalleryEnd?: () => void;
    onFaceExpression?: (expression: 'neutral' | 'happy' | 'sad' | 'sweat' | 'blank') => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({
    isActive,
    headRef,
    onProgressChange,
    onFaceRotation,
    onGalleryEnd,
    onFaceExpression,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [isFalling, setIsFalling] = useState(false);
    const progressRef = useRef(0);

    // 트랙 위치 계산
    const trackWidth = GALLERY_IMAGES.length * 420 + 200;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const maxScroll = Math.max(0, trackWidth - viewportWidth + 100);
    const trackX = -progress * maxScroll;

    // 얼굴 회전값 (progress에 따라)
    const faceRotation = progress * 720; // 2바퀴

    // progress bar 너비
    const progressBarWidth = typeof window !== 'undefined' ? window.innerWidth * 0.6 : 800;

    // 현재 활성화된 이미지 인덱스 (1-based)
    const currentIndex = Math.min(
        Math.floor(progress * GALLERY_IMAGES.length) + 1,
        GALLERY_IMAGES.length
    );

    useEffect(() => {
        progressRef.current = progress;
        onProgressChange?.(progress);
        onFaceRotation?.(faceRotation);
    }, [progress, faceRotation, onProgressChange, onFaceRotation]);

    // 휠 이벤트 핸들러
    const handleWheel = useCallback((e: WheelEvent) => {
        if (!isActive || isFalling) return;

        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY * 0.0008;
        const newProgress = Math.max(0, Math.min(1, progressRef.current + delta));

        setProgress(newProgress);

        // 끝에 도달하면 놀란 표정 + 떨어지기
        if (newProgress >= 0.98 && delta > 0 && !isFalling) {
            setIsFalling(true);
            onFaceExpression?.('sweat'); // 놀란 표정

            // 떨어지는 애니메이션 후 다음 섹션
            setTimeout(() => {
                onGalleryEnd?.();
            }, 800);
        }
    }, [isActive, isFalling, onGalleryEnd, onFaceExpression]);

    // 휠 이벤트 등록 (window level에서)
    useEffect(() => {
        if (!isActive) return;

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [isActive, handleWheel]);

    // 드래그 핸들러
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startProgress = useRef(0);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (isFalling) return;
        isDragging.current = true;
        startX.current = e.clientX;
        startProgress.current = progressRef.current;
        document.body.style.cursor = 'grabbing';
    }, [isFalling]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging.current || isFalling) return;

        const deltaX = e.clientX - startX.current;
        const sensitivity = 0.0008;
        const newProgress = Math.max(0, Math.min(1, startProgress.current - deltaX * sensitivity));
        setProgress(newProgress);
    }, [isFalling]);

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
        document.body.style.cursor = '';
    }, []);

    useEffect(() => {
        if (!isActive) return;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isActive, handleMouseMove, handleMouseUp]);

    // Reset falling state when section becomes inactive
    useEffect(() => {
        if (!isActive) {
            setIsFalling(false);
            setProgress(0);
        }
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
            style={{
                background: "#1a1a2e",
            }}
        >
            {/* 상단 컬러 바 악센트 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8F1E20] via-[#FCBB09] to-[#8E00BD]" />

            {/* 상단 타이틀 - 스포티한 스타일 */}
            <motion.div
                className="absolute top-10 left-10 z-50"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                <div className="flex items-center gap-3">
                    {/* 스포티한 넘버링 */}
                    <div
                        className="w-12 h-12 bg-[#8F1E20] flex items-center justify-center transform -skew-x-6"
                        style={{ fontFamily: "Kanit, sans-serif" }}
                    >
                        <span className="text-white font-black text-xl transform skew-x-6">G</span>
                    </div>
                    <div>
                        <h2
                            className="text-4xl font-black italic text-white tracking-tight"
                            style={{ fontFamily: "Kanit, sans-serif" }}
                        >
                            GALLERY
                        </h2>
                        <p className="text-white/40 text-xs tracking-[0.2em] uppercase">
                            Selected Works
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* 우측 상단 진행률 - 스포티한 카운터 */}
            <motion.div
                className="absolute top-10 right-10 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentIndex}
                            className="text-6xl font-black italic text-[#FCBB09]"
                            style={{ fontFamily: "Kanit, sans-serif" }}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {String(currentIndex).padStart(2, '0')}
                        </motion.span>
                    </AnimatePresence>
                    <span className="text-2xl text-white/30 font-bold">/</span>
                    <span className="text-2xl text-white/30 font-bold">{String(GALLERY_IMAGES.length).padStart(2, '0')}</span>
                </div>
            </motion.div>

            {/* 이미지 트랙 */}
            <motion.div
                className="absolute top-1/2 -translate-y-1/2 flex items-center gap-8 pl-20"
                style={{ x: trackX }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {GALLERY_IMAGES.map((image, index) => {
                    const isCenter = Math.abs(progress * (GALLERY_IMAGES.length - 1) - index) < 0.5;

                    return (
                        <motion.div
                            key={image.id}
                            className="relative flex-shrink-0 cursor-pointer group"
                            initial={{ opacity: 0, y: 80 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: isCenter ? 1.02 : 0.95,
                            }}
                            transition={{
                                delay: 0.1 * index,
                                duration: 0.6,
                                scale: { duration: 0.3 }
                            }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            onClick={() => setSelectedImage(index)}
                        >
                            {/* 이미지 카드 - 스포티한 스타일 */}
                            <div
                                className="relative w-[360px] h-[260px] overflow-hidden"
                                style={{
                                    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)",
                                    boxShadow: isCenter
                                        ? "0 20px 40px -12px rgba(252,187,9,0.3)"
                                        : "0 15px 30px -10px rgba(0,0,0,0.5)",
                                }}
                            >
                                <img
                                    src={image.src}
                                    alt={image.title}
                                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* 그라디언트 오버레이 */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                {/* 카테고리 태그 - 스포티한 스타일 */}
                                <div className="absolute top-3 left-3">
                                    <span
                                        className="px-3 py-1 bg-[#FCBB09] text-black text-[10px] font-bold tracking-wider uppercase transform -skew-x-6 inline-block"
                                    >
                                        <span className="transform skew-x-6 inline-block">{image.category}</span>
                                    </span>
                                </div>

                                {/* 하단 정보 */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3
                                        className="text-white font-bold text-xl italic"
                                        style={{ fontFamily: "Kanit, sans-serif" }}
                                    >
                                        {image.title}
                                    </h3>
                                </div>

                                {/* 호버 시 번호 표시 */}
                                <motion.div
                                    className="absolute top-3 right-3 w-10 h-10 bg-white/10 backdrop-blur-sm flex items-center justify-center"
                                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                >
                                    <span className="text-white font-bold text-sm" style={{ fontFamily: "Kanit, sans-serif" }}>
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </motion.div>
                            </div>

                            {/* 선택 인디케이터 */}
                            {isCenter && (
                                <motion.div
                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#FCBB09]"
                                    layoutId="activeIndicator"
                                />
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* ✨ 프로그레스 트랙 + 굴러가는 3D 얼굴 */}
            <div
                className="absolute bottom-24 left-1/2 -translate-x-1/2"
                style={{ width: progressBarWidth }}
            >
                {/* 트랙 (길) */}
                <div
                    className="relative h-[6px] rounded-full overflow-hidden cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    style={{
                        background: "linear-gradient(90deg, #8F1E20, #FCBB09, #8E00BD)",
                        boxShadow: "0 2px 10px rgba(252, 187, 9, 0.3), inset 0 1px 2px rgba(0,0,0,0.3)",
                    }}
                >
                    {/* 트랙 하이라이트 */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/20 rounded-full" />
                </div>

                {/* 굴러가는 3D 레고 얼굴 - 트랙 위에 위치 */}
                <motion.div
                    className="absolute -top-16 pointer-events-none"
                    style={{
                        left: `${progress * 100}%`,
                        x: "-50%",
                    }}
                    animate={isFalling ? {
                        y: [0, -30, 300],
                        rotateZ: [faceRotation, faceRotation + 180, faceRotation + 540],
                        opacity: [1, 1, 0],
                    } : {
                        y: [0, -3, 0], // 통통 튀는 느낌
                        rotateZ: faceRotation,
                    }}
                    transition={isFalling ? {
                        duration: 0.8,
                        ease: [0.36, 0, 0.66, -0.56], // 떨어지는 가속
                        times: [0, 0.2, 1],
                    } : {
                        y: {
                            duration: 0.3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        },
                        rotateZ: {
                            duration: 0.1,
                        }
                    }}
                >
                    {/* ✅ 3D 레고 얼굴 복제 렌더링 */}
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            transform: `rotateY(${faceRotation}deg)`,
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {headRef.current && (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: headRef.current.querySelector('[data-lego-face-3d]')?.outerHTML || ''
                                }}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    transform: "scale(0.07)", // 48px로 축소 (700px → 48px)
                                    transformOrigin: "top left",
                                }}
                            />
                        )}
                    </div>
                </motion.div>

                {/* 시작/끝 마커 */}
                <div className="flex justify-between mt-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#8F1E20] transform rotate-45" />
                        <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase" style={{ fontFamily: "Kanit, sans-serif" }}>
                            Start
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase" style={{ fontFamily: "Kanit, sans-serif" }}>
                            End
                        </span>
                        <div className="w-2 h-2 bg-[#8E00BD] transform rotate-45" />
                    </div>
                </div>
            </div>

            {/* 이미지 모달 */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-xl flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            className="relative max-w-4xl max-h-[80vh]"
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={GALLERY_IMAGES[selectedImage].src}
                                alt={GALLERY_IMAGES[selectedImage].title}
                                className="max-w-full max-h-[80vh] shadow-2xl"
                                style={{
                                    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)",
                                }}
                            />
                            <div className="absolute -bottom-16 left-0 right-0 text-center">
                                <h3
                                    className="text-white text-2xl font-bold italic"
                                    style={{ fontFamily: "Kanit, sans-serif" }}
                                >
                                    {GALLERY_IMAGES[selectedImage].title}
                                </h3>
                                <span
                                    className="inline-block mt-2 px-4 py-1 bg-[#FCBB09] text-black text-xs font-bold tracking-wider uppercase transform -skew-x-6"
                                >
                                    <span className="transform skew-x-6 inline-block">
                                        {GALLERY_IMAGES[selectedImage].category}
                                    </span>
                                </span>
                            </div>
                            <button
                                className="absolute -top-3 -right-3 w-10 h-10 bg-[#8F1E20] flex items-center justify-center text-white hover:bg-[#a62426] transition-colors transform -skew-x-6"
                                onClick={() => setSelectedImage(null)}
                            >
                                <span className="transform skew-x-6 font-bold">✕</span>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GallerySection;