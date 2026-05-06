import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
import { animated, easings, useSpring } from "@react-spring/web";
import { XMB_MENU } from "../lib/xmbMenu";
import XmbIcon from "./XmbIcon";

const COMPACT_BREAKPOINT_W = 640;
const COMPACT_BREAKPOINT_H = 500;

const LAYOUTS = {
    desktop: {
        categorySpacing: 160,
        itemSpacing: 56,
        categoryIconSize: 64,
        itemIconSize: 36,
        activeItemIconSize: 44,
        itemOffsetY: 100,
        itemGap: 20,
        anchorLeftVw: 26,
        anchorTopVh: 38,
        categoryLabelPx: 13,
        activeItemLabelPx: 22,
        itemLabelPx: 16,
        descriptionPx: 12,
    },
    mobile: {
        categorySpacing: 86,
        itemSpacing: 46,
        categoryIconSize: 40,
        itemIconSize: 26,
        activeItemIconSize: 32,
        itemOffsetY: 70,
        itemGap: 12,
        anchorLeftVw: 18,
        anchorTopVh: 34,
        categoryLabelPx: 11,
        activeItemLabelPx: 17,
        itemLabelPx: 13,
        descriptionPx: 11,
    },
} as const;

const SPRING_CONFIG = { duration: 220, easing: easings.easeOutSine };
const ITEM_TRANSITION = "transform 220ms ease-out, opacity 220ms ease-out";

const subscribeToResize = (cb: () => void) => {
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
};
const getIsCompact = () =>
    window.innerWidth < COMPACT_BREAKPOINT_W ||
    window.innerHeight < COMPACT_BREAKPOINT_H;
const getServerCompact = () => false;

function useIsCompact() {
    return useSyncExternalStore(
        subscribeToResize,
        getIsCompact,
        getServerCompact,
    );
}

