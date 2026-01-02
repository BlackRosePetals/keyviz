import { useKeyStyle } from "@/stores/key_style";
import { motion } from "motion/react";
import { KeycapProps } from ".";
import { KeycapBase } from "./base";
import { easeInOutExpo } from "@/lib/utils";

export const PlasticKeycap = ({ keyData, isPressed }: KeycapProps) => {
    const { container, text, border, modifier } = useKeyStyle();

    const bgColor = keyData.isModifier() && modifier.highlight ? modifier.color : container.color;
    const secondaryBgColor = keyData.isModifier() && modifier.highlight ? modifier.secondaryColor : container.secondaryColor;
    const textColor = keyData.isModifier() && modifier.highlight ? modifier.textColor : text.color;
    const borderColor = keyData.isModifier() && modifier.highlight ? modifier.borderColor : border.color;

    return (
        <div
            style={{
                position: "relative",
                height: text.size * 2.75,
                minWidth: text.size * 2.75,

                width: "100%",
                outlineStyle: "solid",
                outlineWidth: border.enabled ? border.width : 0,
                outlineColor: borderColor,
                borderRadius: border.radius * (text.size * 1.25),

                background: container.useGradient
                    ? `linear-gradient(to bottom right, ${secondaryBgColor}, oklch(from ${secondaryBgColor} clamp(0, calc(l - 0.2), 1) c h))`
                    : secondaryBgColor,
            }}
        >
            <motion.div
                animate={{ y: isPressed ? text.size * 0.15 : 0 }}
                transition={{ ease: easeInOutExpo }}
                style={{
                    height: text.size * 2.2,
                    minWidth: text.size * 2,

                    marginInline: text.size * 0.3,
                    paddingInline: text.size * (border.radius < 0.75 ? 0.5 : (0.5 + border.radius - 0.75)),
                    paddingBlock: text.size * 0.4,

                    fontSize: text.size,
                    color: textColor,

                    borderBottom: `.06em solid ${bgColor}`,
                    borderRadius: border.radius * (text.size * 1.25),

                    background: container.useGradient
                        ? `linear-gradient(to right, oklch(from ${bgColor} clamp(0, calc(l - 0.1), 1) c h), ${bgColor})`
                        : bgColor,
                }}
            >
                <KeycapBase keyData={keyData} />
            </motion.div>
        </div>
    );
}