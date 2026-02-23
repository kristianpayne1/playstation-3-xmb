import { Card, Flex, Button, Separator, Heading } from "@radix-ui/themes";
import Controls from "./Controls";
import useControls, { Theme } from "../hooks/useControls";
import { easings, useSpring } from "@react-spring/web";
import { useCallback } from "react";

function RightPanel() {
    const { open, setOpen, brightness, setBrightness, setTheme } =
        useControls();

    const [, api] = useSpring(() => ({
        from: { brightness: 0.0 },
    }));

    const onThemeChange = useCallback(
        async (theme: Theme) => {
            api.start({
                from: { brightness: brightness },
                to: [{ brightness: 0.0 }, { brightness: 1.0 }],
                config: { duration: 2000, easing: easings.easeInOutSine },
                onChange: ({ value: { brightness } }) => {
                    if (brightness === 0) setTheme(theme);
                    setBrightness(brightness);
                },
            });
        },
        [api, brightness],
    );
    return (
        <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-auto sm:right-5 sm:w-100 max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)] overflow-y-auto overflow-x-hidden">
            <Card>
                <Flex direction="column" gap="5">
                    {open && <Controls onThemeChange={onThemeChange} />}
                    <Flex direction="column" gap="3">
                        {open && <Separator size="4" />}
                        <Button
                            size="3"
                            variant="soft"
                            onClick={() => setOpen(!open)}
                        >
                            {`${open ? "Hide" : "Show"} Controls`}
                        </Button>
                    </Flex>
                </Flex>
            </Card>
        </div>
    );
}

export default RightPanel;
