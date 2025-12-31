import { keymaps } from "@/lib/keymaps";
import { useKeyStyle } from "@/stores/key_style";
import { KeyEvent } from "@/types/event";
import { Alignment } from "@/types/style";


function title(text: string): string {
  // handle space in text
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const alignmentForRow: Record<Alignment, Pick<React.CSSProperties, 'justifyContent' | 'alignItems'>> = {
  'top-left': { justifyContent: 'flex-start', alignItems: 'flex-start' },
  'top-center': { justifyContent: 'center', alignItems: 'flex-start' },
  'top-right': { justifyContent: 'flex-end', alignItems: 'flex-start' },
  'center-left': { justifyContent: 'flex-start', alignItems: 'center' },
  'center': { justifyContent: 'center', alignItems: 'center' },
  'center-right': { justifyContent: 'flex-end', alignItems: 'center' },
  'bottom-left': { justifyContent: 'flex-start', alignItems: 'flex-end' },
  'bottom-center': { justifyContent: 'center', alignItems: 'flex-end' },
  'bottom-right': { justifyContent: 'flex-end', alignItems: 'flex-end' },
};

export const KeycapBase = ({ keyData }: { keyData: KeyEvent }) => {
  const { text, modifier } = useKeyStyle();
  const display = keymaps[keyData.name];

  const color = keyData.isModifier() && modifier.highlight ? modifier.textColor : text.color;
  const textStyle: React.CSSProperties = {
    color,
    lineHeight: 1.2,
    fontSize: text.size,
  };

  const label = () => {
    let value = modifier.textVariant === "text-short"
      ? display.shortLabel ?? display.label
      : display.label;

    switch (text.caps) {
      case "uppercase":
        return value.toUpperCase();
      case "title":
        return title(value);
      default: // lowercase by default
        return value;
    }
  };

  const flexAlignment = alignmentForRow[text.alignment];

  // ───────────── With Icon ─────────────
  if (text.showIcon && display.icon) {
    const Icon = display.icon;
    if (modifier.textVariant === "icon" || keyData.isArrow()) {
      return <Icon color={color} size={text.size * 0.8} />;
    } else {
      return <div 
        className="w-full h-full flex flex-col justify-between" 
        // flip alignment for column
        style={{ alignItems: flexAlignment.justifyContent }}
      >
        <Icon color={color} size={text.size * 0.5} />
        <div style={{ ...textStyle, fontSize: text.size * 0.6 }}>{label()}</div>
      </div>;
    }
  }
  // ───────────── With Symbol ─────────────
  else if (text.showSymbol && display.symbol) {
    return <div
      className="w-full h-full flex flex-col"
      style={{ 
        ...textStyle, 
        fontSize: text.size * 0.64, 
        alignItems: flexAlignment.justifyContent,
        justifyContent: flexAlignment.alignItems
      }}
    >
      <span>{display.symbol}</span>
      <span className="font-semibold">{display.label}</span>
    </div>
  }
  // ───────────── Numpad ─────────────
  else if (keyData.isNumpad()) {
    return <div
      className="w-full h-full flex flex-col justify-between"
      style={{
        ...textStyle,
        fontSize: text.size * 0.5,
        alignItems: flexAlignment.alignItems,
        justifyContent: flexAlignment.justifyContent
      }}
    >
      <div>{label()}</div>
      {
        display.symbol && <div>{display.symbol}</div>
      }
    </div>;
  }
  // ───────────── Text Only ─────────────
  return (
    <div
      className="w-full h-full flex"
      style={{ ...textStyle, alignItems: flexAlignment.alignItems, justifyContent: flexAlignment.justifyContent }}
    >{label()}
    </div>
  );
}