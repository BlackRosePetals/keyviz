import { ColorInput } from "@/components/ui/color-picker";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { NumberInput } from "@/components/ui/number-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useKeyEventSync as useKeyEvent } from "@/stores/key_event";
import { useKeyStyle } from '@/stores/key_style';
import { Cursor01Icon, CursorMagicSelection03FreeIcons, CursorPointer01Icon, Drag03Icon, KeyboardIcon, PaintBoardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";


export const MouseSettings = () => {
    const { showClicks, keepHighlight, animation, color } = useKeyStyle(state => state.mouse);
    const setMouse = useKeyStyle(state => state.setMouse);

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
                <Switch checked={showClicks} onCheckedChange={(checked) => setMouse({ showClicks: checked })} />
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
                <Switch checked={keepHighlight} onCheckedChange={(checked) => setMouse({ keepHighlight: checked })} />
            </ItemActions>
        </Item>

        <Item variant="muted">
            <ItemContent>
                <ItemTitle>
                    <HugeiconsIcon icon={CursorPointer01Icon} size="1em" /> Animation
                </ItemTitle>
                <ItemDescription>
                    Animation when a mouse button is pressed
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Select value={animation} onValueChange={(value) => setMouse({ animation: value as any })}>
                    <SelectTrigger className="min-w-32">
                        <SelectValue placeholder="click animation" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="static">None</SelectItem>
                        <SelectItem value="ripple">Ripple</SelectItem>
                        <SelectItem value="flash">Flash</SelectItem>
                    </SelectContent>
                </Select>
            </ItemActions>
        </Item>

        <Item variant="muted">
            <ItemContent>
                <ItemTitle>
                    <HugeiconsIcon icon={PaintBoardIcon} size="1em" /> Click Color
                </ItemTitle>
            </ItemContent>
            <ItemActions>
                <ColorInput value={color} onChange={(value) => setMouse({ color: value })} className="w-32" />
            </ItemActions>
        </Item>

        <Item variant="muted">
            <ItemContent>
                <ItemTitle>
                    <HugeiconsIcon icon={Drag03Icon} size="1em" /> Drag Threshold
                </ItemTitle>
                <ItemDescription>
                    Minimum distance in pixels to show Drag event.
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <NumberInput value={dragThreshold} onChange={setDragThreshold} className="w-32 h-8" />
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
                <Switch checked={showMouseEvents} onCheckedChange={(checked) => setShowMouseEvents(checked)} />
            </ItemActions>
        </Item>
    </div>;
}