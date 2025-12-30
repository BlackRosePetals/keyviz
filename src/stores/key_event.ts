import { EventPayload, KeyEvent, MouseButton, MouseButtonEvent, MouseMoveEvent, MouseWheelEvent } from "@/types/event";
import { Key } from "@/types/key";
import { persist, createJSONStorage } from "zustand/middleware";
import { tauriStorage } from "./storage";
import { createSyncedStore } from "./sync";

export const KEY_EVENT_STORE = "key_event_store";

const SCROLL_LINGER_MS = 300;
const MODIFIERS = new Set([
    "Shift",
    "Ctrl",
    "Alt",
    "Meta",
    "Fn",
]);

export interface KeyEventState {
    // ───────────── physical state ─────────────
    pressedKeys: string[];
    pressedMouseButton: MouseButton | null;
    mouse: {
        x: number;
        y: number;
        wheel: number;
        lastScrollAt?: number;
        dragStart?: { x: number; y: number; };
        dragging: boolean;
    };
    // ───────────── visual state ─────────────
    groups: Key[][];
    // ───────────── config ─────────────
    dragThreshold: number;
    filterHotkeys: boolean;
    ignoreModifiers: string[];
    showEventHistory: boolean;
    maxHistory: number;
    showMouseEvents: boolean;
    lingerDurationMs: number;
    toggleShortcut: string[];
}

interface KeyEventActions {
    // ───────────── setters ─────────────
    setDragThreshold(value: number): void;
    setFilterHotkeys(value: boolean): void;
    setIgnoreModifiers(modifiers: string[]): void;
    setShowEventHistory(value: boolean): void;
    setMaxHistory(value: number): void;
    setShowMouseEvents(value: boolean): void;
    setLingerDurationMs(value: number): void;
    setToggleShortcut(value: string[]): void;
    // ───────────── event actions ─────────────
    onEvent(event: EventPayload): void;
    onKeyPress(event: KeyEvent): void;
    isHotkey(event: KeyEvent, pressedKeys: string[]): boolean;
    onKeyRelease(event: KeyEvent): void;
    onMouseMove(event: MouseMoveEvent): void;
    onMouseButtonPress(event: MouseButtonEvent): void;
    onMouseButtonRelease(event: MouseButtonEvent): void;
    onMouseWheel(event: MouseWheelEvent): void;
    tick(): void;
}

export type KeyEventStore = KeyEventState & KeyEventActions;

