import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SKILLS_DATA = [
    // 레벨 1 (1~6번) → 😢 sad 표정
    { id: 'skill-1', name: 'CSS', level: 1, icon: '/images/skills/css.png' },
    { id: 'skill-2', name: 'Midjourney', level: 1, icon: '/images/skills/midjourney.png' },
    { id: 'skill-3', name: 'AI', level: 1, icon: '/images/skills/ai.png' },
    { id: 'skill-4', name: 'Keynote', level: 1, icon: '/images/skills/keynote.png' },
    { id: 'skill-5', name: 'Figma', level: 1, icon: '/images/skills/figma.png' },
    { id: 'skill-6', name: 'Premiere', level: 1, icon: '/images/skills/premiere.png' },

    // 레벨 2 (7~12번) → 😐 neutral 표정
    { id: 'skill-7', name: 'Photoshop', level: 2, icon: '/images/skills/photoshop.png' },
    { id: 'skill-8', name: 'GPT', level: 2, icon: '/images/skills/gpt.png' },
    { id: 'skill-9', name: 'Figma', level: 2, icon: '/images/skills/figma2.png' },
    { id: 'skill-10', name: 'TypeScript', level: 2, icon: '/images/skills/typescript.png' },
    { id: 'skill-11', name: 'React', level: 2, icon: '/images/skills/react.png' },
    { id: 'skill-12', name: 'Claude', level: 2, icon: '/images/skills/claude.png' },

    // 레벨 3 (13~18번) → 😊 happy 표정
    { id: 'skill-13', name: 'HTML', level: 3, icon: '/images/skills/html.png' },
    { id: 'skill-14', name: 'JavaScript', level: 3, icon: '/images/skills/javascript.png' },
    { id: 'skill-15', name: 'Blender', level: 3, icon: '/images/skills/blender.png' },
    { id: 'skill-16', name: 'Three.js', level: 3, icon: '/images/skills/threejs.png' },
    { id: 'skill-17', name: 'Framer', level: 3, icon: '/images/skills/framer.png' },
    { id: 'skill-18', name: 'Node.js', level: 3, icon: '/images/skills/nodejs.png' },
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
            {/* 중앙 플래시 */}
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

// 🍬 미니 레고 헤드 (바닥에 쌓이고, 마우스에 밀려남)
const MiniLegoHead = ({ skill, startPos, onMousePush }: any) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 });
    const [hasLanded, setHasLanded] = useState(false);

    const direction = useRef(Math.random() > 0.5 ? 1 : -1).current;
    const power = useRef(400 + Math.random() * 600).current;
    const randomX = direction * power;

    // 바닥 위치 계산
    const floorY = typeof window !== 'undefined'
        ? window.innerHeight - 180 - Math.random() * 80
        : 600;
    const finalX = startPos.x + randomX;
    const finalRotate = (Math.random() - 0.5) * 40;

    // 착지 후 위치 저장
    useEffect(() => {
        const timer = setTimeout(() => {
            setHasLanded(true);
            setPosition({ x: finalX, y: floorY, rotate: finalRotate });
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // 마우스 밀림 효과
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!hasLanded || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
            const force = (100 - distance) / 100;
            const pushX = -dx * force * 0.5;
            const pushY = -dy * force * 0.3;
            const pushRotate = pushX * 0.5;

            setPosition(prev => ({
                x: prev.x + pushX,
                y: Math.min(prev.y + pushY, floorY), // 바닥 아래로 안 내려감
                rotate: prev.rotate + pushRotate,
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
            initial={{
                x: startPos.x,
                y: startPos.y - 100,
                scale: 0,
                rotate: 0,
                opacity: 0
            }}
            animate={hasLanded ? {
                x: position.x,
                y: position.y,
                scale: 1,
                rotate: position.rotate,
                opacity: 1,
            } : {
                opacity: 1,
                scale: [0, 1.5, 1.2, 1],                              // 더 크게 팡!
                y: [startPos.y, startPos.y - 300, startPos.y - 150, floorY],  // 위로 확 튀었다 내려옴
                x: [startPos.x, startPos.x + randomX * 0.5, finalX * 0.8, finalX],  // 좌우로 팡!
                rotate: [0, direction * 180, direction * 360 + finalRotate, finalRotate],  // 회전!
            }}
            transition={hasLanded ? {
                type: "spring",
                stiffness: 120,
                damping: 12,
            } : {
                duration: 1.0,
                times: [0, 0.15, 0.4, 1],      // 4개 keyframe에 맞춤
                ease: "easeOut",
            }}
        >
            <img
                src={skill.icon}
                alt={skill.name}
                className="w-16 h-16 object-contain drop-shadow-lg"
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
    headPosition: { x: number; y: number };
}

const SkillSection: React.FC<SkillSectionProps> = ({
    isActive,
    onSkillsCollected,
    onExpressionChange,
    shakeTrigger,
    headPosition,
}) => {
    const [poppedSkills, setPoppedSkills] = useState<any[]>([]);
    const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const prevShakeTrigger = useRef(shakeTrigger);

    const poppedIds = poppedSkills.map(p => p.skill.id);
    const currentLevelSkills = SKILLS_DATA.filter(s => s.level === currentLevel);
    const remainingSkills = currentLevelSkills.filter(s => !poppedIds.includes(s.id));

    // 흔들림 감지 → 스킬 팝
    useEffect(() => {
        if (shakeTrigger > prevShakeTrigger.current && isActive) {
            prevShakeTrigger.current = shakeTrigger;

            if (remainingSkills.length > 0) {
                popSkill();
            } else if (currentLevel < 3) {
                // 다음 레벨로
                setCurrentLevel(prev => prev + 1);
            }
        }
    }, [shakeTrigger, isActive]);

    // 레벨 변경 시 표정 업데이트
    useEffect(() => {
        const expressions: ('sad' | 'neutral' | 'happy')[] = ['sad', 'neutral', 'happy'];
        console.log('Level changed to:', currentLevel, '-> Expression:', expressions[currentLevel - 1]);
        onExpressionChange?.(expressions[currentLevel - 1]);
    }, [currentLevel]);

    // 모든 스킬 수집 완료
    useEffect(() => {
        if (poppedIds.length >= SKILLS_DATA.length) {
            onSkillsCollected?.();
        }
    }, [poppedIds.length, onSkillsCollected]);

    const popSkill = useCallback(() => {
        if (remainingSkills.length === 0) return;

        const skill = remainingSkills[0];
        const id = Date.now();

        // 스킬 추가
        setPoppedSkills(prev => [...prev, {
            id,
            skill,
            startPos: {
                x: headPosition.x || window.innerWidth / 2,
                y: headPosition.y || window.innerHeight / 2 - 100
            },
        }]);

        // 팡팡 이펙트 추가
        setBursts(prev => [...prev, {
            id,
            x: headPosition.x || window.innerWidth / 2,
            y: (headPosition.y || window.innerHeight / 2) - 100
        }]);

        // 이펙트 정리 (0.8초 후)
        setTimeout(() => {
            setBursts(prev => prev.filter(b => b.id !== id));
        }, 800);

    }, [remainingSkills, headPosition]);

    return (
        <div className="absolute inset-0 z-[200] pointer-events-none overflow-hidden">
            {/* 안내 문구 */}
            <AnimatePresence>
                {isActive && poppedSkills.length < SKILLS_DATA.length && (
                    <motion.div
                        className="absolute top-32 w-full text-center text-white z-[250]"
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
                            {poppedSkills.length} / {SKILLS_DATA.length} skills
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 💥 팡팡 이펙트들 */}
            {bursts.map((burst) => (
                <BurstEffect key={burst.id} x={burst.x} y={burst.y} />
            ))}

            {/* 🍬 스킬 아이콘들 (바닥에 쌓임) */}
            {poppedSkills.map((item) => (
                <MiniLegoHead
                    key={item.id}
                    skill={item.skill}
                    startPos={item.startPos}
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