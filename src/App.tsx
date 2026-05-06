import useControls from "./hooks/useControls";
import useBootSequence from "./hooks/useBootSequence";
import Scene from "./components/Scene";
import BootStages from "./components/BootStages";

function App() {
    const { setBrightness, setOpacity } = useControls();
    const boot = useBootSequence({ setBrightness, setOpacity });

    return (
        <>
            <Scene blurred={boot.blurred} />
            <BootStages {...boot} />
        </>
    );
}

export default App;
