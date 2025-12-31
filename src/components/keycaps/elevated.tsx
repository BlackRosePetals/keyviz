import { motion } from "motion/react";
import { useKeyStyle } from "@/stores/key_style";
import type { KeycapProps } from ".";

export const ElevatedKeycap = ({ keyData, isPressed }: KeycapProps) => {
    const { container, text, border, modifier } = useKeyStyle();

    const bgColor = keyData.isModifier() && modifier.highlight ? modifier.color : container.color;
    const textColor = keyData.isModifier() && modifier.highlight ? modifier.textColor : text.color;
    const borderColor = keyData.isModifier() && modifier.highlight ? modifier.borderColor : border.color;

    return (
        <motion.div
            className="keycap-elevated"
            animate={{ 
                scale: isPressed ? 0.95 : 1,
                boxShadow: isPressed 
                    ? "0 1px 2px rgba(0,0,0,0.2)" 
                    : "0 4px 8px rgba(0,0,0,0.3)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                background: 1>0 
                    ? `linear-gradient(180deg, ${bgColor}, ${container.secondaryColor})`
                    : bgColor,
                color: textColor,
                fontSize: text.size,
                borderRadius: border.radius,
                border: border.enabled ? `${border.width}px solid ${borderColor}` : "none",
                textTransform: text.caps === "uppercase" ? "uppercase" : 
                              text.caps === "lowercase" ? "lowercase" : "capitalize",
                padding: "8px 16px",
            }}
        >
            {keyData.name}
            {keyData.pressedCount > 1 && (
                <span className="press-count">{keyData.pressedCount}</span>
            )}
        </motion.div>
    );
};