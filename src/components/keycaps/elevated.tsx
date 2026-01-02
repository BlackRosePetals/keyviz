import { useKeyStyle } from "@/stores/key_style";
import { motion } from "motion/react";
import type { KeycapProps } from ".";
import { KeycapBase } from "./base";
import { easeInOutExpo } from "@/lib/utils";

export const ElevatedKeycap = ({ keyData, isPressed }: KeycapProps) => {
    const { container, text, border, modifier } = useKeyStyle();

    const bgColor = keyData.isModifier() && modifier.highlight ? modifier.color : container.color;
    const secondaryColor = keyData.isModifier() && modifier.highlight ? modifier.secondaryColor : container.secondaryColor;
    const textColor = keyData.isModifier() && modifier.highlight ? modifier.textColor : text.color;
    const borderColor = keyData.isModifier() && modifier.highlight ? modifier.borderColor : border.color;

    return (
        <div
            style={{
                position: "relative",
                height: text.size * 2.5,
                minWidth: text.size * 2.25,
            }}
        >
            <motion.div
                animate={{ y: isPressed ? text.size * 0.25 : 0 }}
                transition={{ ease: easeInOutExpo }}
                style={{
                    zIndex: 2,
                    position: "relative",
                    height: text.size * 2.25,

                    paddingInline: text.size * (border.radius < 0.75 ? 0.5 : (0.5 + border.radius - 0.75)),
                    paddingBlock: text.size * 0.4,

                    fontSize: text.size,
                    color: textColor,

                    borderStyle: "solid",
                    borderWidth: border.enabled ? border.width : 0,
                    borderColor: container.useGradient ? "transparent" : borderColor,
                    borderRadius: border.radius * (text.size * 1.25),

                    background: container.useGradient
                        ? `linear-gradient(oklch(from ${bgColor} clamp(0, calc(l + 0.2), 1) c h), ${bgColor}) padding-box, 
                           linear-gradient(oklch(from ${borderColor} clamp(0, calc(l + 0.4), 1) c h), oklch(from ${borderColor} clamp(0, calc(l + 0.2), 1) c h), ${borderColor}) border-box`
                        : bgColor,
                }}
            >
                <KeycapBase keyData={keyData} />
            </motion.div>
            <div
                style={{
                    position: "absolute",
                    height: text.size * 2.25,
                    width: "100%",
                    bottom: 0,
                    zIndex: 1,
                    borderStyle: "solid",
                    borderWidth: border.enabled ? border.width : 0,
                    borderColor: borderColor,
                    borderRadius: border.radius * (text.size * 1.25),

                    background: container.useGradient
                        ? `linear-gradient(oklch(from ${secondaryColor} clamp(0, calc(l - 0.2), 1) c h) 70%, ${secondaryColor} 100%)`
                        : secondaryColor,
                }}
            />
        </div>
    );
};