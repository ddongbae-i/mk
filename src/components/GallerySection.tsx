import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

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
}

const GallerySection: React.FC<GallerySectionProps> = ({
    isActive,
    headRef,
    onProgressChange,
    onFaceRotation,
    onGalleryEnd,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const progressRef = useRef(0);

    // 트랙 위치 계산
    const trackWidth = GALLERY_IMAGES.length * 340 + 200;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const maxScroll = Math.max(0, trackWidth - viewportWidth + 100);
    const trackX = -progress * maxScroll;

    // 얼굴 회전값 (progress에 따라)
    const faceRotation = progress * 720; // 2바퀴

    // progress bar 너비
    const progressBarWidth = typeof window !== 'undefined' ? window.innerWidth * 0.6 : 800;

    useEffect(() => {
        progressRef.current = progress;
        onProgressChange?.(progress);
        onFaceRotation?.(faceRotation);
    }, [progress, faceRotation, onProgressChange, onFaceRotation]);

    // 휠 이벤트 핸들러
    const handleWheel = useCallback((e: WheelEvent) => {
        if (!isActive) return;

        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY * 0.0008;
        const newProgress = Math.max(0, Math.min(1, progressRef.current + delta));

        setProgress(newProgress);

        // 끝에 도달하면 다음 섹션으로
        if (newProgress >= 0.98 && delta > 0) {
            onGalleryEnd?.();
        }
    }, [isActive, onGalleryEnd]);

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
        isDragging.current = true;
        startX.current = e.clientX;
        startProgress.current = progressRef.current;
        document.body.style.cursor = 'grabbing';
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging.current) return;

        const deltaX = e.clientX - startX.current;
        const sensitivity = 0.0008;
        const newProgress = Math.max(0, Math.min(1, startProgress.current - deltaX * sensitivity));
        setProgress(newProgress);
    }, []);

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

    if (!isActive) return null;

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            }}
        >
            {/* 배경 그라디언트 오버레이 */}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse at 50% 0%, rgba(252,187,9,0.08) 0%, transparent 60%)",
                }}
            />

            {/* 플로팅 라인 데코 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        style={{
                            width: '100%',
                            top: `${20 + i * 20}%`,
                            transform: `rotate(${-2 + i}deg)`,
                        }}
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 20 + i * 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 2,
                        }}
                    />
                ))}
            </div>

            {/* 상단 타이틀 */}
            <motion.div
                className="absolute top-12 left-12 z-50"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-1 h-16 bg-[#FCBB09]" />
                    <div>
                        <h2
                            className="text-5xl font-black italic text-white tracking-tight"
                            style={{ fontFamily: "Kanit, sans-serif" }}
                        >
                            GALLERY
                        </h2>
                        <p className="text-white/40 text-sm mt-1 tracking-widest">
                            SELECTED WORKS · {GALLERY_IMAGES.length} PROJECTS
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* 우측 상단 진행률 */}
            <motion.div
                className="absolute top-12 right-12 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="text-right">
                    <span className="text-6xl font-black text-white/10" style={{ fontFamily: "Kanit, sans-serif" }}>
                        {String(Math.floor(progress * GALLERY_IMAGES.length) + 1).padStart(2, '0')}
                    </span>
                    <span className="text-2xl text-white/30 ml-1">/ {String(GALLERY_IMAGES.length).padStart(2, '0')}</span>
                </div>
            </motion.div>

            {/* 이미지 트랙 */}
            <motion.div
                className="absolute top-1/2 -translate-y-1/2 flex items-center gap-10 pl-24"
                style={{ x: trackX }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {GALLERY_IMAGES.map((image, index) => {
                    const isCenter = Math.abs(progress * (GALLERY_IMAGES.length - 1) - index) < 0.5;

                    return (
                        <motion.div
                            key={image.id}
                            className="relative flex-shrink-0 cursor-pointer group"
                            initial={{ opacity: 0, y: 80, rotateY: -15 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                rotateY: 0,
                                scale: isCenter ? 1.05 : 0.95,
                            }}
                            transition={{
                                delay: 0.1 * index,
                                duration: 0.6,
                                scale: { duration: 0.3 }
                            }}
                            whileHover={{ scale: 1.08, y: -15 }}
                            onClick={() => setSelectedImage(index)}
                            style={{ perspective: 1000 }}
                        >
                            {/* 이미지 카드 */}
                            <div
                                className="relative w-[300px] h-[220px] rounded-xl overflow-hidden"
                                style={{
                                    boxShadow: isCenter
                                        ? "0 25px 50px -12px rgba(252,187,9,0.25), 0 0 0 1px rgba(255,255,255,0.1)"
                                        : "0 20px 40px -15px rgba(0,0,0,0.5)",
                                }}
                            >
                                <img
                                    src={image.src}
                                    alt={image.title}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* 그라디언트 오버레이 */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                {/* 호버 오버레이 */}
                                <motion.div
                                    className="absolute inset-0 bg-[#FCBB09]/20 backdrop-blur-sm flex items-center justify-center"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M15 3H21V9M21 3L13 11M10 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21H17C18.1046 21 19 20.1046 19 19V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </motion.div>

                                {/* 하단 정보 */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <span className="text-[#FCBB09] text-xs font-medium tracking-wider">
                                        {image.category}
                                    </span>
                                    <h3 className="text-white font-bold text-lg mt-1">
                                        {image.title}
                                    </h3>
                                </div>
                            </div>

                            {/* 인덱스 번호 */}
                            <div
                                className="absolute -left-4 top-1/2 -translate-y-1/2 text-white/5 text-8xl font-black pointer-events-none"
                                style={{ fontFamily: "Kanit, sans-serif" }}
                            >
                                {String(index + 1).padStart(2, '0')}
                            </div>
                        </motion.div>
                    );
                })}

                {/* 끝 마커 */}
                <div className="flex-shrink-0 w-[200px] h-[220px] flex items-center justify-center">
                    <motion.div
                        className="text-center"
                        animate={{ opacity: progress > 0.8 ? 1 : 0.3 }}
                    >
                        <div className="text-white/20 text-sm tracking-widest mb-2">NEXT</div>
                        <div className="text-white/40 text-2xl font-bold" style={{ fontFamily: "Kanit, sans-serif" }}>
                            CONTACT →
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* 하단 프로그레스 바 */}
            <div
                className="absolute bottom-16 left-1/2 -translate-x-1/2"
                style={{ width: progressBarWidth }}
                onMouseDown={handleMouseDown}
            >
                {/* 트랙 라인 */}
                <div className="relative h-1 bg-white/10 rounded-full overflow-visible cursor-grab">
                    {/* 진행 바 */}
                    <motion.div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{
                            width: `${progress * 100}%`,
                            background: "linear-gradient(90deg, #FCBB09, #F25F09)",
                        }}
                    />

                    {/* 트랙 마커들 */}
                    {GALLERY_IMAGES.map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/20"
                            style={{ left: `${(i / (GALLERY_IMAGES.length - 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
                        />
                    ))}
                </div>

                {/* 시작/끝 라벨 */}
                <div className="flex justify-between mt-3 text-white/30 text-xs tracking-widest" style={{ fontFamily: "Kanit, sans-serif" }}>
                    <span>START</span>
                    <span className="text-white/50">{Math.round(progress * 100)}%</span>
                    <span>END</span>
                </div>
            </div>

            {/* 안내 텍스트 */}
            <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                <motion.div
                    animate={{ x: [-5, 5, -5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    ←
                </motion.div>
                <span className="text-xs tracking-[0.3em]">SCROLL OR DRAG</span>
                <motion.div
                    animate={{ x: [5, -5, 5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    →
                </motion.div>
            </motion.div>

            {/* 이미지 모달 */}
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
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={GALLERY_IMAGES[selectedImage].src}
                            alt={GALLERY_IMAGES[selectedImage].title}
                            className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl"
                        />
                        <div className="absolute -bottom-20 left-0 right-0 text-center">
                            <h3 className="text-white text-2xl font-bold">{GALLERY_IMAGES[selectedImage].title}</h3>
                            <p className="text-[#FCBB09] text-sm mt-2">{GALLERY_IMAGES[selectedImage].category}</p>
                        </div>
                        <button
                            className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            ✕
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default GallerySection;