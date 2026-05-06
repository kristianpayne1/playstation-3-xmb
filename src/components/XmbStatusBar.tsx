import { useEffect, useState } from "react";
import type { XmbLayout } from "../lib/xmbLayouts";
import XmbIcon from "./XmbIcon";

const formatDateTime = (d: Date) => {
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${day}/${month} ${hh}:${mm}`;
};

type XmbStatusBarProps = {
    layout: XmbLayout;
    friendsOnline?: number;
};

export default function XmbStatusBar({
    layout: L,
    friendsOnline = 0,
}: XmbStatusBarProps) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        let timer: number;
        const tick = () => {
            setNow(new Date());
            timer = window.setTimeout(tick, 60000 - (Date.now() % 60000));
        };
        timer = window.setTimeout(tick, 60000 - (Date.now() % 60000));
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <div
            className="absolute flex items-center gap-4 text-white whitespace-nowrap leading-none border border-white/20 rounded-md"
            style={{
                top: `${L.statusTopVh}vh`,
                right: -3,
                fontSize: L.statusFontPx,
                padding: `${L.statusFontPx * 0.5}px ${L.statusFontPx}px`,
                textShadow:
                    "0 1px 1px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.55)",
            }}
        >
            <span className="flex items-center gap-1.5">
                <XmbIcon icon="user.svg" size={L.statusIconSize} />
                <span>{friendsOnline}</span>
            </span>
            <span>{formatDateTime(now)}</span>
        </div>
    );
}
