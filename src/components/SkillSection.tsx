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

// 🍬 미니 레고 헤드 (포물선 운동 + 바닥 안착)
const MiniLegoHead = ({ skill, startPos, onAnimationComplete }: any) => {
    // 화면 하단 좌표 (바닥) 계산 - 약간의 랜덤성 추가
    const floorY = window.innerHeight - 100;
    // 좌우로 튀는 범위 설정
    const randomX = (Math.random() - 0.5) * 400;

    return (
        <motion.div
            className="absolute pointer-events-none z-[300] flex flex-col items-center justify-center"
            initial={{
                x: startPos.x,
                y: startPos.y - 150, // 머리 꼭대기에서 시작 (머리 중심보다 위)
                scale: 0.5,
                rotate: 0,
                opacity: 0
            }}
            animate={{
                opacity: [0, 1, 1, 1],
                scale: [0.5, 1.2, 1, 1],
                // Y축: 위로 솟았다가(Up) -> 바닥으로 떨어짐(Down)
                y: [startPos.y - 150, startPos.y - 350, floorY, floorY],
                // X축: 옆으로 퍼짐
                x: [startPos.x, startPos.x + randomX * 0.5, startPos.x + randomX, startPos.x + randomX],
                // 회전: 떨어지면서 빙글빙글 -> 바닥에선 멈춤
                rotate: [0, Math.random() * 360, Math.random() * 720, Math.random() * 720]
            }}
            transition={{
                duration: 2.5, // 체류 시간 길게 (천천히 떨어짐)
                times: [0, 0.2, 0.7, 1], // 0.2지점까지 솟구침 -> 0.7지점에 바닥 닿음 -> 나머지 대기
                ease: ["easeOut", "easeIn", "easeOut", "linear"], // 솟을땐 감속, 떨어질땐 가속(중력)
            }}
            // 애니메이션 끝나도 삭제하지 않고 바닥에 유지하려면 아래 로직 수정 필요
            // 여기서는 일정 시간 후 사라지게 처리함
            onAnimationComplete={onAnimationComplete}
        >
            {/* 아이콘 + 텍스트 */}
            <div className="text-5xl filter drop-shadow-xl transform transition-transform hover:scale-110">
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
    headPosition: { x: number, y: number }; // 머리 위치 받기
}

const SkillSection: React.FC<SkillSectionProps> = ({
    isActive,
    onSkillsCollected,
    onExpressionChange,
    shakeTrigger,
    headPosition
}) => {
    const [poppedSkills, setPoppedSkills] = useState<any[]>([]); // id뿐만 아니라 위치 정보도 저장
    const [currentLevel, setCurrentLevel] = useState(1);

    // 현재 레벨의 스킬 목록
    const currentLevelSkills = SKILLS_DATA.filter(s => s.level === currentLevel);
    // 아직 안 나온 스킬들 (전체 데이터 기준이 아니라, 팝업된 목록 기준)
    const poppedIds = poppedSkills.map(p => p.skill.id);
    const remainingSkills = currentLevelSkills.filter(s => !poppedIds.includes(s.id));

    // 신호가 오면 스킬 1개 발사
    useEffect(() => {
        if (shakeTrigger > 0) {
            if (remainingSkills.length > 0) {
                popSkill();
            } else if (remainingSkills.length === 0 && currentLevel < 3) {
                // 현재 레벨 다 털었으면 다음 레벨로
                setCurrentLevel(prev => prev + 1);
            }
        }
    }, [shakeTrigger]);

    // 표정 변경
    useEffect(() => {
        const expressions: ('sad' | 'neutral' | 'happy')[] = ['sad', 'neutral', 'happy'];
        onExpressionChange?.(expressions[currentLevel - 1]);
    }, [currentLevel, onExpressionChange]);

    // 전체 수집 완료 체크
    useEffect(() => {
        if (poppedIds.length >= SKILLS_DATA.length) onSkillsCollected?.();
    }, [poppedIds.length, onSkillsCollected]);

    const popSkill = useCallback(() => {
        const skill = remainingSkills[0];

        // 팝업된 스킬 리스트에 추가 (위치 정보 포함)
        const newSkill = {
            id: Date.now(), // 유니크 키
            skill: skill,
            startPos: { x: headPosition.x, y: headPosition.y } // 발사 순간의 머리 위치 고정
        };

        setPoppedSkills(prev => [...prev, newSkill]);

        // 바닥에 떨어진 후 5초 뒤에 사라지게 하려면 (쌓이는 느낌 원하면 제거 가능)
        /*
        setTimeout(() => {
            setPoppedSkills(prev => prev.filter(p => p.id !== newSkill.id));
        }, 5000);
        */
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
                        <h2 className="text-4xl font-black italic drop-shadow-md mb-2">SHAKE IT HARD!</h2>
                        <p className="text-lg opacity-90 font-medium">머리를 잡고 흔들어 스킬을 꺼내보세요!</p>
                        <p className="text-sm opacity-70 mt-1">(현재 {currentLevel}단계 / 3단계)</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 💥 스킬 아이콘들 (Lego Heads) */}
            {poppedSkills.map((item) => (
                <MiniLegoHead
                    key={item.id}
                    skill={item.skill}
                    startPos={item.startPos}
                />
            ))}

            {/* 완료 축하 메시지 */}
            <AnimatePresence>
                {poppedSkills.length >= SKILLS_DATA.length && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black/60 z-[400]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="text-center text-white"
                            initial={{ scale: 0.5, rotate: -10 }}
                            animate={{ scale: 1.2, rotate: 0 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                        >
                            <div className="text-7xl mb-6">🎉</div>
                            <h2 className="text-6xl font-black italic text-[#FCBB09] drop-shadow-lg">ALL COLLECTED!</h2>
                            <p className="text-2xl mt-4 font-bold">이제 아래로 스크롤하세요!</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SkillSection;