import { useEffect } from "react";
import { easings, useSpring } from "@react-spring/web";
import { Canvas } from "@react-three/fiber";
import Wave from "./components/Wave";
import RightPanel from "./components/RightPanel";
import useControls from "./hooks/useControls";
import Camera from "./components/Camera";

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
        api.start({
            from: { brightness: 0.0, opacity: 0.0 },
            to: { brightness: 1.0, opacity: 0.5 },
            config: { duration: 5000, easing: easings.easeInOutSine },
            onChange: ({ value }) => {
                setBrightness(value.brightness);
                setOpacity(value.opacity);
            },
        });
    }, [api, setBrightness, setOpacity]);

    return (
        <>
            <main className="h-screen">
                <Canvas className={`xmb-theme-bg-${theme}`}>
                    <Camera />
                    <Wave {...{ color, resolution, length, opacity }} />
                </Canvas>
            </main>
            <RightPanel />
        </>
    );
}

export default App;
