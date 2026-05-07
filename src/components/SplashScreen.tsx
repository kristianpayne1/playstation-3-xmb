import { useEffect, useState } from "react";
import { animated, easings, useSpring } from "@react-spring/web";

const DELAY_MS = 3000;
const FADE_IN_MS = 1000;
const HOLD_MS = 2000;
const FADE_OUT_MS = 500;

type Phase = "hidden" | "revealed" | "fading-out" | "done";

type SplashScreenProps = {
    onFadeOutStart: () => void;
    onComplete: () => void;
};

export default function SplashScreen({
    onFadeOutStart,
    onComplete,
}: SplashScreenProps) {
    const [phase, setPhase] = useState<Phase>("hidden");

    useEffect(() => {
        const timers = [
            window.setTimeout(() => setPhase("revealed"), DELAY_MS),
            window.setTimeout(
                () => {
                    setPhase("fading-out");
                    onFadeOutStart();
                },
                DELAY_MS + FADE_IN_MS + HOLD_MS,
            ),
            window.setTimeout(
                () => {
                    setPhase("done");
                    onComplete();
                },
                DELAY_MS + FADE_IN_MS + HOLD_MS + FADE_OUT_MS,
            ),
        ];
        return () => timers.forEach(window.clearTimeout);
    }, [onFadeOutStart, onComplete]);

    const reveal = useSpring({
        from: { value: -30 },
        to: { value: phase === "hidden" ? -30 : 130 },
        config: { duration: FADE_IN_MS, easing: easings.easeOutSine },
    });

    const fade = useSpring({
        from: { opacity: 1 },
        to: { opacity: phase === "fading-out" ? 0 : 1 },
        config: { duration: FADE_OUT_MS, easing: easings.easeOutSine },
    });

    if (phase === "done") return null;

    const logoUrl = `${import.meta.env.BASE_URL}icons/logo.svg`;
    const maskGradient = (r: number) =>
        `linear-gradient(90deg, white 0%, white ${r}%, transparent ${r + 20}%)`;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-end pr-[12vw] pointer-events-none">
            <animated.div
                className="grid grid-cols-[auto_auto] items-start gap-x-5 sm:gap-x-10 text-white"
                style={{
                    opacity: fade.opacity,
                    WebkitMaskImage: reveal.value.to(maskGradient),
                    maskImage: reveal.value.to(maskGradient),
                }}
            >
                <span
                    aria-hidden
                    className="block w-14 h-14 sm:w-25 sm:h-25 bg-white mask-no-repeat mask-center mask-contain mask-(--logo-mask) m-1"
                    style={
                        {
                            "--logo-mask": `url("${logoUrl}")`,
                        } as React.CSSProperties
                    }
                />
                <span className="font-ps text-[56px] sm:text-[96px] leading-none tracking-tight">
                    PS3
                </span>
                <span className="font-rodin col-start-2 mt-1 justify-self-center whitespace-nowrap font-rodin text-[8px] sm:text-[11px] tracking-[0.2em] opacity-90">
                    PlayStation 3
                </span>
            </animated.div>
        </div>
    );
}
