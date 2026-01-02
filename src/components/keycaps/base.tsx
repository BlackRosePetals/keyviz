import { keymaps } from "@/lib/keymaps";
import { useKeyStyle } from "@/stores/key_style";
import { KeyEvent } from "@/types/event";
import { alignmentForRow } from "@/types/style";


export const KeycapBase = ({ keyData }: { keyData: KeyEvent }) => {
  const { text, container, modifier } = useKeyStyle();
  const display = keymaps[keyData.name];

  const color = keyData.isModifier() && modifier.highlight ? modifier.textColor : text.color;
  const textStyle: React.CSSProperties = {
    color,
    lineHeight: 1.2,
    fontSize: text.size,
    textTransform: text.caps,
  };

  const label = modifier.textVariant === "text-short"
    ? display.shortLabel ?? display.label
    : display.label;

  const flexAlignment = alignmentForRow[text.alignment];

  // ───────────── With Icon ─────────────
  if (container.showIcon && display.icon) {
    const Icon = display.icon;
    if (modifier.textVariant === "icon" || keyData.isArrow()) {
      return <div 
        className="w-full h-full flex"
        style={{ alignItems: flexAlignment.alignItems, justifyContent: flexAlignment.justifyContent }}
      >
        <Icon color={color} size={text.size * 0.8} />
      </div>;
    } else {
      const alignItems = keyData.isModifier()
        ? keyData.name.includes("Right") ? "flex-end" : "flex-start"
        // flip alignment for column
        : flexAlignment.justifyContent;
      return <div
        className="w-full h-full flex flex-col justify-between"
        style={{ alignItems }}
      >
        <Icon color={color} size={text.size * 0.5} />
        <div style={{ ...textStyle, fontSize: text.size * 0.5 }}>
          {label}
        </div>
      </div>;
    }
  }
  // ───────────── With Symbol ─────────────
  else if (container.showSymbol && display.symbol) {
    return <div
      className="w-full h-full flex flex-col"
      style={{
        ...textStyle,
        fontSize: text.size * 0.56,
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
      <div>{label}</div>
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
    >
      {label}
    </div>
  );
}