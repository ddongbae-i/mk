import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SKILLS_DATA = [
    { id: "skill-1", name: "skill_gsap", level: 1, icon: "/images/skill_gsap.png" },
    { id: "skill-2", name: "skill_js", level: 1, icon: "/images/skill_js.png" },
    { id: "skill-3", name: "skill_premiere", level: 1, icon: "/images/skill_premiere.png" },
    { id: "skill-4", name: "skill_react", level: 1, icon: "/images/skill_react.png" },
    { id: "skill-5", name: "skill_typescript", level: 1, icon: "/images/skill_typescript.png" },

    { id: "skill-6", name: "skill_aistudio", level: 2, icon: "/images/skill_aistudio.png" },
    { id: "skill-7", name: "skill_midjourney", level: 2, icon: "/images/skill_midjourney.png" },
    { id: "skill-8", name: "skill_tailwind", level: 2, icon: "/images/skill_tailwind.png" },
    { id: "skill-9", name: "skill_firefly", level: 2, icon: "/images/skill_firefly.png" },

    { id: "skill-10", name: "skill_claude", level: 3, icon: "/images/skill_claude.png" },
    { id: "skill-11", name: "skill_css", level: 3, icon: "/images/skill_css.png" },
    { id: "skill-12", name: "skill_figma", level: 3, icon: "/images/skill_figma.png" },
    { id: "skill-13", name: "skill_gemini", level: 3, icon: "/images/skill_gemini.png" },
    { id: "skill-14", name: "skill_git", level: 3, icon: "/images/skill_git.png" },
    { id: "skill-15", name: "skill_gpt", level: 3, icon: "/images/skill_gpt.png" },
    { id: "skill-16", name: "skill_html", level: 3, icon: "/images/skill_html.png" },
    { id: "skill-17", name: "skill_illustrator", level: 3, icon: "/images/skill_illustrator.png" },
    { id: "skill-18", name: "skill_photoshop", level: 3, icon: "/images/skill_photoshop.png" },
];

type Expression = "sad" | "neutral" | "happy" | "sweat" | "blank";

// 💥 팡팡 이펙트 (크고 화려하게)
const BurstEffect = ({ x, y }: { x: number; y: number }) => {
    const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i * 30) * (Math.PI / 180),
        distance: 100 + Math.random() * 80,
        size: 12 + Math.random() * 10,
        color: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][
            Math.floor(Math.random() * 6)
        ],
    }));

    return (
        <div className="absolute pointer-events-none z-[350]" style={{ left: x, top: y }}>
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        left: -p.size / 2,
                        top: -p.size / 2,
                    }}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{
                        scale: [0, 2.5, 0],
                        x: Math.cos(p.angle) * p.distance,
                        y: Math.sin(p.angle) * p.distance,
                        opacity: [1, 1, 0],
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            ))}
        </div>
    );
};

