import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// 임시 갤러리 이미지 데이터 (나중에 실제 이미지로 교체)
const GALLERY_IMAGES = [
    { id: 1, src: "https://picsum.photos/seed/gallery1/600/400", title: "Project Alpha" },
    { id: 2, src: "https://picsum.photos/seed/gallery2/600/400", title: "Brand Identity" },
    { id: 3, src: "https://picsum.photos/seed/gallery3/600/400", title: "UI Components" },
    { id: 4, src: "https://picsum.photos/seed/gallery4/600/400", title: "Mobile App" },
    { id: 5, src: "https://picsum.photos/seed/gallery5/600/400", title: "Dashboard" },
    { id: 6, src: "https://picsum.photos/seed/gallery6/600/400", title: "E-commerce" },
    { id: 7, src: "https://picsum.photos/seed/gallery7/600/400", title: "Landing Page" },
    { id: 8, src: "https://picsum.photos/seed/gallery8/600/400", title: "Portfolio" },
];

interface GallerySectionProps {
    isActive: boolean;
    headRef: React.RefObject<HTMLElement>;
    onProgressChange?: (progress: number) => void;
    onFaceRotation?: (rotation: number) => void;
}

const GallerySection: React.FC<GallerySectionProps> = ({
    isActive,
    headRef,
    onProgressChange,
    onFaceRotation,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // 드래그 진행률 (0 ~ 1)
    const progress = useMotionValue(0);

    // 얼굴 회전값 (progress에 따라 계산)
    const faceRotation = useTransform(progress, [0, 1], [0, 360 * 2]); // 2바퀴 회전

    // 트랙 위치
    const trackX = useTransform(progress, (p) => {
        const trackWidth = GALLERY_IMAGES.length * 320; // 이미지당 320px
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const maxScroll = trackWidth - viewportWidth + 200;
        return -p * maxScroll;
    });

    // 드래그 상태
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startProgress = useRef(0);

    // 얼굴 위치 계산
    const [facePosition, setFacePosition] = useState({ x: 100, y: 0 });

    // progress bar의 전체 너비
    const progressBarWidth = typeof window !== 'undefined' ? window.innerWidth - 200 : 1000;

    useEffect(() => {
        // progress 변경 시 얼굴 위치 업데이트
        const unsubscribe = progress.on("change", (p) => {
            const newX = 100 + p * (progressBarWidth - 100);
            setFacePosition({ x: newX, y: 0 });
            onProgressChange?.(p);
        });

        return () => unsubscribe();
    }, [progress, progressBarWidth, onProgressChange]);

    useEffect(() => {
        // 얼굴 회전값 전달
        const unsubscribe = faceRotation.on("change", (r) => {
            onFaceRotation?.(r);
        });

        return () => unsubscribe();
    }, [faceRotation, onFaceRotation]);

    // 드래그 핸들러
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        isDragging.current = true;
        startX.current = e.clientX;
        startProgress.current = progress.get();
        document.body.style.cursor = 'grabbing';
    }, [progress]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging.current) return;

        const deltaX = e.clientX - startX.current;
        const sensitivity = 0.001; // 드래그 민감도
        const newProgress = Math.max(0, Math.min(1, startProgress.current + deltaX * sensitivity));

        progress.set(newProgress);
    }, [progress]);

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
        document.body.style.cursor = '';
    }, []);

    // 마우스 이벤트 등록
    useEffect(() => {
        if (!isActive) return;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isActive, handleMouseMove, handleMouseUp]);

    // 휠 스크롤로도 조작 가능
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.stopPropagation();
        const delta = e.deltaY * 0.0005;
        const newProgress = Math.max(0, Math.min(1, progress.get() + delta));
        animate(progress, newProgress, { duration: 0.3, ease: "easeOut" });
    }, [progress]);

    if (!isActive) return null;

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
            style={{ background: "#E07A5F" }} // 테라코타/코랄 색상
            onWheel={handleWheel}
        >
            {/* 배경 패턴 */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* 상단 타이틀 */}
            <motion.div
                className="absolute top-16 left-1/2 -translate-x-1/2 text-center z-50"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                <h2
                    className="text-6xl font-black italic text-white mb-2"
                    style={{ fontFamily: "Kanit, sans-serif", textShadow: "4px 4px 0 #c45a3f" }}
                >
                    GALLERY
                </h2>
                <p className="text-white/80 text-lg">드래그하여 작업물을 둘러보세요</p>
            </motion.div>

            {/* 이미지 트랙 */}
            <motion.div
                ref={trackRef}
                className="absolute top-1/2 -translate-y-1/2 flex items-center gap-8 px-24"
                style={{ x: trackX }}
            >
                {GALLERY_IMAGES.map((image, index) => (
                    <motion.div
                        key={image.id}
                        className="relative flex-shrink-0 cursor-pointer group"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                        whileHover={{ scale: 1.05, y: -10 }}
                    >
                        {/* 이미지 카드 */}
                        <div
                            className="relative w-[280px] h-[200px] rounded-2xl overflow-hidden"
                            style={{
                                boxShadow: "8px 8px 0 0 rgba(0,0,0,0.2)",
                                border: "4px solid #fff",
                            }}
                        >
                            <img
                                src={image.src}
                                alt={image.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                            />

                            {/* 호버 오버레이 */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">{image.title}</span>
                            </div>
                        </div>

                        {/* 인덱스 라벨 */}
                        <div
                            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium"
                            style={{ fontFamily: "Kanit, sans-serif" }}
                        >
                            {String(index + 1).padStart(2, '0')}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* 프로그레스 바 (하단) */}
            <div
                className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl"
                onMouseDown={handleMouseDown}
                style={{ cursor: 'grab' }}
            >
                {/* 트랙 배경 */}
                <div className="relative h-3 bg-white/30 rounded-full overflow-hidden">
                    {/* 진행 바 */}
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-white rounded-full"
                        style={{ width: useTransform(progress, [0, 1], ['0%', '100%']) }}
                    />
                </div>

                {/* 얼굴 인디케이터 (프로그레스바 위에서 굴러감) */}
                <motion.div
                    className="absolute -top-12 pointer-events-none"
                    style={{
                        x: useTransform(progress, [0, 1], [0, progressBarWidth * 0.8]),
                    }}
                >
                    <motion.div
                        className="w-16 h-16 rounded-full bg-[#FCBB09] flex items-center justify-center shadow-lg"
                        style={{
                            rotate: faceRotation,
                            border: "3px solid #2b2b2b",
                        }}
                    >
                        {/* 간단한 얼굴 이모지 */}
                        <span className="text-2xl">😊</span>
                    </motion.div>
                </motion.div>

                {/* 시작/끝 라벨 */}
                <div className="flex justify-between mt-4 text-white/60 text-sm font-medium" style={{ fontFamily: "Kanit, sans-serif" }}>
                    <span>START</span>
                    <span>END</span>
                </div>
            </div>

            {/* 안내 텍스트 */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                ← DRAG OR SCROLL →
            </motion.div>
        </div>
    );
};

export default GallerySection;