export default function Xmb() {
    const isCompact = useIsCompact();
    const L = isCompact ? LAYOUTS.mobile : LAYOUTS.desktop;
    const aboveBarGap = 2 * L.itemOffsetY - L.itemSpacing;

    const [categoryIndex, setCategoryIndex] = useState(0);
    const [itemIndex, setItemIndex] = useState(2);

    const categoryCount = XMB_MENU.length;
    const activeCategory = XMB_MENU[categoryIndex];
    const itemCount = activeCategory.items.length;

    const [itemsHidden, setItemsHidden] = useState(false);
    const hasMountedRef = useRef(false);
    const horizontal = useSpring({
        x: -categoryIndex * L.categorySpacing,
        config: SPRING_CONFIG,
        onRest: () => {
            hasMountedRef.current = true;
            setItemsHidden(false);
        },
    });

    const entrance = useSpring({
        from: { opacity: 0, scale: 1.1 },
        to: { opacity: 1, scale: 1 },
        config: { duration: 400, easing: easings.easeOutSine },
    });

    useLayoutEffect(() => {
        if (hasMountedRef.current) setItemsHidden(true);
    }, [categoryIndex]);

    const categoryIndexRef = useRef(categoryIndex);
    const itemIndexRef = useRef(itemIndex);
    categoryIndexRef.current = categoryIndex;
    itemIndexRef.current = itemIndex;

    const audioCtxRef = useRef<AudioContext | null>(null);
    const tickBufferRef = useRef<AudioBuffer | null>(null);
    useEffect(() => {
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const url = `${import.meta.env.BASE_URL}sounds/menu-tick.mp3`;
        fetch(url)
            .then((r) => r.arrayBuffer())
            .then((buf) => ctx.decodeAudioData(buf))
            .then((audioBuffer) => {
                tickBufferRef.current = audioBuffer;
            })
            .catch((err) => console.error("menu-tick load failed:", err));
        return () => {
            ctx.close().catch(() => {});
        };
    }, []);
    const playTick = useCallback(() => {
        const ctx = audioCtxRef.current;
        const buffer = tickBufferRef.current;
        if (!ctx || !buffer) return;
        if (ctx.state === "suspended") ctx.resume().catch(() => {});
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
    }, []);

    const wheelStepX = L.categorySpacing;
    const wheelStepY = L.itemSpacing;

    useEffect(() => {
        const clamp = (v: number, lo: number, hi: number) =>
            Math.max(lo, Math.min(hi, v));

        const setCategory = (target: number) => {
            const cur = categoryIndexRef.current;
            const next = clamp(target, 0, categoryCount - 1);
            if (next === cur) return;
            setCategoryIndex(next);
            setItemIndex(0);
            playTick();
        };
        const setItem = (target: number) => {
            const cur = itemIndexRef.current;
            const next = clamp(target, 0, itemCount - 1);
            if (next === cur) return;
            setItemIndex(next);
            playTick();
        };
        const stepCategory = (delta: number) =>
            setCategory(categoryIndexRef.current + delta);
        const stepItem = (delta: number) =>
            setItem(itemIndexRef.current + delta);

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") stepCategory(-1);
            else if (e.key === "ArrowRight") stepCategory(1);
            else if (e.key === "ArrowUp") stepItem(-1);
            else if (e.key === "ArrowDown") stepItem(1);
        };

        const wheelAccum = { x: 0, y: 0 };
        let wheelResetTimer: number | null = null;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            wheelAccum.x += e.deltaX;
            wheelAccum.y += e.deltaY;
            const ax = Math.abs(wheelAccum.x);
            const ay = Math.abs(wheelAccum.y);
            if (ax >= ay) {
                const steps = Math.trunc(wheelAccum.x / wheelStepX);
                if (steps !== 0) {
                    stepCategory(steps);
                    wheelAccum.x -= steps * wheelStepX;
                    wheelAccum.y = 0;
                }
            } else {
                const steps = Math.trunc(wheelAccum.y / wheelStepY);
                if (steps !== 0) {
                    stepItem(steps);
                    wheelAccum.y -= steps * wheelStepY;
                    wheelAccum.x = 0;
                }
            }
            if (wheelResetTimer !== null) window.clearTimeout(wheelResetTimer);
            wheelResetTimer = window.setTimeout(() => {
                wheelAccum.x = 0;
                wheelAccum.y = 0;
            }, 200);
        };

        const AXIS_LOCK_PX = 10;
        const swipeStepX = wheelStepX;
        const swipeStepY = wheelStepY;
        let touchStart: { x: number; y: number } | null = null;
        let touchAxis: "x" | "y" | null = null;
        let startC = 0;
        let startI = 0;
        const onTouchStart = (e: TouchEvent) => {
            const t = e.touches[0];
            if (!t) return;
            touchStart = { x: t.clientX, y: t.clientY };
            touchAxis = null;
            startC = categoryIndexRef.current;
            startI = itemIndexRef.current;
        };
        const onTouchMove = (e: TouchEvent) => {
            if (!touchStart) return;
            const t = e.touches[0];
            if (!t) return;
            const dx = t.clientX - touchStart.x;
            const dy = t.clientY - touchStart.y;
            if (touchAxis === null) {
                const ax = Math.abs(dx);
                const ay = Math.abs(dy);
                if (ax < AXIS_LOCK_PX && ay < AXIS_LOCK_PX) return;
                touchAxis = ax > ay ? "x" : "y";
            }
            e.preventDefault();
            if (touchAxis === "x") {
                const delta = Math.trunc(-dx / swipeStepX);
                setCategory(startC + delta);
            } else {
                const delta = Math.trunc(-dy / swipeStepY);
                setItem(startI + delta);
            }
        };
        const onTouchEnd = () => {
            touchStart = null;
            touchAxis = null;
        };

        window.addEventListener("keydown", onKey);
        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        window.addEventListener("touchcancel", onTouchEnd, { passive: true });
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchEnd);
            if (wheelResetTimer !== null) window.clearTimeout(wheelResetTimer);
        };
    }, [categoryCount, itemCount, wheelStepX, wheelStepY, playTick]);

    return (
        <animated.div
            className="fixed inset-0 z-30 pointer-events-none text-white font-rodin select-none overflow-hidden"
            style={{
                opacity: entrance.opacity,
                transform: entrance.scale.to((s) => `scale(${s})`),
            }}
        >
            <animated.div
                className="absolute flex items-start"
                style={{
                    left: `${L.anchorLeftVw}vw`,
                    top: `${L.anchorTopVh}vh`,
                    transform: horizontal.x.to(
                        (x) =>
                            `translate(calc(${x}px - ${L.categorySpacing / 2}px), -50%)`,
                    ),
                }}
            >
                {XMB_MENU.map((cat, i) => {
                    const active = i === categoryIndex;
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                                if (i !== categoryIndex) {
                                    setCategoryIndex(i);
                                    setItemIndex(0);
                                    playTick();
                                }
                            }}
                            className="flex flex-col items-center pointer-events-auto cursor-pointer bg-transparent border-0 p-0"
                            style={{ width: L.categorySpacing }}
                            aria-label={cat.label}
                            aria-current={active ? "true" : undefined}
                        >
                            <XmbIcon
                                icon={cat.icon}
                                size={L.categoryIconSize}
                                active={active}
                            />
                            <span
                                className="mt-3 tracking-wider whitespace-nowrap"
                                style={{
                                    fontSize: L.categoryLabelPx,
                                    opacity: active ? 1 : 0,
                                    animation: active
                                        ? "xmb-pulse 1.6s ease-in-out infinite"
                                        : "none",
                                    textShadow: "0 1px 2px rgba(0,0,0,0.55)",
                                }}
                            >
                                {cat.label}
                            </span>
                        </button>
                    );
                })}
            </animated.div>

            <div
                className="absolute"
                style={{
                    left: `${L.anchorLeftVw}vw`,
                    top: `calc(${L.anchorTopVh}vh + ${L.itemOffsetY}px)`,
                    opacity: itemsHidden ? 0 : 1,
                    transition: itemsHidden ? "none" : "opacity 200ms ease",
                }}
            >
                {activeCategory.items.map((item, i) => {
                    const active = i === itemIndex;
                    const distance = Math.abs(i - itemIndex);
                    const fade = active
                        ? 1
                        : Math.max(0.35, 0.8 - distance * 0.1);
                    const iconSize = active
                        ? L.activeItemIconSize
                        : L.itemIconSize;
                    const baseY = (i - itemIndex) * L.itemSpacing;
                    const y = i < itemIndex ? baseY - aboveBarGap : baseY;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                if (i !== itemIndex) {
                                    setItemIndex(i);
                                    playTick();
                                }
                            }}
                            aria-label={item.label}
                            aria-current={active ? "true" : undefined}
                            className="absolute flex items-center pointer-events-auto cursor-pointer bg-transparent border-0 p-0 text-left"
                            style={{
                                top: 0,
                                left: 0,
                                gap: L.itemGap,
                                transform: `translate(-${L.activeItemIconSize / 2}px, calc(-50% + ${y}px))`,
                                opacity: fade,
                                transition: ITEM_TRANSITION,
                            }}
                        >
                            <div
                                className="flex items-center justify-center shrink-0"
                                style={{ width: L.activeItemIconSize }}
                            >
                                <XmbIcon
                                    icon={item.icon}
                                    size={iconSize}
                                    active={active}
                                />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span
                                    className="whitespace-nowrap"
                                    style={{
                                        fontSize: active
                                            ? L.activeItemLabelPx
                                            : L.itemLabelPx,
                                        textShadow:
                                            "0 1px 2px rgba(0,0,0,0.55)",
                                        transition: "font-size 200ms ease",
                                    }}
                                >
                                    {item.label}
                                </span>
                                {active && item.description && (
                                    <span
                                        className="mt-1 opacity-80 whitespace-nowrap"
                                        style={{
                                            fontSize: L.descriptionPx,
                                            textShadow:
                                                "0 1px 2px rgba(0,0,0,0.55)",
                                        }}
                                    >
                                        {item.description}
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </animated.div>
    );
}
