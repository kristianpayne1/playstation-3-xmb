import { useEffect, useState } from "react";
import XmbAnalogClock from "./XmbAnalogClock";
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

export default function XmbStatusBar({ friendsOnline = 0 }: XmbStatusBarProps) {
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
        <div className="absolute inset-ring inset-ring-white/10 w-90 compact:w-50 justify-between -right-1 top-[8vh] compact:top-[5vh] flex items-center gap-4 text-white whitespace-nowrap leading-none border border-white/20 rounded-sm text-lg/1 compact:text-sm px-4.5 pr-20 py-2 compact:px-3.5 compact:py-1.75 xmb-shadow">
            <span className="flex items-center gap-1.5">
                <XmbIcon
                    icon="user.svg"
                    className="w-4.5 h-4.5 compact:w-3.5 compact:h-3.5"
                />
                <span className="text-trim">{friendsOnline}</span>
            </span>
            <div className="flex gap-4 items-center">
                <span className="text-trim">{formatDateTime(now)}</span>
                <XmbAnalogClock
                    time={now}
                    className="w-5 h-5 compact:w-4 compact:h-4"
                />
            </div>
        </div>
    );
}
