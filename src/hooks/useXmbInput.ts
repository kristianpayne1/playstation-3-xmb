import { type RefObject, useEffect } from "react";

const AXIS_LOCK_PX = 10;
const WHEEL_RESET_MS = 200;

type Options = {
    setCategory: (target: number) => void;
    setItem: (target: number) => void;
    stepCategory: (delta: number) => void;
    stepItem: (delta: number) => void;
    categoryRef: RefObject<number>;
    itemRef: RefObject<number>;
    stepX: number;
    stepY: number;
};

export default function useXmbInput({
    setCategory,
    setItem,
    stepCategory,
    stepItem,
    categoryRef,
    itemRef,
    stepX,
    stepY,
}: Options) {
    useEffect(() => {
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
                const steps = Math.trunc(wheelAccum.x / stepX);
                if (steps !== 0) {
                    stepCategory(steps);
                    wheelAccum.x -= steps * stepX;
                    wheelAccum.y = 0;
                }
            } else {
                const steps = Math.trunc(wheelAccum.y / stepY);
                if (steps !== 0) {
                    stepItem(steps);
                    wheelAccum.y -= steps * stepY;
                    wheelAccum.x = 0;
                }
            }
            if (wheelResetTimer !== null) window.clearTimeout(wheelResetTimer);
            wheelResetTimer = window.setTimeout(() => {
                wheelAccum.x = 0;
                wheelAccum.y = 0;
            }, WHEEL_RESET_MS);
        };

        let touchStart: { x: number; y: number } | null = null;
        let touchAxis: "x" | "y" | null = null;
        let startC = 0;
        let startI = 0;
        const onTouchStart = (e: TouchEvent) => {
            const t = e.touches[0];
            if (!t) return;
            touchStart = { x: t.clientX, y: t.clientY };
            touchAxis = null;
            startC = categoryRef.current;
            startI = itemRef.current;
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
                setCategory(startC + Math.trunc(-dx / stepX));
            } else {
                setItem(startI + Math.trunc(-dy / stepY));
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
    }, [
        setCategory,
        setItem,
        stepCategory,
        stepItem,
        categoryRef,
        itemRef,
        stepX,
        stepY,
    ]);
}
