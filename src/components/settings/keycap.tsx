import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlignmentSelector } from "@/components/ui/alignment-selector";
import { ColorInput } from "@/components/ui/color-picker";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGrid, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useKeyStyle } from "@/stores/key_style";
import { PaintBoardIcon, Refresh01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";


export interface KeycapTheme {
    name: string;
    primary: string;
    secondary: string;
    text: string;
}

export const colorSchemes: KeycapTheme[] = [
    {
        name: "Silver",
        primary: "#f8f8f8",
        secondary: "#dcdcdc",
        text: "#000000",
    },
    {
        name: "Stone",
        primary: "#606060",
        secondary: "#4b4b4b",
        text: "#f8f8f8",
    },
    {
        name: "Lime",
        primary: "#606060",
        secondary: "#4b4b4b",
        text: "#D6ED17",
    },
    {
        name: "Cyber",
        primary: "#00B1D2",
        secondary: "#008ea8",
        text: "#FDDB27",
    },
    {
        name: "Turquoise",
        primary: "#42EADD",
        secondary: "#2ec4b8",
        text: "#ffffff",
    },
    {
        name: "Blue",
        primary: "#2196f3",
        secondary: "#1976d2",
        text: "#ffffff",
    },
    {
        name: "Yellow",
        primary: "#FDDB27",
        secondary: "#dfc019",
        text: "#000000",
    },
    {
        name: "Green",
        primary: "#66bb6a",
        secondary: "#43a047",
        text: "#ffffff",
    },
    {
        name: "Pink",
        primary: "#f06292",
        secondary: "#d81b60",
        text: "#ffffff",
    },
    {
        name: "Red",
        primary: "#ef5350",
        secondary: "#c62828",
        text: "#ffffff",
    },
    {
        name: "Pansy",
        primary: "#673ab7",
        secondary: "#4527a0",
        text: "#ffc107",
    },
    {
        name: "Eclipse",
        primary: "#343148",
        secondary: "#252333",
        text: "#D7C49E",
    },
    {
        name: "Bumblebee",
        primary: "#404040",
        secondary: "#2e2e2e",
        text: "#FDDB27",
    },
    {
        name: "Charcoal",
        primary: "#404040",
        secondary: "#2e2e2e",
        text: "#FFFFFF",
    },
];

export const KeycapSettings = () => {
    const text = useKeyStyle(state => state.text);
    const setTextStyle = useKeyStyle(state => state.setText);

    const modifier = useKeyStyle(state => state.modifier);
    const setModifierStyle = useKeyStyle(state => state.setModifier);

    const container = useKeyStyle(state => state.container);
    const setContainerStyle = useKeyStyle(state => state.setContainer);

    const border = useKeyStyle(state => state.border);
    const setBorderStyle = useKeyStyle(state => state.setBorder);

    const background = useKeyStyle(state => state.background);
    const setBackgroundStyle = useKeyStyle(state => state.setBackground);

    const onStyleChange = (value: string) => {
        if (value === "minimal") {
            setModifierStyle({ highlight: false });
        }
        setContainerStyle({ style: value as any });
    }

    const randomizeStyle = () => {
        const scheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
        setContainerStyle({
            color: scheme.primary,
            secondaryColor: scheme.secondary,
            showIcon: Math.random() > 0.5,
            useGradient: Math.random() > 0.5,
            showSymbol: Math.random() > 0.5
        });
        setBorderStyle({ color: scheme.secondary, radius: Math.random() });
        setTextStyle({ color: scheme.text });
        if (modifier.highlight) {
            const modScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
            setModifierStyle({
                color: modScheme.primary,
                secondaryColor: modScheme.secondary,
                borderColor: modScheme.secondary,
                textColor: modScheme.text,
                textVariant: Math.random() > 0.5 ? "text-short" : "text",
            });
        } else if (background.enabled) {
            setBackgroundStyle({ color: scheme.text });
        }
    }

    return <div className="flex flex-col p-6 gap-y-4">
        <Item variant="outline">
            <ItemContent>
                <ItemTitle>
                    Preset
                </ItemTitle>
            </ItemContent>
            <ItemActions>
                <Button variant="ghost" size="icon" onClick={randomizeStyle} className="active:rotate-90">
                    <HugeiconsIcon icon={Refresh01Icon} />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <HugeiconsIcon icon={PaintBoardIcon} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            {
                                colorSchemes.map((scheme) => (
                                    <DropdownMenuItem key={scheme.name} onClick={() => {
                                        setContainerStyle({ color: scheme.primary, secondaryColor: scheme.secondary });
                                        setBorderStyle({ color: scheme.secondary });
                                        setTextStyle({ color: scheme.text });
                                    }
                                    }>
                                        <div
                                            className="w-4 h-4 flex justify-center items-center mr-1 text-center text-xs border border-muted-foreground/20 rounded-xs"
                                            style={{ backgroundColor: scheme.primary, color: scheme.text }}
                                        >
                                            A</div>
                                        {scheme.name}
                                    </DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Select value={container.style} onValueChange={onStyleChange}>
                    <SelectTrigger className="w-28">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="minimal" >Minimal</SelectItem>
                            <SelectItem value="flat"    >Flat</SelectItem>
                            <SelectItem value="elevated">Elevated</SelectItem>
                            <SelectItem value="plastic" >Plastic</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </ItemActions>
        </Item>

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
                                        className="w-28 h-8"
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
                                            setContainerStyle({ showIcon: true });
                                        }
                                    }}>
                                        <SelectTrigger className="w-28">
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
                                        value={text.caps} onValueChange={(value) => setTextStyle({ caps: value as 'uppercase' | 'capitalize' | 'lowercase' })}
                                        variant="outline"
                                        className="w-28"
                                    >
                                        <ToggleGroupItem className="w-1/3" value="uppercase">AA</ToggleGroupItem>
                                        <ToggleGroupItem className="w-1/3" value="capitalize">Aa</ToggleGroupItem>
                                        <ToggleGroupItem className="w-1/3" value="lowercase">aa</ToggleGroupItem>
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
                    <ItemGrid className="min-h-14 md:grid-cols-3">
                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Icon</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <Switch
                                    checked={container.showIcon}
                                    onCheckedChange={(showIcon) => setContainerStyle({ showIcon })}
                                    disabled={modifier.textVariant === "icon"}
                                />
                            </ItemActions>
                        </Item>
                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Symbol</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <Switch
                                    checked={container.showSymbol}
                                    onCheckedChange={(showSymbol) => setContainerStyle({ showSymbol })}
                                />
                            </ItemActions>
                        </Item>
                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Shading</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <Switch
                                    checked={container.useGradient}
                                    onCheckedChange={(useGradient) => setContainerStyle({ useGradient })}
                                    disabled={modifier.textVariant === "icon"}
                                />
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
                    {
                        (container.style === "minimal" || container.style === "flat") ?
                            <ItemGrid>
                                <Item variant="muted" className={modifier.highlight ? "" : "col-span-2"}>
                                    <ItemContent>
                                        <ItemTitle>Normal</ItemTitle>
                                    </ItemContent>
                                    <ItemActions>
                                        <ColorInput value={container.color} onChange={(color) => setContainerStyle({ color: color as string })} />
                                    </ItemActions>
                                </Item>
                                {
                                    modifier.highlight &&
                                    <Item variant="muted">
                                        <ItemContent>
                                            <ItemTitle>Modifier</ItemTitle>
                                        </ItemContent>
                                        <ItemActions>
                                            <ColorInput value={modifier.color} onChange={(color) => setModifierStyle({ color: color as string })} />
                                        </ItemActions>
                                    </Item>
                                }
                            </ItemGrid> :
                            <>
                                {modifier.highlight && <h1>Normal Color</h1>}
                                <ItemGrid>
                                    <Item variant="muted">
                                        <ItemContent>
                                            <ItemTitle>Primary</ItemTitle>
                                        </ItemContent>
                                        <ItemActions>
                                            <ColorInput
                                                value={container.color}
                                                onChange={(color) => setContainerStyle({ color })}
                                            />
                                        </ItemActions>
                                    </Item>
                                    <Item variant="muted">
                                        <ItemContent>
                                            <ItemTitle>Secondary</ItemTitle>
                                        </ItemContent>
                                        <ItemActions>
                                            <ColorInput
                                                value={container.secondaryColor}
                                                onChange={(secondaryColor) => setContainerStyle({ secondaryColor })}
                                            />
                                        </ItemActions>
                                    </Item>
                                </ItemGrid>
                                {
                                    modifier.highlight && <>
                                        <h1>Modifier Color</h1>
                                        <ItemGrid>
                                            <Item variant="muted">
                                                <ItemContent>
                                                    <ItemTitle>Primary</ItemTitle>
                                                </ItemContent>
                                                <ItemActions>
                                                    <ColorInput
                                                        value={modifier.color}
                                                        onChange={(color) => setModifierStyle({ color })}
                                                    />
                                                </ItemActions>
                                            </Item>
                                            <Item variant="muted">
                                                <ItemContent>
                                                    <ItemTitle>Secondary</ItemTitle>
                                                </ItemContent>
                                                <ItemActions>
                                                    <ColorInput
                                                        value={modifier.secondaryColor}
                                                        onChange={(secondaryColor) => setModifierStyle({ secondaryColor })}
                                                    />
                                                </ItemActions>
                                            </Item>
                                        </ItemGrid>
                                    </>
                                }
                            </>
                    }
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="border">
                <AccordionTrigger>Border</AccordionTrigger>
                <AccordionContent className="h-fit flex flex-col gap-4">
                    <ItemGrid>
                        <Item variant="muted">
                            <ItemContent className="min-h-6 h-full justify-center">
                                <ItemTitle>Enable</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <Switch id="borderEnabled" checked={border.enabled} onCheckedChange={(enabled) => setBorderStyle({ enabled })} />
                            </ItemActions>
                        </Item>
                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Width</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <NumberInput
                                    minValue={0.5}
                                    step={0.5}
                                    value={border.width}
                                    onChange={(width) => setBorderStyle({ width })}
                                    className="max-w-20 h-8"
                                    isDisabled={!border.enabled}
                                />
                            </ItemActions>
                        </Item>
                        <Item variant="muted" className={modifier.highlight ? "" : "col-span-2"}>
                            <ItemContent>
                                <ItemTitle>Color</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <ColorInput
                                    value={border.color}
                                    onChange={(color) => setBorderStyle({ color: color as string })}
                                    disabled={!border.enabled}
                                />
                            </ItemActions>
                        </Item>
                        {
                            modifier.highlight && <Item variant="muted">
                                <ItemContent>
                                    <ItemTitle>Modifier Color</ItemTitle>
                                </ItemContent>
                                <ItemActions>
                                    <ColorInput
                                        value={modifier.borderColor}
                                        onChange={(color) => setModifierStyle({ borderColor: color as string })}
                                        disabled={!border.enabled}
                                    />
                                </ItemActions>
                            </Item>
                        }
                    </ItemGrid>
                    <Item variant="muted">
                        <ItemContent>
                            <ItemTitle>Radius</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <div className="w-4 h-4 border-l-2 border-t-2 border-primary/50" style={{ borderTopLeftRadius: `${border.radius * 100}%` }} />
                            <Slider
                                min={0}
                                max={1}
                                step={0.01}
                                value={[border.radius]}
                                onValueChange={(value) => setBorderStyle({ radius: value[0] })}
                                className="w-40 h-8 mx-2"
                                disabled={!border.enabled}
                            />
                            <Label htmlFor="borderRadius" className="w-[4ch] font-mono text-right">{(border.radius * 100).toFixed(0)}%</Label>
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
                                <Switch checked={background.enabled} onCheckedChange={(enabled) => setBackgroundStyle({ enabled })} />
                            </ItemActions>
                        </Item>
                        <Item variant="muted">
                            <ItemContent>
                                <ItemTitle>Color</ItemTitle>
                            </ItemContent>
                            <ItemActions>
                                <ColorInput value={background.color} onChange={(color) => setBackgroundStyle({ color: color as string })} disabled={!background.enabled} />
                            </ItemActions>
                        </Item>
                    </ItemGrid>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>;
}