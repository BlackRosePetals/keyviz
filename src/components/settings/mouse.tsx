import { ColorInput } from "@/components/ui/color-picker";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { NumberInput } from "@/components/ui/number-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useKeyEvent } from "@/stores/key_event";
import { useKeyStyle } from '@/stores/key_style';
import { Cursor01Icon, CursorCircleSelection01Icon, CursorMagicSelection03FreeIcons, CursorPointer01Icon, Drag03Icon, KeyboardIcon, PaintBoardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";


export const MouseSettings = () => {
    const mouse = useKeyStyle(state => state.mouse);
    const setMouseStyle = useKeyStyle(state => state.setMouse);

    const dragThreshold = useKeyEvent(state => state.dragThreshold);
    const setDragThreshold = useKeyEvent(state => state.setDragThreshold);

    const showMouseEvents = useKeyEvent(state => state.showMouseEvents);
    const setShowMouseEvents = useKeyEvent(state => state.setShowMouseEvents);

    return <div className="flex flex-col gap-y-4 p-6">
        <h1 className="text-xl font-semibold">Mouse</h1>

        <Item variant="muted">
            <ItemContent>
                <ItemTitle>
                    <HugeiconsIcon icon={CursorMagicSelection03FreeIcons} size="1em" /> Show Clicks
                </ItemTitle>
                <ItemDescription>
                    Visualize clicks when a mouse button is pressed
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Switch
                    checked={mouse.showClicks}
                    onCheckedChange={(showClicks) => setMouseStyle({ showClicks, keepHighlight: false })}
                />
            </ItemActions>
        </Item>

        <Item variant="muted">
            <ItemContent>
                <ItemTitle>
                    <HugeiconsIcon icon={Cursor01Icon} size="1em" /> Keep Highlight
                </ItemTitle>
                <ItemDescription>
                    Show the highlight around the cursor all time
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Switch
                    checked={mouse.keepHighlight}
                    onCheckedChange={(keepHighlight) => setMouseStyle({ keepHighlight })}
                    disabled={!mouse.showClicks}
                />
            </ItemActions>
        </Item>

        <Item variant="muted">
            <ItemContent>
                <ItemTitle>
                    <HugeiconsIcon icon={CursorCircleSelection01Icon} size="1em" /> Size
                </ItemTitle>
                <ItemDescription>
                    Size of the mouse highlight in pixels
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <NumberInput
                    step={10}
                    className="w-32 h-8"
                    value={mouse.size}
                    onChange={(size) => setMouseStyle({ size })}
                    isDisabled={!mouse.showClicks}
                />
            </ItemActions>
        </Item>

        <Item variant="muted">
            <ItemContent>
                <ItemTitle>
                    <HugeiconsIcon icon={PaintBoardIcon} size="1em" /> Click Color
                </ItemTitle>
            </ItemContent>
            <ItemActions>
                <ColorInput
                    className="w-32"
                    value={mouse.color}
                    onChange={(color) => setMouseStyle({ color })}
                    disabled={!mouse.showClicks}
                />
            </ItemActions>
        </Item>

        <Item variant="muted">
            <ItemContent>
                <ItemTitle>
                    <HugeiconsIcon icon={Drag03Icon} size="1em" /> Drag Threshold
                </ItemTitle>
                <ItemDescription>
                    Minimum distance in pixels to show Drag event
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <NumberInput
                    className="w-32 h-8"
                    value={dragThreshold}
                    onChange={setDragThreshold}
                />
            </ItemActions>
        </Item>

        <Item variant="muted">
            <ItemContent>
                <ItemTitle>
                    <HugeiconsIcon icon={KeyboardIcon} size="1em" /> Mouse Events
                </ItemTitle>
                <ItemDescription>
                    Visualize mouse events like click, drag, etc. <br /> along with key events
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Switch
                    checked={showMouseEvents}
                    onCheckedChange={(checked) => setShowMouseEvents(checked)}
                />
            </ItemActions>
        </Item>
    </div>;
}