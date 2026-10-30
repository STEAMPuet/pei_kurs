import { useCurrentFrame } from "remotion";
import { ABILITIES, C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Person, Phase, SceneShell, SpeechBubble } from "../ui";

const DETAILS: { lines: string[]; tag?: string }[] = [
  { lines: ["У себе: жар в обличчі, бажання виправдатися.", "У клієнта: підвищений голос, стиснуті руки."] },
  { lines: ["Напруга — сигнал: у контакті відбувається щось важливе.", "Увагу — саме туди."] },
  {
    lines: [
      "Її реакція: тривога, страх здатися некомпетентною.",
      "Гнів клієнта: можливо, він почувається непочутим.",
      "Виправдання, найімовірніше, посилять напругу.",
    ],
  },
  { lines: ["Видих, пауза: «Схоже, вам дуже важливо, щоб вас почули. Розкажіть, що я пропустила»."], tag: "емоцію не придушено, а враховано" },
];

export const Case: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const steps = [1, 2, 3, 4].map((i) => beatStart(scene, i));
  const active = steps.filter((s) => frame >= s).length - 1;
  return (
    <SceneShell kicker="5 · Практика" title="Розбір ситуації за моделлю">
      <div style={{ position: "absolute", left: 110, top: 232, display: "flex", alignItems: "flex-end", gap: 26 }}>
        <Appear at={cue(scene, "Ірина")} style={{ textAlign: "center" }}>
          <Person size={130} color={C.teal} />
          <div style={{ fontWeight: 700, fontSize: 30, color: C.inkSoft }}>Ірина</div>
        </Appear>
        <Appear at={cue(scene, "клієнт")} style={{ textAlign: "center" }}>
          <Person size={130} color={C.lav} />
          <div style={{ fontWeight: 700, fontSize: 30, color: C.inkSoft }}>клієнт</div>
        </Appear>
        <Appear at={cue(scene, "Ви мене")} from="left" style={{ marginBottom: 70, marginLeft: 10 }}>
          <div style={{ rotate: `${2.5 * Math.sin((frame - cue(scene, "Ви мене")) * 0.9) * Math.exp(-Math.max(0, frame - cue(scene, "Ви мене")) / 12)}deg` }}>
            <SpeechBubble bg={C.lavSoft} color={C.lavDeep}>
              «Ви мене взагалі не слухаєте!»
            </SpeechBubble>
          </div>
        </Appear>
      </div>

      <div style={{ position: "absolute", left: 110, top: 470, display: "flex", flexDirection: "column", gap: 14 }}>
        {ABILITIES.map((a, i) => {
          const on = i === active;
          const done = i < active;
          return (
            <Appear key={a.n} at={steps[0] - 20 + i * 4} from="left">
              <div
                style={{
                  width: 420,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "14px 22px",
                  borderRadius: 22,
                  backgroundColor: on ? a.color : a.soft,
                  opacity: on || done ? 1 : 0.55,
                }}
              >
                <div style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: on ? "#FFFDF9" : a.color, color: on ? a.color : "#FFFDF9", fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done ? "✓" : a.n}
                </div>
                <div style={{ fontWeight: 800, fontSize: 36, color: on ? "#FFFDF9" : C.ink }}>{a.title}</div>
              </div>
            </Appear>
          );
        })}
      </div>

      {DETAILS.map((d, i) => (
        <Phase key={i} from={steps[i]} to={i < 3 ? steps[i + 1] : undefined}>
          <Appear at={steps[i]} style={{ position: "absolute", left: 600, top: 470, width: 1210 }}>
            <div
              style={{
                boxSizing: "border-box",
                minHeight: 330,
                borderRadius: 32,
                padding: "34px 44px",
                backgroundColor: C.surface,
                border: `2px solid ${C.line}`,
                borderLeft: `12px solid ${ABILITIES[i].color}`,
                boxShadow: C.shadow,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 32, letterSpacing: 2, textTransform: "uppercase", color: ABILITIES[i].color }}>{ABILITIES[i].title}</div>
              {d.lines.map((l) => (
                <div key={l} style={{ fontWeight: 600, fontSize: 40, lineHeight: 1.32, marginTop: 14 }}>
                  {l}
                </div>
              ))}
              {d.tag ? (
                <Appear at={cue(scene, "Емоцію")} style={{ marginTop: 22 }}>
                  <div style={{ display: "inline-block", padding: "10px 26px", borderRadius: 999, backgroundColor: ABILITIES[3].soft, color: ABILITIES[3].color, fontWeight: 800, fontSize: 34 }}>
                    {d.tag}
                  </div>
                </Appear>
              ) : null}
            </div>
          </Appear>
        </Phase>
      ))}
    </SceneShell>
  );
};
