import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, SANS, SERIF } from "./theme";
import { ease, easeBack } from "./ui";

// Висота «сцени» над смугою субтитрів: уся графіка живе тут і не перекривається субтитрами.
export const STAGE_H = 880;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ───────────────────────── Камера ─────────────────────────
// Ключ камери: у кадрі `at` камера починає рух до точки (x, y) світу з масштабом z за `dur` кадрів.
export type CamKey = { readonly at: number; readonly x: number; readonly y: number; readonly z: number; readonly dur?: number };

export const useCamera = (keys: readonly CamKey[]) => {
  const frame = useCurrentFrame();
  let cur = keys[0];
  let prev = keys[0];
  for (let i = 0; i < keys.length; i++) {
    if (frame >= keys[i].at) {
      cur = keys[i];
      prev = keys[Math.max(0, i - 1)];
    }
  }
  const t = interpolate(frame, [cur.at, cur.at + (cur.dur ?? 50)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lerp = (a: number, b: number) => a + (b - a) * t;
  // масштаб інтерполюємо логарифмічно — наїзд виглядає рівномірним
  const z = Math.exp(lerp(Math.log(prev.z), Math.log(cur.z)));
  return { x: lerp(prev.x, cur.x), y: lerp(prev.y, cur.y), z };
};

// Світ сцени з камерою; viewport — уся ширина кадру й висота STAGE_H.
export const Camera: React.FC<{
  readonly keys: readonly CamKey[];
  readonly width: number;
  readonly height: number;
  readonly background?: string;
  readonly children: React.ReactNode;
}> = ({ keys, width, height, background, children }) => {
  const frame = useCurrentFrame();
  const { x, y, z } = useCamera(keys);
  // ледь помітне «дихання» камери, щоб статичні плани не застигали
  const bx = 6 * Math.sin(frame / 90);
  const by = 4 * Math.cos(frame / 110);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: STAGE_H, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          background,
          transformOrigin: "0 0",
          transform: `translate(${960 - x * z + bx}px, ${STAGE_H / 2 - y * z + by}px) scale(${z})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Ключ камери, що ставить точку світу (wx, wy) у точку екрана (sx, sy) з масштабом z.
export const aim = (at: number, wx: number, wy: number, z: number, sx = 960, sy = 440, dur?: number): CamKey => ({
  at,
  x: wx - (sx - 960) / z,
  y: wy - (sy - 440) / z,
  z,
  dur,
});

// М'яка підкладка під текст: ліворуч (side="left") або на весь кадр.
export const Veil: React.FC<{ readonly at: number; readonly until?: number; readonly dark?: boolean; readonly width?: number; readonly full?: boolean }> = ({
  at,
  until,
  dark = false,
  width = 60,
  full = false,
}) => {
  const c = dark ? "40,46,76" : "247,241,232";
  return (
    <Show at={at} until={until} from="none" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: STAGE_H }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: full ? `rgba(${c},0.82)` : `linear-gradient(90deg, rgba(${c},0.96) 0%, rgba(${c},0.8) ${width - 22}%, rgba(${c},0) ${width}%)`,
        }}
      />
    </Show>
  );
};

// Ім'я / підпис-табличка (для дослідників на лінії часу тощо).
export const Plate: React.FC<{ readonly at: number; readonly title: string; readonly sub?: string; readonly color?: string; readonly size?: number; readonly style?: React.CSSProperties }> = ({
  at,
  title,
  sub,
  color = C.ink,
  size = 56,
  style,
}) => (
  <Show at={at} from="up" style={style}>
    <div style={{ fontFamily: SANS, color }}>
      <div style={{ fontWeight: 800, fontSize: size, lineHeight: 1.1 }}>{title}</div>
      {sub ? <div style={{ fontWeight: 700, fontSize: size * 0.62, lineHeight: 1.25, color: C.inkSoft, marginTop: 8 }}>{sub}</div> : null}
    </div>
  </Show>
);

// Пігулка-мітка (поняття на схемі).
export const Pill: React.FC<{ readonly color?: string; readonly bg?: string; readonly size?: number; readonly outline?: boolean; readonly children: React.ReactNode }> = ({
  color = C.ink,
  bg = C.surface,
  size = 44,
  outline = false,
  children,
}) => (
  <div
    style={{
      display: "inline-block",
      padding: `${size * 0.32}px ${size * 0.62}px`,
      borderRadius: 999,
      backgroundColor: outline ? "transparent" : bg,
      border: outline ? `3px dashed ${color}` : undefined,
      color,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: size,
      whiteSpace: "nowrap",
      boxShadow: outline ? undefined : "0 10px 26px rgba(31,43,71,0.08)",
    }}
  >
    {children}
  </div>
);

// Плавна лінія-зв'язок, що прокреслюється від (x1,y1) до (x2,y2) з вигином.
export const Link: React.FC<{
  readonly at: number;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly bend?: number;
  readonly color?: string;
  readonly width?: number;
  readonly dashed?: boolean;
  readonly dur?: number;
  readonly opacity?: number;
}> = ({ at, x1, y1, x2, y2, bend = 0, color = C.inkMute, width = 5, dashed = false, dur = 26, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: ease });
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.2 + 10;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={1} height={1}>
      <path
        d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? `14 12` : `${len}`}
        strokeDashoffset={dashed ? 0 : len * (1 - p)}
        opacity={dashed ? p * opacity : opacity * (p > 0 ? 1 : 0)}
      />
    </svg>
  );
};

// ───────────────────────── Світло ─────────────────────────
export const Glow: React.FC<{ readonly x: number; readonly y: number; readonly r: number; readonly color: string; readonly opacity?: number }> = ({
  x,
  y,
  r,
  color,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, ${color}00 70%)`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

// ───────────────────────── Персонаж ─────────────────────────
export type Mood = "neutral" | "smile" | "tense" | "sad" | "focus" | "calm" | "angry";
export type Look = { skin: string; hair: string; top: string; bottom: string; hairStyle: "long" | "short" | "bun" };

export const LOOKS = {
  heroine: { skin: "#E9BC98", hair: "#3B2C28", top: C.teal, bottom: "#34405E", hairStyle: "long" },
  mate: { skin: "#C99572", hair: "#1F2B47", top: C.lav, bottom: "#4A4F63", hairStyle: "short" },
  psych: { skin: "#E3B08E", hair: "#5A4334", top: "#5E8FB0", bottom: "#3A4560", hairStyle: "bun" },
  client: { skin: "#D9A47E", hair: "#2E2A2A", top: "#B98A73", bottom: "#4B5066", hairStyle: "short" },
  family: { skin: "#E0B18F", hair: "#7A5A48", top: "#C9B79C", bottom: "#5B6175", hairStyle: "short" },
} as const satisfies Record<string, Look>;

// Ілюстрована людина (viewBox 200×420). facing — у який бік дивиться; seated — сидить; hold — тримає щось перед собою.
export const Person: React.FC<{
  readonly look: Look;
  readonly x: number;
  readonly y: number; // точка «підлоги» під ногами
  readonly scale?: number;
  readonly mood?: Mood;
  readonly facing?: "left" | "right" | "front";
  readonly seated?: boolean;
  readonly hold?: boolean;
  readonly speaking?: boolean;
  readonly flush?: number; // рум'янець 0..1 (напруга, жар в обличчі)
  readonly opacity?: number;
}> = ({ look, x, y, scale = 1.3, mood = "neutral", facing = "front", seated = false, hold = false, speaking = false, flush = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const dir = facing === "left" ? -1 : facing === "right" ? 1 : 0;
  const fx = dir * 10; // зсув рис обличчя в бік погляду
  const blink = frame % 107 < 4 ? 0.15 : 1;
  const breathe = 1.5 * Math.sin(frame / 22);
  const brow = {
    neutral: [0, 0],
    smile: [-2, -2],
    calm: [0, 0],
    focus: [3, -1],
    tense: [5, -3],
    angry: [7, -5],
    sad: [-5, 4],
  }[mood];
  const mouth = speaking
    ? `M ${92 + fx} 118 Q ${100 + fx} ${124 + 4 * Math.abs(Math.sin(frame / 3))} ${108 + fx} 118`
    : {
        neutral: `M ${91 + fx} 119 L ${109 + fx} 119`,
        calm: `M ${90 + fx} 118 Q ${100 + fx} 123 ${110 + fx} 118`,
        smile: `M ${88 + fx} 116 Q ${100 + fx} 128 ${112 + fx} 116`,
        focus: `M ${93 + fx} 120 L ${107 + fx} 120`,
        tense: `M ${92 + fx} 121 Q ${100 + fx} 117 ${108 + fx} 121`,
        angry: `M ${90 + fx} 123 Q ${100 + fx} 115 ${110 + fx} 123`,
        sad: `M ${90 + fx} 123 Q ${100 + fx} 116 ${110 + fx} 123`,
      }[mood];
  const legs = seated ? (
    <>
      <rect x={62} y={268} width={110} height={34} rx={17} fill={look.bottom} />
      <rect x={140} y={280} width={32} height={110} rx={16} fill={look.bottom} />
      <rect x={92} y={280} width={32} height={110} rx={16} fill={look.bottom} opacity={0.9} />
      <ellipse cx={160} cy={394} rx={24} ry={10} fill="#2C3348" />
      <ellipse cx={112} cy={394} rx={24} ry={10} fill="#2C3348" />
    </>
  ) : (
    <>
      <rect x={70} y={270} width={28} height={136} rx={14} fill={look.bottom} />
      <rect x={102} y={270} width={28} height={136} rx={14} fill={look.bottom} />
      <ellipse cx={82} cy={410} rx={22} ry={9} fill="#2C3348" />
      <ellipse cx={120} cy={410} rx={22} ry={9} fill="#2C3348" />
    </>
  );
  const hair =
    look.hairStyle === "long" ? (
      <>
        <path d="M 52 96 C 46 30 154 30 148 96 C 138 66 62 66 52 96 Z" fill={look.hair} />
      </>
    ) : look.hairStyle === "bun" ? (
      <>
        <circle cx={100} cy={40} r={20} fill={look.hair} />
        <path d="M 52 96 C 48 30 152 30 148 96 C 138 64 62 64 52 96 Z" fill={look.hair} />
      </>
    ) : (
      <path d="M 52 98 C 46 28 154 28 148 98 C 140 68 60 68 52 98 Z" fill={look.hair} />
    );
  const w = 200 * scale;
  const h = 420 * scale;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 200 420"
      style={{ position: "absolute", left: x - w / 2, top: y - h, overflow: "visible", opacity }}
    >
      <ellipse cx={100} cy={414} rx={70} ry={10} fill="#1F2B47" opacity={0.12} />
      <g transform={seated && facing === "left" ? "translate(200 0) scale(-1 1)" : undefined}>{legs}</g>
      <g transform={`translate(0 ${breathe})`}>
        {look.hairStyle === "long" ? <path d="M 54 92 C 50 40 150 40 146 92 L 150 190 C 130 200 70 200 50 190 Z" fill={look.hair} /> : null}
        <path d="M 56 168 C 56 146 76 136 100 136 C 124 136 144 146 144 168 L 140 282 L 60 282 Z" fill={look.top} />
        {hold ? (
          <>
            <path d="M 60 170 C 44 200 52 236 92 240" stroke={look.top} strokeWidth={24} fill="none" strokeLinecap="round" />
            <path d="M 140 170 C 156 200 148 236 108 240" stroke={look.top} strokeWidth={24} fill="none" strokeLinecap="round" />
            <circle cx={100} cy={240} r={13} fill={look.skin} />
          </>
        ) : (
          <>
            <rect x={38} y={160} width={24} height={112} rx={12} fill={look.top} transform="rotate(6 50 160)" />
            <rect x={138} y={160} width={24} height={112} rx={12} fill={look.top} transform="rotate(-6 150 160)" />
            <circle cx={44} cy={276} r={12} fill={look.skin} />
            <circle cx={156} cy={276} r={12} fill={look.skin} />
          </>
        )}
        <rect x={88} y={118} width={24} height={26} rx={8} fill={look.skin} />
        <circle cx={100} cy={92} r={44} fill={look.skin} />
        {look.hairStyle === "long" ? <path d="M 52 96 C 46 30 154 30 148 96 C 138 66 62 66 52 96 Z" fill={look.hair} /> : hair}
        <circle cx={78 + fx} cy={108} r={9} fill="#E58C7A" opacity={0.18 + 0.5 * flush} />
        <circle cx={122 + fx} cy={108} r={9} fill="#E58C7A" opacity={0.18 + 0.5 * flush} />
        <ellipse cx={85 + fx} cy={94} rx={4} ry={4.5 * blink} fill="#1F2B47" />
        <ellipse cx={115 + fx} cy={94} rx={4} ry={4.5 * blink} fill="#1F2B47" />
        <path d={`M ${77 + fx} ${84 + brow[0] * 0.3} L ${92 + fx} ${83 + brow[0]}`} stroke="#1F2B47" strokeWidth={3} strokeLinecap="round" />
        <path d={`M ${108 + fx} ${83 + brow[0]} L ${123 + fx} ${84 + brow[0] * 0.3}`} stroke="#1F2B47" strokeWidth={3} strokeLinecap="round" />
        <path d={mouth} stroke="#8A4B44" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};

// ───────────────────────── Хмарка емоційного стану ─────────────────────────
// М'яка «жива» пляма над головою: колір і неспокій (amp) показують стан, підпис — назву емоції.
export const MoodCloud: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly color: string;
  readonly amp?: number;
  readonly label?: string;
  readonly labelColor?: string;
  readonly labelSize?: number;
  readonly opacity?: number;
}> = ({ x, y, r, color, amp = 0.08, label, labelColor = C.ink, labelSize, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const n = 48;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + amp * Math.sin(3 * a + frame / 9) + amp * 0.6 * Math.sin(5 * a - frame / 13);
    return `${(r * k * Math.cos(a)).toFixed(1)},${(r * 0.78 * k * Math.sin(a)).toFixed(1)}`;
  });
  return (
    <div style={{ position: "absolute", left: x - r * 1.3, top: y - r * 1.3, width: r * 2.6, height: r * 2.6, opacity }}>
      <svg width={r * 2.6} height={r * 2.6} viewBox={`${-r * 1.3} ${-r * 1.3} ${r * 2.6} ${r * 2.6}`} style={{ overflow: "visible" }}>
        <polygon points={pts.join(" ")} fill={color} opacity={0.32} />
        <polygon points={pts.join(" ")} fill="none" stroke={color} strokeWidth={4} opacity={0.75} />
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: r * 0.5,
            right: r * 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: labelSize ?? Math.max(38, r * 0.32),
            color: labelColor,
            lineHeight: 1.1,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

// ───────────────────────── Текстові елементи ─────────────────────────
// Плавна поява будь-чого в кадрі `at` (без «дихання» — для світу з камерою).
export const Show: React.FC<{
  readonly at: number;
  readonly until?: number;
  readonly from?: "up" | "down" | "left" | "right" | "scale" | "none";
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ at, until, from = "up", style, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 22], [0, 1], { ...clamp, easing: ease });
  const m = interpolate(frame, [at, at + 22], [0, 1], { ...clamp, easing: easeBack });
  const out = until === undefined ? 1 : interpolate(frame, [until - 14, until], [1, 0], clamp);
  const d = 40 * (1 - m);
  const translate = from === "up" ? `0px ${d}px` : from === "down" ? `0px ${-d}px` : from === "left" ? `${-d}px 0px` : from === "right" ? `${d}px 0px` : undefined;
  return (
    <div style={{ opacity: p * out, translate, scale: from === "scale" ? String(0.8 + 0.2 * m) : undefined, ...style }}>{children}</div>
  );
};

// Опорна підписка з «виноскою» до точки на ілюстрації.
export const Callout: React.FC<{
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly tx: number;
  readonly ty: number;
  readonly color?: string;
  readonly size?: number;
  readonly children: React.ReactNode;
}> = ({ at, x, y, tx, ty, color = C.tealDeep, size = 42, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 20], [0, 1], { ...clamp, easing: ease });
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={1} height={1}>
        <line x1={x} y1={y} x2={x + (tx - x) * p} y2={y + (ty - y) * p} stroke={color} strokeWidth={3} strokeDasharray="8 8" opacity={0.8} />
        <circle cx={x} cy={y} r={7 * p} fill={color} stroke="#FFFDF9" strokeWidth={3} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: tx,
          top: ty,
          translate: "-50% -50%",
          opacity: p,
          scale: String(0.85 + 0.15 * p),
          padding: "14px 28px",
          borderRadius: 999,
          backgroundColor: C.surface,
          border: `3px solid ${color}`,
          boxShadow: C.shadow,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: size,
          color,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </>
  );
};

