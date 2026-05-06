import type { XmbCategory } from "../lib/xmbMenu";
import type { XmbLayout } from "../lib/xmbLayouts";
import XmbIcon from "./XmbIcon";

const ITEM_TRANSITION = "transform 220ms ease-out, opacity 220ms ease-out";

type XmbItemListProps = {
    layout: XmbLayout;
    category: XmbCategory;
    itemIndex: number;
    hidden: boolean;
    onSelect: (index: number) => void;
};

export default function XmbItemList({
    layout: L,
    category,
    itemIndex,
    hidden,
    onSelect,
}: XmbItemListProps) {
    const aboveBarGap = 2 * L.itemOffsetY - L.itemSpacing;

    return (
        <div
            className="absolute"
            style={{
                left: `${L.anchorLeftVw}vw`,
                top: `calc(${L.anchorTopVh}vh + ${L.itemOffsetY}px)`,
                opacity: hidden ? 0 : 1,
                transition: hidden ? "none" : "opacity 200ms ease",
            }}
        >
            {category.items.map((item, i) => {
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
                        onClick={() => onSelect(i)}
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
                                    textShadow: "0 1px 2px rgba(0,0,0,0.55)",
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
    );
}
