import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, SANS } from "./theme";

// Початок кожного розділу лекції: id першої сцени → назва розділу.
export const SECTIONS: Record<string, { n: string; title: string }> = {
  iq: { n: "1", title: "Передумови" },
  history: { n: "2", title: "Історія поняття" },
  model: { n: "3", title: "Модель Маєра–Саловея–Карузо" },
  psychologist: { n: "4", title: "ЕІ у роботі психолога" },
  case: { n: "5", title: "Практика" },
  summary: { n: "✓", title: "Підсумки" },
};

export const WIPE_LEAD = 16; // кадрів до стику сцен
export const WIPE_LENGTH = 42;

// Шторка з назвою розділу: накриває стик сцен (у паузі озвучки) і відкриває нову сцену.
export const SectionWipe: React.FC<{ readonly n: string; readonly title: string }> = ({ n, title }) => {
  const frame = useCurrentFrame();
  const inOut = Easing.inOut(Easing.cubic);
  const x = interpolate(frame, [0, WIPE_LEAD, WIPE_LEAD + 8, WIPE_LENGTH], [-105, 0, 0, 105], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: inOut,
  });
  const text = interpolate(frame, [WIPE_LEAD - 6, WIPE_LEAD + 4], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* друга, світліша смуга трохи випереджає основну — м'який шлейф */}
      <div style={{ position: "absolute", inset: 0, translate: `${x * 1.08}% 0`, backgroundColor: C.lavSoft, borderRadius: 60 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${x}% 0`,
          background: `linear-gradient(120deg, ${C.tealDeep} 0%, ${C.teal} 45%, ${C.lav} 100%)`,
          borderRadius: 60,
          display: "flex",
          alignItems: "center",
          paddingLeft: 180,
          gap: 50,
          fontFamily: SANS,
          color: "#FFFDF9",
        }}
      >
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: 170,
            border: "6px solid rgba(255,253,249,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 90,
            translate: `${text}px 0`,
          }}
        >
          {n}
        </div>
        <div style={{ translate: `${text * 1.6}px 0` }}>
          <div style={{ fontWeight: 700, fontSize: 34, letterSpacing: 6, textTransform: "uppercase", opacity: 0.85 }}>Розділ</div>
          <div style={{ fontWeight: 800, fontSize: 92, lineHeight: 1.1 }}>{title}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
