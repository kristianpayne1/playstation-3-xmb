import type { XmbCategory } from "../lib/xmbMenu";
import XmbIcon from "./XmbIcon";

type XmbItemListProps = {
    category: XmbCategory;
    itemIndex: number;
    itemSpacing: number;
    itemOffsetY: number;
    hidden: boolean;
    onSelect: (index: number) => void;
};

export default function XmbItemList({
    category,
    itemIndex,
    itemSpacing,
    itemOffsetY,
    hidden,
    onSelect,
}: XmbItemListProps) {
    const aboveBarGap = 2 * itemOffsetY - itemSpacing;

    return (
        <div
            className={`absolute left-(--xmb-anchor-left) ${
                hidden
                    ? "opacity-0"
                    : "opacity-100 transition-opacity duration-200 ease-in-out"
            }`}
            style={{
                top: `calc(var(--xmb-anchor-top) + ${itemOffsetY}px)`,
            }}
        >
            {category.items.map((item, i) => {
                const active = i === itemIndex;
                const distance = Math.abs(i - itemIndex);
                const fade = active
                    ? 1
                    : Math.max(0.35, 0.8 - distance * 0.1);
                const baseY = (i - itemIndex) * itemSpacing;
                const y = i < itemIndex ? baseY - aboveBarGap : baseY;
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelect(i)}
                        aria-label={item.label}
                        aria-current={active ? "true" : undefined}
                        className="absolute top-0 left-0 flex items-center pointer-events-auto cursor-pointer bg-transparent border-0 p-0 text-left gap-5 compact:gap-3 transition-[transform,opacity] duration-220 ease-out"
                        style={{
                            transform: `translateY(calc(-50% + ${y}px))`,
                            opacity: fade,
                        }}
                    >
                        <div className="flex items-center justify-center shrink-0 w-11 h-11 compact:w-8 compact:h-8 -ml-5.5 compact:-ml-4">
                            <XmbIcon
                                icon={item.icon}
                                className={
                                    active
                                        ? "w-11 h-11 compact:w-8 compact:h-8"
                                        : "w-9 h-9 compact:w-6.5 compact:h-6.5"
                                }
                                active={active}
                            />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span
                                className={`whitespace-nowrap xmb-shadow transition-[font-size] duration-200 ease-in-out ${
                                    active
                                        ? "text-[22px] compact:text-[17px]"
                                        : "text-base compact:text-[13px]"
                                }`}
                            >
                                {item.label}
                            </span>
                            {active && item.description && (
                                <span className="mt-1 opacity-80 whitespace-nowrap text-xs compact:text-[11px] xmb-shadow">
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
