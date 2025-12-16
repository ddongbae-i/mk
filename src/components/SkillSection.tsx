import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SKILLS_DATA = [
    // ... 데이터는 기존과 동일 ...
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

// 💥 팡팡 이펙트
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
                        width: p.size, height: p.size, backgroundColor: p.color,
                        left: -p.size / 2, top: -p.size / 2,
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
        </div>
    );
};

// 🍬 미니 아이콘 (물리: 좌표 고정 후 바닥으로 추락)
const MiniLegoHead = React.memo(({ skill, headX, headY }: { skill: any; headX: number; headY: number }) => {
    const floorY = typeof window !== "undefined" ? window.innerHeight - 100 : 800;
    const randomX = (Math.random() - 0.5) * 400; // 좌우 랜덤 확산
    const finalRotate = (Math.random() - 0.5) * 180;

    return (
        <motion.div
            className="absolute pointer-events-none z-[300]"
            style={{ left: 0, top: 0 }}
            initial={{ x: headX, y: headY, scale: 0, rotate: 0 }}
            animate={{
                x: [headX, headX + randomX * 0.5, headX + randomX],
                y: [headY, headY - 150, floorY], // 솟구쳤다 바닥으로
                scale: [0, 1.2, 1],
                rotate: finalRotate
            }}
            transition={{
                duration: 0.8,
                times: [0, 0.3, 1],
                ease: [0.22, 1, 0.36, 1]
            }}
        >
            <img
                src={skill.icon}
                alt={skill.name}
                className="w-14 h-14 object-contain"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
            />
        </motion.div>
    );
});

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

    // 흔들림 감지용 ref
    const shakeCountRef = useRef(0);
    const prevShakeTrigger = useRef(shakeTrigger);

    // ✅ 머리 좌표 계산
    const getHeadMouth = useCallback(() => {
        const el = headRef?.current;
        if (!el) return { x: window.innerWidth / 2, y: window.innerHeight * 0.3 };
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height * 0.1 };
    }, [headRef]);

    const poppedIds = poppedSkills.map((p) => p.skill.id);
    const currentLevelSkills = SKILLS_DATA.filter((s) => s.level === currentLevel);
    const remainingSkills = currentLevelSkills.filter((s) => !poppedIds.includes(s.id));

    // ✅ 스킬 발사 함수
    const popSkill = useCallback(() => {
        if (!isActive) return;

        // 현재 레벨 다 모으면 다음 레벨로 (표정 전환의 핵심)
        if (remainingSkills.length === 0) {
            if (currentLevel < 3) setCurrentLevel((p) => p + 1);
            return;
        }

        const skill = remainingSkills[0];
        const id = Date.now();
        const { x, y } = getHeadMouth();

        setPoppedSkills((prev) => [...prev, { id, skill, originX: x, originY: y }]);
        setBursts((prev) => [...prev, { id, x, y }]);
        setTimeout(() => {
            setBursts((prev) => prev.filter((b) => b.id !== id));
        }, 600);
    }, [isActive, remainingSkills, currentLevel, getHeadMouth]);


    // ✅ 흔들림 감지 & 빈도 조절
    useEffect(() => {
        if (!isActive) return;

        if (shakeTrigger !== prevShakeTrigger.current) {
            prevShakeTrigger.current = shakeTrigger;
            shakeCountRef.current += 1;

            // 3번 흔들 때마다 1개 발사 (빈도 조절)
            if (shakeCountRef.current % 3 === 0) {
                popSkill();
            }
        }
    }, [shakeTrigger, isActive, popSkill]);


    // ✅ [핵심 수정] 표정 제어 로직
    // 흔드는 여부(isShaking)와 상관없이, 오직 '현재 레벨'에 따라 표정이 결정됨
    useEffect(() => {
        if (!isActive) return;

        if (currentLevel === 1) {
            onExpressionChange?.("sad");     // Level 1: 못함 (Sad)
        } else if (currentLevel === 2) {
            onExpressionChange?.("neutral"); // Level 2: 보통 (Neutral)
        } else if (currentLevel === 3) {
            onExpressionChange?.("happy");   // Level 3: 잘함 (Happy)
        }

        // (참고) 만약 다 끝났을 때 표정을 바꾸고 싶다면 아래에 추가 가능
        if (poppedSkills.length >= SKILLS_DATA.length) {
            onExpressionChange?.("happy");
        }

    }, [currentLevel, isActive, onExpressionChange, poppedSkills.length]);


    // 완료 체크
    useEffect(() => {
        if (poppedIds.length >= SKILLS_DATA.length) onSkillsCollected?.();
    }, [poppedIds.length, onSkillsCollected]);


    return (
        <div className="absolute inset-0 z-[200] overflow-hidden">
            {/* UI 레이어 */}
            <div className="absolute inset-0 pointer-events-auto">
                <AnimatePresence>
                    {isActive && poppedSkills.length < SKILLS_DATA.length && (
                        <motion.div
                            className="absolute top-24 w-full text-center text-white z-[250]"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2 className="text-5xl font-black italic drop-shadow-lg mb-2" style={{ fontFamily: "Kanit, sans-serif" }}>
                                SHAKE IT!
                            </h2>
                            <p className="text-lg opacity-90 drop-shadow-md">머리를 마구 흔들어주세요!</p>
                            {/* 현재 레벨 디버깅용 (필요 없으면 삭제) */}
                            <p className="text-sm opacity-60 mt-2">Level {currentLevel}</p>
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
                                🎉 ALL SKILLS UNLOCKED! 🎉
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 이펙트 레이어 */}
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