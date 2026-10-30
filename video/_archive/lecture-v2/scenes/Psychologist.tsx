import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Chip, NumberBadge, Phase, SceneShell, useProgress } from "../ui";

const CX = 960;
const CY = 500;
const R = 130;

type Item = { n: number; title: string; text: string; x: number; y: number; color: string; anchor: [number, number] };

// Дві колонки по боках від «Психолога» і п'ята картка під ним; усе вище зони субтитрів.
const ITEMS: Item[] = [
  { n: 1, title: "Емоційна усвідомленість", text: "свої емоції окремо від переживань клієнта", x: 110, y: 240, color: C.teal, anchor: [710, 320] },
  { n: 2, title: "Емпатія й альянс", text: "довірливий контакт і співпраця з клієнтом", x: 1210, y: 240, color: "#5E8FB0", anchor: [1210, 320] },
  { n: 3, title: "Психодіагностика", text: "точніше бачити поведінку й приховані переживання", x: 110, y: 455, color: C.lav, anchor: [710, 535] },
  { n: 4, title: "Робота з людьми в кризі", text: "саморегуляція і професійна витримка", x: 1210, y: 455, color: C.lavDeep, anchor: [1210, 535] },
  { n: 5, title: "Профілактика вигорання", text: "помічати виснаження, знати свої ресурси", x: 660, y: 678, color: C.tealDeep, anchor: [960, 678] },
];

const Link: React.FC<{ readonly at: number; readonly to: [number, number]; readonly color: string }> = ({ at, to, color }) => {
  const p = useProgress(at, 24);
  const [x, y] = to;
  return (
    <line
      x1={CX}
      y1={CY}
      x2={CX + (x - CX) * p}
      y2={CY + (y - CY) * p}
      stroke={color}
      strokeWidth={4}
      strokeDasharray="10 12"
      opacity={0.6}
    />
  );
};

// Хвилі, що розходяться від «Психолога»: емпатія, контакт, вплив на інших.
const Ripples: React.FC<{ readonly at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  if (frame < at + 20) {
    return null;
  }
  return (
    <>
      {[0, 1, 2].map((k) => {
        const t = ((frame - at - 20 + k * 40) % 120) / 120;
        return <circle key={k} cx={CX} cy={CY} r={R + 26 + t * 150} fill="none" stroke={C.teal} strokeWidth={3} opacity={0.35 * (1 - t)} />;
      })}
    </>
  );
};

export const Psychologist: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const b1 = beatStart(scene, 1);
  const starts = [1, 2, 3, 4, 5].map((i) => beatStart(scene, i));
  return (
    <SceneShell kicker="4 · ЕІ у роботі психолога" title="Чому це важливо для психолога">
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {ITEMS.map((it, i) => (
          <Link key={it.n} at={starts[i]} to={it.anchor} color={it.color} />
        ))}
        <Ripples at={cue(scene, "Психолог працює")} />
      </svg>
      <Appear at={cue(scene, "Психолог працює")} from="scale" idle={0} style={{ position: "absolute", left: CX - R, top: CY - R }}>
        <div
          style={{
            width: R * 2,
            height: R * 2,
            borderRadius: R * 2,
            backgroundColor: C.surface,
            border: `4px solid ${C.teal}`,
            boxShadow: `0 0 0 26px ${C.tealSoft}, ${C.shadow}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 44,
          }}
        >
          Психолог
        </div>
      </Appear>

      <Phase from={0} to={b1}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", gap: 18 }}>
          <Appear at={cue(scene, "стрес")}>
            <Chip color={C.lavDeep} bg={C.lavSoft}>
              стрес
            </Chip>
          </Appear>
          <Appear at={cue(scene, "кризи")}>
            <Chip color={C.lavDeep} bg={C.lavSoft}>
              криза
            </Chip>
          </Appear>
          <Appear at={cue(scene, "методів")}>
            <Chip color={C.ink} bg={C.surface} style={{ border: `2px solid ${C.line}` }}>
              результат = методи + ЕІ фахівця
            </Chip>
          </Appear>
        </div>
      </Phase>

      {ITEMS.map((it, i) => (
        <Appear key={it.n} at={starts[i]} from={it.x < CX - 300 ? "left" : it.x > CX ? "right" : "up"} style={{ position: "absolute", left: it.x, top: it.y, width: 600 }}>
          <div
            style={{
              boxSizing: "border-box",
              display: "flex",
              gap: 20,
              padding: "22px 28px",
              borderRadius: 28,
              backgroundColor: C.surface,
              border: `2px solid ${C.line}`,
              boxShadow: C.shadow,
            }}
          >
            <NumberBadge n={it.n} color={it.color} size={54} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 36, lineHeight: 1.15 }}>{it.title}</div>
              <div style={{ fontWeight: 600, fontSize: 31, lineHeight: 1.28, color: C.inkSoft, marginTop: 6 }}>{it.text}</div>
            </div>
          </div>
        </Appear>
      ))}

      {/* Висновок розділу поверх схеми: ЕІ — інтегральна професійно важлива якість */}
      <Phase from={beatStart(scene, 6)}>
        <AbsoluteFill style={{ backgroundColor: "rgba(247, 241, 232, 0.82)" }} />
        <Appear at={beatStart(scene, 6)} from="scale" style={{ position: "absolute", left: 260, right: 260, top: 250 }}>
          <div style={{ borderRadius: 40, padding: "48px 60px", backgroundColor: C.surface, border: `3px solid ${C.teal}`, boxShadow: C.shadow }}>
            <div style={{ fontWeight: 700, fontSize: 32, letterSpacing: 3, color: C.tealDeep, textTransform: "uppercase" }}>Висновок розділу</div>
            <div style={{ fontWeight: 800, fontSize: 58, lineHeight: 1.2, marginTop: 14 }}>
              ЕІ — інтегральна професійно важлива якість психолога
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 34 }}>
              {[
                { w: "консультативної", t: "консультативна" },
                { w: "психодіагностичної", t: "психодіагностична" },
                { w: "психокорекційної", t: "психокорекційна" },
                { w: "психотерапевтичної", t: "психотерапевтична" },
              ].map((x, i) => (
                <Appear key={x.w} at={cue(scene, x.w)} from="scale">
                  <Chip color="#FFFDF9" bg={[C.teal, "#5E8FB0", C.lav, C.lavDeep][i]}>
                    {x.t}
                  </Chip>
                </Appear>
              ))}
            </div>
            <Appear at={cue(scene, "діяльності", 6)} style={{ marginTop: 22 }}>
              <div style={{ fontWeight: 600, fontSize: 36, color: C.inkSoft }}>діяльність — ефективніша завдяки ЕІ</div>
            </Appear>
          </div>
        </Appear>
      </Phase>
    </SceneShell>
  );
};
