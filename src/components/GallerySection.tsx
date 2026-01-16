import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ 이미지 12개로 확장
const GALLERY_IMAGES = [
    { id: 1, src: "/gallery/01.png", title: "Product Visuals", category: "UI/UX" },
    { id: 2, src: "/gallery/02.png", title: "Product Visuals", category: "Branding" },
    { id: 3, src: "/gallery/03.png", title: "Product Visuals", category: "Design System" },
    { id: 4, src: "/gallery/04.jpg", title: "Created with AI", category: "Mobile" },
    { id: 5, src: "/gallery/05.png", title: "Created with AI", category: "Web App" },
    { id: 6, src: "/gallery/06.png", title: "Created with AI", category: "Web" },
    { id: 7, src: "/gallery/07.png", title: "Created with AI", category: "Marketing" },
    { id: 8, src: "/gallery/08.png", title: "Created with AI", category: "Personal" },
    { id: 9, src: "/gallery/09.jpg", title: "Created with AI", category: "UI Kit" },
    { id: 10, src: "/gallery/10.jpg", title: "Created with AI", category: "Identity" },
    { id: 11, src: "/gallery/11.png", title: "Off-Work Inspirations", category: "SaaS" },
    { id: 12, src: "/gallery/12.png", title: "Off-Work Inspirations", category: "App" },
];

interface GallerySectionProps {
    isActive: boolean;
    headRef: React.RefObject<HTMLElement>;
    onProgressChange?: (progress: number) => void;
    onFaceRotation?: (rotation: number) => void;
    onGalleryEnd?: () => void;
    onFaceExpression?: (expression: "neutral" | "happy" | "sad" | "sweat" | "blank") => void;
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
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [isFalling, setIsFalling] = useState(false);
    const currentStepRef = useRef(0);

    const MAX_STEP = GALLERY_IMAGES.length;

    const IMAGE_WIDTH = 500;
    const IMAGE_GAP = 32;
    const IMAGE_STEP = IMAGE_WIDTH + IMAGE_GAP;

    const currentImageIndex = Math.min(currentStep, GALLERY_IMAGES.length - 1);
    const trackX = -currentImageIndex * IMAGE_STEP;
    const progress = Math.min(currentStep / (GALLERY_IMAGES.length - 1), 1);
    const faceRotation = progress * 720;
    const progressBarWidth = typeof window !== "undefined" ? window.innerWidth * 0.6 : 800;
    const currentIndex = currentImageIndex + 1;
    const isAtLastImage = currentStep >= GALLERY_IMAGES.length - 1;

    useEffect(() => {
        currentStepRef.current = currentStep;
        onProgressChange?.(progress);
        onFaceRotation?.(faceRotation);
    }, [currentStep, progress, faceRotation, onProgressChange, onFaceRotation]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isActive || isFalling) return;

