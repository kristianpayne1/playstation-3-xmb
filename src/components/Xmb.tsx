import { useEffect, useState, useSyncExternalStore } from "react";
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

    const [categoryIndex, setCategoryIndex] = useState(1);
    const [itemIndex, setItemIndex] = useState(4);

    const categoryCount = XMB_MENU.length;
    const activeCategory = XMB_MENU[categoryIndex];
    const itemCount = activeCategory.items.length;

    const horizontal = useSpring({
        x: -categoryIndex * L.categorySpacing,
        config: SPRING_CONFIG,
    });

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                setCategoryIndex((i) => {
                    const next = Math.max(0, i - 1);
                    if (next !== i) setItemIndex(0);
                    return next;
                });
            } else if (e.key === "ArrowRight") {
                setCategoryIndex((i) => {
                    const next = Math.min(categoryCount - 1, i + 1);
                    if (next !== i) setItemIndex(0);
                    return next;
                });
            } else if (e.key === "ArrowUp") {
                setItemIndex((i) => Math.max(0, i - 1));
            } else if (e.key === "ArrowDown") {
                setItemIndex((i) => Math.min(itemCount - 1, i + 1));
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [categoryCount, itemCount]);

    return (
        <div className="fixed inset-0 z-30 pointer-events-none text-white font-rodin select-none overflow-hidden">
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
                                if (i !== itemIndex) setItemIndex(i);
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
        </div>
    );
}
