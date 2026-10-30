import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, SANS } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Chip, ease, Phase, SceneMotion } from "../ui";

export const Intro: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  // Два кола «Пізнання» й «Емоції» м'яко сходяться в спільну зону.
  const merge = interpolate(frame, [cue(scene, "Він поєднує"), cue(scene, "Він поєднує") + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  // Дві «орбіти» праворуч від назви: мислення й емоції повільно кружляють довкола спільного центру.
  const t = frame / 30;
  const orbit = (phase: number, r: number) => ({
    x: 1610 + r * Math.cos(t * 0.45 + phase),
    y: 470 + r * 0.55 * Math.sin(t * 0.45 + phase),
  });
  const o1 = orbit(0, 95);
  const o2 = orbit(Math.PI, 95);

  return (
    <SceneMotion>
      <AbsoluteFill style={{ fontFamily: SANS, color: C.ink }}>
      <Phase from={0} to={b1}>
        <Appear at={10} from="scale" idle={0} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
            <ellipse cx={1610} cy={470} rx={95} ry={52} fill="none" stroke={C.line} strokeWidth={3} strokeDasharray="6 12" />
            <ellipse cx={1610} cy={470} rx={200} ry={140} fill="none" stroke={C.line} strokeWidth={2} />
            <circle cx={o1.x} cy={o1.y} r={92} fill={C.tealSoft} stroke={C.teal} strokeWidth={4} style={{ mixBlendMode: "multiply" }} />
            <circle cx={o2.x} cy={o2.y} r={92} fill={C.lavSoft} stroke={C.lav} strokeWidth={4} style={{ mixBlendMode: "multiply" }} />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = t * 0.3 + (i * Math.PI) / 3;
              return <circle key={i} cx={1610 + 225 * Math.cos(a)} cy={470 + 160 * Math.sin(a)} r={9} fill={i % 2 ? C.lav : C.teal} opacity={0.7} />;
            })}
          </svg>
        </Appear>
        <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 160, paddingBottom: 120 }}>
          <Appear at={4} idle={0}>
            <div style={{ fontWeight: 700, fontSize: 34, letterSpacing: 5, color: C.tealDeep, textTransform: "uppercase" }}>
              Лекція 1 · Психологія емоційного інтелекту
            </div>
          </Appear>
          <Appear at={14} from="left" distance={70} idle={0}>
            <div style={{ fontWeight: 800, fontSize: 108, lineHeight: 1.08, marginTop: 28 }}>Теоретичні засади</div>
          </Appear>
          <Appear at={24} from="left" distance={70} idle={0}>
            <div style={{ fontWeight: 800, fontSize: 108, lineHeight: 1.08, color: C.lavDeep }}>емоційного інтелекту</div>
          </Appear>
          <Appear at={36} from="left" style={{ marginTop: 48, display: "flex", gap: 18 }}>
            <div style={{ width: 120, height: 10, borderRadius: 10, backgroundColor: C.teal }} />
            <div style={{ width: 60, height: 10, borderRadius: 10, backgroundColor: C.lav }} />
          </Appear>
        </AbsoluteFill>
      </Phase>

      <Phase from={b1} to={b2}>
        <div style={{ position: "absolute", left: 110, top: 90, right: 110 }}>
          <Appear at={b1}>
            <div style={{ fontWeight: 800, fontSize: 66 }}>Що таке емоційний інтелект?</div>
          </Appear>
          <div style={{ display: "flex", gap: 22, marginTop: 34 }}>
            <Appear at={cue(scene, "помічати")}>
              <Chip>помічати</Chip>
            </Appear>
            <Appear at={cue(scene, "розуміти")}>
              <Chip>розуміти</Chip>
            </Appear>
            <Appear at={cue(scene, "враховувати")}>
              <Chip color={C.lavDeep} bg={C.lavSoft}>
                враховувати в мисленні та поведінці
              </Chip>
            </Appear>
          </div>
        </div>
        <Appear at={cue(scene, "Він поєднує") - 10} from="none" style={{ position: "absolute", left: 0, right: 0, top: 380, height: 460 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 960 - 400 - 120 * (1 - merge) + 0,
              width: 460,
              height: 460,
              borderRadius: "50%",
              backgroundColor: C.tealSoft,
              border: `4px solid ${C.teal}`,
              mixBlendMode: "multiply",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingLeft: 70,
              boxSizing: "border-box",
              fontWeight: 800,
              fontSize: 46,
              color: C.tealDeep,
            }}
          >
            Пізнання
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 960 - 60 + 120 * (1 - merge),
              width: 460,
              height: 460,
              borderRadius: "50%",
              backgroundColor: C.lavSoft,
              border: `4px solid ${C.lav}`,
              mixBlendMode: "multiply",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 90,
              boxSizing: "border-box",
              fontWeight: 800,
              fontSize: 46,
              color: C.lavDeep,
            }}
          >
            Емоції
          </div>
          <div
            style={{
              position: "absolute",
              top: 196,
              left: 960 - 100,
              width: 200,
              textAlign: "center",
              fontWeight: 800,
              fontSize: 54,
              color: C.ink,
              opacity: merge,
            }}
          >
            ЕІ
          </div>
        </Appear>
      </Phase>

      <Phase from={b2}>
        <div style={{ position: "absolute", left: 110, top: 90, right: 110 }}>
          <Appear at={b2}>
            <div style={{ fontWeight: 800, fontSize: 66 }}>У цій лекції</div>
          </Appear>
          <div style={{ display: "flex", flexDirection: "column", gap: 30, marginTop: 56 }}>
            {[
              { at: cue(scene, "як виникло"), n: "1", text: "Як виникло поняття", color: C.teal },
              { at: cue(scene, "чотирьох"), n: "2", text: "Модель із чотирьох здібностей", color: C.lav },
              { at: cue(scene, "психолога", 2), n: "3", text: "Значення для роботи психолога", color: C.lavDeep },
            ].map((item) => (
              <Appear key={item.n} at={item.at} from="left">
                <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
                  <div
                    style={{
                      width: 84,
                      height: 84,
                      borderRadius: 28,
                      backgroundColor: item.color,
                      color: "#FFFDF9",
                      fontWeight: 800,
                      fontSize: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.n}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 58 }}>{item.text}</div>
                </div>
              </Appear>
            ))}
          </div>
        </div>
      </Phase>
      </AbsoluteFill>
    </SceneMotion>
  );
};
