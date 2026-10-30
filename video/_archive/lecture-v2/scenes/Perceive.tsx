import { C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Chip, Person, Phase, SpeechBubble } from "../ui";
import { AbilityLayout, CONTENT_LEFT, Definition, ExampleLabel, Takeaway } from "./AbilityLayout";

const Signal: React.FC<{ readonly at: number; readonly text: string }> = ({ at, text }) => (
  <Appear at={at} from="right">
    <div
      style={{
        padding: "18px 30px",
        borderRadius: 24,
        backgroundColor: C.surface,
        border: `2px solid ${C.line}`,
        boxShadow: C.shadow,
        fontWeight: 700,
        fontSize: 38,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ width: 18, height: 18, borderRadius: 18, backgroundColor: C.lav }} />
      {text}
    </div>
  </Appear>
);

export const Perceive: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  return (
    <AbilityLayout index={0} title="Сприйняття емоцій">
      <Phase from={0} to={b1}>
        <Definition index={0} at={cue(scene, "Це вміння")}>
          <div style={{ fontWeight: 700, fontSize: 48, lineHeight: 1.25, marginTop: 14 }}>
            Розпізнавати власні емоції та емоції інших людей
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 30 }}>
            <Appear at={cue(scene, "мімікою")}>
              <Chip>міміка</Chip>
            </Appear>
            <Appear at={cue(scene, "жестами")}>
              <Chip>жести</Chip>
            </Appear>
            <Appear at={cue(scene, "інтонацією")}>
              <Chip>інтонація</Chip>
            </Appear>
            <Appear at={cue(scene, "поведінкою")}>
              <Chip>поведінка</Chip>
            </Appear>
          </div>
        </Definition>
      </Phase>

      <Phase from={b1} to={b2}>
        <ExampleLabel at={b1} index={0} text="слова й сигнали не збігаються" />
        <div style={{ position: "absolute", left: CONTENT_LEFT, top: 360, width: 460 }}>
          <Appear at={cue(scene, "Усе нормально")}>
            <SpeechBubble>«Усе нормально»</SpeechBubble>
          </Appear>
          <Appear at={cue(scene, "Колега")} style={{ marginTop: 34, marginLeft: 40 }}>
            <Person size={210} color={C.teal} />
          </Appear>
        </div>
        <Appear at={cue(scene, "розбіжність")} from="scale" style={{ position: "absolute", left: CONTENT_LEFT + 470, top: 470 }}>
          <div style={{ fontWeight: 800, fontSize: 130, color: C.peach, lineHeight: 1 }}>≠</div>
        </Appear>
        <div style={{ position: "absolute", left: CONTENT_LEFT + 620, top: 380, display: "flex", flexDirection: "column", gap: 22 }}>
          <Signal at={cue(scene, "тихо")} text="тихий голос" />
          <Signal at={cue(scene, "погляду")} text="уникає погляду" />
          <Signal at={cue(scene, "коротко")} text="короткі відповіді" />
        </div>
        <Appear at={cue(scene, "запитає")} style={{ position: "absolute", left: CONTENT_LEFT + 600, top: 720 }}>
          <SpeechBubble bg={C.lavSoft} color={C.lavDeep} tail="right" style={{ fontSize: 40 }}>
            «Як ти насправді?»
          </SpeechBubble>
        </Appear>
      </Phase>

      <Phase from={b2}>
        <Takeaway at={b2} index={0}>
          Щоб використати, зрозуміти чи регулювати емоцію, її спершу треба помітити.
        </Takeaway>
        <Appear at={cue(scene, "фундамент")} style={{ position: "absolute", left: CONTENT_LEFT, top: 720 }}>
          <Chip>сприйняття — фундамент моделі</Chip>
        </Appear>
      </Phase>
    </AbilityLayout>
  );
};
