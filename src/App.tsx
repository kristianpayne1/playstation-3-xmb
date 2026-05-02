import { useEffect, useRef, useState } from "react";
import { easings, useSpring } from "@react-spring/web";
import { Canvas } from "@react-three/fiber";
import Wave from "./components/Wave";
import useControls from "./hooks/useControls";
import Camera from "./components/Camera";
import PowerScreen from "./components/PowerScreen";

function App() {
    const {
        theme,
        color,
        resolution,
        length,
        brightness,
        opacity,
        setBrightness,
        setOpacity,
    } = useControls();
    const [powered, setPowered] = useState(false);
    const orchestraRef = useRef<HTMLAudioElement | null>(null);
    const [, api] = useSpring(() => ({
        from: { brightness: 0.0, opacity: 0.0 },
    }));

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--xmb-brightness",
            brightness.toString(),
        );
    }, [brightness]);

    useEffect(() => {
        if (!powered) return;
        if (orchestraRef.current) {
            orchestraRef.current.volume = 0.5;
            orchestraRef.current
                .play()
                .catch((err) => console.error("orchestra-tuning failed:", err));
        }
        api.start({
            from: { brightness: 0.0, opacity: 0.0 },
            to: { brightness: 1.0, opacity: 0.5 },
            config: { duration: 8000, easing: easings.easeInOutSine },
            onChange: ({ value }) => {
                setBrightness(value.brightness);
                setOpacity(value.opacity);
            },
        });
    }, [powered, api, setBrightness, setOpacity]);

    return (
        <>
            <main className="h-screen">
                <Canvas className={`xmb-theme-bg-${theme}`}>
                    <Camera />
                    <Wave {...{ color, resolution, length, opacity }} />
                </Canvas>
            </main>
            {!powered && <PowerScreen onPowerOn={() => setPowered(true)} />}
            <audio
                ref={orchestraRef}
                src={`${import.meta.env.BASE_URL}sounds/orchestra-tuning.mp3`}
                preload="auto"
            />
        </>
    );
}

export default App;
