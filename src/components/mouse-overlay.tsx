import { easeInOutExpo } from "@/lib/utils";
import { useKeyEvent } from "@/stores/key_event";
import { useKeyStyle } from "@/stores/key_style";
import { availableMonitors, currentMonitor, Monitor } from "@tauri-apps/api/window";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MouseIndicator } from "./mouse-indicator";

export const MouseOverlay = () => {
    const monitorName = useKeyStyle(state => state.appearance.monitor);

    const isPressed = useKeyEvent(state => state.showMouseClicked);

    const style = useKeyStyle(state => state.mouse);
    const animationDuration = useKeyStyle(state => state.appearance.animationDuration);

    const [monitor, setMonitor] = useState<Monitor | null>(null);
    const positionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const load = async () => {
            const monitors = await availableMonitors();
            let targetMonitor: Monitor | null = null;
            if (monitorName) {
                targetMonitor = monitors.find(m => m.name === monitorName) || null;
            }
            if (!targetMonitor) {
                targetMonitor = await currentMonitor();
            }
            setMonitor(targetMonitor);
        }
        load();
    }, [monitorName]);

    // Subscribe to mouse movement without re-rendering React
    useEffect(() => {
        if (!monitor || !positionRef.current) return;

        // Zustand subscribe allows us to listen to changes without triggering a component re-render
        const unsubscribe = useKeyEvent.subscribe((state) => {
            const { x, y } = state.mouse;

            // Basic visibility check inside the loop to avoid lagging behind state updates
            if (!style.keepHighlight && !state.pressedMouseButton && !style.showIndicator) {
                // positionRef.current.style.opacity = '0'; 
                return;
            }

            positionRef.current!.style.transform =
                `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        });

        return () => unsubscribe();
    }, [monitor, style.showClicks, style.keepHighlight, style.showIndicator]);

    if (!monitor) return null;

    // Logic to determine if we should render anything at all to keep DOM light
    const shouldRender = style.showClicks || style.keepHighlight || style.showIndicator;
    if (!shouldRender) return null;

    const isVisible = isPressed || style.keepHighlight;

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div
                ref={positionRef}
                className="absolute top-0 left-0 will-change-transform"
                style={{
                    width: style.size,
                    height: style.size,
                }}
            >
                {style.showClicks && (
                    <motion.div
                        className="w-full h-full"
                        initial={false}
                        animate={{
                            opacity: isVisible ? 1 : 0,
                            scale: isPressed ? 0.5 : 1.0,
                            borderWidth: style.size / 20,
                        }}
                        style={{
                            borderColor: style.color,
                            borderStyle: "solid",
                            borderRadius: "50%",
                        }}
                        transition={{
                            duration: animationDuration,
                            ease: easeInOutExpo,
                        }}
                    />
                )}

                {style.showIndicator &&
                    <motion.div
                        className="absolute left-1/2 top-1/2"
                        animate={{ opacity: isVisible ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <MouseIndicator />
                    </motion.div>
                }
            </div>
        </div>
    );
};