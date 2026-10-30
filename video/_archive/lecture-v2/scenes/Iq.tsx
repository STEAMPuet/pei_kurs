import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Card, Chip, SceneShell } from "../ui";

const Outcome: React.FC<{ readonly at: number; readonly text: string }> = ({ at, text }) => {
  const frame = useCurrentFrame();
  const stamp = interpolate(frame, [at + 18, at + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Appear at={at} from="right">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: 880,
          padding: "24px 34px",
          borderRadius: 26,
          backgroundColor: C.surface,
          border: `2px dashed ${C.line}`,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 44 }}>{text}</div>
        <div style={{ fontWeight: 700, fontSize: 30, color: C.lavDeep, opacity: stamp }}>не гарантовано</div>
      </div>
    </Appear>
  );
};

export const Iq: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const b1 = beatStart(scene, 1);
  return (
    <SceneShell kicker="1 · Передумови" title="Межі оцінювання через IQ">
      <Appear at={cue(scene, "Довгий")} style={{ position: "absolute", left: 110, top: 270 }}>
        <Card style={{ width: 640, display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 120, color: C.tealDeep, lineHeight: 1 }}>IQ</div>
            <div style={{ fontWeight: 600, fontSize: 34, color: C.inkSoft }}>тести інтелекту</div>
          </div>
          <div style={{ fontWeight: 600, fontSize: 34, color: C.inkSoft }}>Інтелект ототожнювали з:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <Appear at={cue(scene, "логікою")}>
              <Chip>логікою</Chip>
            </Appear>
            <Appear at={cue(scene, "пам'яттю")}>
              <Chip>пам'яттю</Chip>
            </Appear>
            <Appear at={cue(scene, "навчання")}>
              <Chip>здатністю до навчання</Chip>
            </Appear>
          </div>
        </Card>
      </Appear>

      <div style={{ position: "absolute", left: 830, top: 270, display: "flex", flexDirection: "column", gap: 22 }}>
        <Appear at={b1}>
          <div style={{ fontWeight: 700, fontSize: 38, color: C.inkSoft, marginBottom: 4 }}>Високий IQ сам собою:</div>
        </Appear>
        <Outcome at={cue(scene, "професійного")} text="Професійний успіх" />
        <Outcome at={cue(scene, "спілкування")} text="Ефективне спілкування" />
        <Outcome at={cue(scene, "благополуччя")} text="Благополуччя" />
        <Appear at={cue(scene, "Людям")} style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 36, color: C.inkSoft, marginBottom: 14 }}>Можливі труднощі:</div>
          <div style={{ display: "flex", gap: 14 }}>
            <Appear at={cue(scene, "взаємодіяти")}>
              <Chip color={C.lavDeep} bg={C.lavSoft}>
                взаємодія
              </Chip>
            </Appear>
            <Appear at={cue(scene, "керувати")}>
              <Chip color={C.lavDeep} bg={C.lavSoft}>
                емоції
              </Chip>
            </Appear>
            <Appear at={cue(scene, "пристосовуватися")}>
              <Chip color={C.lavDeep} bg={C.lavSoft}>
                зміни
              </Chip>
            </Appear>
          </div>
        </Appear>
      </div>
    </SceneShell>
  );
};
