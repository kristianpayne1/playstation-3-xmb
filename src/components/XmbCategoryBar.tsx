import { animated, type SpringValue } from "@react-spring/web";
import { XMB_MENU } from "../lib/xmbMenu";
import XmbIcon from "./XmbIcon";

type XmbCategoryBarProps = {
    categoryIndex: number;
    categorySpacing: number;
    xValue: SpringValue<number>;
    onSelect: (index: number) => void;
};

export default function XmbCategoryBar({
    categoryIndex,
    categorySpacing,
    xValue,
    onSelect,
}: XmbCategoryBarProps) {
    return (
        <animated.div
            className="absolute flex items-start left-(--xmb-anchor-left) top-(--xmb-anchor-top)"
            style={{
                transform: xValue.to(
                    (x) =>
                        `translate(calc(${x}px - ${categorySpacing / 2}px), -50%)`,
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
                        style={{ width: categorySpacing }}
                        aria-label={cat.label}
                        aria-current={active ? "true" : undefined}
                    >
                        <XmbIcon
                            icon={cat.icon}
                            className="w-16 h-16 compact:w-10 compact:h-10"
                            active={active}
                        />
                        <span
                            className={`mt-3 tracking-wider whitespace-nowrap text-[13px] compact:text-[11px] xmb-shadow ${
                                active
                                    ? "opacity-100 animate-xmb-pulse"
                                    : "opacity-0"
                            }`}
                        >
                            {cat.label}
                        </span>
                    </button>
                );
            })}
        </animated.div>
    );
}