// 🎮 물리 기반 스킬 아이콘
const MiniLegoHead = React.memo(({
    skill,
    headX,
    headY,
    mousePos,
    mouseVelocity,
}: {
    skill: any;
    headX: number;
    headY: number;
    mousePos: { x: number; y: number };
    mouseVelocity: { x: number; y: number };
}) => {
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 900;
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1600;
    const floorY = windowHeight - 180;

    const [pos, setPos] = useState({ x: headX, y: headY });
    const [rotation, setRotation] = useState(0);
    const [isLanded, setIsLanded] = useState(false);

    const velRef = useRef({ x: (Math.random() - 0.5) * 20, y: -20 - Math.random() * 10 });
    const rotVelRef = useRef((Math.random() - 0.5) * 25);
    const posRef = useRef({ x: headX, y: headY });
    const landedRef = useRef(false);
    const lastMouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const gravity = 0.6;
        const bounce = 0.5;
        const friction = 0.99;
        const groundFriction = 0.95;

        let raf: number;

        const update = () => {
            let { x, y } = posRef.current;
            let vx = velRef.current.x;
            let vy = velRef.current.y;
            let rotVel = rotVelRef.current;

            vy += gravity;
            x += vx;
            y += vy;

            if (y >= floorY) {
                y = floorY;
                if (Math.abs(vy) > 2) {
                    vy = -vy * bounce;
                    rotVel *= 0.7;
                } else {
                    vy = 0;
                    landedRef.current = true;
                    setIsLanded(true);
                }
                vx *= groundFriction;
            }

            if (x < 40) { x = 40; vx = Math.abs(vx) * bounce; }
            if (x > windowWidth - 40) { x = windowWidth - 40; vx = -Math.abs(vx) * bounce; }

            vx *= friction;
            rotVel *= 0.995;

            posRef.current = { x, y };
            velRef.current = { x: vx, y: vy };
            rotVelRef.current = rotVel;

            setPos({ x, y });
            setRotation((prev) => prev + rotVel);

            raf = requestAnimationFrame(update);
        };

        raf = requestAnimationFrame(update);
        return () => cancelAnimationFrame(raf);
    }, [floorY, windowWidth]);

    useEffect(() => {
        const { x, y } = posRef.current;
        const dx = mousePos.x - x;
        const dy = mousePos.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const hitRadius = 50;

        if (dist < hitRadius && dist > 0) {
            const speed = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2);
            const minSpeed = 3;

            if (speed > minSpeed) {
                const pushX = -dx / dist;
                const pushY = -dy / dist;

                const force = Math.min(speed * 1.5, 25);

                velRef.current.x += pushX * force + mouseVelocity.x * 0.3;
                velRef.current.y += pushY * force * 0.5 - 8;
                rotVelRef.current += (Math.random() - 0.5) * force * 2;

                landedRef.current = false;
                setIsLanded(false);
            }
        }

        lastMouseRef.current = { x: mousePos.x, y: mousePos.y };
    }, [mousePos, mouseVelocity]);

    return (
        <div
            className="absolute pointer-events-none z-[300]"
            style={{
                left: pos.x - 32,
                top: pos.y - 32,
                transform: `rotate(${rotation}deg)`,
                transition: "none",
            }}
        >
            <img
                src={skill.icon}
                alt={skill.name}
                className="w-16 h-16 object-contain"
                style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.25))" }}
            />
        </div>
    );
});

interface SkillSectionProps {
    isActive: boolean;
    onSkillsCollected?: () => void;
    onExpressionChange?: (expression: Expression) => void;
    // ✅ 흔들고 있는 동안 hover/click 막기용(부모에서 쓰면 편함)
    onShakingChange?: (isShaking: boolean) => void;

    shakeTrigger: number;
    headRef: React.RefObject<HTMLElement>;
    mousePos?: { x: number; y: number };
    mouseVelocity?: { x: number; y: number };
}

