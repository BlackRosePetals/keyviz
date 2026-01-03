import { easeInQuint, easeOutQuint } from "@/lib/utils";
import { useKeyEvent } from "@/stores/key_event";
import { useKeyStyle } from "@/stores/key_style";
import { alignmentForColumn } from "@/types/style";
import { AnimatePresence, motion, Variants } from "motion/react";
import { useMemo } from "react";
import { Keycap } from "./keycaps";


const fadeVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
}

export const KeyOverlay = () => {
    const { pressedKeys, groups } = useKeyEvent();
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

    return (
        <div className="flex w-full h-full justify-end items-center" style={{
            flexDirection: appearance.flexDirection,
            paddingBlock: appearance.marginY,
            paddingInline: appearance.marginX,
            alignItems: alignment.alignItems,
            justifyContent: alignment.justifyContent,
            position: "relative",
        }}>
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
                                    transition={{
                                        ease: [easeOutQuint, easeInQuint],
                                        duration: appearance.animationDuration
                                    }}
                                    className="cursor-pointer"
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