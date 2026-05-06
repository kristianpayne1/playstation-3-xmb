import { useCallback, useEffect, useRef, useState } from "react";
import { easings, useSpring } from "@react-spring/web";

const RAMP_MS = 8000;
const ORCHESTRA_VOLUME = 0.5;

type Options = {
    setBrightness: (v: number) => void;
    setOpacity: (v: number) => void;
};

export default function useBootSequence({
    setBrightness,
    setOpacity,
}: Options) {
    const [powered, setPowered] = useState(false);
    const [splashing, setSplashing] = useState(false);
    const [blurred, setBlurred] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        const audio = new Audio(
            `${import.meta.env.BASE_URL}sounds/orchestra-tuning.mp3`,
        );
        audio.preload = "auto";
        audio.volume = ORCHESTRA_VOLUME;
        audioRef.current = audio;
        return () => {
            audio.pause();
            audio.src = "";
        };
    }, []);

    const [, api] = useSpring(() => ({
        from: { brightness: 0, opacity: 0 },
    }));

    const powerOn = useCallback(() => {
        setPowered(true);
        setSplashing(true);
        setBlurred(true);
        audioRef.current
            ?.play()
            .catch((err) => console.error("orchestra-tuning failed:", err));
        api.start({
            from: { brightness: 0, opacity: 0 },
            to: { brightness: 1, opacity: 0.5 },
            config: { duration: RAMP_MS, easing: easings.easeInOutSine },
            onChange: ({ value }) => {
                setBrightness(value.brightness);
                setOpacity(value.opacity);
            },
        });
    }, [api, setBrightness, setOpacity]);

    const onSplashFadeOutStart = useCallback(() => setBlurred(false), []);
    const onSplashComplete = useCallback(() => setSplashing(false), []);

    return {
        powered,
        splashing,
        blurred,
        powerOn,
        onSplashFadeOutStart,
        onSplashComplete,
    };
}

export type BootSequence = ReturnType<typeof useBootSequence>;
