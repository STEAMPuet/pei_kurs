import { useCurrentFrame } from "remotion";
import { ABILITIES, C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Phase } from "../ui";
import { AbilityLayout, CONTENT_LEFT, CONTENT_WIDTH, Definition, ExampleLabel } from "./AbilityLayout";

// Три кола, що повільно «дихають»: пауза й видихи.
const Breath: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
      {[0, 1, 2].map((i) => {
        const s = 0.75 + 0.25 * Math.sin(frame / 22 - i * 0.9);
        return <div key={i} style={{ width: 46, height: 46, borderRadius: 46, backgroundColor: C.teal, opacity: 0.35 + 0.4 * s, scale: String(s) }} />;
      })}
    </div>
  );
};

const Point: React.FC<{ readonly at: number; readonly text: string }> = ({ at, text }) => (
  <Appear at={at} from="left">
    <div style={{ display: "flex", alignItems: "center", gap: 20, fontWeight: 700, fontSize: 42, lineHeight: 1.25 }}>
      <div style={{ width: 20, height: 20, borderRadius: 20, backgroundColor: ABILITIES[3].color, flexShrink: 0 }} />
      {text}
    </div>
  </Appear>
);

const Compare: React.FC<{
  readonly at: number;
  readonly good: boolean;
  readonly title: string;
  readonly lines: readonly string[];
}> = ({ at, good, title, lines }) => (
  <Appear at={at} style={{ width: 540 }}>
    <div
      style={{
        boxSizing: "border-box",
        height: 440,
        borderRadius: 32,
        padding: "36px 40px",
        backgroundColor: good ? C.surface : "rgba(255, 253, 249, 0.6)",
        border: `3px solid ${good ? ABILITIES[3].color : C.line}`,
        boxShadow: good ? C.shadow : undefined,
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 76,
          backgroundColor: good ? ABILITIES[3].color : C.line,
          color: good ? "#FFFDF9" : C.inkMute,
          fontWeight: 800,
          fontSize: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {good ? "✓" : "✕"}
      </div>
      <div style={{ fontWeight: 800, fontSize: 52, marginTop: 22, color: good ? C.ink : C.inkMute }}>{title}</div>
      {lines.map((l) => (
        <div key={l} style={{ fontWeight: 600, fontSize: 38, lineHeight: 1.3, marginTop: 14, color: good ? C.inkSoft : C.inkMute }}>
          {l}
        </div>
      ))}
    </div>
  </Appear>
);

export const Manage: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  return (
    <AbilityLayout index={3} title="Управління емоціями">
      <Phase from={0} to={b1}>
        <Definition index={3} at={cue(scene, "найвищий")}>
          <div style={{ display: "inline-block", marginTop: 18, padding: "10px 26px", borderRadius: 999, backgroundColor: ABILITIES[3].soft, color: ABILITIES[3].color, fontWeight: 800, fontSize: 36 }}>
            найвищий рівень моделі
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 30 }}>
            <Point at={cue(scene, "контролювати")} text="контролювати свої реакції" />
            <Point at={cue(scene, "рівновагу")} text="зберігати емоційну рівновагу" />
            <Point at={cue(scene, "допомагати")} text="допомагати іншим конструктивно проживати емоції" />
          </div>
        </Definition>
      </Phase>

      <Phase from={b1} to={b2}>
        <ExampleLabel at={b1} index={3} text="різке повідомлення в робочому чаті" />
        <div style={{ position: "absolute", left: CONTENT_LEFT, top: 350, width: CONTENT_WIDTH }}>
          <Appear at={cue(scene, "різке")} from="left">
            <div style={{ display: "inline-flex", flexDirection: "column", gap: 14, padding: "26px 34px", borderRadius: "30px 30px 30px 8px", backgroundColor: C.peachSoft, border: `3px solid ${C.peach}` }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 220, height: 18, borderRadius: 9, backgroundColor: C.peach, opacity: 0.6 }} />
                <div style={{ width: 120, height: 18, borderRadius: 9, backgroundColor: C.peach, opacity: 0.6 }} />
              </div>
              <div style={{ width: 280, height: 18, borderRadius: 9, backgroundColor: C.peach, opacity: 0.6 }} />
              <div style={{ fontWeight: 700, fontSize: 32, color: "#A8644A" }}>різке повідомлення</div>
            </div>
          </Appear>
          <Appear at={cue(scene, "паузу")} style={{ display: "flex", alignItems: "center", gap: 30, margin: "34px 0 34px 120px" }}>
            <Breath />
            <div style={{ fontWeight: 700, fontSize: 38, color: C.tealDeep }}>пауза · кілька повільних видихів</div>
          </Appear>
          <Appear at={cue(scene, "Мене")} from="right" style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ maxWidth: 760, padding: "26px 34px", borderRadius: "30px 30px 8px 30px", backgroundColor: C.tealSoft, fontWeight: 700, fontSize: 40, lineHeight: 1.3, color: C.ink }}>
              «Мене засмутив тон повідомлення. Пропоную обговорити питання».
            </div>
          </Appear>
        </div>
      </Phase>

      <Phase from={b2}>
        <div style={{ position: "absolute", left: CONTENT_LEFT, top: 300, display: "flex", gap: 50 }}>
          <Compare at={cue(scene, "придушувати")} good={false} title="Придушення" lines={["заперечити емоцію", "сховати її"]} />
          <Compare at={cue(scene, "визнають")} good title="Регулювання" lines={["визнати емоцію", "обрати, як і коли її виразити"]} />
        </div>
      </Phase>
    </AbilityLayout>
  );
};
