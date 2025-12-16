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

// 💥 팡팡
const BurstEffect = ({ x, y }: { x: number; y: number }) => {
    const particles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (i * 45) * (Math.PI / 180),
        distance: 50 + Math.random() * 30,
        size: 8 + Math.random() * 8,
        color: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][
            Math.floor(Math.random() * 6)
        ],
    }));

    return (
        <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
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
                        scale: [0, 1.5, 0],
                        x: Math.cos(p.angle) * p.distance,
                        y: Math.sin(p.angle) * p.distance,
                        opacity: [1, 1, 0],
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            ))}
            <motion.div
                className="absolute rounded-full bg-white"
                style={{ width: 40, height: 40, left: -20, top: -20 }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2, 0], opacity: [1, 0.8, 0] }}
                transition={{ duration: 0.3 }}
            />
        </div>
    );
};

// 🍬 미니 아이콘
const MiniLegoHead = ({ skill, headX, headY }: { skill: any; headX: number; headY: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 });
    const [hasLanded, setHasLanded] = useState(false);

    const direction = useRef(Math.random() > 0.5 ? 1 : -1).current;
    const power = useRef(200 + Math.random() * 400).current;
    const randomX = direction * power;

    const floorY =
        typeof window !== "undefined" ? window.innerHeight - 150 - Math.random() * 100 : 600;

    const finalX = headX + randomX;
    const finalRotate = (Math.random() - 0.5) * 60;

    useEffect(() => {
        const timer = setTimeout(() => {
            setHasLanded(true);
            setPosition({ x: finalX, y: floorY, rotate: finalRotate });
        }, 1200);
        return () => clearTimeout(timer);
    }, [finalX, floorY, finalRotate]);

    return (
        <motion.div
            ref={ref}
            className="absolute pointer-events-none z-[300]"
            style={{ left: 0, top: 0 }}
            initial={{ x: headX, y: headY, scale: 0, rotate: 0, opacity: 1 }}
            animate={
                hasLanded
                    ? { x: position.x, y: position.y, scale: 1, rotate: position.rotate }
                    : {
                        x: [headX, headX + randomX * 0.3, headX + randomX * 0.7, finalX],
                        y: [headY, headY - 200, headY - 100, floorY],
                        scale: [0, 1.3, 1.1, 1],
                        rotate: [0, direction * 180, direction * 360, finalRotate],
                    }
            }
            transition={
                hasLanded
                    ? { type: "spring", stiffness: 100, damping: 15 }
                    : { duration: 1.0, times: [0, 0.2, 0.5, 1], ease: "easeOut" }
            }
        >
            <img
                src={skill.icon}
                alt={skill.name}
                className="w-14 h-14 object-contain"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
            />
        </motion.div>
    );
};

interface SkillSectionProps {
    isActive: boolean;
    onSkillsCollected?: () => void;
    onExpressionChange?: (expression: "sad" | "neutral" | "happy" | "sweat") => void;
    shakeTrigger: number;
    headRef: React.RefObject<HTMLElement>;
}

