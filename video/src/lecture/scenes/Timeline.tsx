import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { aim, Camera, ChapterTag, Glow, Link, LOOKS, Person, Pill, Plate, SceneFade, Show } from "../kit";
import { C, SANS } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { ease } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LINE_Y = 450;
const FLOOR = 770;

// Хвилі «резонансу» від події.
const Ripples: React.FC<{ readonly x: number; readonly y: number; readonly at: number; readonly color: string }> = ({ x, y, at, color }) => {
  const frame = useCurrentFrame();
  if (frame < at) {
    return null;
  }
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      {[0, 1, 2, 3].map((k) => {
        const t = ((frame - at + k * 25) % 100) / 100;
        return <circle key={k} cx={x} cy={y} r={60 + 380 * t} fill="none" stroke={color} strokeWidth={5} opacity={0.5 * (1 - t)} />;
      })}
    </svg>
  );
};

// ───────────────────────── Історія поняття ─────────────────────────
export const History: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b = [0, 1, 2, 3].map((i) => beatStart(scene, i));
  const merge = interpolate(frame, [cue(scene, "взаємопов'язані") - 20, cue(scene, "взаємопов'язані") + 30], [0, 1], { ...clamp, easing: ease });
  const reach = interpolate(frame, [b[1] - 30, b[1], b[2] - 30, b[2], b[3] - 30, b[3], durationInFrames - 60, durationInFrames - 20], [1500, 2300, 2300, 3800, 3800, 5300, 5300, 6200], { ...clamp, easing: ease });
  const ev = [
    { x: 2300, year: "1985", at: cue(scene, "1985"), c: C.teal },
    { x: 3800, year: "1990", at: cue(scene, "1990"), c: "#5E8FB0" },
    { x: 5300, year: "1995", at: cue(scene, "1995"), c: C.lavDeep },
  ];
  const keys = [
    aim(0, 800, 450, 0.9, 960, 450, 1),
    aim(cue(scene, "взаємопов'язані") - 20, 1350, 450, 0.95, 960, 450, 60),
    aim(b[1] - 30, 2300, 440, 1.0, 960, 450, 50),
    aim(b[2] - 30, 3800, 440, 1.0, 960, 450, 50),
    aim(b[3] - 30, 5300, 440, 1.0, 960, 450, 50),
    aim(durationInFrames - 70, 3800, 450, 0.29, 960, 450, 60),
  ];
  return (
    <SceneFade duration={durationInFrames}>
      <Camera keys={keys} width={6400} height={880}>
        {/* два самостійні напрями, що зливаються в один */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
          <defs>
            <linearGradient id="hist-line" x1="0" x2="1">
              <stop offset="0" stopColor={C.teal} />
              <stop offset="1" stopColor={C.lav} />
            </linearGradient>
          </defs>
          <path d={`M 100 ${250 + 200 * merge} C 700 ${250 + 180 * merge} 1000 ${LINE_Y} 1500 ${LINE_Y}`} fill="none" stroke={C.teal} strokeWidth={14} strokeLinecap="round" />
          <path d={`M 100 ${650 - 200 * merge} C 700 ${650 - 180 * merge} 1000 ${LINE_Y} 1500 ${LINE_Y}`} fill="none" stroke={C.lav} strokeWidth={14} strokeLinecap="round" />
          <line x1={1500} y1={LINE_Y} x2={6250} y2={LINE_Y} stroke={C.line} strokeWidth={18} strokeLinecap="round" />
          <line x1={1500} y1={LINE_Y} x2={reach} y2={LINE_Y} stroke="url(#hist-line)" strokeWidth={18} strokeLinecap="round" opacity={merge} />
        </svg>
        <Show at={cue(scene, "дослідження інтелекту")} until={b[1] - 30} from="left" style={{ position: "absolute", left: 520, top: 170 }}>
          <Pill color={C.tealDeep} size={48}>дослідження інтелекту</Pill>
        </Show>
        <Show at={cue(scene, "дослідження емоцій")} until={b[1] - 30} from="left" style={{ position: "absolute", left: 520, top: 650 }}>
          <Pill color={C.lavDeep} size={48}>дослідження емоцій</Pill>
        </Show>
        <Show at={cue(scene, "наприкінці")} until={b[1] - 30} from="up" style={{ position: "absolute", left: 1250, top: 520 }}>
          <Pill color={C.inkSoft} size={44}>кінець XX століття</Pill>
        </Show>

        {/* події */}
        {ev.map((e) => (
          <Show key={e.year} at={e.at} from="scale" style={{ position: "absolute", left: e.x - 50, top: LINE_Y - 50 }}>
            <div style={{ width: 100, height: 100, borderRadius: 100, backgroundColor: e.c, border: "10px solid #FFFDF9", boxShadow: C.shadow, boxSizing: "border-box" }} />
          </Show>
        ))}
        {ev.map((e) => (
          <Show key={`${e.year}-y`} at={e.at} from="up" style={{ position: "absolute", left: e.x - 300, top: 110, width: 600, textAlign: "center" }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 190, lineHeight: 1, color: e.c }}>{e.year}</div>
          </Show>
        ))}
        {/* 1985: з'являється термін */}
        <Plate at={cue(scene, "Вейн")} title="Вейн Пейн" size={60} style={{ position: "absolute", left: 2300 - 380, top: 540, width: 760, textAlign: "center" }} />
        <Show at={cue(scene, "термін")} from="scale" style={{ position: "absolute", left: 2300 - 330, top: 650, width: 660, textAlign: "center" }}>
          <Pill color="#FFFDF9" bg={C.teal} size={50}>«емоційний інтелект»</Pill>
        </Show>
        {/* 1990: стаття з науковим визначенням */}
        <Plate at={cue(scene, "Джон")} title="Джон Маєр і Пітер Саловей" size={52} style={{ position: "absolute", left: 3800 - 420, top: 530, width: 840, textAlign: "center" }} />
        <Show at={cue(scene, "статтю")} from="up" style={{ position: "absolute", left: 3800 + 310, top: 220 }}>
          <div style={{ width: 170, height: 220, borderRadius: 14, backgroundColor: C.surface, boxShadow: C.shadow, padding: 24, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 14 }}>
            {[1, 0.8, 0.9, 0.6, 0.85].map((w, i) => (
              <div key={i} style={{ height: 12, borderRadius: 6, width: `${w * 100}%`, backgroundColor: i === 0 ? "#5E8FB0" : C.line }} />
            ))}
          </div>
        </Show>
        <div style={{ position: "absolute", left: 3800 - 420, top: 640, width: 840, display: "flex", justifyContent: "center", gap: 16 }}>
          {[
            { w: "сприймати", t: "сприймати" },
            { w: "розуміти", t: "розуміти" },
            { w: "керувати", t: "керувати" },
          ].map((x) => (
            <Show key={x.w} at={cue(scene, x.w, 2)} from="scale">
              <Pill color="#FFFDF9" bg="#5E8FB0" size={46}>{x.t}</Pill>
            </Show>
          ))}
        </div>
        {/* 1995: книжка і широкий резонанс */}
        <Plate at={cue(scene, "Деніела")} title="Деніел Гоулман" size={60} style={{ position: "absolute", left: 5300 - 380, top: 540, width: 760, textAlign: "center" }} />
        <Show at={cue(scene, "книжка")} from="up" style={{ position: "absolute", left: 5300 + 310, top: 230 }}>
          <div style={{ position: "relative", width: 200, height: 240 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "10px 18px 18px 10px", backgroundColor: C.lavDeep, boxShadow: C.shadow }} />
            <div style={{ position: "absolute", left: 18, top: 30, right: 20, height: 14, borderRadius: 7, backgroundColor: "rgba(255,253,249,0.8)" }} />
            <div style={{ position: "absolute", left: 18, top: 60, width: 100, height: 14, borderRadius: 7, backgroundColor: "rgba(255,253,249,0.6)" }} />
          </div>
        </Show>
        <div style={{ position: "absolute", left: 5300 - 460, top: 650, width: 920, display: "flex", justifyContent: "center", gap: 14 }}>
          {[
            { w: "саморегуляції", t: "саморегуляція" },
            { w: "емпатії", t: "емпатія" },
            { w: "соціальної", t: "соціальна взаємодія" },
          ].map((x) => (
            <Show key={x.w} at={cue(scene, x.w)} from="scale">
              <Pill color={C.lavDeep} size={42}>{x.t}</Pill>
            </Show>
          ))}
        </div>
        <Ripples x={5300} y={LINE_Y} at={cue(scene, "резонанс")} color={C.lav} />
        <Show at={cue(scene, "резонанс")} from="scale" style={{ position: "absolute", left: 5300 + 280, top: 520 }}>
          <Pill color="#FFFDF9" bg={C.lav} size={44}>широкий резонанс</Pill>
        </Show>
      </Camera>
      <Show at={0} until={b[1]} style={{ position: "absolute", left: 90, top: 110 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ink }}>Як з'явилося поняття</div>
      </Show>
      <Show at={durationInFrames - 60} from="none" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 880 }}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(247,241,232,0.55)" }} />
      </Show>
      <Show at={durationInFrames - 60} style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, color: C.ink }}>
          термін <span style={{ color: C.inkMute }}>→</span> наукове визначення <span style={{ color: C.inkMute }}>→</span> популярність
        </div>
      </Show>
      <ChapterTag>2 · Історія поняття</ChapterTag>
    </SceneFade>
  );
};

