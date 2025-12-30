import { AnimatePresence, motion } from "motion/react";
import { useKeyEvent } from "../stores/key_event";
import { useKeyStyle } from "@/stores/key_style";

const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 10 }
};

export const Overlay = () => {
    const { pressedKeys, pressedMouseButton, mouse, groups,
        filterHotkeys, lingerDurationMs
    } = useKeyEvent();

    const fontColor = useKeyStyle(state => state.text.color);

    return <div>
        <div>Filter Hotkeys: {filterHotkeys ? "🟢" : "🔴"}</div>
        <div>Linger Duration: {lingerDurationMs} ms</div>
        <div style={{ color: fontColor }}>Font Color: {fontColor}</div>

        <div>Pressed Keys: {[...pressedKeys].join(" + ")}</div>
        <div>Pressed Mouse Button: {pressedMouseButton ?? "None"}</div>
        <div>Mouse Position: ({mouse.x}, {mouse.y})</div>
        <div>Mouse Dragging: {mouse.dragging ? "Yes" : "No"}</div>
        <div>Mouse Wheel Delta: {mouse.wheel}</div>

        <div className="container">
            <AnimatePresence>{
                groups.map((group, index) => (
                    <motion.div
                        key={index}
                        className="keygroup"
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.2 }}
                    >
                        <AnimatePresence>{
                            group.map(key => (
                                <motion.div
                                    key={key.name}
                                    variants={variants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    transition={{ duration: 0.2 }}
                                    className="keycap"
                                >
                                    <motion.div
                                        animate={{ transform: groups.length - 1 === index && key.in(pressedKeys) ? "scale(0.9)" : "scale(1)" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        {key.name}
                                    </motion.div>
                                </motion.div>
                            ))
                        }</AnimatePresence>
                    </motion.div>
                ))
            }</AnimatePresence>
        </div>
    </div>;
}