const SkillSection: React.FC<SkillSectionProps> = ({
    isActive,
    onSkillsCollected,
    onExpressionChange,
    shakeTrigger,
    headRef,
}) => {
    const [poppedSkills, setPoppedSkills] = useState<any[]>([]);
    const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const prevShakeTrigger = useRef(shakeTrigger);

    // ✅ 머리 “윗부분” 좌표 계산 (주둥이처럼)
    const getHeadMouth = useCallback(() => {
        const el = headRef?.current;
        if (!el) {
            return { x: window.innerWidth / 2, y: window.innerHeight * 0.25 };
        }
        const r = el.getBoundingClientRect();
        return {
            x: r.left + r.width / 2,
            y: r.top + r.height * 0.08, // 여기 숫자만 조절하면 “윗부분” 위치가 바뀜
        };
    }, [headRef]);

    const poppedIds = poppedSkills.map((p) => p.skill.id);
    const currentLevelSkills = SKILLS_DATA.filter((s) => s.level === currentLevel);
    const remainingSkills = currentLevelSkills.filter((s) => !poppedIds.includes(s.id));

    const popSkill = useCallback(() => {
        if (!isActive) return;

        if (remainingSkills.length === 0) {
            if (currentLevel < 3) setCurrentLevel((p) => p + 1);
            return;
        }

        const skill = remainingSkills[0];
        const id = Date.now();
        const { x, y } = getHeadMouth();

        // ✅ 발사 좌표를 저장해두면, 머리가 움직여도 “그때 그 위치”에서 튄다
        setPoppedSkills((prev) => [...prev, { id, skill, originX: x, originY: y }]);

        setBursts((prev) => [...prev, { id, x, y }]);
        window.setTimeout(() => {
            setBursts((prev) => prev.filter((b) => b.id !== id));
        }, 600);
    }, [isActive, remainingSkills, currentLevel, getHeadMouth]);

    // ✅ shakeTrigger 변화 즉시 팝
    useEffect(() => {
        if (!isActive) return;
        if (shakeTrigger > prevShakeTrigger.current) {
            prevShakeTrigger.current = shakeTrigger;
            popSkill();
        }
    }, [shakeTrigger, isActive, popSkill]);

    // ✅ 레벨별 기본 표정 (필요하면 sweat로도 바꿀 수 있게 그대로 둠)
    useEffect(() => {
        const expressions: ("sad" | "neutral" | "happy")[] = ["sad", "neutral", "happy"];
        onExpressionChange?.(expressions[currentLevel - 1]);
    }, [currentLevel, onExpressionChange]);

    useEffect(() => {
        if (poppedIds.length >= SKILLS_DATA.length) onSkillsCollected?.();
    }, [poppedIds.length, onSkillsCollected]);

    return (
        <div className="absolute inset-0 z-[200] overflow-hidden">
            {/* ✅ UI 레이어: 클릭/호버 가능 */}
            <div className="absolute inset-0 pointer-events-auto">
                <AnimatePresence>
                    {isActive && poppedSkills.length < SKILLS_DATA.length && (
                        <motion.div
                            className="absolute top-20 w-full text-center text-white z-[250]"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onMouseEnter={() => onExpressionChange?.("happy")}
                            onMouseLeave={() => onExpressionChange?.("neutral")}
                        >
                            <h2
                                className="text-5xl font-black italic drop-shadow-lg mb-3"
                                style={{ fontFamily: "Kanit, sans-serif" }}
                            >
                                SHAKE IT!
                            </h2>
                            <p className="text-xl opacity-90">머리를 잡고 흔들어보세요!</p>
                            <p className="text-sm opacity-70 mt-2">
                                Level {currentLevel} · {poppedSkills.length} / {SKILLS_DATA.length} skills
                            </p>

                            {/* ✅ 테스트 버튼 (원하면 지워도 됨) */}
                            <div className="mt-6 flex justify-center gap-3">
                                <button
                                    className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur border border-white/30"
                                    onMouseEnter={() => onExpressionChange?.("happy")}
                                    onMouseLeave={() => onExpressionChange?.("neutral")}
                                    onMouseDown={() => onExpressionChange?.("sweat")}
                                    onMouseUp={() => onExpressionChange?.("happy")}
                                    onClick={() => popSkill()}
                                >
                                    POP (테스트)
                                </button>
                            </div>
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
                            onMouseEnter={() => onExpressionChange?.("happy")}
                            onMouseLeave={() => onExpressionChange?.("neutral")}
                        >
                            <p className="text-5xl font-black text-white drop-shadow-lg">
                                🎉 ALL SKILLS UNLOCKED! 🎉
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ✅ 이펙트/아이콘 레이어: 클릭 막기 */}
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
                    />
                ))}
            </div>
        </div>
    );
};

export default SkillSection;
