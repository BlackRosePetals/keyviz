import { AnimatePresence, motion } from "motion/react";
import { useKeyEvent } from "../stores/key_event";
import { useKeyStyle } from "@/stores/key_style";
import { Keycap } from "./keycaps";

const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 10 }
};

export const Overlay = () => {
    const { pressedKeys, groups } = useKeyEvent();
    const { appearance } = useKeyStyle();

    return (
        // Container !don't use tailwind
        <div className="flex w-screen h-screen justify-end items-center" style={{
            flexDirection: appearance.flexDirection,
            paddingBlock: appearance.marginY,
            paddingInline: appearance.marginX,
        }}>
            <AnimatePresence>
                {groups.map((group, index) => (
                    <motion.div
                        key={index}
                        className="keygroup"
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.2 }}
                    >
                        <AnimatePresence>
                            {group.map(key => (
                                <motion.div
                                    key={key.name}
                                    variants={variants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    transition={{ duration: 0.2 }}
                                >
                                    <Keycap
                                        keyData={key}
                                        isPressed={groups.length - 1 === index && key.in(pressedKeys)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};