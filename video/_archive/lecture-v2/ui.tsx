import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS, SERIF } from "./theme";

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
// Легкий «перебіг» на кінці руху — поява з пружинкою.
export const easeBack = Easing.bezier(0.34, 1.45, 0.64, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Поява елемента в кадрі `at` з пружинкою; `until` — плавне зникнення.
// Після появи елемент ледь помітно «дихає» (idle, px), щоб кадр не застигав.
export const Appear: React.FC<{
  readonly at: number;
  readonly until?: number;
  readonly dur?: number;
  readonly from?: "up" | "down" | "left" | "right" | "scale" | "none";
  readonly distance?: number;
  readonly idle?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ at, until, dur = 24, from = "up", distance = 44, idle = 3, style, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: ease });
  const m = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: easeBack });
  const out = until === undefined ? 1 : interpolate(frame, [until - 14, until], [1, 0], clamp);
  const d = (1 - m) * distance;
  const float = idle * p * Math.sin((frame - at) / 26 + at * 0.37);
  const translate =
    from === "up"
      ? `0px ${d + float}px`
      : from === "down"
        ? `0px ${-d + float}px`
        : from === "left"
          ? `${-d}px ${float}px`
          : from === "right"
            ? `${d}px ${float}px`
            : `0px ${float}px`;
  return (
    <div
      style={{
        opacity: p * out,
        translate,
        scale: from === "scale" ? String(0.82 + 0.18 * m) : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Частина сцени, що змінює іншу частину: з'являється в `from`, зникає в `to`.
export const Phase: React.FC<{
  readonly from: number;
  readonly to?: number;
  readonly children: React.ReactNode;
}> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  const fadeIn = from <= 0 ? 1 : interpolate(frame, [from, from + 16], [0, 1], clamp);
  const fadeOut = to === undefined ? 1 : interpolate(frame, [to - 16, to], [1, 0], clamp);
  if (frame < from - 1 || (to !== undefined && frame > to)) {
    return null;
  }
  return <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>{children}</AbsoluteFill>;
};

// Анімований прогрес 0→1 між кадрами.
export const useProgress = (at: number, dur = 30) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: ease });
};

