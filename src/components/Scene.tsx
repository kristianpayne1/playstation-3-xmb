import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Camera from "./Camera";
import Wave from "./Wave";
import useControls from "../hooks/useControls";

const BLUR_TRANSITION_MS = 500;

type SceneProps = {
    blurred: boolean;
};

export default function Scene({ blurred }: SceneProps) {
    const { theme, color, resolution, length, opacity, brightness } =
        useControls();

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--xmb-brightness",
            brightness.toString(),
        );
    }, [brightness]);

    return (
        <main
            className="h-screen transition-[filter] ease-out"
            style={{
                filter: blurred ? "blur(4px)" : "none",
                transitionDuration: `${BLUR_TRANSITION_MS}ms`,
            }}
        >
            <Canvas className={`xmb-theme-bg-${theme}`}>
                <Camera />
                <Wave {...{ color, resolution, length, opacity }} />
            </Canvas>
        </main>
    );
}
