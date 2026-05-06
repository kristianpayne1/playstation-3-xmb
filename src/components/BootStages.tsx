import type { BootSequence } from "../hooks/useBootSequence";
import PowerScreen from "./PowerScreen";
import SplashScreen from "./SplashScreen";
import Xmb from "./Xmb";

type BootStagesProps = Omit<BootSequence, "blurred">;

export default function BootStages({
    powered,
    splashing,
    powerOn,
    onSplashFadeOutStart,
    onSplashComplete,
}: BootStagesProps) {
    if (!powered) return <PowerScreen onPowerOn={powerOn} />;
    if (splashing)
        return (
            <SplashScreen
                onFadeOutStart={onSplashFadeOutStart}
                onComplete={onSplashComplete}
            />
        );
    return <Xmb />;
}