// Велике ключове слово / формула на весь план.
export const BigText: React.FC<{
  readonly at: number;
  readonly until?: number;
  readonly size?: number;
  readonly color?: string;
  readonly serif?: boolean;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ at, until, size = 120, color = C.ink, serif = false, style, children }) => (
  <Show at={at} until={until} from="up" style={style}>
    <div
      style={{
        fontFamily: serif ? SERIF : SANS,
        fontStyle: serif ? "italic" : undefined,
        fontWeight: serif ? 500 : 800,
        fontSize: size,
        lineHeight: 1.08,
        color,
        letterSpacing: serif ? 0 : -1,
      }}
    >
      {children}
    </div>
  </Show>
);

// Мовна «бульбашка» репліки.
export const Bubble: React.FC<{
  readonly at: number;
  readonly x: number;
  readonly y: number;
  readonly tail?: "left" | "right";
  readonly bg?: string;
  readonly color?: string;
  readonly size?: number;
  readonly maxWidth?: number;
  readonly wiggle?: boolean;
  readonly children: React.ReactNode;
}> = ({ at, x, y, tail = "left", bg = C.surface, color = C.ink, size = 46, maxWidth = 760, wiggle = false, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 18], [0, 1], { ...clamp, easing: easeBack });
  const rot = wiggle ? 2.5 * Math.sin((frame - at) * 0.9) * Math.exp(-Math.max(0, frame - at) / 12) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        maxWidth,
        opacity: Math.min(1, p * 1.5),
        scale: String(0.6 + 0.4 * p),
        rotate: `${rot}deg`,
        transformOrigin: tail === "left" ? "10% 100%" : "90% 100%",
        padding: "24px 36px",
        borderRadius: 34,
        backgroundColor: bg,
        color,
        boxShadow: C.shadow,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.25,
      }}
    >
      {children}
      <div style={{ position: "absolute", bottom: -14, [tail]: 50, width: 30, height: 30, backgroundColor: bg, rotate: "45deg" }} />
    </div>
  );
};

// Невеликий ярлик розділу в лівому верхньому куті (орієнтир, а не заголовок кожного кадру).
export const ChapterTag: React.FC<{ readonly children: string }> = ({ children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 20], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 44,
          opacity: p,
          padding: "10px 22px",
          borderRadius: 999,
          backgroundColor: "rgba(255, 253, 249, 0.85)",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: C.tealDeep,
          boxShadow: "0 6px 18px rgba(31,43,71,0.06)",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Плавне з'явлення/зникнення всієї сцени (без «в'їзду» — рух тепер дає камера).
export const SceneFade: React.FC<{ readonly duration: number; readonly children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12, duration - 12, duration], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
