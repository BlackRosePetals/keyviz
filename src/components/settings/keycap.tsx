import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlignmentSelector } from "@/components/ui/alignment-selector";
import { ColorInput } from "@/components/ui/color-picker";
import { GradientInput } from "@/components/ui/gradient-picker";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGrid, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useKeyStyleSync as useKeyStyle } from "@/stores/key_style";


export const KeycapSettings = () => {

    const text = useKeyStyle(state => state.text);
    const setTextStyle = useKeyStyle(state => state.setText);

    const modifier = useKeyStyle(state => state.modifier);
    const setModifierStyle = useKeyStyle(state => state.setModifier);

    const container = useKeyStyle(state => state.container);
    const setContainer = useKeyStyle(state => state.setContainer);

    const border = useKeyStyle(state => state.border);
    const setBorder = useKeyStyle(state => state.setBorder);

    const background = useKeyStyle(state => state.background);
    const setBackground = useKeyStyle(state => state.setBackground);

    return <div className="flex flex-col gap-y-4 p-6">
        <div className="sticky top-6 z-10 w-full h-40 outline bg-linear-to-b from-primary/10 to-background rounded-lg">
        </div>

        <Accordion type="multiple" className="w-full" defaultValue={["text"]}>
            <AccordionItem value="text">
                <AccordionTrigger>Text</AccordionTrigger>
                <AccordionContent className="h-fit flex flex-col gap-4">
                    <ItemGrid className="md:grid-cols-[240px_1fr]">
                        <AlignmentSelector
                            value={text.alignment}
                            onChange={(value) => setTextStyle({ alignment: value })}
                            className="w-full h-48 text-2xl"
                        />
                        <ItemGroup>
                            <Item variant="muted" className="flex-2">
                                <ItemContent>
                                    <ItemTitle>Size</ItemTitle>
                                </ItemContent>
                                <ItemActions>
                                    <NumberInput
                                        value={text.size}
                                        onChange={(value) => setTextStyle({ size: value })} minValue={8}
                                        className="w-24 h-8"
                                    />
                                </ItemActions>
                            </Item>
                            <Item variant="muted" className="flex-2">
                                <ItemContent>
                                    <ItemTitle>Modifier Text</ItemTitle>
                                </ItemContent>
                                <ItemActions>
                                    <Select value={modifier.textVariant} onValueChange={(value) => {
                                        setModifierStyle({ textVariant: value as any });
                                        if (value === "icon") {
                                            setTextStyle({ showIcon: true });
                                        }
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="text variant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text-short">Short Text</SelectItem>
                                            <SelectItem value="text">Full Text</SelectItem>
                                            <SelectItem value="icon">Icon Only</SelectItem>
                                        </SelectContent>
                                    </Select>

                                </ItemActions>
                            </Item>
                            <Item variant="muted" className="flex-2">
                                <ItemContent>
                                    <ItemTitle>Text Cap</ItemTitle>
                                </ItemContent>
                                <ItemActions>
                                    <ToggleGroup
                                        type="single"
                                        value={text.caps} onValueChange={(value) => setTextStyle({ caps: value as 'uppercase' | 'title' | 'lowercase' })}
                                        variant="outline"
                                    >
                                        <ToggleGroupItem value="uppercase">AA</ToggleGroupItem>
                                        <ToggleGroupItem value="title">Aa</ToggleGroupItem>
                                        <ToggleGroupItem value="lowercase">aa</ToggleGroupItem>
                                    </ToggleGroup>
                                </ItemActions>
                            </Item>
                        </ItemGroup>
                    </ItemGrid>
                    <ItemGrid>
                        <Item variant="muted" className={modifier.highlight ? "" : "col-span-2"}>
                            <ItemContent>
                                <ItemTitle>Text Color</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <ColorInput value={text.color} onChange={(color) => setTextStyle({ color })} />
                            </ItemActions>
                        </Item>
                        {
                            modifier.highlight &&
                            <Item variant="muted">
                                <ItemContent>
                                    <ItemTitle>Modifier Color</ItemTitle>
                                </ItemContent>
                                <ItemActions>
                                    <ColorInput value={modifier.textColor} onChange={(textColor) => setModifierStyle({ textColor })} />
                                </ItemActions>
                            </Item>
                        }
                    </ItemGrid>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="container">
                <AccordionTrigger>Container</AccordionTrigger>
                <AccordionContent className="h-fit flex flex-col gap-4">
                    <ItemGrid className="min-h-14">
                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Show Icon</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <Switch checked={text.showIcon} onCheckedChange={(checked) => setTextStyle({ showIcon: checked })} disabled={modifier.textVariant === "icon"} />
                            </ItemActions>
                        </Item>
                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Show Symbol</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <Switch checked={text.showSymbol} onCheckedChange={(checked) => setTextStyle({ showSymbol: checked })} />
                            </ItemActions>
                        </Item>
                    </ItemGrid>
                    <Item variant="muted">
                        <ItemContent>
                            <ItemTitle>Highlight Modifier</ItemTitle>
                            <ItemDescription>Use different color for modifier keys</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <Switch checked={modifier.highlight} onCheckedChange={(highlight) => setModifierStyle({ highlight })} />
                        </ItemActions>
                    </Item>
                    {modifier.highlight && <h2>Normal Color</h2>}
                    <ItemGrid>
                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Primary</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <GradientInput value={container.color} onChange={(color) => setContainer({ color: color as string })} />
                            </ItemActions>
                        </Item>
                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Secondary</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <GradientInput value={container.secondaryColor} onChange={(color) => setContainer({ secondaryColor: color as string })} />
                            </ItemActions>
                        </Item>
                    </ItemGrid>
                    {
                        modifier.highlight &&
                        <>
                            <h2>Modifier Color</h2>
                            <ItemGrid>
                                <Item variant="muted">
                                    <ItemContent>
                                        <ItemTitle>Primary</ItemTitle>
                                    </ItemContent>
                                    <ItemActions>
                                        <GradientInput value={modifier.color} onChange={(color) => setModifierStyle({ color: color as string })} />
                                    </ItemActions>
                                </Item>
                                <Item variant="muted">
                                    <ItemContent>
                                        <ItemTitle>Secondary</ItemTitle>
                                    </ItemContent>
                                    <ItemActions>
                                        <GradientInput value={modifier.secondaryColor} onChange={(color) => setModifierStyle({ secondaryColor: color as string })} />
                                    </ItemActions>
                                </Item>
                            </ItemGrid>
                        </>
                    }
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="border">
                <AccordionTrigger>Border</AccordionTrigger>
                <AccordionContent className="h-fit flex flex-col gap-4">
                    <Item variant="muted">
                        <ItemContent className="min-h-6 h-full justify-center">
                            <ItemTitle>Enable</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <Switch id="borderEnabled" checked={border.enabled} onCheckedChange={(enabled) => setBorder({ enabled })} />
                        </ItemActions>
                    </Item>
                    <ItemGrid>
                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Width</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <NumberInput
                                    minValue={1}
                                    value={border.width}
                                    onChange={(width) => setBorder({ width })}
                                    className="max-w-20 h-8"
                                    isDisabled={!border.enabled}
                                />
                            </ItemActions>
                        </Item>
                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Color</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <ColorInput
                                    value={border.color}
                                    onChange={(color) => setBorder({ color: color as string })}
                                    disabled={!border.enabled}
                                />
                            </ItemActions>
                        </Item>
                    </ItemGrid>
                    <Item variant="muted">
                        <ItemContent>
                            <ItemTitle>Radius</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <div className="w-4 h-4 border-l-2 border-t-2 border-primary/50" style={{ borderTopLeftRadius: `${border.radius}%` }} />
                            <Slider
                                value={[border.radius]}
                                onValueChange={(value) => setBorder({ radius: value[0] })}
                                className="w-40 h-8 mx-2"
                                disabled={!border.enabled}
                            />
                            <Label htmlFor="borderRadius" className="w-[4ch] font-mono text-right">{border.radius}%</Label>
                        </ItemActions>
                    </Item>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="background">
                <AccordionTrigger>Background</AccordionTrigger>
                <AccordionContent className="h-fit flex flex-col gap-4">
                    <ItemGrid>
                        <Item variant="muted">
                            <ItemContent className="min-h-6 h-full justify-center">
                                <ItemTitle>Enable</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <Switch checked={background.enabled} onCheckedChange={(enabled) => setBackground({ enabled })} />
                            </ItemActions>
                        </Item>
                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Color</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <ColorInput value={background.color} onChange={(color) => setBackground({ color: color as string })} disabled={!background.enabled} />
                            </ItemActions>
                        </Item>
                    </ItemGrid>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>;
}