            let direction = 0;
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                direction = 1;
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                direction = -1;
            } else {
                return;  // 관련 없는 키는 무시
            }

            e.preventDefault();
            e.stopPropagation();

            const newStep = Math.max(0, Math.min(MAX_STEP, currentStepRef.current + direction));
            setCurrentStep(newStep);

            if (newStep >= MAX_STEP && direction > 0 && !isFalling) {
                setIsFalling(true);
                onFaceExpression?.("sweat");

                setTimeout(() => {
                    onGalleryEnd?.();
                }, 800);
            }
        },
        [isActive, isFalling, onGalleryEnd, onFaceExpression, MAX_STEP]
    );

    const handleWheel = useCallback(
        (e: WheelEvent) => {
            if (!isActive || isFalling) return;

            e.preventDefault();
            e.stopPropagation();

            const direction = e.deltaY > 0 ? 1 : -1;
            const newStep = Math.max(0, Math.min(MAX_STEP, currentStepRef.current + direction));

            setCurrentStep(newStep);

            if (newStep >= MAX_STEP && direction > 0 && !isFalling) {
                setIsFalling(true);
                onFaceExpression?.("sweat");

                setTimeout(() => {
                    onGalleryEnd?.();
                }, 800);
            }
        },
        [isActive, isFalling, onGalleryEnd, onFaceExpression, MAX_STEP]
    );

    useEffect(() => {
        if (!isActive) return;

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("keydown", handleKeyDown);  // 🔥 추가

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("keydown", handleKeyDown);  // 🔥 추가
        };
    }, [isActive, handleWheel, handleKeyDown]);



    const isDragging = useRef(false);
    const startX = useRef(0);
    const startStep = useRef(0);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (isFalling) return;
            isDragging.current = true;
            startX.current = e.clientX;
            startStep.current = currentStepRef.current;
            document.body.style.cursor = "grabbing";
        },
        [isFalling]
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging.current || isFalling) return;

            const deltaX = e.clientX - startX.current;
            const sensitivity = 0.01;
            const newStep = Math.max(0, Math.min(MAX_STEP, startStep.current - deltaX * sensitivity));
            setCurrentStep(Math.round(newStep));
        },
        [isFalling, MAX_STEP]
    );

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
        document.body.style.cursor = "";
    }, []);

    useEffect(() => {
        if (!isActive) return;

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isActive, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        if (!isActive) {
            setIsFalling(false);
            setCurrentStep(0);
        }
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
            style={{
                background: "rgb(26, 26, 46)",
            }}
        >
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
                            className="text-4xl font-bold italic text-[#FCBB09]"
                            style={{ fontFamily: "Kanit, sans-serif" }}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {String(currentIndex).padStart(2, "0")}
                        </motion.span>
                    </AnimatePresence>
                    <span className="text-xl text-white/30 font-medium">/</span>
                    <span className="text-xl text-white/30 font-medium">
                        {String(GALLERY_IMAGES.length).padStart(2, "0")}
                    </span>
                </div>
            </motion.div>

            <motion.div
                className="absolute flex items-center gap-8"
                style={{
                    x: trackX,
                    top: "25%",
                    left: "35%",
                    transform: "translate(-50%, -50%)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {GALLERY_IMAGES.map((image, index) => {
                    const isCenter = index === currentImageIndex;

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
                                delay: Math.min(0.1 * index, 0.5),
                                duration: 0.6,
                                scale: { duration: 0.3 },
                            }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            onClick={() => setSelectedImage(index)}
                        >
                            <div
                                className="relative w-[500px] h-[500px] overflow-hidden"
                                style={{
                                    clipPath:
                                        "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)",
                                    boxShadow: isCenter
                                        ? "0 20px 40px -12px rgba(252,187,9,0.30), 0 0 0 1px rgba(255,255,255,0.06)"
                                        : "0 15px 30px -10px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.03)",
                                    // 🔥 추가
                                    imageRendering: "auto",
                                    backfaceVisibility: "hidden",
                                    transform: "translateZ(0)",
                                }}
                            >
                                <img
                                    src={image.src}
                                    alt={image.title}
                                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                                    loading="lazy"
                                    decoding="async"
                                    // 🔥 추가
                                    style={{
                                        imageRendering: "auto",
                                        backfaceVisibility: "hidden",
                                    }}
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                <motion.div
                                    className="absolute top-3 right-3 w-10 h-10 bg-white/10 backdrop-blur-sm flex items-center justify-center"
                                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                >
                                    <span className="text-white font-bold text-sm" style={{ fontFamily: "Kanit, sans-serif" }}>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </motion.div>


                                <AnimatePresence>
                                    {selectedImage !== index && (  // ✅ 모달 열릴 때만 숨김
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 p-6 z-10"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h3
                                                className="text-white font-bold ytext-2xl mb-1"
                                                style={{ fontFamily: "Kanit, sans-serif" }}
                                            >
                                                {image.title}
                                            </h3>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </motion.div>
                    );
                })}
            </motion.div>

            {/* ✨ 프로그레스 트랙 + 굴러가는 3D 얼굴 */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2" style={{ width: progressBarWidth }}>
                <div
                    className="relative h-[6px] rounded-full overflow-hidden cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    style={{
                        background: "#2a3a52",
                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
                    }}
                >
                    <motion.div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={{
                            background: "#FCBB09",
                            boxShadow: "0 2px 10px rgba(252, 187, 9, 0.4)",
                        }}
                        animate={{
                            width: `${progress * 100}%`,
                        }}
                        transition={{ duration: 0.1 }}
                    />

                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/20 rounded-full" />
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
                            className="relative"
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={GALLERY_IMAGES[selectedImage].src}
                                alt={GALLERY_IMAGES[selectedImage].title}
                                className="max-w-[90vw] max-h-[85vh] shadow-2xl"
                                style={{
                                    clipPath:
                                        "polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)",
                                }}
                            />
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
        </div >
    );
};

export default GallerySection;
