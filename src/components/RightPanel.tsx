import { Card, Flex, Button, Separator } from "@radix-ui/themes";
import Controls from "./Controls";
import useControls from "../hooks/useControls";

function RightPanel() {
    const { open, setOpen } = useControls();

    return (
        <div
            className="absolute top-3 left-3 right-3 sm:top-5 sm:left-auto sm:right-5 sm:w-100 max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)] overflow-y-auto overflow-x-hidden"
        >
            <Card>
                <Flex direction="column" gap="5">
                    {open && <Controls />}
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
