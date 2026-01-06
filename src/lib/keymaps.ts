import { ArrowBigUpDashIcon, ArrowBigUpIcon, ArrowDownIcon, ArrowDownToLineIcon, ArrowLeftIcon, ArrowLeftRightIcon, ArrowRightIcon, ArrowRightToLineIcon, ArrowUpIcon, ArrowUpToLineIcon, ChevronUpIcon, CircleArrowOutUpLeftIcon, CommandIcon, CornerDownLeftIcon, DeleteIcon, Grid2X2Icon, ImageIcon, LockIcon, LucideIcon, MouseIcon, MoveDiagonal, MoveDownRightIcon, MoveUpLeftIcon, OptionIcon, PauseIcon, SpaceIcon, SparkleIcon, Volume2Icon, VolumeXIcon } from "lucide-react";

import { platform } from "@tauri-apps/plugin-os";

// ───────────── Platform Logic ─────────────
const currentPlatform = platform();

interface SwitchPlatformConfig<T> {
    windows: T;
    macos: T;
    linux?: T;
}

function switchPlatform<T>(config: SwitchPlatformConfig<T>): T {
    if (currentPlatform === 'macos') {
        return config.macos;
    } else if (currentPlatform === 'linux' && config.linux !== undefined) {
        return config.linux!;
    }
    return config.windows;
}

// ───────────── Key mapping ─────────────
export interface DisplayData {
    // textual representation
    label: string;
    // short label if any like ctrl for control
    shortLabel?: string;
    // glyph representation if any like ⌃ for control
    glyph?: string;
    // secondary symbol if any like @ for digit 2
    symbol?: string;
    // icon path if can be represented with iconography
    icon?: LucideIcon;
}

