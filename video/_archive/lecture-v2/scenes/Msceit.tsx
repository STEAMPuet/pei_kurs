import { ABILITIES, C } from "../theme";
import { cue, type SceneData } from "../timeline";
import { Appear, Arrow, Card, SceneShell, useProgress } from "../ui";

// Абстрактна шкала без чисел: тест оцінює кожну здібність окремо.
const Bar: React.FC<{ readonly at: number; readonly i: number }> = ({ at, i }) => {
  const p = useProgress(at + i * 8, 40);
  const a = ABILITIES[i];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ width: 290, fontWeight: 700, fontSize: 36 }}>{a.title}</div>
      <div style={{ width: 380, height: 26, borderRadius: 26, backgroundColor: a.soft, overflow: "hidden" }}>
        <div style={{ width: `${p * [62, 74, 56, 68][i]}%`, height: "100%", borderRadius: 26, backgroundColor: a.color }} />
      </div>
    </div>
  );
};

export const Msceit: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const words = ABILITIES.map((a) => ({ ...a, at: cue(scene, a.verb) }));
  return (
    <SceneShell kicker="3 · Центральна модель" title="Як вимірюють: тест MSCEIT">
      <Appear at={cue(scene, "тест Маєра")} style={{ position: "absolute", left: 110, top: 260 }}>
        <Card style={{ width: 820 }}>
          <div style={{ fontWeight: 800, fontSize: 64, color: C.tealDeep }}>MSCEIT</div>
          <div style={{ fontWeight: 600, fontSize: 32, color: C.inkSoft, marginTop: 4 }}>тест Маєра–Саловея–Карузо</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 28 }}>
            {[0, 1, 2, 3].map((i) => (
              <Bar key={i} at={cue(scene, "кожної")} i={i} />
            ))}
          </div>
        </Card>
      </Appear>

      <div style={{ position: "absolute", left: 1010, top: 300, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18 }}>
        <Appear at={cue(scene, "теоретичних")}>
          <div style={{ padding: "22px 32px", borderRadius: 26, backgroundColor: C.surface, border: `2px dashed ${C.line}`, fontWeight: 700, fontSize: 40 }}>
            теоретичні міркування
          </div>
        </Appear>
        <Appear at={cue(scene, "емпіричних")} style={{ rotate: "90deg", marginLeft: 120 }}>
          <Arrow at={cue(scene, "емпіричних")} width={100} />
        </Appear>
        <Appear at={cue(scene, "емпіричних")}>
          <div style={{ padding: "22px 32px", borderRadius: 26, backgroundColor: C.tealSoft, fontWeight: 800, fontSize: 40, color: C.tealDeep }}>
            емпіричні дослідження
          </div>
        </Appear>
      </div>

      <div style={{ position: "absolute", left: 110, right: 110, top: 770, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        {words.map((w, i) => (
          <div key={w.n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Appear at={w.at} from="scale">
              <div style={{ padding: "14px 30px", borderRadius: 999, backgroundColor: w.color, color: "#FFFDF9", fontWeight: 800, fontSize: 44 }}>{w.verb}</div>
            </Appear>
            {i < 3 ? <Arrow at={words[i + 1].at - 6} width={70} /> : null}
          </div>
        ))}
      </div>
    </SceneShell>
  );
};
