import { keymaps } from "@/lib/keymaps";
import { useKeyStyle } from "@/stores/key_style";
import type { KeycapProps } from ".";
import { easeInOutExpo } from "@/lib/utils";

export const MinimalKeycap = ({ keyData, isPressed }: KeycapProps) => {
    const { text, container, modifier } = useKeyStyle();
    
    const display = keymaps[keyData.name];
    const color = keyData.isModifier() && modifier.highlight ? modifier.textColor : text.color;
    const textStyle: React.CSSProperties = {
        color,
        lineHeight: 1.2,
        fontSize: text.size,
        textTransform: text.caps,
        gap: ".1em",
    };

    const label = modifier.textVariant === "text-short"
        ? display.shortLabel ?? display.label
        : display.label;

    let child = <>{label}</>;

    if (keyData.isModifier() && container.showIcon && display.icon) {
        const Icon = display.icon;
        if (modifier.textVariant === "icon" || keyData.isArrow()) {
            child = <Icon color={color} size={text.size} />;
        } else {
            child = <>
                <Icon color={color} size={text.size} />
                <div style={{ ...textStyle }}>
                    {label}
                </div>
            </>;
        }
    }

    return (
        <motion.div
            animate={{ scale: isPressed ? 0.95 : 1 }}
            transition={{ ease: easeInOutExpo }}
            className="flex items-center"
            style={textStyle}
        >
            {child}
        </motion.div>
    );
};