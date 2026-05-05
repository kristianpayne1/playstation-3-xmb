import { useEffect, useState } from "react";
import { animated, easings, useSpring } from "@react-spring/web";
import { XMB_MENU } from "../lib/xmbMenu";
import XmbIcon from "./XmbIcon";

const CATEGORY_SPACING = 160;
const ITEM_SPACING = 56;
const CATEGORY_ICON_SIZE = 64;
const ITEM_ICON_SIZE = 36;
const ACTIVE_ITEM_ICON_SIZE = 44;
const ITEM_OFFSET_Y = 100;
const ABOVE_BAR_GAP = 2 * ITEM_OFFSET_Y - ITEM_SPACING;

const ANCHOR_LEFT_VW = 26;
const ANCHOR_TOP_VH = 38;

const SPRING_CONFIG = { duration: 220, easing: easings.easeOutSine };
const ITEM_TRANSITION = "transform 220ms ease-out, opacity 220ms ease-out";

export default function Xmb() {
    const [categoryIndex, setCategoryIndex] = useState(1);
    const [itemIndex, setItemIndex] = useState(4);

    const categoryCount = XMB_MENU.length;
    const activeCategory = XMB_MENU[categoryIndex];
    const itemCount = activeCategory.items.length;

    const horizontal = useSpring({
        x: -categoryIndex * CATEGORY_SPACING,
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
                    left: `${ANCHOR_LEFT_VW}vw`,
                    top: `${ANCHOR_TOP_VH}vh`,
                    transform: horizontal.x.to(
                        (x) =>
                            `translate(calc(${x}px - ${CATEGORY_SPACING / 2}px), -50%)`,
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
                            style={{ width: CATEGORY_SPACING }}
                            aria-label={cat.label}
                            aria-current={active ? "true" : undefined}
                        >
                            <XmbIcon
                                icon={cat.icon}
                                size={CATEGORY_ICON_SIZE}
                                active={active}
                            />
                            <span
                                className="mt-3 text-[13px] tracking-wider whitespace-nowrap"
                                style={{
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
                    left: `${ANCHOR_LEFT_VW}vw`,
                    top: `calc(${ANCHOR_TOP_VH}vh + ${ITEM_OFFSET_Y}px)`,
                }}
            >
                {activeCategory.items.map((item, i) => {
                    const active = i === itemIndex;
                    const distance = Math.abs(i - itemIndex);
                    const fade = active
                        ? 1
                        : Math.max(0.35, 0.8 - distance * 0.1);
                    const iconSize = active
                        ? ACTIVE_ITEM_ICON_SIZE
                        : ITEM_ICON_SIZE;
                    const baseY = (i - itemIndex) * ITEM_SPACING;
                    const y = i < itemIndex ? baseY - ABOVE_BAR_GAP : baseY;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                if (i !== itemIndex) setItemIndex(i);
                            }}
                            aria-label={item.label}
                            aria-current={active ? "true" : undefined}
                            className="absolute flex items-center gap-5 pointer-events-auto cursor-pointer bg-transparent border-0 p-0 text-left"
                            style={{
                                top: 0,
                                left: 0,
                                transform: `translate(-${ACTIVE_ITEM_ICON_SIZE / 2}px, calc(-50% + ${y}px))`,
                                opacity: fade,
                                transition: ITEM_TRANSITION,
                            }}
                        >
                            <div
                                className="flex items-center justify-center shrink-0"
                                style={{ width: ACTIVE_ITEM_ICON_SIZE }}
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
                                        fontSize: active ? 22 : 16,
                                        textShadow:
                                            "0 1px 2px rgba(0,0,0,0.55)",
                                        transition: "font-size 200ms ease",
                                    }}
                                >
                                    {item.label}
                                </span>
                                {active && item.description && (
                                    <span
                                        className="mt-1 text-[12px] opacity-80 whitespace-nowrap"
                                        style={{
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
