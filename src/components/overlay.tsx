import { AnimatePresence, motion, Variants } from "motion/react";
import { useKeyEvent } from "../stores/key_event";
import { useKeyStyle } from "@/stores/key_style";
import { Keycap } from "./keycaps";
import { alignmentForColumn } from "@/types/style";
import { RawKey } from "@/types/event";
import { useMemo } from "react";
import { easeOutQuint, easeInQuint } from "@/lib/utils";


const fadeVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
}

export const Overlay = () => {
    const { pressedKeys, groups, onEvent } = useKeyEvent();
    const { appearance, container, text, border, background } = useKeyStyle();

    const alignment = alignmentForColumn[appearance.alignment];

    const variants = useMemo<Variants>(() => {
        switch (appearance.animation) {
            case "none":
                return {
                    visible: {},
                    hidden: {}
                };
            case "fade":
                return fadeVariants;
            case "zoom":
                return {
                    visible: { scale: 1, opacity: 1 },
                    hidden: { scale: 0, opacity: 0 }
                };
            case "float":
                return {
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: text.size }
                };
            case "slide":
                return {
                    visible: { opacity: 1, x: 0 },
                    hidden: { opacity: 0, x: text.size }
                };
        }
    }, [appearance.animation, text.size]);

    const play = () => {
        // Simulate key press
        onEvent({ type: "KeyEvent", name: RawKey.ControlLeft, pressed: true });
        onEvent({ type: "KeyEvent", name: RawKey.KeyA, pressed: true });

        // Simulate key release
        setTimeout(() => {
            onEvent({ type: "KeyEvent", name: RawKey.KeyA, pressed: false });
            onEvent({ type: "KeyEvent", name: RawKey.ControlLeft, pressed: false });
        }, 1_000);
    }

    return (
        <div className="flex w-screen h-screen justify-end items-center" style={{
            flexDirection: appearance.flexDirection,
            paddingBlock: appearance.marginY,
            paddingInline: appearance.marginX,
            alignItems: alignment.alignItems,
            justifyContent: alignment.justifyContent,
            position: "relative",
        }}>
            <button className="absolute top-4 right-4" onClick={play}>{appearance.animation}</button>
            <AnimatePresence>
                {groups.map((group, index) => (
                    <motion.div
                        key={index}
                        variants={appearance.animation === "none" ? {} : fadeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        style={{
                            display: "flex",
                            columnGap: container.style === "minimal" ? text.size * 0.15 : text.size * 0.25,
                            padding: text.size * 0.4,
                            background: background.color,
                            borderRadius: border.radius * (text.size * 1.75),
                        }}
                        className="overflow-hidden"
                        transition={{ ease: [easeOutQuint, easeInQuint], duration: appearance.animationDuration }}
                    >
                        <AnimatePresence>
                            {group.map(key => (
                                <motion.div
                                    key={key.name}
                                    variants={variants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    transition={{ ease: [easeOutQuint, easeInQuint], duration: appearance.animationDuration }}
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