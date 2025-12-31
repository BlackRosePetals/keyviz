import { useKeyStyle } from "@/stores/key_style";
import { KeyEvent } from "@/types/event";
import { ElevatedKeycap } from "./elevated";
import { FlatKeycap } from "./flat";
import { MinimalKeycap } from "./minimal";
import { PlasticKeycap } from "./plastic";

export interface KeycapProps {
    keyData: KeyEvent;
    isPressed: boolean;
}

const components = {
    minimal: MinimalKeycap,
    flat: FlatKeycap,
    elevated: ElevatedKeycap,
    plastic: PlasticKeycap,
} as const;

export const Keycap = (props: KeycapProps) => {
    const style = useKeyStyle(state => state.container.style);
    const KeycapComponent = components[style];
    
    return <KeycapComponent {...props} />;
};
