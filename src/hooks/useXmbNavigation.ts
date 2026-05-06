import { useCallback, useRef, useState } from "react";

const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

type Options = {
    itemCounts: number[];
    initialCategory?: number;
    initialItem?: number;
    onChange?: () => void;
};

export default function useXmbNavigation({
    itemCounts,
    initialCategory = 0,
    initialItem = 0,
    onChange,
}: Options) {
    const [categoryIndex, setCategoryIndex] = useState(initialCategory);
    const [itemIndex, setItemIndex] = useState(initialItem);

    const categoryRef = useRef(categoryIndex);
    const itemRef = useRef(itemIndex);
    categoryRef.current = categoryIndex;
    itemRef.current = itemIndex;

    const itemCountsRef = useRef(itemCounts);
    itemCountsRef.current = itemCounts;

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const setCategory = useCallback((target: number) => {
        const next = clamp(target, 0, itemCountsRef.current.length - 1);
        if (next === categoryRef.current) return;
        setCategoryIndex(next);
        setItemIndex(0);
        onChangeRef.current?.();
    }, []);

    const setItem = useCallback((target: number) => {
        const max = itemCountsRef.current[categoryRef.current] - 1;
        const next = clamp(target, 0, max);
        if (next === itemRef.current) return;
        setItemIndex(next);
        onChangeRef.current?.();
    }, []);

    const stepCategory = useCallback(
        (delta: number) => setCategory(categoryRef.current + delta),
        [setCategory],
    );
    const stepItem = useCallback(
        (delta: number) => setItem(itemRef.current + delta),
        [setItem],
    );

    return {
        categoryIndex,
        itemIndex,
        categoryRef,
        itemRef,
        setCategory,
        setItem,
        stepCategory,
        stepItem,
    };
}
