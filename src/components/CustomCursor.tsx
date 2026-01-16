// CustomCursor.tsx
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

type HoverState = "default" | "pointer" | "lego-head";

export const CustomCursor = ({
    canScroll = true // 🔥 외부에서 제어
}: {
    canScroll?: boolean
}) => {
    const [hoverState, setHoverState] = useState<HoverState>("default");

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const cursorX = useSpring(mouseX, { damping: 26, stiffness: 520, mass: 0.7 });
    const cursorY = useSpring(mouseY, { damping: 26, stiffness: 520, mass: 0.7 });

    // ====== hoverState 감지 ======
    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            const target = e.target as HTMLElement | null;
            if (!target) return;

            if (target.closest('[data-lego-head="true"]')) {
                setHoverState("lego-head");
            } else if (
                target.closest('button, a, [role="button"], .cursor-pointer, [data-hoverable="true"]')
            ) {
                setHoverState("pointer");
            } else {
                setHoverState("default");
            }
        };

        window.addEventListener("mousemove", moveCursor, { passive: true });
        return () => window.removeEventListener("mousemove", moveCursor as any);
    }, [mouseX, mouseY]);

    const ORB = 58;
    const ORB_POINTER = 42;

    // 🔥 수정: default 상태 + canScroll일 때만 힌트 표시
    const showScrollHint = hoverState === "default" && canScroll;

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{
                x: cursorX,
                y: cursorY,
                translateX: "-50%",
                translateY: "-50%",
            }}
        >
            <div className="relative">
                {/* 메인 원 */}
                <motion.div
                    className="relative z-10 rounded-full bg-white"
                    style={{
                        filter: "drop-shadow(0 14px 30px rgba(255,255,255,0.18))",
                    }}
                    animate={{
                        width: hoverState === "lego-head" ? 0 : hoverState === "pointer" ? ORB_POINTER : ORB,
                        height: hoverState === "lego-head" ? 0 : hoverState === "pointer" ? ORB_POINTER : ORB,
                        opacity: hoverState === "lego-head" ? 0 : 1,
                        scale: hoverState === "pointer" ? 0.95 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 360, damping: 26 }}
                >
                    <div
                        className="absolute left-[22%] top-[18%] rounded-full bg-white/55"
                        style={{ width: ORB * 0.22, height: ORB * 0.22 }}
                    />
                </motion.div>

                {/* 🔥 스크롤 힌트 - 강화 버전 */}

                <AnimatePresence>
                    {showScrollHint && (
                        <>
                            {/* 펄스 링 효과 */}
                            <motion.div
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/50"
                                initial={{ width: ORB, height: ORB, opacity: 0 }}
                                animate={{
                                    width: ORB + 40,
                                    height: ORB + 40,
                                    opacity: [0, 0.6, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                            />

                            {/* 두 번째 펄스 링 */}
                            <motion.div
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-white/40"
                                initial={{ width: ORB, height: ORB, opacity: 0 }}
                                animate={{
                                    width: ORB + 30,
                                    height: ORB + 30,
                                    opacity: [0, 0.5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                    delay: 0.4
                                }}
                            />

                            {/* 🔥 세모만 - 원 중앙 아래에서 위아래로 */}
                            <motion.div
                                className="absolute"
                                style={{
                                    left: "35%",
                                    top: `${ORB - 2}px`, // 원 바로 아래
                                    transform: "translateX(-50%)",
                                    filter: "drop-shadow(0 8px 16px rgba(255,255,255,0.4))",
                                }}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    y: [0, 12, 0]
                                }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    opacity: { duration: 0.3 },
                                    y: {
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }
                                }}
                            >
                                <svg width="20" height="14" viewBox="0 0 20 14">
                                    <path
                                        d="M10 14L0 0h20L10 14z"
                                        fill="white"
                                    />
                                </svg>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* pointer 링 */}
                <AnimatePresence>
                    {hoverState === "pointer" && (
                        <motion.div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-white/90"
                            initial={{ width: 0, height: 0, opacity: 0 }}
                            animate={{ width: 72, height: 72, opacity: 1 }}
                            exit={{ width: 0, height: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 340, damping: 24 }}
                            style={{ filter: "drop-shadow(0 12px 22px rgba(255,255,255,0.10))" }}
                        />
                    )}
                </AnimatePresence>

                {/* lego-head 링 */}
                <AnimatePresence>
                    {hoverState === "lego-head" && (
                        <motion.div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white"
                            initial={{ width: 0, height: 0, opacity: 0 }}
                            animate={{ width: 120, height: 120, opacity: 0.55 }}
                            exit={{ width: 0, height: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 240, damping: 22 }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};