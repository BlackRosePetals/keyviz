import { motion } from "motion/react";
import { useKeyStyle } from "@/stores/key_style";
import type { KeycapProps } from ".";

export const MinimalKeycap = ({ keyData, isPressed }: KeycapProps) => {
    const { text, modifier } = useKeyStyle();

    const textColor = keyData.isModifier() && modifier.highlight ? modifier.textColor : text.color;

    return (
        <motion.div
            className="keycap-minimal"
            animate={{ scale: isPressed ? 0.95 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                color: textColor,
                fontSize: text.size,
                textTransform: text.caps === "uppercase" ? "uppercase" : 
                              text.caps === "lowercase" ? "lowercase" : "capitalize",
            }}
        >
            {keyData.name}
            {keyData.pressedCount > 1 && (
                <span className="press-count">×{keyData.pressedCount}</span>
            )}
        </motion.div>
    );
};