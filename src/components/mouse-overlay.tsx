import { easeInOutExpo } from "@/lib/utils";
import { useKeyEvent } from "@/stores/key_event";
import { useKeyStyle } from "@/stores/key_style";
import { currentMonitor, Monitor } from "@tauri-apps/api/window";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const MouseOverlay = () => {
    const pressedButton = useKeyEvent(state => state.pressedMouseButton);
    const isPressed = useKeyEvent(state => state.showMouseClicked);
    const mouse = useKeyEvent(state => state.mouse);

    const style = useKeyStyle(state => state.mouse);
    const animationDuration = useKeyStyle(state => state.appearance.animationDuration);

    // We only need the monitor info for math, not for rendering
    const [monitor, setMonitor] = useState<Monitor | null>(null);

    // Reference to the actual DOM element
    const positionRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        currentMonitor().then(setMonitor);
    }, []);

    const updatePosition = () => {
        if (!monitor || !positionRef.current) return;
        const scaleFactor = monitor.scaleFactor;

        // Convert Physical -> Logical
        const x = (mouse.x - monitor.position.x) / scaleFactor;
        const y = (mouse.y - monitor.position.y) / scaleFactor;

        // Use translate3d to force hardware acceleration
        positionRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    useEffect(() => {
        if (!style.keepHighlight && !pressedButton) return;
        updatePosition();
    }, [mouse, style.keepHighlight, monitor]);

    useEffect(() => {
        if (!style.showClicks) return;
        if (style.keepHighlight) {
            return; // handle above
        } else if (pressedButton) {
            updatePosition();
        }
        if (!innerRef.current) return;
        innerRef.current.style.opacity = isPressed ? "1" : style.keepHighlight ? "1" : "0";
        innerRef.current.style.transform = isPressed ? "scale(0.6)" : "scale(1.0)";
    }, [style.showClicks, isPressed]);

    if (!monitor || (!style.showClicks && !style.keepHighlight)) return null;

    return (
        <div className="w-full h-full pointer-events-none">
            <div
                ref={positionRef}
                className="absolute -translate-1/2 will-change-transform"
            >
                {/* <div
                    ref={innerRef}
                    className={"rounded-full" + (style.showClicks ? " transition-all" : "")}
                    style={{
                        width: style.size,
                        height: style.size,
                        borderColor: style.color,
                        borderWidth: style.size / 20,
                        transitionDuration: `${animationDuration}s`,
                        msTransitionTimingFunction: "cubic-bezier(1, 0, 0, 1)",
                        }}
                        /> */}
                <motion.div
                    animate={{
                        opacity: isPressed ? 1 : style.keepHighlight ? 1 : 0,
                        scale: isPressed ? 0.6 : 1.0,
                    }}
                    style={{
                        width: style.size,
                        height: style.size,
                        borderColor: style.color,
                        borderRadius: "50%",
                        borderWidth: style.size / 15,
                    }}
                    transition={{
                        duration: animationDuration,
                        ease: easeInOutExpo,
                    }}
                />
            </div>
        </div>
    );
}