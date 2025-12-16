import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

type HoverState = "default" | "pointer" | "lego-head";

/**
 * ✅ 사용법
 * - 기본: 페이지가 더 내려갈 수 있으면(바닥이 아니면) canScrollDown=true
 * - 특정 섹션 기준으로 하고 싶으면:
 *    <section data-scroll-hint="true"> ... </section>
 *   이 섹션이 "스크롤 더 가능" 상태일 때만 힌트가 뜸.
 */
export const CustomCursor = () => {
    const [hoverState, setHoverState] = useState<HoverState>("default");
    const [canScrollDown, setCanScrollDown] = useState(false);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const cursorX = useSpring(mouseX, { damping: 26, stiffness: 520, mass: 0.7 });
    const cursorY = useSpring(mouseY, { damping: 26, stiffness: 520, mass: 0.7 });

    const rafRef = useRef<number | null>(null);

    // ====== 1) hoverState 감지 ======
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

    // ====== 2) "스크롤 해야 하는 상황" 계산 ======
    useEffect(() => {
        const threshold = 20; // 바닥 근처면 힌트 끔(여유)

        const computePage = () => {
            const el = document.documentElement;
            const scrollTop = window.scrollY || el.scrollTop || 0;
            const viewportH = window.innerHeight || 0;
            const totalH = el.scrollHeight || 0;

            const remaining = totalH - (scrollTop + viewportH);
            const scrollable = totalH > viewportH + 4;

            return scrollable && remaining > threshold;
        };

        const computeSection = (section: HTMLElement) => {
            // 섹션이 "자체 스크롤"을 갖는 경우: scrollHeight > clientHeight
            const remaining = section.scrollHeight - (section.scrollTop + section.clientHeight);
            const scrollable = section.scrollHeight > section.clientHeight + 2;

            // 섹션이 뷰포트에 어느 정도 들어와있을 때만 힌트 주고 싶으면 여기서 조건 추가 가능
            return scrollable && remaining > threshold;
        };

        const getActiveHintTarget = () => {
            // 우선순위 1) data-scroll-hint="true" 요소 중 화면에 가장 가까운/보이는 것
            const candidates = Array.from(
                document.querySelectorAll<HTMLElement>('[data-scroll-hint="true"]')
            );

            if (candidates.length === 0) return null;

            // 뷰포트 안에 걸쳐 있는 요소 우선
            const inView = candidates
                .map((el) => ({ el, rect: el.getBoundingClientRect() }))
                .filter(({ rect }) => rect.bottom > 0 && rect.top < window.innerHeight);

            if (inView.length === 0) return null;

            // 화면 상단에 가장 가까운 요소 선택
            inView.sort((a, b) => Math.abs(a.rect.top) - Math.abs(b.rect.top));
            return inView[0].el;
        };

        const compute = () => {
            const section = getActiveHintTarget();
            if (section) return computeSection(section);
            return computePage();
        };

        const onAnyScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => setCanScrollDown(compute()));
        };

        // 초기 계산
        setCanScrollDown(compute());

        window.addEventListener("scroll", onAnyScroll, { passive: true });
        window.addEventListener("resize", onAnyScroll, { passive: true });

        // 섹션 자체 스크롤도 잡아야 함 (캡처 단계에서 모든 스크롤 감지)
        window.addEventListener("scroll", onAnyScroll, { passive: true, capture: true } as any);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.removeEventListener("scroll", onAnyScroll as any);
            window.removeEventListener("resize", onAnyScroll as any);
            window.removeEventListener("scroll", onAnyScroll as any, true);
        };
    }, []);

    // ====== 디자인 파라미터 ======
    const ORB = 58; // 🔥 기본 원: 크게 (니 의도대로)
    const ORB_POINTER = 42;
    const showScrollHint = hoverState === "default" && canScrollDown;

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
                    {/* 예쁜 하이라이트 */}
                    <div
                        className="absolute left-[22%] top-[18%] rounded-full bg-white/55"
                        style={{ width: ORB * 0.22, height: ORB * 0.22 }}
                    />
                </motion.div>

                {/* 스크롤 해야 할 때만 나오는 꼬리 */}
                <AnimatePresence>
                    {showScrollHint && (
                        <>
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white"
                                style={{
                                    top: ORB - 10,
                                    width: 16,
                                    filter: "drop-shadow(0 10px 22px rgba(255,255,255,0.14))",
                                }}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 42, opacity: 0.92 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                            />
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white"
                                style={{
                                    top: ORB - 10 + 42 - 10,
                                    width: 18,
                                    height: 18,
                                    filter: "drop-shadow(0 12px 26px rgba(255,255,255,0.14))",
                                }}
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.9 }}
                                exit={{ scale: 0.7, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 360, damping: 24 }}
                            />
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
