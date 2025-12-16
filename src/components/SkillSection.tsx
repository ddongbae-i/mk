import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SKILLS_DATA = [
    // 레벨 1
    { id: 'skill-1', name: 'skill_gsap', level: 1, icon: '/images/skill_gsap.png' },
    { id: 'skill-2', name: 'skill_js', level: 1, icon: '/images/skill_js.png' },
    { id: 'skill-3', name: 'skill_premiere', level: 1, icon: '/images/skill_premiere.png' },
    { id: 'skill-4', name: 'skill_react', level: 1, icon: '/images/skill_react.png' },
    { id: 'skill-5', name: 'skill_typescript', level: 1, icon: '/images/skill_typescript.png' },
    // 레벨 2
    { id: 'skill-6', name: 'skill_aistudio', level: 2, icon: '/images/skill_aistudio.png' },
    { id: 'skill-7', name: 'skill_midjourney', level: 2, icon: '/images/skill_midjourney.png' },
    { id: 'skill-8', name: 'skill_tailwind', level: 2, icon: '/images/skill_tailwind.png' },
    { id: 'skill-9', name: 'skill_firefly', level: 2, icon: '/images/skill_firefly.png' },
    // 레벨 3
    { id: 'skill-10', name: 'skill_claude', level: 3, icon: '/images/skill_claude.png' },
    { id: 'skill-11', name: 'skill_css', level: 3, icon: '/images/skill_css.png' },
    { id: 'skill-12', name: 'skill_figma', level: 3, icon: '/images/skill_figma.png' },
    { id: 'skill-13', name: 'skill_gemini', level: 3, icon: '/images/skill_gemini.png' },
    { id: 'skill-14', name: 'skill_git', level: 3, icon: '/images/skill_git.png' },
    { id: 'skill-15', name: 'skill_gpt', level: 3, icon: '/images/skill_gpt.png' },
    { id: 'skill-16', name: 'skill_html', level: 3, icon: '/images/skill_html.png' },
    { id: 'skill-17', name: 'skill_illustrator', level: 3, icon: '/images/skill_illustrator.png' },
    { id: 'skill-18', name: 'skill_photoshop', level: 3, icon: '/images/skill_photoshop.png' },
];

// 💥 팡팡 터지는 이펙트
const BurstEffect = ({ x, y }: { x: number; y: number }) => {
    const particles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (i * 45) * (Math.PI / 180),
        distance: 50 + Math.random() * 30,
        size: 8 + Math.random() * 8,
        color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]
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

// 🍬 미니 레고 헤드 - 머리 위치에서 시작!
const MiniLegoHead = ({ skill, headX, headY }: { skill: any; headX: number; headY: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 });
    const [hasLanded, setHasLanded] = useState(false);

    // ✅ 랜덤값들을 컴포넌트 마운트 시 한 번만 계산
    const direction = useRef(Math.random() > 0.5 ? 1 : -1).current;
    const power = useRef(200 + Math.random() * 400).current;
    const randomX = direction * power;

    const floorY = typeof window !== 'undefined'
        ? window.innerHeight - 150 - Math.random() * 100
        : 600;
    const finalX = headX + randomX;
    const finalRotate = (Math.random() - 0.5) * 60;

    useEffect(() => {
        const timer = setTimeout(() => {
            setHasLanded(true);
            setPosition({ x: finalX, y: floorY, rotate: finalRotate });
        }, 1200);
        return () => clearTimeout(timer);
    }, [finalX, floorY, finalRotate]);

    // 마우스 밀림 효과
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!hasLanded || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) {
            const force = (80 - distance) / 80;
            setPosition(prev => ({
                x: prev.x - dx * force * 0.3,
                y: Math.min(prev.y - dy * force * 0.2, floorY),
                rotate: prev.rotate - dx * force * 0.3,
            }));
        }
    }, [hasLanded, floorY]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    return (
        <motion.div
            ref={ref}
            className="absolute pointer-events-none z-[300]"
            style={{ left: 0, top: 0 }}
            initial={{
                x: headX,
                y: headY,
                scale: 0,
                rotate: 0,
                opacity: 1
            }}
            animate={hasLanded ? {
                x: position.x,
                y: position.y,
                scale: 1,
                rotate: position.rotate,
            } : {
                // ✅ 머리에서 위로 팡! 튀었다가 포물선으로 떨어짐
                x: [headX, headX + randomX * 0.3, headX + randomX * 0.7, finalX],
                y: [headY, headY - 200, headY - 100, floorY],  // 위로 튀었다가 내려옴
                scale: [0, 1.3, 1.1, 1],
                rotate: [0, direction * 180, direction * 360, finalRotate],
            }}
            transition={hasLanded ? {
                type: "spring",
                stiffness: 100,
                damping: 15,
            } : {
                duration: 1.0,
                times: [0, 0.2, 0.5, 1],
                ease: "easeOut",
            }}
        >
            <img
                src={skill.icon}
                alt={skill.name}
                className="w-14 h-14 object-contain"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
            />
        </motion.div>
    );
};

