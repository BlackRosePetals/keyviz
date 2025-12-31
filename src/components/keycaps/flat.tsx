import { motion } from "motion/react";
import { useKeyStyle } from "@/stores/key_style";
import type { KeycapProps } from ".";
import { KeycapBase } from "./base";

export const FlatKeycap = ({ keyData, isPressed }: KeycapProps) => {
    const { container, text, border, modifier } = useKeyStyle();

    const bgColor = keyData.isModifier() && modifier.highlight ? modifier.color : container.color;
    const textColor = keyData.isModifier() && modifier.highlight ? modifier.textColor : text.color;
    const borderColor = keyData.isModifier() && modifier.highlight ? modifier.borderColor : border.color;

    return (
        <motion.div
            animate={{ scale: isPressed ? 0.95 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                height: text.size * 2.5,
                minWidth: text.size * 2.5,

                paddingInline: text.size * (border.radius < 0.75 ? 0.5 : (0.5 + border.radius - 0.75)),
                paddingBlock: text.size * 0.4,

                fontSize: text.size,
                color: textColor,

                borderStyle: "solid",
                borderWidth: border.enabled ? border.width : 0,
                borderColor: borderColor,
                borderRadius: border.radius * (text.size * 1.25),

                background: bgColor.includes(",")
                    ? `linear-gradient(to bottom, ${bgColor})`
                    : bgColor,
            }}
        >
            <KeycapBase keyData={keyData} />
        </motion.div>
    );
};