// Перехід між сценами + повільна «камера»: вміст в'їжджає праворуч, повільно
// наближається протягом сцени й виїжджає ліворуч.
export const SceneMotion: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const enter = interpolate(frame, [0, 24], [1, 0], { ...clamp, easing: ease });
  const exit = interpolate(frame, [d - 18, d], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const opacity = interpolate(frame, [0, 12, d - 14, d], [0, 1, 1, 0], clamp);
  const zoom = interpolate(frame, [0, d], [1, 1.025]);
  return (
    <AbsoluteFill
      style={{
        opacity,
        translate: `${140 * enter - 140 * exit}px ${4 * Math.sin(frame / 70)}px`,
        scale: String(zoom),
        transformOrigin: "50% 45%",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Заголовок із «маркером», що прокреслюється під ним.
const Title: React.FC<{ readonly children: string }> = ({ children }) => {
  const sweep = useProgress(14, 30);
  return (
    <div style={{ position: "relative", isolation: "isolate", display: "inline-block", fontWeight: 800, fontSize: 66, lineHeight: 1.15, marginTop: 8 }}>
      <div
        style={{
          position: "absolute",
          left: -6,
          bottom: 6,
          height: 18,
          width: `calc(${sweep * 100}% + 12px)`,
          borderRadius: 9,
          backgroundColor: C.tealSoft,
          zIndex: -1,
        }}
      />
      {children}
    </div>
  );
};

// Оболонка сцени: заголовок розділу + перехід і «камера».
export const SceneShell: React.FC<{
  readonly kicker: string;
  readonly title: string;
  readonly children: React.ReactNode;
}> = ({ kicker, title, children }) => (
  <SceneMotion>
    <AbsoluteFill style={{ fontFamily: SANS, color: C.ink }}>
      <div style={{ position: "absolute", left: 110, top: 70, right: 110, zIndex: 0 }}>
        <Appear at={0} distance={20} idle={0}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 4,
              color: C.tealDeep,
              textTransform: "uppercase",
            }}
          >
            {kicker}
          </div>
        </Appear>
        <Appear at={4} distance={24} idle={0}>
          <Title>{title}</Title>
        </Appear>
      </div>
      {children}
    </AbsoluteFill>
  </SceneMotion>
);

export const Card: React.FC<{
  readonly style?: React.CSSProperties;
  readonly accent?: string;
  readonly children: React.ReactNode;
}> = ({ style, accent, children }) => (
  <div
    style={{
      boxSizing: "border-box",
      backgroundColor: C.surface,
      borderRadius: 32,
      border: `2px solid ${C.line}`,
      boxShadow: C.shadow,
      padding: "34px 40px",
      borderLeft: accent ? `10px solid ${accent}` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  readonly color?: string;
  readonly bg?: string;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ color = C.tealDeep, bg = C.tealSoft, style, children }) => (
  <div
    style={{
      display: "inline-block",
      padding: "12px 28px",
      borderRadius: 999,
      backgroundColor: bg,
      color,
      fontWeight: 700,
      fontSize: 38,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Quote: React.FC<{ readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({
  style,
  children,
}) => (
  <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 58, lineHeight: 1.3, ...style }}>
    {children}
  </div>
);

// Спрощена фігура людини: голова + плечі.
export const Person: React.FC<{
  readonly size?: number;
  readonly color?: string;
  readonly inner?: boolean;
  readonly style?: React.CSSProperties;
}> = ({ size = 160, color = C.teal, inner = false, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <circle cx={50} cy={32} r={18} fill={color} />
    <path d="M14 96 C14 66 30 56 50 56 C70 56 86 66 86 96 Z" fill={color} opacity={0.85} />
    {inner ? <circle cx={50} cy={74} r={9} fill="#FFFDF9" opacity={0.9} /> : null}
  </svg>
);

export const SpeechBubble: React.FC<{
  readonly color?: string;
  readonly bg?: string;
  readonly tail?: "left" | "right";
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ color = C.ink, bg = C.surface, tail = "left", style, children }) => (
  <div
    style={{
      position: "relative",
      display: "inline-block",
      backgroundColor: bg,
      color,
      borderRadius: 30,
      padding: "24px 36px",
      fontWeight: 700,
      fontSize: 44,
      boxShadow: C.shadow,
      border: `2px solid ${C.line}`,
      ...style,
    }}
  >
    {children}
    <div
      style={{
        position: "absolute",
        bottom: -16,
        [tail]: 46,
        width: 32,
        height: 32,
        backgroundColor: bg,
        borderRight: `2px solid ${C.line}`,
        borderBottom: `2px solid ${C.line}`,
        rotate: "45deg",
      }}
    />
  </div>
);

// Стрілка, що «прокреслюється» від 0 до 1.
export const Arrow: React.FC<{
  readonly at: number;
  readonly width?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}> = ({ at, width = 120, color = C.inkMute, style }) => {
  const p = useProgress(at, 24);
  return (
    <svg width={width} height={40} viewBox={`0 0 ${width} 40`} style={{ opacity: p > 0 ? 1 : 0, ...style }}>
      <line x1={4} y1={20} x2={4 + (width - 16) * p} y2={20} stroke={color} strokeWidth={5} strokeLinecap="round" />
      <path
        d={`M ${width - 22} 8 L ${width - 6} 20 L ${width - 22} 32`}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={p > 0.9 ? 1 : 0}
      />
    </svg>
  );
};

export const NumberBadge: React.FC<{
  readonly n: number | string;
  readonly color: string;
  readonly size?: number;
}> = ({ n, color, size = 64 }) => (
  <div
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: size,
      backgroundColor: color,
      color: "#FFFDF9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 800,
      fontSize: size * 0.5,
    }}
  >
    {n}
  </div>
);