// ───────────────────────── Три підходи ─────────────────────────
// Одна людина — три «лінзи», крізь які на неї дивляться дослідники.
const Lens: React.FC<{ readonly x: number; readonly color: string; readonly at: number; readonly kind: 0 | 1 | 2 }> = ({ x, color, at, kind }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 30], [0, 1], { ...clamp, easing: ease });
  const bars = (
    <div style={{ position: "absolute", left: x + 150, top: 330, display: "flex", alignItems: "flex-end", gap: 12, opacity: p }}>
      {[70, 120, 170].map((h, i) => (
        <div key={i} style={{ width: 40, height: h * p, borderRadius: 10, backgroundColor: C.teal, opacity: 0.5 + i * 0.25 }} />
      ))}
    </div>
  );
  const badges = (
    <div style={{ position: "absolute", left: x - 330, width: 270, top: 250, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, opacity: p }}>
      {["риса", "риса", "компетентність"].map((t, i) => (
        <div key={i} style={{ padding: "8px 18px", borderRadius: 999, backgroundColor: C.lavSoft, color: C.lavDeep, fontFamily: SANS, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap", translate: `${-30 * (1 - p)}px 0` }}>{t}</div>
      ))}
    </div>
  );
  return (
    <>
      <div style={{ position: "absolute", left: x - 340, top: 120, width: 680, height: 680, borderRadius: 680, border: `12px solid ${color}`, backgroundColor: "rgba(255,253,249,0.55)", opacity: 0.35 + 0.65 * p, boxShadow: p > 0.5 ? C.shadow : undefined }} />
      <Person look={LOOKS.heroine} x={x + 30} y={FLOOR - 20} mood="neutral" />
      {kind !== 1 ? bars : null}
      {kind !== 0 ? badges : null}
          </>
  );
};

// Лінзи стоять на 1500 px одна від одної: на крупному плані сусідня повністю поза кадром.
const LENSES = [
  { x: 700, color: C.teal, title: "1 · Здібність", short: "1 · Здібність" },
  { x: 2200, color: C.lav, title: "2 · Риси й компетентності", short: "2 · Риси" },
  { x: 3700, color: C.lavDeep, title: "3 · Змішана модель", short: "3 · Змішана" },
];

export const Approaches: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const { durationInFrames } = useVideoConfig();
  const b2 = beatStart(scene, 2);
  const at = [cue(scene, "Перший"), cue(scene, "Другий"), cue(scene, "Третій")];
  const map = { x: 5600, y: 470 };
  const HUB_Y = map.y + 40;
  const HUB_R = 230;
  const fields = [
    { w: "освіті", t: "освіта" },
    { w: "управлінні", t: "управління персоналом" },
    { w: "консультуванні", t: "консультування" },
    { w: "медицині", t: "медицина" },
    { w: "військовій", t: "військова справа" },
    { w: "соціальній", t: "соціальна робота" },
  ];
  const keys = [
    aim(0, LENSES[1].x, 450, 0.5, 960, 460, 1),
    ...LENSES.map((l, i) => aim(at[i] - 6, l.x + 30, 440, 1.0, 960, 460, 45)),
    aim(b2, map.x, 460, 0.82, 960, 460, 45),
  ];
  return (
    <SceneFade duration={durationInFrames}>
      <Camera keys={keys} width={6400} height={880}>
        <Show at={0} until={b2 + 16} from="none">
        {LENSES.map((l, i) => (
          <Lens key={l.x} x={l.x} color={l.color} at={at[i]} kind={i as 0 | 1 | 2} />
        ))}
        </Show>

        {/* карта сфер, де сьогодні вивчають ЕІ */}
        <Glow x={map.x} y={map.y} r={420} color="#FFE9C9" opacity={0.9} />
        <Person look={LOOKS.heroine} x={map.x} y={map.y + 230} scale={0.9} mood="smile" />
        <Show at={b2} from="scale" style={{ position: "absolute", left: map.x - HUB_R, top: HUB_Y - HUB_R, width: HUB_R * 2, height: HUB_R * 2 }}>
          <div style={{ boxSizing: "border-box", width: "100%", height: "100%", borderRadius: "50%", border: `4px dashed ${C.line}` }} />
        </Show>
        {fields.map((f, i) => {
          const a = -Math.PI / 2 + (i - 2.5) * 0.62;
          const fx = map.x + 640 * Math.cos(a) * 1.15;
          const fy = map.y + 330 * Math.sin(a) + 40;
          return (
            <div key={f.w}>
              <Link at={cue(scene, f.w)} x1={map.x + (HUB_R * (fx - map.x)) / Math.hypot(fx - map.x, fy - HUB_Y)} y1={HUB_Y + (HUB_R * (fy - HUB_Y)) / Math.hypot(fx - map.x, fy - HUB_Y)} x2={fx} y2={fy} color={C.line} width={5} />
              <Show at={cue(scene, f.w) + 6} from="scale" style={{ position: "absolute", left: fx, top: fy, translate: "-50% -50%" }}>
                <Pill size={46}>{f.t}</Pill>
              </Show>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: map.x - 640, top: 760, width: 1280, display: "flex", justifyContent: "center", gap: 18 }}>
          {[
            { w: "стресостійкістю", t: "стресостійкість", c: C.teal },
            { w: "резильєнтністю", t: "резильєнтність", c: C.lav },
            { w: "благополуччям", t: "благополуччя", c: C.lavDeep },
          ].map((x) => (
            <Show key={x.w} at={cue(scene, x.w)} from="up">
              <Pill color="#FFFDF9" bg={x.c} size={44}>{x.t}</Pill>
            </Show>
          ))}
        </div>
      </Camera>
      <Show at={0} until={at[0]} style={{ position: "absolute", left: 90, top: 110 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ink }}>Один феномен — три погляди</div>
      </Show>
      {/* загальний план: короткі підписи під лінзами (екранні координати, без обрізання) */}
      {LENSES.map((l, i) => (
        <Show key={`ov-${l.x}`} at={6 + i * 6} until={at[0]} from="up" style={{ position: "absolute", left: 960 + (l.x - LENSES[1].x) * 0.5 - 250, top: 690, width: 500, textAlign: "center" }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: l.color }}>{l.short}</div>
        </Show>
      ))}
      {/* активний підхід: назва зверху по центру; сусідні не показуються */}
      {LENSES.map((l, i) => (
        <Show key={`t-${l.x}`} at={at[i]} until={i < 2 ? at[i + 1] - 4 : b2} from="up" style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "12px 36px", borderRadius: 999, backgroundColor: "rgba(255,253,249,0.92)", fontFamily: SANS, fontWeight: 800, fontSize: 60, color: l.color }}>{l.title}</div>
        </Show>
      ))}
      <Show at={b2 + 26} style={{ position: "absolute", left: 90, top: 110 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: C.ink, width: 560, lineHeight: 1.1 }}>Де сьогодні вивчають ЕІ</div>
      </Show>
      <ChapterTag>2 · Історія поняття</ChapterTag>
    </SceneFade>
  );
};