interface SkillSectionProps {
    isActive: boolean;
    onSkillsCollected?: () => void;
    onExpressionChange?: (expression: 'sad' | 'neutral' | 'happy') => void;
    shakeTrigger: number;
}

const SkillSection: React.FC<SkillSectionProps> = ({
    isActive,
    onSkillsCollected,
    onExpressionChange,
    shakeTrigger,
}) => {
    const [poppedSkills, setPoppedSkills] = useState<any[]>([]);
    const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const prevShakeTrigger = useRef(shakeTrigger);

    // ✅ 머리 위치 (화면 중앙 상단)
    const headX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
    const headY = typeof window !== 'undefined' ? window.innerHeight * 0.25 : 200;

    const poppedIds = poppedSkills.map(p => p.skill.id);
    const currentLevelSkills = SKILLS_DATA.filter(s => s.level === currentLevel);
    const remainingSkills = currentLevelSkills.filter(s => !poppedIds.includes(s.id));

    // ✅ shakeTrigger 변경 시 즉시 스킬 팝! (드래그 중에도)
    useEffect(() => {
        if (shakeTrigger > prevShakeTrigger.current && isActive) {
            prevShakeTrigger.current = shakeTrigger;
            popSkill();
        }
    }, [shakeTrigger, isActive]);

    // 레벨 변경 시 표정 업데이트
    useEffect(() => {
        const expressions: ('sad' | 'neutral' | 'happy')[] = ['sad', 'neutral', 'happy'];
        onExpressionChange?.(expressions[currentLevel - 1]);
    }, [currentLevel]);

    // 모든 스킬 수집 완료
    useEffect(() => {
        if (poppedIds.length >= SKILLS_DATA.length) {
            onSkillsCollected?.();
        }
    }, [poppedIds.length, onSkillsCollected]);

    const popSkill = useCallback(() => {
        // 현재 레벨 스킬이 없으면 다음 레벨로
        if (remainingSkills.length === 0) {
            if (currentLevel < 3) {
                setCurrentLevel(prev => prev + 1);
            }
            return;
        }

        const skill = remainingSkills[0];
        const id = Date.now();

        setPoppedSkills(prev => [...prev, { id, skill }]);

        // 팡팡 이펙트
        setBursts(prev => [...prev, { id, x: headX, y: headY }]);
        setTimeout(() => {
            setBursts(prev => prev.filter(b => b.id !== id));
        }, 600);

    }, [remainingSkills, currentLevel, headX, headY]);

    return (
        <div className="absolute inset-0 z-[200] pointer-events-none overflow-hidden">
            {/* 안내 문구 */}
            <AnimatePresence>
                {isActive && poppedSkills.length < SKILLS_DATA.length && (
                    <motion.div
                        className="absolute top-20 w-full text-center text-white z-[250]"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <h2 className="text-5xl font-black italic drop-shadow-lg mb-3"
                            style={{ fontFamily: 'Kanit, sans-serif' }}>
                            SHAKE IT!
                        </h2>
                        <p className="text-xl opacity-90">머리를 잡고 흔들어보세요!</p>
                        <p className="text-sm opacity-70 mt-2">
                            Level {currentLevel} · {poppedSkills.length} / {SKILLS_DATA.length} skills
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 💥 팡팡 이펙트들 */}
            {bursts.map((burst) => (
                <BurstEffect key={burst.id} x={burst.x} y={burst.y} />
            ))}

            {/* 🍬 스킬 아이콘들 */}
            {poppedSkills.map((item) => (
                <MiniLegoHead
                    key={item.id}
                    skill={item.skill}
                    headX={headX}
                    headY={headY}
                />
            ))}

            {/* 완료 메시지 */}
            <AnimatePresence>
                {poppedSkills.length >= SKILLS_DATA.length && (
                    <motion.div
                        className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center z-[260]"
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
    );
};

export default SkillSection;