// We use the string names from the provided Rust enum as keys
export const keymaps: Record<string, DisplayData> = {
    // ───────────── Function keys ─────────────
    F1: { label: "F1" },
    F2: { label: "F2" },
    F3: { label: "F3" },
    F4: { label: "F4" },
    F5: { label: "F5" },
    F6: { label: "F6" },
    F7: { label: "F7" },
    F8: { label: "F8" },
    F9: { label: "F9" },
    F10: { label: "F10" },
    F11: { label: "F11" },
    F12: { label: "F12" },
    // ───────────── Navigation ─────────────
    PrintScreen: {
        label: "print screen",
        shortLabel: "prt scrn",
        icon: ImageIcon,
    },
    Pause: {
        label: "pause break",
        shortLabel: "pause",
        icon: PauseIcon,
    },
    Backspace: {
        label: switchPlatform({
            windows: "backspace",
            macos: "delete",
        }),
        shortLabel: switchPlatform({
            windows: "back",
            macos: "del",
        }),
        glyph: "⌫",
        icon: DeleteIcon,
    },
    Tab: {
        label: "tab",
        glyph: "⇆",
        icon: ArrowLeftRightIcon,
    },
    Space: {
        label: "space",
        glyph: "⎵",
        icon: SpaceIcon,
    },
    Return: {
        label: switchPlatform({
            windows: "enter",
            macos: "return",
        }),
        glyph: "↩",
        icon: CornerDownLeftIcon,
    },
    Apps: {
        label: "menu",
        glyph: "☰",
    },
    Insert: {
        label: "insert",
        shortLabel: "ins",
        glyph: "⇥",
        icon: ArrowRightToLineIcon,
    },
    Delete: {
        label: "delete",
        shortLabel: "del",
        glyph: "⌦",
        icon: DeleteIcon,
    },
    Home: {
        label: "home",
        glyph: "⇱",
        icon: MoveUpLeftIcon,
    },
    End: {
        label: "end",
        glyph: "⇲",
        icon: MoveDownRightIcon,
    },
    PageUp: {
        label: "page up",
        shortLabel: "pg up",
        glyph: "⤒",
        icon: ArrowUpToLineIcon,
    },
    PageDown: {
        label: "page down",
        shortLabel: "pg dn",
        glyph: "⤓",
        icon: ArrowDownToLineIcon,
    },
    UpArrow: {
        label: "up",
        glyph: "↑",
        icon: ArrowUpIcon,
    },
    DownArrow: {
        label: "down",
        glyph: "↓",
        icon: ArrowDownIcon,
    },
    LeftArrow: {
        label: "left",
        glyph: "←",
        icon: ArrowLeftIcon,
    },
    RightArrow: {
        label: "right",
        glyph: "→",
        icon: ArrowRightIcon,
    },
    CapsLock: {
        label: "caps lock",
        glyph: "⇪",
        icon: ArrowBigUpDashIcon,
    },
    ScrollLock: {
        label: "scroll lock",
        glyph: "🖱",
        icon: MouseIcon,
    },
    NumLock: {
        label: "num lock",
        icon: LockIcon,
    },
    Escape: {
        label: "escape",
        shortLabel: "esc",
        glyph: "⎋",
        icon: CircleArrowOutUpLeftIcon,
    },

    // ───────────── Digits ──────────────
    Num1: {
        label: "1",
        symbol: "!",
    },
    Num2: {
        label: "2",
        symbol: "@",
    },
    Num3: {
        label: "3",
        symbol: "#",
    },
    Num4: {
        label: "4",
        symbol: "$", // Escaping not strictly needed in TS strings unless inside template literal
    },
    Num5: {
        label: "5",
        symbol: "%",
    },
    Num6: {
        label: "6",
        symbol: "^",
    },
    Num7: {
        label: "7",
        symbol: "&",
    },
    Num8: {
        label: "8",
        symbol: "*",
    },
    Num9: {
        label: "9",
        symbol: "(",
    },
    Num0: {
        label: "0",
        symbol: ")",
    },
    // ───────────── Letters ─────────────
    KeyA: { label: "A" },
    KeyB: { label: "B" },
    KeyC: { label: "C" },
    KeyD: { label: "D" },
    KeyE: { label: "E" },
    KeyF: { label: "F" },
    KeyG: { label: "G" },
    KeyH: { label: "H" },
    KeyI: { label: "I" },
    KeyJ: { label: "J" },
    KeyK: { label: "K" },
    KeyL: { label: "L" },
    KeyM: { label: "M" },
    KeyN: { label: "N" },
    KeyO: { label: "O" },
    KeyP: { label: "P" },
    KeyQ: { label: "Q" },
    KeyR: { label: "R" },
    KeyS: { label: "S" },
    KeyT: { label: "T" },
    KeyU: { label: "U" },
    KeyV: { label: "V" },
    KeyW: { label: "W" },
    KeyX: { label: "X" },
    KeyY: { label: "Y" },
    KeyZ: { label: "Z" },
    // ───────────── Punctuation ─────────────
    BackQuote: {
        label: "`",
        symbol: "~",
    },
    Minus: {
        label: "-",
        symbol: "_",
    },
    Equal: {
        label: "=",
        symbol: "+",
    },
    LeftBracket: {
        label: "[",
        symbol: "{",
    },
    RightBracket: {
        label: "]",
        symbol: "}",
    },
    BackSlash: {
        label: "\\",
        symbol: "|",
    },
    SemiColon: {
        label: ";",
        symbol: ":",
    },
    Quote: {
        label: "'",
        symbol: "\"",
    },
    Comma: {
        label: ",",
        symbol: "<",
    },
    Dot: {
        label: ".",
        symbol: ">",
    },
    Slash: {
        label: "?",
        symbol: "/",
    },
    // ───────────── Numpad ─────────────
    KpDivide: { label: "/" },
    KpMultiply: { label: "*" },
    KpMinus: { label: "-" },
    KpPlus: { label: "+" },
    KpEqual: { label: "=" },
    KpComma: { label: "," },
    KpReturn: {
        label: "Enter",
        glyph: "↩",
    },
    KpDecimal: {
        label: ".",
        symbol: "del",
    },
    Kp0: {
        label: "0",
        symbol: "ins",
    },
    Kp1: {
        label: "1",
        symbol: "end",
    },
    Kp2: {
        label: "2",
        symbol: "▼",
    },
    Kp3: {
        label: "3",
        symbol: "pg dn",
    },
    Kp4: {
        label: "4",
        symbol: "◀",
    },
    Kp5: {
        label: "5",
        symbol: " ",
    },
    Kp6: {
        label: "6",
        symbol: "▶",
    },
    Kp7: {
        label: "7",
        symbol: "home",
    },
    Kp8: {
        label: "8",
        symbol: "▲",
    },
    Kp9: {
        label: "9",
        symbol: "pg up",
    },
    // ───────────── Media ─────────────
    VolumeUp: {
        label: "volume up",
        shortLabel: "vol +",
        icon: Volume2Icon,
    },
    VolumeDown: {
        label: "volume down",
        shortLabel: "vol -",
        icon: Volume2Icon,
    },
    VolumeMute: {
        label: "mute",
        icon: VolumeXIcon,
    },

    // ───────────── Mouse Events ─────────────
    Left: {
        label: "left click",
        shortLabel: "left",
        icon: MouseIcon,
    },
    Middle: {
        label: "middle click",
        shortLabel: "middle",
        icon: MouseIcon,
    },
    Right: {
        label: "right click",
        shortLabel: "right",
        icon: MouseIcon,
    },
    Drag: {
        label: "drag",
        icon: MoveDiagonal,
    },
    Scroll: {
        label: "scroll",
        glyph: "↕",
        icon: MouseIcon,
    },
};

// ───────────── Apply Mappings for Modifiers ─────────────

// Control
['ControlLeft', 'ControlRight'].forEach((key) => {
    keymaps[key] = {
        label: "control",
        shortLabel: "ctrl",
        glyph: "⌃",
        icon: ChevronUpIcon,
    };
});

// Meta
['MetaLeft', 'MetaRight'].forEach((key) => {
    keymaps[key] = switchPlatform({
        windows: {
            label: "win",
            glyph: "\u229E",
            icon: Grid2X2Icon,
        },
        macos: {
            label: "command",
            shortLabel: "cmd",
            glyph: "⌘",
            icon: CommandIcon,
        },
        linux: {
            label: "Meta",
            glyph: "✦",
            icon: SparkleIcon,
        },
    });
});

// Alt
['Alt'].forEach((key) => {
    keymaps[key] = {
        label: switchPlatform({
            windows: "alt",
            macos: "option",
        }),
        shortLabel: switchPlatform({
            windows: "alt",
            macos: "opt",
        }),
        glyph: "⌥",
        icon: OptionIcon,
    };
});

// Shift
['ShiftLeft', 'ShiftRight'].forEach((key) => {
    keymaps[key] = {
        label: "shift",
        glyph: "⇧",
        icon: ArrowBigUpIcon,
    };
});