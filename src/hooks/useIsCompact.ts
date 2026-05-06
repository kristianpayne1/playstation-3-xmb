import { useSyncExternalStore } from "react";

const BREAKPOINT_W = 640;
const BREAKPOINT_H = 500;

const subscribe = (cb: () => void) => {
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
};
const getSnapshot = () =>
    window.innerWidth < BREAKPOINT_W || window.innerHeight < BREAKPOINT_H;
const getServerSnapshot = () => false;

export default function useIsCompact() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
