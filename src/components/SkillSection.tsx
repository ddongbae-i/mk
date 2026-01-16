import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

console.log('SkillSection render', Date.now());

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

// ✅ 이미지 프리로딩 함수
const preloadImages = (imageUrls: string[]) => {
    return Promise.all(
        imageUrls.map((url) => {
            return new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    console.log('✅ Loaded:', url);
                    resolve();
                };
                img.onerror = () => {
                    console.error('❌ Failed to load:', url);
                    reject();
                };
                img.src = url;
            });
        })
    );
};

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

interface PhysicsObject {
    id: number;
    skill: any;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotVel: number;
    landed: boolean;
    elemRef: HTMLDivElement | null;
}

interface SkillSectionProps {
    isActive: boolean;
    isExiting?: boolean;
    onSkillsCollected?: () => void;
    onExpressionChange?: (expression: Expression) => void;
    onShakingChange?: (isShaking: boolean) => void;
    shakeTrigger: number;
    headRef: React.RefObject<HTMLElement>;
    mousePos?: { x: number; y: number };
    mouseVelocity?: { x: number; y: number };
    onExitComplete?: () => void;
}

const SkillSection: React.FC<SkillSectionProps> = ({
    isActive,
    isExiting = false,
    onSkillsCollected,
    onExpressionChange,
    onShakingChange,
    shakeTrigger,
    headRef,
    mousePos = { x: 0, y: 0 },
    mouseVelocity = { x: 0, y: 0 },
    onExitComplete,
}) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [absorbingSkills, setAbsorbingSkills] = useState<{
        id: number;
        fromX: number;
        fromY: number;
        skill: any;
    }[]>([]);
    const [poppedSkills, setPoppedSkills] = useState<{ id: number; skill: any; originX: number; originY: number }[]>([]);
    const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
    const [currentLevel, setCurrentLevel] = useState(1);

    const physicsObjectsRef = useRef<Map<number, PhysicsObject>>(new Map());
    const rafRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mousePosRef = useRef(mousePos);
    const mouseVelocityRef = useRef(mouseVelocity);
    const shakeCountRef = useRef(0);
    const prevShakeTrigger = useRef(shakeTrigger);
    const baseExpressionRef = useRef<Expression>("neutral");
    const isShakingRef = useRef(false);
    const shakeEndTimerRef = useRef<number | null>(null);

    // ✅ 이미지 프리로딩
    useEffect(() => {
        if (!isActive) return;

        console.log('🖼️ Starting image preload...');
        const imageUrls = SKILLS_DATA.map(skill => skill.icon);

        preloadImages(imageUrls)
            .then(() => {
                console.log('✅ All images loaded!');
                setImagesLoaded(true);
            })
            .catch((err) => {
                console.error('❌ Image preload failed:', err);
                // 실패해도 진행
                setImagesLoaded(true);
            });
    }, [isActive]);

    // ✅ isExiting 처리 - 물리 객체를 먼저 중지하고 흡수 시작
    useEffect(() => {
        if (!isExiting || poppedSkills.length === 0) return;

        console.log('🔥 Starting exit animation, popped count:', poppedSkills.length);

        // 1. 물리 엔진 중지
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        // 2. 현재 위치 수집 후 흡수 시작
        setTimeout(() => {
            const absorbed: typeof absorbingSkills = [];

            physicsObjectsRef.current.forEach((obj) => {
                if (obj.elemRef) {
                    const rect = obj.elemRef.getBoundingClientRect();
                    absorbed.push({
                        id: obj.id,
                        fromX: rect.left + rect.width / 2,
                        fromY: rect.top + rect.height / 2,
                        skill: obj.skill,
                    });
                    console.log('📍 Skill position:', obj.skill.name, rect.left, rect.top);
                }
            });

            console.log('📦 Total skills to absorb:', absorbed.length);
            setAbsorbingSkills(absorbed);
            setPoppedSkills([]); // ✅ 물리 객체 숨기기

            // 3. 흡수 완료 후 정리
            const totalDuration = absorbed.length * 50 + 600;
            setTimeout(() => {
                setAbsorbingSkills([]);
                physicsObjectsRef.current.clear();
                console.log('✅ Exit complete');
                onExitComplete?.();
            }, totalDuration);
        }, 50);

    }, [isExiting, poppedSkills.length, onExitComplete]);

    useEffect(() => {
        mousePosRef.current = mousePos;
    }, [mousePos]);

    useEffect(() => {
        mouseVelocityRef.current = mouseVelocity;
    }, [mouseVelocity]);

    const getHeadMouth = useCallback(() => {
        const el = headRef?.current;
        if (!el) {
            console.warn('⚠️ headRef not ready, using fallback');
            return {
                x: window.innerWidth / 2,
                y: window.innerHeight * 0.3
            };
        }

        const r = el.getBoundingClientRect();
        const centerX = r.left + r.width / 2;
        const centerY = r.top + r.height * 0.1;

        return { x: centerX, y: centerY };
    }, [headRef]);

    const getLevelExpression = useCallback((level: number): Expression => {
        if (level === 1) return "sad";
        if (level === 2) return "neutral";
        return "happy";
    }, []);

    const applyBaseExpression = useCallback(() => {
        onExpressionChange?.(baseExpressionRef.current);
    }, [onExpressionChange]);

    const setShaking = useCallback((v: boolean) => {
        if (isShakingRef.current === v) return;
        isShakingRef.current = v;
        onShakingChange?.(v);
    }, [onShakingChange]);

    // ✅ 물리 엔진
    useEffect(() => {
        if (!isActive || !imagesLoaded) return;

        console.log('🔴 Physics loop STARTED');
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const floorY = windowHeight - 150;
        const gravity = 0.6;
        const bounce = 0.5;
        const friction = 0.99;
        const groundFriction = 0.95;

        const updatePhysics = () => {
            const mousePos = mousePosRef.current;
            const mouseVelocity = mouseVelocityRef.current;

            physicsObjectsRef.current.forEach((obj) => {
                if (!obj.elemRef) return;

                let { x, y, vx, vy, rotation, rotVel } = obj;

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
                        obj.landed = true;
                    }
                    vx *= groundFriction;
                }

                if (x < 40) { x = 40; vx = Math.abs(vx) * bounce; }
                if (x > windowWidth - 40) { x = windowWidth - 40; vx = -Math.abs(vx) * bounce; }

                const dx = mousePos.x - x;
                const dy = mousePos.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const hitRadius = 70;

                if (dist < hitRadius && dist > 0) {
                    const speed = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2);
                    if (speed > 3) {
                        const pushX = -dx / dist;
                        const pushY = -dy / dist;
                        const force = Math.min(speed * 1.5, 25);

                        vx += pushX * force + mouseVelocity.x * 0.3;
                        vy += pushY * force * 0.5 - 8;
                        rotVel += (Math.random() - 0.5) * force * 2;
                        obj.landed = false;
                    }
                }

                vx *= friction;
                rotVel *= 0.995;
                rotation += rotVel;

                obj.x = x;
                obj.y = y;
                obj.vx = vx;
                obj.vy = vy;
                obj.rotation = rotation;
                obj.rotVel = rotVel;

                obj.elemRef.style.transform = `translate(${x - 70}px, ${y - 70}px) rotate(${rotation}deg)`;
            });

            rafRef.current = requestAnimationFrame(updatePhysics);
        };

        rafRef.current = requestAnimationFrame(updatePhysics);

        return () => {
            console.log('🟢 Physics loop STOPPED');
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [isActive, imagesLoaded]);

    const registerPhysicsObject = useCallback((id: number, skill: any, originX: number, originY: number, elem: HTMLDivElement | null) => {
        if (!elem) {
            console.warn('⚠️ Element not ready for skill:', skill.name);
            return;
        }

        if (physicsObjectsRef.current.has(id)) {
            return;
        }

        console.log('✅ Registering physics object:', skill.name, 'at', originX, originY);

        physicsObjectsRef.current.set(id, {
            id,
            skill,
            x: originX,
            y: originY,
            vx: (Math.random() - 0.5) * 20,
            vy: -20 - Math.random() * 10,
            rotation: 0,
            rotVel: (Math.random() - 0.5) * 25,
            landed: false,
            elemRef: elem,
        });
    }, []);

    const popSkill = useCallback(() => {
        if (!isActive || !imagesLoaded) {
            console.warn('⚠️ popSkill blocked: not ready');
            return;
        }

        const poppedIds = poppedSkills.map((p) => p.skill.id);
        const currentLevelSkills = SKILLS_DATA.filter((s) => s.level === currentLevel);
        const remainingSkills = currentLevelSkills.filter((s) => !poppedIds.includes(s.id));

        if (remainingSkills.length === 0) {
            if (currentLevel < 3) {
                console.log('⬆️ Level up:', currentLevel, '→', currentLevel + 1);
                setCurrentLevel((p) => p + 1);
            }
            return;
        }

        const skill = remainingSkills[0];
        const id = Date.now();

        const headPos = getHeadMouth();
        console.log('💥 Popping skill:', skill.name, 'at:', headPos);

        setBursts((prev) => [...prev, { id, x: headPos.x, y: headPos.y }]);
        setTimeout(() => {
            setBursts((prev) => prev.filter((b) => b.id !== id));
        }, 700);

        setPoppedSkills((prev) => [...prev, {
            id,
            skill,
            originX: headPos.x,
            originY: headPos.y
        }]);
    }, [isActive, imagesLoaded, currentLevel, getHeadMouth, poppedSkills]);

    useEffect(() => {
        if (isActive) return;

        if (shakeEndTimerRef.current) window.clearTimeout(shakeEndTimerRef.current);
        setShaking(false);
        baseExpressionRef.current = "neutral";
        onExpressionChange?.("neutral");
        physicsObjectsRef.current.clear();
    }, [isActive, onExpressionChange, setShaking]);

    useEffect(() => {
        if (!isActive) return;

        let newExpression: Expression = getLevelExpression(currentLevel);
        if (poppedSkills.length >= SKILLS_DATA.length) {
            newExpression = "happy";
        }

        baseExpressionRef.current = newExpression;
        if (!isShakingRef.current) {
            onExpressionChange?.(newExpression);
        }
    }, [currentLevel, isActive, poppedSkills.length, getLevelExpression, onExpressionChange]);

    useEffect(() => {
        if (!isActive) return;

        if (shakeTrigger !== prevShakeTrigger.current) {
            prevShakeTrigger.current = shakeTrigger;
            shakeCountRef.current += 1;

            console.log('🔔 Shake detected! Count:', shakeCountRef.current);

            setShaking(true);
            const targetExpr = getLevelExpression(currentLevel);
            onExpressionChange?.(targetExpr);

            if (shakeEndTimerRef.current) window.clearTimeout(shakeEndTimerRef.current);
            shakeEndTimerRef.current = window.setTimeout(() => {
                setShaking(false);
                applyBaseExpression();
            }, 250);

            popSkill();
        }
    }, [shakeTrigger, isActive, popSkill, onExpressionChange, applyBaseExpression, setShaking, currentLevel, getLevelExpression]);

    const poppedIds = poppedSkills.map((p) => p.skill.id);

    useEffect(() => {
        if (poppedIds.length >= SKILLS_DATA.length) {
            console.log('🎉 All skills collected!');
            onSkillsCollected?.();
        }
    }, [poppedIds.length, onSkillsCollected]);

    return (
        <div className="absolute inset-0 z-[200] overflow-hidden">
            {/* ✅ 로딩 표시 */}
            {isActive && !imagesLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-[300]">
                    <div className="text-[#f0f0f0] text-2xl font-bold italic" style={{ fontFamily: "Kanit, sans-serif" }}>
                        Loading skills...
                    </div>
                </div>
            )}

            <div className="absolute inset-0 pointer-events-auto">
                <AnimatePresence>
                    {isActive && imagesLoaded && poppedSkills.length < SKILLS_DATA.length && (
                        <motion.div
                            className="absolute top-24 w-full text-center text-[#f0f0f0] z-[250]"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h2 className="text-5xl font-bold italic mb-2" style={{ fontFamily: "Kanit, sans-serif" }}>
                                What's in MK's head?
                            </h2>
                            <p className="text-lg">머리를 잡고 마구 흔들어주세요!</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {poppedSkills.length >= SKILLS_DATA.length && (
                        <motion.div
                            className="absolute top-[10%] left-[40%] text-center z-[260] pointer-events-auto"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <p className="text-5xl font-bold text-[#f0f0f0] italic" style={{ fontFamily: "Kanit, sans-serif" }}>
                                This is MK's skill set
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div ref={containerRef} className="absolute inset-0 pointer-events-none">
                {bursts.map((burst) => (
                    <BurstEffect key={burst.id} x={burst.x} y={burst.y} />
                ))}

                {/* ✅ 흡수 애니메이션 */}
                {absorbingSkills.length > 0 && absorbingSkills.map((item, index) => {
                    const headCenter = headRef?.current
                        ? (() => {
                            const r = headRef.current.getBoundingClientRect();
                            return {
                                x: r.left + r.width / 2,
                                y: r.top + r.height * 0.1
                            };
                        })()
                        : { x: window.innerWidth / 2, y: window.innerHeight * 0.3 };

                    console.log('🎯 Absorbing:', item.skill.name, 'from', item.fromX, item.fromY, 'to', headCenter.x, headCenter.y);

                    return (
                        <motion.div
                            key={`absorb-${item.id}`}
                            className="absolute pointer-events-none z-[350]"
                            style={{ left: 0, top: 0 }}
                            initial={{
                                x: item.fromX - 70,
                                y: item.fromY - 70,
                                scale: 1,
                                opacity: 1,
                            }}
                            animate={{
                                x: headCenter.x - 70,
                                y: headCenter.y - 70,
                                scale: 0,
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.5,
                                ease: [0.32, 0, 0.67, 0],
                                delay: index * 0.04,
                            }}
                        >
                            <img
                                src={item.skill.icon}
                                alt={item.skill.name}
                                className="w-[140px] h-[140px] object-contain"
                                style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.25))" }}
                            />
                        </motion.div>
                    );
                })}

                {/* ✅ 물리 객체들 */}
                {poppedSkills.map((item) => (
                    <div
                        key={item.id}
                        ref={(el) => {
                            if (el && imagesLoaded) {
                                registerPhysicsObject(item.id, item.skill, item.originX, item.originY, el);
                            }
                        }}
                        className="absolute pointer-events-none z-[300]"
                        style={{
                            left: 0,
                            top: 0,
                            transform: `translate(${item.originX - 70}px, ${item.originY - 70}px)`,
                            willChange: "transform",
                        }}
                    >
                        <img
                            src={item.skill.icon}
                            alt={item.skill.name}
                            className="w-[140px] h-[140px] object-contain"
                            style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.25))" }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillSection;