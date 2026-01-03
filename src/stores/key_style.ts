import { Alignment } from "@/types/style";
import { createJSONStorage, persist } from "zustand/middleware";
import { tauriStorage } from "./storage";
import { createSyncedStore } from "./sync";
import { getCurrentWindow } from "@tauri-apps/api/window";

export const KEY_STYLE_STORE = "key_style_store";

export interface AppearanceSettings {
    flexDirection: "row" | "column";
    alignment: Alignment;
    marginX: number;
    marginY: number;
    animation: "none" | "fade" | "zoom" | "float" | "slide";
    animationDuration: number;
}

export interface ContainerSettings {
    style: "minimal" | "flat" | "elevated" | "plastic";
    color: string;
    secondaryColor: string;
    showIcon: boolean;
    showSymbol: boolean;
    useGradient: boolean;
}

export interface ModifierSettings {
    highlight: boolean;
    color: string;
    secondaryColor: string;
    textColor: string;
    textVariant: "icon" | "text" | "text-short";
    borderColor: string;
}

export interface TextSettings {
    size: number;
    color: string;
    caps: "uppercase" | "capitalize" | "lowercase";
    alignment: Alignment;
}

export interface BorderSettings {
    enabled: boolean;
    color: string;
    width: number;
    radius: number;
}

export interface BackgroundSettings {
    enabled: boolean;
    color: string;
}

export interface MouseSettings {
    showClicks: boolean;
    keepHighlight: boolean;
    size: number;
    color: string;
}

export interface KeyStyleState {
    appearance: AppearanceSettings;
    container: ContainerSettings;
    modifier: ModifierSettings;
    text: TextSettings;
    border: BorderSettings;
    background: BackgroundSettings;
    mouse: MouseSettings;
}

interface KeyStyleActions {
    setAppearance: (appearance: Partial<AppearanceSettings>) => void;
    setContainer: (container: Partial<ContainerSettings>) => void;
    setModifier: (modifier: Partial<ModifierSettings>) => void;
    setText: (text: Partial<TextSettings>) => void;
    setBorder: (border: Partial<BorderSettings>) => void;
    setBackground: (background: Partial<BackgroundSettings>) => void;
    setMouse: (mouse: Partial<MouseSettings>) => void;
}

export type KeyStyleStore = KeyStyleState & KeyStyleActions;

const createKeyStyleStore = createSyncedStore<KeyStyleStore>(
    KEY_STYLE_STORE,
    (set) => ({
        appearance: {
            flexDirection: "column",
            alignment: "bottom-center",
            marginX: 5,
            marginY: 5,
            animation: "fade",
            motionBlur: true,
            animationDuration: 0.2,
        },
        container: {
            style: "elevated",
            color: "#ffffffff",
            secondaryColor: "#000000ff",
            showIcon: true,
            showSymbol: true,
            useGradient: false,
        },
        modifier: {
            highlight: true,
            color: "#ff0000ff",
            secondaryColor: "#990000ff",
            textColor: "#ffffffff",
            textVariant: "text-short",
            borderColor: "#990000ff",
        },
        text: {
            size: 24,
            color: "#000000ff",
            caps: "capitalize",
            alignment: "bottom-center",
        },
        border: {
            enabled: true,
            width: 1,
            color: "#000000ff",
            radius: 0.45,
        },
        background: {
            enabled: true,
            color: "#ffffff80",
        },
        mouse: {
            showClicks: true,
            keepHighlight: false,
            showEvents: true,
            size: 150,
            color: "#0000ffff",
        },

        setAppearance: (appearance) => set((state) => ({ appearance: { ...state.appearance, ...appearance } })),
        setContainer: (container) => set((state) => ({ container: { ...state.container, ...container } })),
        setModifier: (modifier) => set((state) => ({ modifier: { ...state.modifier, ...modifier } })),
        setText: (text) => set((state) => ({ text: { ...state.text, ...text } })),
        setBorder: (border) => set((state) => ({ border: { ...state.border, ...border } })),
        setBackground: (background) => set((state) => ({ background: { ...state.background, ...background } })),
        setMouse: (mouse) => set((state) => ({ mouse: { ...state.mouse, ...mouse } })),
    }),
    (config) => persist(config, {
        name: KEY_STYLE_STORE,
        storage: createJSONStorage(() => tauriStorage),
    }),
);

export const useKeyStyle = createKeyStyleStore(getCurrentWindow().label === "settings");