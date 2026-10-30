import { AbsoluteFill, useVideoConfig } from "remotion";
import { ABILITIES, C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Chip, NumberBadge, Phase, SceneShell } from "../ui";

const Point: React.FC<{ readonly at: number; readonly children: React.ReactNode }> = ({ at, children }) => (
  <Appear at={at} from="left">
    <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ width: 22, height: 22, borderRadius: 22, backgroundColor: C.teal, flexShrink: 0 }} />
      <div style={{ fontWeight: 700, fontSize: 46, lineHeight: 1.25 }}>{children}</div>
    </div>
  </Appear>
);

const QUESTIONS = [
  { word: "Які зміни", text: "Які зміни в поглядах на інтелект підготували появу поняття ЕІ?" },
  { word: "Чим управління", text: "Чим управління емоціями відрізняється від їх придушення?" },
  { word: "Як емоційний", text: "Як емоційний інтелект допомагає психологові запобігати вигоранню?" },
];

export const Summary: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const { durationInFrames } = useVideoConfig();
  const b2 = beatStart(scene, 2);
  const thanks = cue(scene, "Дякую");
  return (
    <>
      <Phase from={0} to={thanks}>
        <SceneShell kicker="Підсумки" title={"Ключові висновки"}>
          <Phase from={0} to={b2}>
            <div style={{ position: "absolute", left: 110, top: 280, right: 110, display: "flex", flexDirection: "column", gap: 34 }}>
              <Point at={cue(scene, "виник")}>ЕІ — відповідь на межі суто когнітивного погляду на інтелект</Point>
              <Appear at={cue(scene, "чотири")} from="left">
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginLeft: 48 }}>
                  {ABILITIES.map((a, i) => (
                    <div key={a.n} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ padding: "12px 26px", borderRadius: 999, backgroundColor: a.color, color: "#FFFDF9", fontWeight: 800, fontSize: 38 }}>{a.title}</div>
                      {i < 3 ? <div style={{ fontWeight: 800, fontSize: 40, color: C.inkMute }}>→</div> : null}
                    </div>
                  ))}
                </div>
              </Appear>
              <Point at={cue(scene, "придушення")}>Управління емоціями ≠ їх придушення</Point>
              <Point at={cue(scene, "психолога")}>Для психолога — складова компетентності й збереження здоров'я</Point>
            </div>
          </Phase>

          <Phase from={b2}>
            <Appear at={b2} style={{ position: "absolute", left: 110, top: 250 }}>
              <div style={{ fontWeight: 700, fontSize: 34, letterSpacing: 3, color: C.lavDeep, textTransform: "uppercase" }}>Запитання для самоперевірки</div>
            </Appear>
            <div style={{ position: "absolute", left: 110, right: 110, top: 320, display: "flex", flexDirection: "column", gap: 24 }}>
              {QUESTIONS.map((q, i) => (
                <Appear key={q.word} at={cue(scene, q.word)} from="left">
                  <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "24px 34px", borderRadius: 28, backgroundColor: C.surface, border: `2px solid ${C.line}`, boxShadow: C.shadow }}>
                    <NumberBadge n={i + 1} color={[C.teal, C.lav, C.lavDeep][i]} size={62} />
                    <div style={{ fontWeight: 700, fontSize: 42, lineHeight: 1.25 }}>{q.text}</div>
                  </div>
                </Appear>
              ))}
            </div>
            <Appear at={cue(scene, "Зупиніть")} style={{ position: "absolute", left: 110, top: 770 }}>
              <Chip color={C.ink} bg={C.tealSoft}>
                ⏸ Зупиніть відео й спробуйте відповісти
              </Chip>
            </Appear>
          </Phase>
        </SceneShell>
      </Phase>

      <Phase from={thanks} to={durationInFrames}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: "Manrope", color: C.ink, paddingBottom: 120 }}>
          <Appear at={thanks}>
            <div style={{ fontWeight: 800, fontSize: 110, textAlign: "center" }}>Дякую за увагу!</div>
          </Appear>
          <Appear at={thanks + 10} style={{ marginTop: 30 }}>
            <div style={{ fontWeight: 600, fontSize: 40, color: C.inkSoft, textAlign: "center" }}>
              Лекція 1 · Теоретичні засади психології емоційного інтелекту
            </div>
          </Appear>
          <Appear at={thanks + 18} style={{ marginTop: 40, display: "flex", gap: 18 }}>
            <div style={{ width: 120, height: 10, borderRadius: 10, backgroundColor: C.teal }} />
            <div style={{ width: 60, height: 10, borderRadius: 10, backgroundColor: C.lav }} />
          </Appear>
        </AbsoluteFill>
      </Phase>
    </>
  );
};
