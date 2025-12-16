import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

// 스킬 데이터 - 레벨별로 구분 (1: 초급, 2: 중급, 3: 고급)
const SKILLS_DATA = [
    // 초급 (레벨 1) - 안좋은 표정
    { id: 'skill-1', name: 'Excel', level: 1, color: '#217346', icon: '📊' },
    { id: 'skill-2', name: 'PPT', level: 1, color: '#D24726', icon: '📑' },

    // 중급 (레벨 2) - 보통 표정
    { id: 'skill-3', name: 'Figma', level: 2, color: '#F24E1E', icon: '🎨' },
    { id: 'skill-4', name: 'HTML/CSS', level: 2, color: '#E44D26', icon: '🌐' },
    { id: 'skill-5', name: 'Photoshop', level: 2, color: '#31A8FF', icon: '🖼️' },

    // 고급 (레벨 3) - 좋은 표정
    { id: 'skill-6', name: 'React', level: 3, color: '#61DAFB', icon: '⚛️' },
    { id: 'skill-7', name: 'TypeScript', level: 3, color: '#3178C6', icon: '📘' },
    { id: 'skill-8', name: 'UI/UX', level: 3, color: '#FF6B6B', icon: '✨' },
];

// 미니 레고 헤드 컴포넌트
const MiniLegoHead = ({
    skill,
    style,
    isPopping,
    onAnimationComplete
}: {
    skill: typeof SKILLS_DATA[0];
    style: React.CSSProperties;
    isPopping: boolean;
    onAnimationComplete?: () => void;
}) => (
    <motion.div
        className="absolute pointer-events-none"
        style={style}
        initial={{
            scale: 0,
            opacity: 0,
            y: 0,
            x: 0,
        }}
        animate={isPopping ? {
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1, 0],
            y: [0, -150 - Math.random() * 100, -200 - Math.random() * 150],
            x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 360],
        } : {}}
        transition={{
            duration: 1.2,
            ease: "easeOut",
            times: [0, 0.3, 0.6, 1],
        }}
        onAnimationComplete={onAnimationComplete}
    >
        {/* 미니 레고 헤드 SVG */}
        <svg width="50" height="60" viewBox="0 0 50 60">
            {/* 머리 윗부분 (원통) */}
            <ellipse cx="25" cy="8" rx="8" ry="4" fill={skill.color} />
            <rect x="17" y="8" width="16" height="12" fill={skill.color} />
            <ellipse cx="25" cy="20" rx="8" ry="4" fill={skill.color} opacity="0.8" />

            {/* 얼굴 */}
            <rect x="5" y="20" width="40" height="35" rx="8" fill="#FCBB09" />

            {/* 눈 */}
            <circle cx="17" cy="35" r="4" fill="#2b2b2b" />
            <circle cx="33" cy="35" r="4" fill="#2b2b2b" />
            <circle cx="18" cy="34" r="1.5" fill="white" />
            <circle cx="34" cy="34" r="1.5" fill="white" />

            {/* 입 - 레벨에 따라 다름 */}
            {skill.level === 1 && (
                // 슬픈 표정
                <path d="M17 47 Q25 42 33 47" stroke="#2b2b2b" strokeWidth="2" fill="none" />
            )}
            {skill.level === 2 && (
                // 보통 표정
                <line x1="17" y1="47" x2="33" y2="47" stroke="#2b2b2b" strokeWidth="2" />
            )}
            {skill.level === 3 && (
                // 웃는 표정
                <path d="M17 45 Q25 52 33 45" stroke="#2b2b2b" strokeWidth="2" fill="none" />
            )}
        </svg>

        {/* 스킬 이름 */}
        <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-2 py-0.5 rounded"
            style={{ backgroundColor: skill.color, color: 'white' }}
        >
            {skill.name}
        </div>
    </motion.div>
);

