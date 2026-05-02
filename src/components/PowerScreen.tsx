import { useCallback, useRef, useState } from "react";

const HEARTBEAT_MS = 1e3;

type PowerScreenProps = {
    onPowerOn: () => void;
};

export default function PowerScreen({ onPowerOn }: PowerScreenProps) {
    const [isOn, setIsOn] = useState(false);
    const beepRef = useRef<HTMLAudioElement | null>(null);

    const handlePowerOn = useCallback(() => {
        if (isOn) return;
        setIsOn(true);

        beepRef.current
            ?.play()
            .catch((err) => console.error("power-beep failed:", err));

        window.setTimeout(onPowerOn, HEARTBEAT_MS);
    }, [isOn, onPowerOn]);

    return (
        <button
            type="button"
            aria-label="Power on"
            onClick={handlePowerOn}
            className="fixed inset-0 z-50 flex items-center justify-center gap-5 bg-black cursor-pointer"
        >
            <span
                aria-hidden
                className={`block w-7 h-7 bg-white`}
                style={{
                    WebkitMaskImage: `url("${import.meta.env.BASE_URL}icons/power.svg")`,
                    maskImage: `url("${import.meta.env.BASE_URL}icons/power.svg")`,
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                }}
            />
            <span
                aria-hidden
                className="block w-0.75 h-6 rounded-xs"
                style={{
                    backgroundColor: isOn ? "#3aff5a" : "#ff2a2a",
                    boxShadow: isOn
                        ? "0 0 8px 1px rgba(58, 255, 90, 0.85)"
                        : "0 0 8px 1px rgba(255, 42, 42, 0.85)",
                }}
            />
            <audio
                ref={beepRef}
                src={`${import.meta.env.BASE_URL}sounds/power-beep.mp3`}
                preload="auto"
            />
        </button>
    );
}
