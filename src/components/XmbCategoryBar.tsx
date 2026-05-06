import { animated, type SpringValue } from "@react-spring/web";
import { XMB_MENU } from "../lib/xmbMenu";
import type { XmbLayout } from "../lib/xmbLayouts";
import XmbIcon from "./XmbIcon";

type XmbCategoryBarProps = {
    layout: XmbLayout;
    categoryIndex: number;
    xValue: SpringValue<number>;
    onSelect: (index: number) => void;
};

export default function XmbCategoryBar({
    layout: L,
    categoryIndex,
    xValue,
    onSelect,
}: XmbCategoryBarProps) {
    return (
        <animated.div
            className="absolute flex items-start"
            style={{
                left: `${L.anchorLeftVw}vw`,
                top: `${L.anchorTopVh}vh`,
                transform: xValue.to(
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
                        onClick={() => onSelect(i)}
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
    );
}
