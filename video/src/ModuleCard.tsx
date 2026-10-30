import type React from "react";
import { Interactive } from "remotion";
import "./fonts";

const ModuleCardInner = ({
  number,
  label,
  accent,
  style,
}: {
  readonly number: string;
  readonly label: string;
  readonly accent: string;
  readonly style?: React.CSSProperties;
}) => (
  <div
    style={{
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 44,
      backgroundColor: "#182332",
      border: "2px solid #41536a",
      borderTop: `8px solid ${accent}`,
      borderRadius: 20,
      ...style,
    }}
  >
    <div
      style={{
        fontFamily: "JetBrains Mono",
        fontWeight: 700,
        fontSize: 44,
        color: accent,
        letterSpacing: 4,
      }}
    >
      {number}
    </div>
    <div
      style={{
        fontFamily: "Exo Two",
        fontWeight: 700,
        fontSize: 58,
        lineHeight: 1.1,
        color: "#edf3fa",
      }}
    >
      {label}
    </div>
  </div>
);

export const ModuleCard = Interactive.create({
  Component: ModuleCardInner,
  layout: "none",
  schema: {
    number: { type: "string", default: "01", description: "Номер теми" },
    label: { type: "string", default: "", description: "Назва теми" },
    accent: { type: "color", default: "#00b8c4", description: "Акцент" },
  },
});
