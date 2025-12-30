import { invoke } from '@tauri-apps/api/core';
import { platform } from '@tauri-apps/plugin-os';

import { Item, ItemActions, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "@/components/ui/item";
import { NumberInput } from '@/components/ui/number-input';
import { ShortcutRecorder } from '@/components/ui/shortcut-recorder';
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from "@/lib/utils";
import { useKeyEventSync as useKeyEvent } from "@/stores/key_event";
import { useKeyStyleSync as useKeyStyle } from "@/stores/key_style";
import { ArrowHorizontalIcon, ArrowUp01Icon, ArrowUpBigIcon, ArrowVerticalIcon, CommandIcon, Diamond01Icon, FilterHorizontalIcon, LayerIcon, OptionIcon, ToggleOnIcon, WindowsOldIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";


const platformName = platform();
const modifiers = [
    { icon: ArrowUp01Icon, label: 'Ctrl', value: 'Ctrl' },
    platformName === 'macos'
        ? { icon: CommandIcon, label: 'Cmd', value: 'Meta' }
        : platformName === 'windows'
            ? { icon: WindowsOldIcon, label: 'Win', value: 'Meta' }
            : { icon: Diamond01Icon, label: 'Meta', value: 'Meta' },
    { icon: OptionIcon, label: platformName === 'macos' ? 'Opt' : 'Alt', value: 'Alt' },
    { icon: ArrowUpBigIcon, label: 'Shift', value: 'Shift' },
    { label: 'F#', value: 'Fn' },
];

export const GeneralSettings = () => {
    const {
        filterHotkeys, setFilterHotkeys,
        ignoreModifiers, setIgnoreModifiers,
        showEventHistory, setShowEventHistory,
        maxHistory, setMaxHistory,
        toggleShortcut, setToggleShortcut
    } = useKeyEvent();

    const direction = useKeyStyle(state => state.appearance.flexDirection);
    const setAppearance = useKeyStyle(state => state.setAppearance);

    return <div className="flex flex-col gap-y-4 p-6">
        <h1 className="text-xl font-semibold">General</h1>

        <Item variant="muted">
            <ItemContent>
                <ItemTitle>
                    <HugeiconsIcon icon={CommandIcon} size="1em" />
                    Hotkey Filter
                </ItemTitle>
                <ItemDescription>
                    Filter out letters, numbers, symbols, etc.
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Switch checked={filterHotkeys} onCheckedChange={setFilterHotkeys} />
            </ItemActions>
        </Item>

        <Item variant="muted" className={cn("transition-opacity", filterHotkeys ? "" : "pointer-events-none opacity-50")}>
            <ItemHeader className="flex-col items-start">
                <ItemTitle>
                    <HugeiconsIcon icon={FilterHorizontalIcon} size="1em" />
                    Allowed Modifiers
                </ItemTitle>
                <ItemDescription>
                    Skip any keystroke starting with the disabled modifiers below
                </ItemDescription>
            </ItemHeader>
            <ItemContent>
                <div className="p-2 flex gap-x-2 bg-background rounded-lg">
                    {modifiers.map((mod) => (
                        <KeyCap
                            key={mod.label}
                            icon={mod.icon}
                            label={mod.label}
                            disabled={ignoreModifiers.includes(mod.value)}
                            onClick={() => {
                                if (ignoreModifiers.includes(mod.value)) {
                                    setIgnoreModifiers(ignoreModifiers.filter(m => m !== mod.value));
                                } else {
                                    setIgnoreModifiers([...ignoreModifiers, mod.value]);
                                }
                            }}
                        />
                    ))}
                </div>
            </ItemContent>
        </Item>

        <Item variant="muted">
            <ItemContent>
                <ItemTitle>
                    <HugeiconsIcon icon={LayerIcon} size="1em" />
                    Show History
                </ItemTitle>
                <ItemDescription>
                    Keep previously pressed keystrokes in the view
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Switch checked={showEventHistory} onCheckedChange={setShowEventHistory} />
            </ItemActions>
        </Item>

        <div className={cn("flex flex-col gap-4 md:flex-row", showEventHistory ? "" : "pointer-events-none opacity-50", "transition-opacity")}>
            <Item variant="muted" className="flex-7">
                <ItemContent>
                    <ItemTitle>Direction</ItemTitle>
                </ItemContent>
                <ItemActions>
                    <ToggleGroup
                        size="sm"
                        type="single"
                        variant="outline"
                        value={direction}
                        onValueChange={(value) => setAppearance({ flexDirection: value as 'row' | 'column' })}
                    >
                        <ToggleGroupItem value="row" aria-label="Horizontal">
                            <HugeiconsIcon icon={ArrowHorizontalIcon} strokeWidth={2} size={10} /> Row
                        </ToggleGroupItem>
                        <ToggleGroupItem value="column" aria-label="Vertical">
                            <HugeiconsIcon icon={ArrowVerticalIcon} strokeWidth={2} /> Column
                        </ToggleGroupItem>
                    </ToggleGroup>
                </ItemActions>
            </Item>
            <Item variant="muted" className="flex-5">
                <ItemContent>
                    <ItemTitle>Max Count</ItemTitle>
                </ItemContent>
                <ItemActions className="max-w-20">
                    <NumberInput className="h-8" value={maxHistory} onChange={setMaxHistory} minValue={2} maxValue={12} />
                </ItemActions>
            </Item>
        </div>

        <Item variant="muted">
            <ItemHeader className="flex-col items-start">
                <ItemTitle>
                    <HugeiconsIcon icon={ToggleOnIcon} size="1em" />
                    Toggle Shortcut
                </ItemTitle>
                <ItemDescription>
                    Global shortcut to show/hide the key visualizer, click box to set
                </ItemDescription>
            </ItemHeader>
            <ItemContent>
                <ShortcutRecorder value={toggleShortcut} onChange={shortcut => {
                    setToggleShortcut(shortcut);
                    invoke('set_toggle_shortcut', { shortcut });
                }} />
            </ItemContent>
        </Item>
    </div>;
}

const KeyCap = ({ icon, label, disabled, onClick }: { icon?: IconSvgElement; label: string; disabled?: boolean; onClick?: () => void }) => {
    return (
        <a
            className={cn("bg-linear-to-b from-primary/50 to-secondary rounded-lg cursor-pointer transition-opacity", disabled ? " opacity-50" : "")}
            onClick={onClick}
        >
            <div className={cn("m-px mb-0.5 px-3 py-1.5 flex gap-1 bg-secondary rounded-lg", label !== "Ctrl" ? "items-center" : "")}>
                {icon && <HugeiconsIcon icon={icon} size="1em" />}{label}
            </div>
        </a>
    );
}