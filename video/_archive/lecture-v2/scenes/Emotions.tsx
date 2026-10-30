import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Chip, ease, Phase, SceneShell } from "../ui";

export const Emotions: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const meet = cue(scene, "Сучасні");
  // Від «протистояння» до взаємодії: кола зближуються, бар'єр зникає.
  const p = interpolate(frame, [meet, meet + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const overlap = interpolate(frame, [cue(scene, "складній взаємодії"), cue(scene, "складній взаємодії") + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gap = 360 * (1 - p);
  const r = 190;
  const cx = 960;
  const cy = 520;
  // Підпис зміщено назовні, щоб спільна зона кіл лишалася вільною.
  const circle = (x: number, color: string, soft: string, label: string, side: "left" | "right") => (
    <div
      style={{
        boxSizing: "border-box",
        position: "absolute",
        left: x - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        backgroundColor: soft,
        border: `4px solid ${color}`,
        mixBlendMode: "multiply",
        display: "flex",
        alignItems: "center",
        justifyContent: side === "left" ? "flex-start" : "flex-end",
        padding: "0 44px",
        fontWeight: 800,
        fontSize: 44,
        color,
      }}
    >
      {label}
    </div>
  );
  const chips = [
    { w: "рішень", t: "рішення", x: 330, y: 340 },
    { w: "мотивації", t: "мотивація", x: 1590, y: 340 },
    { w: "навчанні", t: "навчання", x: 310, y: 660 },
    { w: "адаптації", t: "адаптація", x: 1610, y: 660 },
    { w: "взаємодії", t: "взаємодія з людьми", x: 960, y: 800 },
  ];
  const b2 = beatStart(scene, 2);
  return (
    <SceneShell kicker="1 · Передумови" title="Переосмислення ролі емоцій">
      <Phase from={0} to={b2}>
      <Appear at={cue(scene, "Змінилося")} from="none" idle={0}>
        {circle(cx - 130 - gap, C.tealDeep, C.tealSoft, "Мислення", "left")}
        {circle(cx + 130 + gap, C.lavDeep, C.lavSoft, "Емоції", "right")}
      </Appear>
      <Appear at={cue(scene, "перешкодою")} until={meet + 20} from="scale" style={{ position: "absolute", left: cx - 120, top: cy - 190 }}>
        <div style={{ width: 240, height: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <div style={{ width: 10, height: 240, borderRadius: 10, backgroundColor: C.peach }} />
          <div style={{ fontWeight: 700, fontSize: 36, color: C.peach }}>«перешкода»?</div>
        </div>
      </Appear>
      <div style={{ position: "absolute", left: cx - 150, top: cy - r - 66, width: 300, textAlign: "center", opacity: overlap }}>
        <Chip color="#FFFDF9" bg={C.ink}>
          взаємодія
        </Chip>
      </div>
      {chips.map((c) => (
        <Appear key={c.t} at={cue(scene, c.w)} from="scale" style={{ position: "absolute", left: c.x, top: c.y, translate: "-50% -50%" }}>
          <Chip color={C.ink} bg={C.surface} style={{ border: `2px solid ${C.line}`, boxShadow: C.shadow }}>
            {c.t}
          </Chip>
        </Appear>
      ))}
      </Phase>

      {/* Підсумок передумов: три зміни, з яких виросло поняття ЕІ */}
      <Phase from={b2}>
        <Appear at={b2} style={{ position: "absolute", left: 110, top: 250 }}>
          <div style={{ fontWeight: 700, fontSize: 40, color: C.inkSoft }}>Поняття ЕІ виросло з трьох змін:</div>
        </Appear>
        <div style={{ position: "absolute", left: 110, right: 110, top: 340, display: "flex", gap: 36 }}>
          {[
            { at: cue(scene, "уявлення про", 2), text: "Уявлення про здібності людини розширилися", color: C.teal },
            { at: cue(scene, "роль емоцій", 2), text: "Роль емоцій переосмислили", color: C.lav },
            { at: cue(scene, "обмеженість", 2), text: "Обмеженість суто когнітивного оцінювання стала очевидною", color: C.lavDeep },
          ].map((item, i) => (
            <Appear key={i} at={item.at} from="up" style={{ flex: 1 }}>
              <div
                style={{
                  boxSizing: "border-box",
                  height: 400,
                  borderRadius: 32,
                  padding: "40px 40px",
                  backgroundColor: C.surface,
                  border: `2px solid ${C.line}`,
                  borderTop: `12px solid ${item.color}`,
                  boxShadow: C.shadow,
                  display: "flex",
                  flexDirection: "column",
                  gap: 28,
                }}
              >
                <div style={{ width: 80, height: 80, borderRadius: 80, backgroundColor: item.color, color: "#FFFDF9", fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ✓
                </div>
                <div style={{ fontWeight: 700, fontSize: 44, lineHeight: 1.25 }}>{item.text}</div>
              </div>
            </Appear>
          ))}
        </div>
      </Phase>
    </SceneShell>
  );
};
