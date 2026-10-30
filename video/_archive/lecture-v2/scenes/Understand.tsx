import { useCurrentFrame, interpolate } from "remotion";
import { C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Arrow, Phase, SpeechBubble } from "../ui";
import { AbilityLayout, CONTENT_LEFT, Definition, ExampleLabel } from "./AbilityLayout";

const Skill: React.FC<{ readonly at: number; readonly text: string }> = ({ at, text }) => (
  <Appear at={at} from="left">
    <div style={{ display: "flex", alignItems: "center", gap: 20, fontWeight: 700, fontSize: 42, lineHeight: 1.25 }}>
      <div style={{ width: 20, height: 20, borderRadius: 20, backgroundColor: C.lav, flexShrink: 0 }} />
      {text}
    </div>
  </Appear>
);

const Column: React.FC<{ readonly at: number; readonly label: string; readonly bg: string; readonly children: React.ReactNode }> = ({
  at,
  label,
  bg,
  children,
}) => (
  <Appear at={at} style={{ width: 316 }}>
    <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: 2, color: C.inkSoft, textTransform: "uppercase", marginBottom: 14 }}>{label}</div>
    <div style={{ boxSizing: "border-box", height: 360, borderRadius: 30, backgroundColor: bg, padding: "30px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
      {children}
    </div>
  </Appear>
);

const Struck: React.FC<{ readonly at: number; readonly children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <span style={{ position: "relative", color: C.inkMute }}>
      {children}
      <span style={{ position: "absolute", left: 0, top: "52%", height: 5, width: `${p * 100}%`, backgroundColor: C.peach, borderRadius: 4 }} />
    </span>
  );
};

export const Understand: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  return (
    <AbilityLayout index={2} title="Розуміння емоцій">
      <Phase from={0} to={b1}>
        <Definition index={2} at={cue(scene, "Це вміння")}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 22 }}>
            <Skill at={cue(scene, "причини")} text="визначати причини емоцій" />
            <Skill at={cue(scene, "аналізувати")} text="аналізувати, як вони змінюються" />
            <Skill at={cue(scene, "передбачати")} text="передбачати розвиток реакцій" />
            <Skill at={cue(scene, "складних")} text="усвідомлювати змішані переживання" />
          </div>
        </Definition>
      </Phase>

      <Phase from={b1} to={b2}>
        <ExampleLabel at={b1} index={2} text="роздратування ввечері" />
        <div style={{ position: "absolute", left: CONTENT_LEFT, top: 350, display: "flex", alignItems: "center", gap: 2 }}>
          <Column at={cue(scene, "Поміркувавши")} label="Причина" bg={C.surface}>
            <div style={{ fontWeight: 700, fontSize: 36, lineHeight: 1.3 }}>
              <Appear at={cue(scene, "близьких")}>
                <Struck at={cue(scene, "близьких") + 12}>не близькі</Struck>
              </Appear>
              <Appear at={cue(scene, "втомі")} style={{ marginTop: 18 }}>
                втома після напруженого дня
              </Appear>
            </div>
          </Column>
          <Arrow at={cue(scene, "втомі") + 10} width={90} />
          <Column at={cue(scene, "дратуєтеся")} label="Емоція" bg={C.lavSoft}>
            <div style={{ fontWeight: 800, fontSize: 40, lineHeight: 1.25, color: C.lavDeep }}>роздратування через дрібниці</div>
          </Column>
          <Arrow at={cue(scene, "передбачаєте")} width={90} />
          <Column at={cue(scene, "передбачаєте")} label="Прогноз" bg={C.surface}>
            <div style={{ fontWeight: 700, fontSize: 36, lineHeight: 1.3 }}>без відпочинку може перерости у сварку</div>
          </Column>
        </div>
      </Phase>

      <Phase from={b2}>
        <div style={{ position: "absolute", left: CONTENT_LEFT, top: 360, display: "flex", flexDirection: "column", gap: 60 }}>
          <Appear at={cue(scene, "чому")}>
            <SpeechBubble bg={C.lavSoft} color={C.lavDeep} style={{ fontSize: 60 }}>
              Чому я це відчуваю?
            </SpeechBubble>
          </Appear>
          <Appear at={cue(scene, "що може")} style={{ marginLeft: 200 }}>
            <SpeechBubble tail="right" style={{ fontSize: 60 }}>
              Що може статися далі?
            </SpeechBubble>
          </Appear>
        </div>
      </Phase>
    </AbilityLayout>
  );
};