const SkillSection: React.FC<SkillSectionProps> = ({
    isActive,
    onSkillsCollected,
    onExpressionChange,
    onShakingChange,
    shakeTrigger,
    headRef,
    mousePos = { x: 0, y: 0 },
    mouseVelocity = { x: 0, y: 0 },
}) => {
    const [poppedSkills, setPoppedSkills] = useState<any[]>([]);
    const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
    const [currentLevel, setCurrentLevel] = useState(1);

    const shakeCountRef = useRef(0);
    const prevShakeTrigger = useRef(shakeTrigger);

    // ✅ 표정 우선순위 정리용
    const baseExpressionRef = useRef<Expression>("neutral");     // 레벨 기반 기본 표정
    const isShakingRef = useRef(false);                          // 흔들고 있는지
    const shakeEndTimerRef = useRef<number | null>(null);

    const SHAKE_EXPRESSIONS: ("sad" | "neutral" | "happy")[] = ["sad", "neutral", "happy"];

    const getHeadMouth = useCallback(() => {
        const el = headRef?.current;
        if (!el) return { x: window.innerWidth / 2, y: window.innerHeight * 0.3 };
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height * 0.1 };
    }, [headRef]);

    const poppedIds = poppedSkills.map((p) => p.skill.id);
    const currentLevelSkills = SKILLS_DATA.filter((s) => s.level === currentLevel);
    const remainingSkills = currentLevelSkills.filter((s) => !poppedIds.includes(s.id));

    const applyBaseExpression = useCallback(() => {
        onExpressionChange?.(baseExpressionRef.current);
    }, [onExpressionChange]);

    const setShaking = useCallback((v: boolean) => {
        if (isShakingRef.current === v) return;
        isShakingRef.current = v;
        onShakingChange?.(v);
    }, [onShakingChange]);

    const popSkill = useCallback(() => {
        if (!isActive) return;

        if (remainingSkills.length === 0) {
            if (currentLevel < 3) setCurrentLevel((p) => p + 1);
            return;
        }

        const skill = remainingSkills[0];
        const id = Date.now();
        const { x, y } = getHeadMouth();

        setBursts((prev) => [...prev, { id, x, y }]);
        setTimeout(() => {
            setBursts((prev) => prev.filter((b) => b.id !== id));
        }, 700);

        setPoppedSkills((prev) => [...prev, { id, skill, originX: x, originY: y }]);
    }, [isActive, remainingSkills, currentLevel, getHeadMouth]);

    // ✅ isActive 꺼지면 정리 + 기본으로 복귀
    useEffect(() => {
        if (isActive) return;

        if (shakeEndTimerRef.current) window.clearTimeout(shakeEndTimerRef.current);
        setShaking(false);
        baseExpressionRef.current = "neutral";
        onExpressionChange?.("neutral");
    }, [isActive, onExpressionChange, setShaking]);

    // ✅ 레벨 기반 "기본 표정"만 결정 (흔들고 있지 않을 때만 적용)
    useEffect(() => {
        if (!isActive) return;

        if (currentLevel === 1) baseExpressionRef.current = "sad";
        else if (currentLevel === 2) baseExpressionRef.current = "neutral";
        else baseExpressionRef.current = "happy";

        // 다 모았으면 기본도 happy로
        if (poppedSkills.length >= SKILLS_DATA.length) {
            baseExpressionRef.current = "happy";
        }

        // 흔드는 중이 아니면 기본 표정 바로 반영
        if (!isShakingRef.current) applyBaseExpression();
    }, [currentLevel, isActive, poppedSkills.length, applyBaseExpression]);

    // ✅ 흔들 때: 표정은 무조건 3개만 순환 + 끝나면 기본으로 복귀
    useEffect(() => {
        if (!isActive) return;

        if (shakeTrigger !== prevShakeTrigger.current) {
            prevShakeTrigger.current = shakeTrigger;
            shakeCountRef.current += 1;

            // 흔들기 시작
            setShaking(true);

            // 3단계 순환
            const idx = (shakeCountRef.current - 1) % 3;
            onExpressionChange?.(SHAKE_EXPRESSIONS[idx]);

            // 흔들기 끝 감지 (250ms 동안 추가 트리거 없으면 종료)
            if (shakeEndTimerRef.current) window.clearTimeout(shakeEndTimerRef.current);
            shakeEndTimerRef.current = window.setTimeout(() => {
                setShaking(false);
                applyBaseExpression(); // ✅ 원래(기본) 표정으로 복귀
            }, 250);

            // ✅ 스킬 발사 (기존 로직 유지: 2번에 1개)
            if (shakeCountRef.current % 2 === 0) {
                popSkill();
            }
        }
    }, [shakeTrigger, isActive, popSkill, onExpressionChange, applyBaseExpression, setShaking]);

    useEffect(() => {
        if (poppedIds.length >= SKILLS_DATA.length) onSkillsCollected?.();
    }, [poppedIds.length, onSkillsCollected]);

    return (
        <div className="absolute inset-0 z-[200] overflow-hidden">
            <div className="absolute inset-0 pointer-events-auto">
                <AnimatePresence>
                    {isActive && poppedSkills.length < SKILLS_DATA.length && (
                        <motion.div
                            className="absolute top-24 w-full text-center text-white z-[250]"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2
                                className="text-5xl font-black italic drop-shadow-lg mb-2"
                                style={{ fontFamily: "Kanit, sans-serif" }}
                            >
                                SHAKE IT!
                            </h2>
                            <p className="text-lg opacity-90 drop-shadow-md">머리를 마구 흔들어주세요!</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {poppedSkills.length >= SKILLS_DATA.length && (
                        <motion.div
                            className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center z-[260] pointer-events-auto"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <p className="text-5xl font-black text-white drop-shadow-lg">
                                ALL SKILLS UNLOCKED!
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute inset-0 pointer-events-none">
                {bursts.map((burst) => (
                    <BurstEffect key={burst.id} x={burst.x} y={burst.y} />
                ))}

                {poppedSkills.map((item) => (
                    <MiniLegoHead
                        key={item.id}
                        skill={item.skill}
                        headX={item.originX}
                        headY={item.originY}
                        mousePos={mousePos}
                        mouseVelocity={mouseVelocity}
                    />
                ))}
            </div>
        </div>
    );
};

export default SkillSection;
