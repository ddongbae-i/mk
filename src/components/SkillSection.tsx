// 🎮 물리 기반 스킬 아이콘 - ✅ 성능 최적화 버전
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
    const floorY = windowHeight - 150;

    // ✅ DOM ref로 직접 조작 - 상태 업데이트 없음!
    const elemRef = useRef<HTMLDivElement>(null);
    const velRef = useRef({ x: (Math.random() - 0.5) * 20, y: -20 - Math.random() * 10 });
    const rotVelRef = useRef((Math.random() - 0.5) * 25);
    const posRef = useRef({ x: headX, y: headY });
    const rotRef = useRef(0);
    const landedRef = useRef(false);

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
            rotRef.current += rotVel;

            // ✅ DOM 직접 업데이트 - React 상태 변경 없음!
            if (elemRef.current) {
                elemRef.current.style.transform = `translate(${x - 70}px, ${y - 70}px) rotate(${rotRef.current}deg)`;
            }

            raf = requestAnimationFrame(update);
        };

        raf = requestAnimationFrame(update);
        return () => cancelAnimationFrame(raf);
    }, [floorY, windowWidth]);

    // 마우스 상호작용
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
            }
        }
    }, [mousePos.x, mousePos.y, mouseVelocity.x, mouseVelocity.y]);

    return (
        <div
            ref={elemRef}
            className="absolute pointer-events-none z-[300]"
            style={{
                left: 0,
                top: 0,
                transform: `translate(${headX - 70}px, ${headY - 70}px)`,
                willChange: "transform",  // ✅ GPU 가속 힌트
            }}
        >
            <img
                src={skill.icon}
                alt={skill.name}
                className="w-[140px] h-[140px] object-contain"
                style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.25))" }}
                loading="lazy"  // ✅ 이미지 지연 로딩
            />
        </div>
    );
}, (prevProps, nextProps) => {
    // ✅ 커스텀 비교 함수 - skill이 같으면 리렌더 안 함
    return prevProps.skill.id === nextProps.skill.id;
});