import { useEffect, useState } from "react";
import XmbIcon from "./XmbIcon";

const formatDateTime = (d: Date) => {
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${day}/${month} ${hh}:${mm}`;
};

type XmbStatusBarProps = {
    friendsOnline?: number;
};

export default function XmbStatusBar({
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
        <div className="absolute -right-0.75 top-[4vh] compact:top-[3vh] flex items-center gap-4 text-white whitespace-nowrap leading-none border border-white/20 rounded-md text-lg compact:text-sm px-4.5 py-2.25 compact:px-3.5 compact:py-1.75 xmb-status-shadow">
            <span className="flex items-center gap-1.5">
                <XmbIcon
                    icon="user.svg"
                    className="w-4.5 h-4.5 compact:w-3.5 compact:h-3.5"
                />
                <span>{friendsOnline}</span>
            </span>
            <span>{formatDateTime(now)}</span>
        </div>
    );
}
