import { useLayoutEffect, useRef, useState } from "react";
import { animated, easings, useSpring } from "@react-spring/web";
import { XMB_MENU } from "../lib/xmbMenu";
import { XMB_LAYOUTS } from "../lib/xmbLayouts";
import useIsCompact from "../hooks/useIsCompact";
import useTickSound from "../hooks/useTickSound";
import useXmbNavigation from "../hooks/useXmbNavigation";
import useXmbInput from "../hooks/useXmbInput";
import XmbCategoryBar from "./XmbCategoryBar";
import XmbItemList from "./XmbItemList";
import XmbStatusBar from "./XmbStatusBar";

const HORIZONTAL_SPRING = { duration: 220, easing: easings.easeOutSine };
const ENTRANCE_SPRING = { duration: 400, easing: easings.easeOutSine };

export default function Xmb() {
    const isCompact = useIsCompact();
    const layout = isCompact ? XMB_LAYOUTS.mobile : XMB_LAYOUTS.desktop;

    const playTick = useTickSound(
        `${import.meta.env.BASE_URL}sounds/menu-tick.mp3`,
    );

    const {
        categoryIndex,
        itemIndex,
        categoryRef,
        itemRef,
        setCategory,
        setItem,
        stepCategory,
        stepItem,
    } = useXmbNavigation({
        itemCounts: XMB_MENU.map((c) => c.items.length),
        initialCategory: 0,
        initialItem: 2,
        onChange: playTick,
    });

    useXmbInput({
        setCategory,
        setItem,
        stepCategory,
        stepItem,
        categoryRef,
        itemRef,
        stepX: layout.categorySpacing,
        stepY: layout.itemSpacing,
    });

    const [itemsHidden, setItemsHidden] = useState(false);
    const hasMountedRef = useRef(false);
    const horizontal = useSpring({
        x: -categoryIndex * layout.categorySpacing,
        config: HORIZONTAL_SPRING,
        onRest: () => {
            hasMountedRef.current = true;
            setItemsHidden(false);
        },
    });
    useLayoutEffect(() => {
        if (hasMountedRef.current) setItemsHidden(true);
    }, [categoryIndex]);

    const entrance = useSpring({
        from: { opacity: 0, scale: 1.1 },
        to: { opacity: 1, scale: 1 },
        config: ENTRANCE_SPRING,
    });

    return (
        <animated.div
            className="fixed inset-0 z-30 pointer-events-none text-white font-rodin select-none overflow-hidden"
            style={{
                opacity: entrance.opacity,
                transform: entrance.scale.to((s) => `scale(${s})`),
            }}
        >
            <XmbStatusBar layout={layout} />
            <XmbCategoryBar
                layout={layout}
                categoryIndex={categoryIndex}
                xValue={horizontal.x}
                onSelect={setCategory}
            />
            <XmbItemList
                layout={layout}
                category={XMB_MENU[categoryIndex]}
                itemIndex={itemIndex}
                hidden={itemsHidden}
                onSelect={setItem}
            />
        </animated.div>
    );
}
