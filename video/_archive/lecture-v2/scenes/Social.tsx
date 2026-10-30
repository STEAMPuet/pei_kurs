import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Card, Person, Phase, SceneShell, useProgress } from "../ui";

// Абстрактне коло «багатовимірного інтелекту»: сегменти без назв, два з них підсвічуються.
const Facets: React.FC<{ readonly at: number; readonly highlightAt: number }> = ({ at, highlightAt }) => {
  const frame = useCurrentFrame();
  const n = 8;
  const hl = interpolate(frame, [highlightAt, highlightAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={320} height={320} viewBox="-160 -160 320 320">
      {Array.from({ length: n }, (_, i) => {
        const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + 0.04;
        const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - 0.04;
        const r0 = 62;
        const r1 = 150;
        const p = (r: number, a: number) => `${r * Math.cos(a)} ${r * Math.sin(a)}`;
        const appear = interpolate(frame, [at + i * 4, at + i * 4 + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const special = i === 1 ? C.teal : i === 2 ? C.lav : null;
        return (
          <path
            key={i}
            d={`M ${p(r0, a0)} L ${p(r1, a0)} A ${r1} ${r1} 0 0 1 ${p(r1, a1)} L ${p(r0, a1)} A ${r0} ${r0} 0 0 0 ${p(r0, a0)} Z`}
            fill={special ?? "#DDD5C7"}
            opacity={appear * (special ? 0.35 + 0.65 * hl : 0.7)}
          />
        );
      })}
    </svg>
  );
};

export const Social: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const b2 = beatStart(scene, 2);
  const link = useProgress(cue(scene, "взаємодіяти"), 30);
  return (
    <SceneShell kicker="1 · Передумови" title="Соціальний і множинний інтелект">
      <Phase from={0} to={b2}>
        <Appear at={cue(scene, "Торндайк")} style={{ position: "absolute", left: 110, top: 270 }}>
          <Card style={{ width: 820, height: 560 }}>
            <div style={{ fontWeight: 600, fontSize: 34, color: C.inkSoft }}>Едвард Торндайк</div>
            <div style={{ fontWeight: 800, fontSize: 54, marginTop: 6 }}>Соціальний інтелект</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginTop: 26 }}>
              <Person size={150} color={C.teal} />
              <svg width={170} height={60}>
                <path d="M 10 40 Q 85 -10 160 40" fill="none" stroke={C.inkMute} strokeWidth={5} strokeDasharray="200" strokeDashoffset={200 * (1 - link)} strokeLinecap="round" />
              </svg>
              <Person size={150} color={C.lav} />
            </div>
            <Appear at={cue(scene, "уміння")}>
              <div style={{ fontWeight: 600, fontSize: 38, lineHeight: 1.3, marginTop: 20 }}>
                уміння розуміти людей і взаємодіяти з ними — окремий вид інтелекту
              </div>
            </Appear>
          </Card>
        </Appear>
        <Appear at={cue(scene, "Гарднер")} style={{ position: "absolute", left: 990, top: 270 }}>
          <Card style={{ width: 820, height: 560 }}>
            <div style={{ fontWeight: 600, fontSize: 34, color: C.inkSoft }}>Говард Гарднер</div>
            <div style={{ fontWeight: 800, fontSize: 54, marginTop: 6 }}>Множинний інтелект</div>
            <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 20 }}>
              <Facets at={cue(scene, "багатовимірний")} highlightAt={cue(scene, "два")} />
              <Appear at={cue(scene, "два")}>
                <div style={{ fontWeight: 700, fontSize: 40, lineHeight: 1.3 }}>
                  інтелект багатовимірний;
                  <br />
                  <span style={{ color: C.tealDeep }}>два види</span> — ключові для ЕІ
                </div>
              </Appear>
            </div>
          </Card>
        </Appear>
      </Phase>

      <Phase from={b2}>
        <Appear at={cue(scene, "Міжособистісний")} style={{ position: "absolute", left: 110, top: 270 }}>
          <Card accent={C.teal} style={{ width: 820, height: 440 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
              <Person size={120} color={C.teal} />
              <Person size={120} color={C.lav} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 52 }}>Міжособистісний</div>
            <div style={{ fontWeight: 600, fontSize: 40, lineHeight: 1.3, marginTop: 16, color: C.inkSoft }}>
              розуміння емоцій і поведінки інших людей
            </div>
          </Card>
        </Appear>
        <Appear at={cue(scene, "внутрішньоособистісний")} style={{ position: "absolute", left: 990, top: 270 }}>
          <Card accent={C.lav} style={{ width: 820, height: 440 }}>
            <div style={{ marginBottom: 18 }}>
              <Person size={120} color={C.lav} inner />
            </div>
            <div style={{ fontWeight: 800, fontSize: 52 }}>Внутрішньоособистісний</div>
            <div style={{ fontWeight: 600, fontSize: 40, lineHeight: 1.3, marginTop: 16, color: C.inkSoft }}>
              самопізнання, усвідомлення власних переживань, саморегуляція
            </div>
          </Card>
        </Appear>
      </Phase>
    </SceneShell>
  );
};
