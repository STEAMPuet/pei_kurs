import type React from "react";
import { AbilityLadder } from "../AbilityStairs";
import { ABILITIES, C } from "../theme";
import { Appear, Quote, SceneShell } from "../ui";

// Спільна розкладка для чотирьох здібностей: «драбина» ліворуч, вміст праворуч.
export const CONTENT_LEFT = 680;
export const CONTENT_WIDTH = 1130;

export const AbilityLayout: React.FC<{
  readonly index: 0 | 1 | 2 | 3;
  readonly title: string;
  readonly children: React.ReactNode;
}> = ({ index, title, children }) => (
  <SceneShell kicker={`3 · Здібність ${index + 1}/4`} title={title}>
    <AbilityLadder active={index} style={{ position: "absolute", left: 110, top: 330 }} />
    {children}
  </SceneShell>
);

// Картка визначення здібності.
export const Definition: React.FC<{
  readonly index: 0 | 1 | 2 | 3;
  readonly at: number;
  readonly children: React.ReactNode;
}> = ({ index, at, children }) => {
  const a = ABILITIES[index];
  return (
    <Appear at={at} style={{ position: "absolute", left: CONTENT_LEFT, top: 290, width: CONTENT_WIDTH }}>
      <div
        style={{
          boxSizing: "border-box",
          borderRadius: 32,
          backgroundColor: C.surface,
          border: `2px solid ${C.line}`,
          borderLeft: `12px solid ${a.color}`,
          boxShadow: C.shadow,
          padding: "40px 48px",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: 3, color: a.color, textTransform: "uppercase" }}>Визначення</div>
        {children}
      </div>
    </Appear>
  );
};

export const ExampleLabel: React.FC<{ readonly at: number; readonly index: 0 | 1 | 2 | 3; readonly text: string }> = ({
  at,
  index,
  text,
}) => (
  <Appear at={at} style={{ position: "absolute", left: CONTENT_LEFT, top: 268 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div
        style={{
          padding: "8px 22px",
          borderRadius: 999,
          backgroundColor: ABILITIES[index].color,
          color: "#FFFDF9",
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        Приклад
      </div>
      <div style={{ fontWeight: 700, fontSize: 38, color: C.inkSoft }}>{text}</div>
    </div>
  </Appear>
);

export const Takeaway: React.FC<{ readonly at: number; readonly index: 0 | 1 | 2 | 3; readonly children: React.ReactNode }> = ({
  at,
  index,
  children,
}) => (
  <Appear at={at} style={{ position: "absolute", left: CONTENT_LEFT, top: 360, width: CONTENT_WIDTH }}>
    <div style={{ width: 90, height: 10, borderRadius: 10, backgroundColor: ABILITIES[index].color, marginBottom: 36 }} />
    <Quote style={{ fontSize: 64, color: C.ink }}>{children}</Quote>
  </Appear>
);