const createKeyEventStore = createSyncedStore<KeyEventStore>(
    KEY_EVENT_STORE,
    (set, get) => ({
        pressedKeys: <string[]>[],
        pressedMouseButton: null,
        mouse: { x: 0, y: 0, wheel: 0, dragging: false },
        groups: [],
        dragThreshold: 50,
        filterHotkeys: true,
        ignoreModifiers: ["Shift"],
        showEventHistory: true,
        maxHistory: 5,
        lingerDurationMs: 5_000,
        showMouseEvents: true,
        toggleShortcut: ["Shift", "F10"],

        setDragThreshold(value: number) {
            set({ dragThreshold: value });
        },
        setFilterHotkeys(value: boolean) {
            set({ filterHotkeys: value });
        },
        setIgnoreModifiers(modifiers: string[]) {
            set({ ignoreModifiers: modifiers });
        },
        setShowEventHistory(value: boolean) {
            set({ showEventHistory: value });
        },
        setMaxHistory(value: number) {
            set({ maxHistory: value });
        },
        setShowMouseEvents(value: boolean) {
            set({ showMouseEvents: value });
        },
        setLingerDurationMs(value: number) {
            set({ lingerDurationMs: value });
        },
        setToggleShortcut(value: string[]) {
            set({ toggleShortcut: value });
        },
        onEvent(event: EventPayload) {
            const state = get();
            switch (event.type) {
                case "KeyEvent":
                    if (event.pressed) {
                        state.onKeyPress(event);
                    } else {
                        state.onKeyRelease(event);
                    }
                    break;

                case "MouseMoveEvent":
                    state.onMouseMove(event);
                    break;

                case "MouseButtonEvent":
                    if (event.pressed) {
                        state.onMouseButtonPress(event);
                    } else {
                        state.onMouseButtonRelease(event);
                    }
                    break;

                case "MouseWheelEvent":
                    state.onMouseWheel(event);
                    break;
            }
        },
        onKeyPress(event: KeyEvent) {
            const state = get();
            // 0. track pyhsical state
            const pressedKeys = [...state.pressedKeys];
            pressedKeys.push(event.name);

            // 1. filter event
            if (state.filterHotkeys && !state.isHotkey(event, pressedKeys)) {
                set({ pressedKeys });
                return;
            }

            let groups = [...state.groups];
            const last = groups.length - 1;
            const key = new Key(event.name);

            // 2. check if pressed again
            const existingKey = last >= 0 ? groups[last].find(gKey => gKey.name === key.name) : undefined;
            if (existingKey) {
                // history mode, add new group
                if (state.showEventHistory && groups[last].length > 1) {
                    const group = groups[last].filter(gKey => gKey.in(pressedKeys));
                    groups.push(group);
                }
                // replace mode, only currently pressed keys
                // or
                // history mode, last group has only this key
                else {
                    let group = <Key[]>[];
                    groups[last].forEach(gKey => {
                        if (gKey.name === key.name) {
                            // update existing key's pressed count and time
                            existingKey.press();
                            group.push(existingKey);
                        } else if (gKey.in(pressedKeys)) {
                            group.push(gKey);
                        }
                    });
                    groups[last] = group;
                }
            }
            // 3. add to group
            else {
                // add new group
                if (pressedKeys.length === 1 || last < 0) {
                    if (state.showEventHistory) {
                        groups.push([key]);
                    } else {
                        groups = [[key]];
                    }
                }
                // key combination
                else {
                    if (state.showEventHistory && groups[last].some(gKey => !gKey.in(pressedKeys))) {
                        // history mode, partial combination, add new group
                        const group = groups[last].filter(gKey => gKey.in(pressedKeys));
                        group.push(key);
                        groups.push(group);
                    } else {
                        groups[last].push(key);
                    }
                }
            }
            // ensure max history
            if (state.showEventHistory && groups.length > state.maxHistory) {
                groups = groups.slice(groups.length - state.maxHistory);
            }

            set({ pressedKeys, groups });
        },
        isHotkey(event, pressedKeys) {
            const state = get();
            if (pressedKeys.length === 1) {
                // only modifier keys
                return MODIFIERS.has(event.name) && !state.ignoreModifiers.includes(event.name);
            } else {
                // combination starts with modifier
                return MODIFIERS.has(pressedKeys[0]) && !state.ignoreModifiers.includes(pressedKeys[0]);
            }
        },
        onKeyRelease(event: KeyEvent) {
            const state = get();
            // track physical state
            const pressedKeys = state.pressedKeys.filter(keyName => keyName !== event.name);

            // update last pressed time
            const groups = [...state.groups];
            const last = groups.length - 1;

            const kIndex = last >= 0 ? groups[last].findIndex(key => key.name === event.name) : undefined;
            if (kIndex && kIndex >= 0) {
                groups[last][kIndex].lastPressedAt = Date.now();
                set({ pressedKeys, groups });
            } else {
                set({ pressedKeys });
            }
        },
        onMouseMove(event: MouseMoveEvent) {
            const state = get();
            const mouse = { ...state.mouse };
            // update position
            mouse.x = event.x;
            mouse.y = event.y;
            // check dragging
            if (state.showMouseEvents && mouse.dragStart && !mouse.dragging) {
                const dx = mouse.x - mouse.dragStart.x;
                const dy = mouse.y - mouse.dragStart.y;
                const dragDistance = Math.hypot(dx, dy);

                if (dragDistance > state.dragThreshold) {
                    mouse.dragging = true;

                    // remove mouse button from pressed keys
                    const pressedKeys = state.pressedKeys.filter(keyName => keyName !== state.pressedMouseButton?.toString());

                    // remove mouse button from last group
                    const groups = [...state.groups];
                    const last = groups.length - 1;
                    if (last >= 0) {
                        groups[last] = groups[last].filter(key => key.name !== state.pressedMouseButton?.toString());
                    }

                    set({ pressedKeys, mouse, groups });

                    // simulate drag as key press
                    state.onKeyPress({ type: "KeyEvent", name: "Drag", pressed: true });
                    return;
                }
            }
            set({ mouse });
        },
        onMouseButtonPress(event: MouseButtonEvent) {
            const state = get();
            // set drag start position
            const mouse = {
                ...state.mouse,
                dragStart: { x: state.mouse.x, y: state.mouse.y },
            };

            // simulate mouse button press as key
            if (state.showMouseEvents) {
                state.onKeyPress({ type: "KeyEvent", name: event.button.toString(), pressed: true });
            }

            set({ pressedMouseButton: event.button, mouse });
        },
        onMouseButtonRelease(event: MouseButtonEvent) {
            const state = get();
            // reset drag state
            const mouse = {
                ...state.mouse,
                dragging: false,
                dragStart: undefined
            };
            // check if was dragging
            if (state.mouse.dragging) {
                // simulate drag release as key
                state.onKeyRelease({ type: "KeyEvent", name: "Drag", pressed: false });
            } else if (state.showMouseEvents) {
                // simulate mouse button release as key
                state.onKeyRelease({ type: "KeyEvent", name: event.button.toString(), pressed: false });
            }

            set({ pressedMouseButton: null, mouse });
        },
        onMouseWheel(event: MouseWheelEvent) {
            // bug: history mode, ctrl + scroll, scroll
            const state = get();
            // update mouse wheel state
            const mouse = {
                ...state.mouse,
                wheel: Math.sign(event.delta_y), // -1 for up, 1 for down
                lastScrollAt: Date.now()
            };
            // simulate mouse wheel as key press
            if (state.showMouseEvents && !state.pressedKeys.includes("Scroll")) {
                state.onKeyPress({ type: "KeyEvent", name: "Scroll", pressed: true });
            }

            set({ mouse });
        },
        tick() {
            // todo: remove pressed keys with unsually long linger duration
            const state = get();
            const now = Date.now();
            let notify = false;

            const groups = <Key[][]>[];

            if (state.mouse.lastScrollAt && now - state.mouse.lastScrollAt > SCROLL_LINGER_MS) {
                // simulate scroll key release
                state.onKeyRelease({ type: "KeyEvent", name: "Scroll", pressed: false });
                set({ mouse: { ...state.mouse, wheel: 0, lastScrollAt: undefined } });
            }

            for (const group of state.groups) {
                const updatedGroup = group.filter((key) => {
                    // keep key if
                    return (
                        // is pressed
                        state.pressedKeys.includes(key.name) ||
                        // within linger duration 
                        now - key.lastPressedAt < state.lingerDurationMs
                    );
                })
                if (updatedGroup.length !== group.length) {
                    notify = true;
                }
                if (updatedGroup.length > 0) {
                    groups.push(updatedGroup);
                }
            }

            if (notify) {
                set({ groups });
            }
        }
    }),
    (config) => persist(config, {
        name: KEY_EVENT_STORE,
        storage: createJSONStorage(() => tauriStorage),
        partialize: (state) => {
            const {  pressedKeys, pressedMouseButton, mouse, groups, ...persistedState } = state;
            return persistedState;
        },
    }),
);

export const useKeyEvent = createKeyEventStore(false);
export const useKeyEventSync = createKeyEventStore(true);