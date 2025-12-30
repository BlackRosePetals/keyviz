import { Alignment } from "@/types/style";
import { createJSONStorage, persist } from "zustand/middleware";
import { tauriStorage } from "./storage";
import { createSyncedStore } from "./sync";

export const KEY_STYLE_STORE = "key_style_store";

export interface AppearanceSettings {
    flexDirection: "row" | "column";
    alignment: Alignment;
    marginX: number;
    marginY: number;
    animation: "none" | "fade" | "zoom" | "slide";
    animationDuration: number;
    motionBlur: boolean;
}

export interface ContainerSettings {
    keycap: "minimal" | "flat" | "elevated" | "plastic" | "mechanical";
    useGradient: boolean;
    color: string;
    secondaryColor: string;
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
    caps: "uppercase" | "title" | "lowercase";
    alignment: Alignment;
    showIcon: boolean;
    showSymbol: boolean;
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
    filled: boolean;
    color: string;
    animation: "ripple" | "flash" | "static";
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
            animationDuration: 300,
        },
        container: {
            keycap: "elevated",
            useGradient: true,
            color: "#ffffffff",
            secondaryColor: "#ccccccff",
        },
        modifier: {
            highlight: true,
            color: "#ff0000ff",
            secondaryColor: "#cc0000ff",
            textColor: "#ffffffff",
            textVariant: "text-short",
            borderColor: "#990000ff",
        },
        text: {
            size: 18,
            color: "#000000ff",
            caps: "title",
            alignment: "bottom-center",
            showIcon: true,
            showSymbol: true,
        },
        border: {
            enabled: true,
            color: "#000000ff",
            width: 1,
            radius: 45,
        },
        background: {
            enabled: true,
            color: "#ffffff80",
        },
        mouse: {
            showClicks: true,
            keepHighlight: false,
            showEvents: true,
            filled: false,
            color: "#0000ffff",
            animation: "ripple",
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

export const useKeyStyle = createKeyStyleStore(false);
export const useKeyStyleSync = createKeyStyleStore(true);