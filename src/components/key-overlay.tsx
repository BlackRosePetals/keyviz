import { easeInQuint, easeOutQuint } from "@/lib/utils";
import { useKeyEvent } from "@/stores/key_event";
import { useKeyStyle } from "@/stores/key_style";
import { alignmentForColumn, alignmentForRow } from "@/types/style";
import { AnimatePresence, motion, Variants } from "motion/react";
import { useMemo } from "react";
import { Keycap } from "./keycaps";


const fadeVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
}

export const KeyOverlay = () => {
    const pressedKeys = useKeyEvent(state => state.pressedKeys);
    const groups = useKeyEvent(state => state.groups);

    const appearance = useKeyStyle(state => state.appearance);
    const text = useKeyStyle(state => state.text);
    const border = useKeyStyle(state => state.border);
    const background = useKeyStyle(state => state.background);

    const alignment = appearance.flexDirection === "row"
        ? alignmentForRow[appearance.alignment]
        : alignmentForColumn[appearance.alignment];

    const containerStyle = {
        flexDirection: appearance.flexDirection,
        paddingBlock: appearance.marginY,
        paddingInline: appearance.marginX,
        alignItems: alignment.alignItems,
        justifyContent: alignment.justifyContent,
        gap: text.size * 0.5,
    };

    const groupStyle = {
        display: "flex",
        columnGap: appearance.style === "minimal" ? text.size * 0.15 : text.size * 0.3,
        ...(background.enabled && {
            paddingInline: text.size * 0.4,
            paddingBlock: appearance.style === "minimal" ? text.size * 0.25 : text.size * 0.4,
            background: background.color,
            borderRadius: border.radius * (text.size * 1.75),
        }),
    }

    const layoutAnimation = appearance.animation === "none" ? false : "position";

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
        <div className="w-full h-full flex" style={containerStyle}>
            <AnimatePresence>
                {groups.map((group, index) => (
                    <motion.div
                        key={group.timestamp}
                        layout={layoutAnimation}
                        variants={appearance.animation === "none" ? {} : fadeVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        style={groupStyle}
                        className={background.enabled ? "overflow-hidden" : ""}
                        transition={{ ease: [easeOutQuint, easeInQuint], duration: appearance.animationDuration }}
                    >
                        <AnimatePresence>
                            {group.keys.map(event => (
                                <motion.div
                                    key={event.name}
                                    layout={layoutAnimation}
                                    variants={variants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"

                                    transition={{
                                        ease: [easeOutQuint, easeInQuint],
                                        duration: appearance.animationDuration,
                                        layout: { duration: appearance.animationDuration / 3, ease: easeOutQuint },
                                    }}
                                    className="cursor-pointer flex items-center"
                                >
                                    <Keycap
                                        event={event}
                                        isPressed={groups.length - 1 === index && event.in(pressedKeys)}
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