// 팡팡 이펙트 (별/반짝이)
const PopEffect = ({ x, y, color }: { x: number; y: number; color: string }) => (
    <motion.div
        className="absolute pointer-events-none"
        style={{ left: x, top: y }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
    >
        {/* 별 모양 */}
        <svg width="40" height="40" viewBox="0 0 40 40">
            <polygon
                points="20,0 24,14 40,14 27,23 32,40 20,30 8,40 13,23 0,14 16,14"
                fill={color}
            />
        </svg>
    </motion.div>
);

// 원형 팡 이펙트
const BurstEffect = ({ x, y }: { x: number; y: number }) => (
    <motion.div
        className="absolute pointer-events-none rounded-full border-4 border-yellow-400"
        style={{ left: x - 50, top: y - 50, width: 100, height: 100 }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{
            scale: [0, 2],
            opacity: [1, 0],
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
    />
);

interface SkillSectionProps {
    isActive: boolean;
    onSkillsCollected?: () => void;
    faceExpression?: 'sad' | 'neutral' | 'happy';
    onExpressionChange?: (expression: 'sad' | 'neutral' | 'happy') => void;
}

const SkillSection: React.FC<SkillSectionProps> = ({
    isActive,
    onSkillsCollected,
    onExpressionChange,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [poppedSkills, setPoppedSkills] = useState<string[]>([]);
    const [effects, setEffects] = useState<{ id: string; x: number; y: number; color: string }[]>([]);
    const [bursts, setBursts] = useState<{ id: string; x: number; y: number }[]>([]);
    const [isShaking, setIsShaking] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [faceRotation, setFaceRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);

    const shakeCountRef = useRef(0);
    const lastShakeTime = useRef(0);
    const mousePos = useRef({ x: 0, y: 0 });
    const lastMousePos = useRef({ x: 0, y: 0 });

    // 현재 레벨의 스킬들
    const currentLevelSkills = SKILLS_DATA.filter(s => s.level === currentLevel);
    const remainingSkills = currentLevelSkills.filter(s => !poppedSkills.includes(s.id));

    // 모든 스킬이 나왔는지 확인
    const allSkillsPopped = poppedSkills.length >= SKILLS_DATA.length;

    // 흔들기 감지
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isActive) return;

        const now = Date.now();
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        lastMousePos.current = { x: e.clientX, y: e.clientY };
        mousePos.current = { x: e.clientX, y: e.clientY };

        // 빠른 움직임 감지 (흔들기)
        if (distance > 30 && now - lastShakeTime.current > 100) {
            lastShakeTime.current = now;
            shakeCountRef.current += 1;
            setIsShaking(true);

            // 3번 흔들면 스킬 하나 팝!
            if (shakeCountRef.current >= 3 && remainingSkills.length > 0) {
                shakeCountRef.current = 0;
                popSkill();
            }

            setTimeout(() => setIsShaking(false), 200);
        }
    }, [isActive, remainingSkills]);

    // 스킬 팝 함수
    const popSkill = useCallback(() => {
        if (remainingSkills.length === 0) {
            // 현재 레벨 다 나왔으면 다음 레벨로
            if (currentLevel < 3) {
                setCurrentLevel(prev => prev + 1);
                // 표정 변경 알림
                const newExpression = currentLevel === 1 ? 'neutral' : 'happy';
                onExpressionChange?.(newExpression as 'sad' | 'neutral' | 'happy');
            }
            return;
        }

        const skill = remainingSkills[0];
        setPoppedSkills(prev => [...prev, skill.id]);

        // 이펙트 추가
        const effectId = `effect-${Date.now()}`;
        const burstId = `burst-${Date.now()}`;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2 - 100;

        setEffects(prev => [...prev, {
            id: effectId,
            x: centerX + (Math.random() - 0.5) * 100,
            y: centerY + (Math.random() - 0.5) * 50,
            color: skill.color
        }]);

        setBursts(prev => [...prev, { id: burstId, x: centerX, y: centerY }]);

        // 이펙트 정리
        setTimeout(() => {
            setEffects(prev => prev.filter(e => e.id !== effectId));
            setBursts(prev => prev.filter(b => b.id !== burstId));
        }, 1000);

    }, [remainingSkills, currentLevel, onExpressionChange]);

    // 360도 스핀 (phase 26 진입 시)
    useEffect(() => {
        if (isActive && !isSpinning) {
            setIsSpinning(true);
            // 스핀 애니메이션은 LegoFace3D에서 처리
        }
    }, [isActive]);

    // 레벨 변경 시 표정 업데이트
    useEffect(() => {
        const expressions: ('sad' | 'neutral' | 'happy')[] = ['sad', 'neutral', 'happy'];
        onExpressionChange?.(expressions[currentLevel - 1]);
    }, [currentLevel, onExpressionChange]);

    // 스킬 수집 완료
    useEffect(() => {
        if (allSkillsPopped) {
            onSkillsCollected?.();
        }
    }, [allSkillsPopped, onSkillsCollected]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-[200]"
            onMouseMove={handleMouseMove}
        >
            {/* 배경 */}
            <motion.div
                className="absolute inset-0 bg-[#4A7C23]"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            />

            {/* 안내 텍스트 */}
            <AnimatePresence>
                {isActive && !allSkillsPopped && (
                    <motion.div
                        className="absolute top-20 left-1/2 -translate-x-1/2 text-center text-white"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <p className="text-2xl font-bold mb-2">얼굴을 흔들어보세요! 🎉</p>
                        <p className="text-lg opacity-80">
                            레벨 {currentLevel} 스킬 ({poppedSkills.filter(id =>
                                SKILLS_DATA.find(s => s.id === id)?.level === currentLevel
                            ).length}/{currentLevelSkills.length})
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 팝된 스킬들 */}
            {SKILLS_DATA.filter(s => poppedSkills.includes(s.id)).map((skill, index) => (
                <MiniLegoHead
                    key={skill.id}
                    skill={skill}
                    isPopping={true}
                    style={{
                        left: '50%',
                        top: '40%',
                        marginLeft: -25,
                    }}
                />
            ))}

            {/* 팡팡 이펙트들 */}
            {effects.map(effect => (
                <PopEffect key={effect.id} x={effect.x} y={effect.y} color={effect.color} />
            ))}

            {/* 원형 버스트 이펙트들 */}
            {bursts.map(burst => (
                <BurstEffect key={burst.id} x={burst.x} y={burst.y} />
            ))}

            {/* 흔들림 인디케이터 */}
            <AnimatePresence>
                {isShaking && (
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="text-6xl">💥</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 수집된 스킬 목록 (하단) */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 flex-wrap justify-center max-w-[80vw]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            >
                {SKILLS_DATA.filter(s => poppedSkills.includes(s.id)).map(skill => (
                    <motion.div
                        key={skill.id}
                        className="px-3 py-1.5 rounded-full text-white text-sm font-medium"
                        style={{ backgroundColor: skill.color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                        {skill.icon} {skill.name}
                    </motion.div>
                ))}
            </motion.div>

            {/* 완료 메시지 */}
            <AnimatePresence>
                {allSkillsPopped && (
                    <motion.div
                        className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <p className="text-4xl font-bold text-white mb-4">🎊 모든 스킬 수집 완료! 🎊</p>
                        <p className="text-xl text-white/80">스크롤하여 계속하세요</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SkillSection;