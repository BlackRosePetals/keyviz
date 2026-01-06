import { AllowedKeys, EventPayload, KeyEvent, MODIFIERS, MouseButton, MouseButtonEvent, MouseMoveEvent, MouseWheelEvent, RawKey, RawKeyEvent } from "@/types/event";
import { createJSONStorage, persist } from "zustand/middleware";
import { tauriStorage } from "./storage";
import { createSyncedStore } from "./sync";
import { getCurrentWindow } from "@tauri-apps/api/window";


export const KEY_EVENT_STORE = "key_event_store";
const SCROLL_LINGER_MS = 300;
const MIN_CLICK_DISPLAY_MS = 200;

interface KeyGroup {
    keys: KeyEvent[];
    timestamp: number;
}

interface KeyEventState {
    // ───────────── physical state ─────────────
    pressedKeys: string[];
    pressedMouseButton: MouseButton | null;
    lastMouseButtonPressAt?: number;
    mouse: {
        x: number;
        y: number;
        wheel: number;
        lastScrollAt?: number;
        dragStart?: { x: number; y: number; };
        dragging: boolean;
    };
    // ───────────── visual state ─────────────
    isStyling: boolean;
    groups: KeyGroup[];
    showMouseClicked: boolean;
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
    setIsStyling(value: boolean): void;
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
    onKeyPress(event: RawKeyEvent): void;
    isHotkey(event: RawKeyEvent, pressedKeys: string[]): boolean;
    onKeyRelease(event: RawKeyEvent): void;
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
        groups: <KeyGroup[]>[],
        isStyling: false,
        showMouseClicked: false,
        dragThreshold: 50,
        filterHotkeys: true,
        ignoreModifiers: [RawKey.ShiftLeft, RawKey.ShiftRight],
        showEventHistory: true,
        maxHistory: 5,
        lingerDurationMs: 5_000,
        showMouseEvents: true,
        toggleShortcut: [RawKey.ShiftLeft, RawKey.F10],

        setIsStyling(value) {
            set({ isStyling: value });
        },
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
                    if (!AllowedKeys.has(event.name)) return;
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
        onKeyPress(event: RawKeyEvent) {
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
            const key = new KeyEvent(event.name);

            // 2. check if pressed again
            const existingKey = last >= 0 ? groups[last].keys.find(gKey => gKey.name === key.name) : undefined;
            if (existingKey) {
                // history mode, add new group
                if (state.showEventHistory && groups[last].keys.length > 1) {
                    const groupKeys: KeyEvent[] = [];
                    groups[last].keys.forEach(gKey => {
                        if (gKey.in(pressedKeys)) {
                            groupKeys.push(new KeyEvent(gKey.name));
                        }
                    });
                    groups.push({ keys: groupKeys, timestamp: Date.now() });
                }
                // replace mode, only currently pressed keys
                // or
                // history mode, last group has only this key
                else {
                    let groupKeys = <KeyEvent[]>[];
                    groups[last].keys.forEach(gKey => {
                        if (gKey.name === key.name) {
                            // update existing key's pressed count and time
                            existingKey.press();
                            groupKeys.push(existingKey);
                        } else if (gKey.in(pressedKeys)) {
                            groupKeys.push(gKey);
                        }
                    });
                    groups[last].keys = groupKeys;
                }
            }
            // 3. add to group
            else {
                // add new group
                if (pressedKeys.length === 1 || last < 0) {
                    if (state.showEventHistory) {
                        groups.push({ keys: [key], timestamp: Date.now() });
                    } else {
                        groups = [{ keys: [key], timestamp: Date.now() }];
                    }
                }
                // key combination
                else {
                    if (state.showEventHistory && groups[last].keys.some(gKey => !gKey.in(pressedKeys))) {
                        // history mode, partial combination, add new group
                        const groupKeys = groups[last].keys.filter(gKey => gKey.in(pressedKeys));
                        groupKeys.push(key);
                        groups.push({ keys: groupKeys, timestamp: Date.now() });
                    } else {
                        groups[last].keys.push(key);
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
        onKeyRelease(event: RawKeyEvent) {
            const state = get();
            // track physical state
            const pressedKeys = state.pressedKeys.filter(keyName => keyName !== event.name);

            // update last pressed time
            const groups = [...state.groups];
            const last = groups.length - 1;

            const kIndex = last >= 0 ? groups[last].keys.findIndex(key => key.name === event.name) : undefined;
            if (kIndex && kIndex >= 0) {
                groups[last].keys[kIndex].lastPressedAt = Date.now();
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
                        groups[last].keys = groups[last].keys.filter(key => key.name !== state.pressedMouseButton?.toString());
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

            set({
                pressedMouseButton: event.button,
                lastMouseButtonPressAt: Date.now(),
                showMouseClicked: true,
                mouse
            });
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
            // hide click visualization after short delay
            let showMouseClicked = true;
            let lastMouseButtonPressAt = state.lastMouseButtonPressAt;
            if (Date.now() - state.lastMouseButtonPressAt! > MIN_CLICK_DISPLAY_MS) {
                showMouseClicked = false;
                lastMouseButtonPressAt = undefined;
            }// else, will be turned off in tick()
            set({
                pressedMouseButton: null,
                lastMouseButtonPressAt,
                showMouseClicked,
                mouse
            });
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

            const groups = <KeyGroup[]>[];

            // hide mouse click visualization after delay
            if (
                !state.pressedMouseButton
                && state.lastMouseButtonPressAt
                && now - state.lastMouseButtonPressAt > MIN_CLICK_DISPLAY_MS
            ) {
                set({ showMouseClicked: false, lastMouseButtonPressAt: undefined });
            }
            
            // handle scroll linger
            if (state.mouse.lastScrollAt && now - state.mouse.lastScrollAt > SCROLL_LINGER_MS) {
                // simulate scroll key release
                state.onKeyRelease({ type: "KeyEvent", name: "Scroll", pressed: false });
                set({ mouse: { ...state.mouse, wheel: 0, lastScrollAt: undefined } });
            }

            // don't remove keys while styling
            if (state.isStyling) return;

            // remove keys that have exceeded linger duration
            for (const group of state.groups) {
                const updatedKeys = group.keys.filter((key) => {
                    // keep key if
                    return (
                        // is pressed
                        state.pressedKeys.includes(key.name) ||
                        // within linger duration 
                        now - key.lastPressedAt < state.lingerDurationMs
                    );
                })
                if (updatedKeys.length !== group.keys.length) {
                    notify = true;
                }
                if (updatedKeys.length > 0) {
                    groups.push({ keys: updatedKeys, timestamp: group.timestamp });
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
            const { pressedKeys, pressedMouseButton, mouse, groups, ...persistedState } = state;
            return persistedState;
        },
    }),
);

export const useKeyEvent = createKeyEventStore(getCurrentWindow().label === "settings");