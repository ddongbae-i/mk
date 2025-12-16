import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SKILLS_DATA = [
    { id: 'skill-1', name: 'Excel', level: 1, color: '#217346', icon: '📊' },
    { id: 'skill-2', name: 'PPT', level: 1, color: '#D24726', icon: '📑' },
    { id: 'skill-3', name: 'Figma', level: 2, color: '#F24E1E', icon: '🎨' },
    { id: 'skill-4', name: 'HTML/CSS', level: 2, color: '#E44D26', icon: '🌐' },
    { id: 'skill-5', name: 'Photoshop', level: 2, color: '#31A8FF', icon: '🖼️' },
    { id: 'skill-6', name: 'React', level: 3, color: '#61DAFB', icon: '⚛️' },
    { id: 'skill-7', name: 'TypeScript', level: 3, color: '#3178C6', icon: '📘' },
    { id: 'skill-8', name: 'UI/UX', level: 3, color: '#FF6B6B', icon: '✨' },
];

// 🍬 미니 레고 헤드 (바닥에 쌓이는 모션)
const MiniLegoHead = ({ skill, startPos }: any) => {
    // 바닥 위치 (화면 하단에서 약간 위) - 쌓이는 느낌을 위해 랜덤 오차 추가
    const floorY = window.innerHeight - 80 - Math.random() * 50;
    // 좌우로 퍼지는 범위
    const randomX = (Math.random() - 0.5) * 500;
    // 최종 회전 각도 (바닥에 떨어진 후 멈출 각도)
    const finalRotate = Math.random() * 360;

    return (
        <motion.div
            className="absolute pointer-events-none z-[300] flex flex-col items-center justify-center"
            initial={{
                x: startPos.x,
                y: startPos.y - 100, // 머리 위쪽에서 시작
                scale: 0.5,
                rotate: 0,
                opacity: 0
            }}
            animate={{
                opacity: 1, // 사라지지 않고 계속 보임
                scale: [0.5, 1.2, 1],
                // Y축: 솟구쳤다가(Up) -> 바닥으로 떨어짐(Down)
                y: [startPos.y - 100, startPos.y - 300, floorY],
                // X축: 시작점 -> 퍼짐
                x: [startPos.x, startPos.x + randomX * 0.2, startPos.x + randomX],
                // 회전: 빙글빙글 돌다가 멈춤
                rotate: [0, finalRotate + 720, finalRotate]
            }}
            transition={{
                duration: 1.5, // 떨어지는 속도
                times: [0, 0.4, 1], // 0.4 지점에서 최고점, 1에서 바닥
                ease: ["easeOut", "bounceOut"], // 바닥에 닿을 때 통통 튀는 효과 (bounceOut)
            }}
            // 애니메이션이 끝나도 스타일 유지 (fill: forwards 효과)
            style={{ x: startPos.x + randomX, y: floorY, rotate: finalRotate }}
        >
            {/* 아이콘 + 텍스트 */}
            <div className="text-5xl filter drop-shadow-xl">
                {skill.icon}
            </div>
            <span className="mt-2 px-3 py-1 text-sm font-bold text-white rounded-full shadow-lg whitespace-nowrap border border-white/20"
                style={{ backgroundColor: skill.color }}>
                {skill.name}
            </span>
        </motion.div>
    );
};

interface SkillSectionProps {
    isActive: boolean;
    onSkillsCollected?: () => void;
    onExpressionChange?: (expression: 'sad' | 'neutral' | 'happy') => void;
    shakeTrigger: number;
    headPosition: { x: number, y: number };
}

const SkillSection: React.FC<SkillSectionProps> = ({
    isActive,
    onSkillsCollected,
    onExpressionChange,
    shakeTrigger,
    headPosition
}) => {
    const [poppedSkills, setPoppedSkills] = useState<any[]>([]);
    const [currentLevel, setCurrentLevel] = useState(1);

    const currentLevelSkills = SKILLS_DATA.filter(s => s.level === currentLevel);
    const poppedIds = poppedSkills.map(p => p.skill.id);
    const remainingSkills = currentLevelSkills.filter(s => !poppedIds.includes(s.id));

    useEffect(() => {
        if (shakeTrigger > 0) {
            if (remainingSkills.length > 0) {
                popSkill();
            } else if (remainingSkills.length === 0 && currentLevel < 3) {
                setCurrentLevel(prev => prev + 1);
            }
        }
    }, [shakeTrigger]);

    useEffect(() => {
        const expressions: ('sad' | 'neutral' | 'happy')[] = ['sad', 'neutral', 'happy'];
        onExpressionChange?.(expressions[currentLevel - 1]);
    }, [currentLevel, onExpressionChange]);

    useEffect(() => {
        if (poppedIds.length >= SKILLS_DATA.length) onSkillsCollected?.();
    }, [poppedIds.length, onSkillsCollected]);

    const popSkill = useCallback(() => {
        const skill = remainingSkills[0];
        const newSkill = {
            id: Date.now(),
            skill: skill,
            startPos: { x: headPosition.x, y: headPosition.y }
        };
        setPoppedSkills(prev => [...prev, newSkill]);
        // setTimeout 제거됨: 스킬이 사라지지 않음
    }, [remainingSkills, headPosition]);

    return (
        <div className="absolute inset-0 z-[200] pointer-events-none overflow-hidden">
            {/* 배경 */}
            <motion.div
                className="absolute inset-0 bg-[#4A7C23]"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
            />

            {/* 안내 문구 */}
            <AnimatePresence>
                {isActive && poppedSkills.length < SKILLS_DATA.length && (
                    <motion.div
                        className="absolute top-32 w-full text-center text-white z-[250]"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <h2 className="text-4xl font-black italic drop-shadow-md mb-2">SHAKE IT!</h2>
                        <p className="text-lg opacity-90 font-medium">머리를 잡고 흔들어보세요!</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 💥 스킬 아이콘들 (바닥에 쌓임) */}
            {poppedSkills.map((item) => (
                <MiniLegoHead
                    key={item.id}
                    skill={item.skill}
                    startPos={item.startPos}
                />
            ))}

            {/* 마지막 효과(오버레이) 제거됨 */}
        </div>
    );
};

export default SkillSection;