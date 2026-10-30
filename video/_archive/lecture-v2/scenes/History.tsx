import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { cue, type SceneData } from "../timeline";
import { Appear, Chip, ease, SceneShell } from "../ui";

const LINE_Y = 430;
const X0 = 150;
const X1 = 1770;

export const History: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const nodes = [
    { at: cue(scene, "1985"), x: 360, year: "1985", name: "Вейн Пейн", text: "використав термін «емоційний інтелект»", color: C.teal },
    {
      at: cue(scene, "1990"),
      x: 960,
      year: "1990",
      name: "Джон Маєр і Пітер Саловей",
      text: "перше наукове визначення: здібності сприймати, розуміти емоції та керувати ними",
      color: C.lav,
    },
    { at: cue(scene, "1995"), x: 1560, year: "1995", name: "Деніел Гоулман", text: "книжка «Емоційний інтелект» зробила ідею широко відомою", color: C.lavDeep },
  ];
  // Лінія часу дотягується до кожної нової дати.
  const reach = interpolate(
    frame,
    [0, 30, nodes[0].at, nodes[0].at + 20, nodes[1].at, nodes[1].at + 20, nodes[2].at, nodes[2].at + 20],
    [X0, X0 + 120, X0 + 120, nodes[0].x, nodes[0].x, nodes[1].x, nodes[1].x, X1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease },
  );
  const active = nodes.filter((n) => frame >= n.at).length - 1;

  return (
    <SceneShell kicker="2 · Історія поняття" title="Як з'явилося поняття">
      <Appear at={cue(scene, "наприкінці")} style={{ position: "absolute", left: X0, top: 240 }}>
        <Chip color={C.inkSoft} bg={C.surface} style={{ border: `2px solid ${C.line}` }}>
          кінець XX століття
        </Chip>
      </Appear>
      <div style={{ position: "absolute", left: X0, top: LINE_Y - 4, width: X1 - X0, height: 8, borderRadius: 8, backgroundColor: C.line }} />
      <div style={{ position: "absolute", left: X0, top: LINE_Y - 4, width: reach - X0, height: 8, borderRadius: 8, backgroundColor: C.teal }} />
      {nodes.map((n, i) => (
        <Appear key={n.year} at={n.at} from="scale" style={{ position: "absolute", left: n.x - 270, top: LINE_Y - 110, width: 540 }}>
          <div style={{ textAlign: "center", fontWeight: 800, fontSize: 68, color: n.color, lineHeight: 1 }}>{n.year}</div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 34,
              margin: "22px auto 0",
              backgroundColor: n.color,
              border: "6px solid #FFFDF9",
              boxShadow: i === active ? `0 0 0 ${8 + 7 * Math.sin(frame / 12)}px ${n.color}40, ${C.shadow}` : C.shadow,
            }}
          />
          <div
            style={{
              boxSizing: "border-box",
              marginTop: 30,
              padding: "28px 32px",
              borderRadius: 28,
              backgroundColor: C.surface,
              border: `2px solid ${i === active ? n.color : C.line}`,
              boxShadow: C.shadow,
              opacity: i === active ? 1 : 0.8,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 40, lineHeight: 1.2 }}>{n.name}</div>
            <div style={{ fontWeight: 600, fontSize: 34, lineHeight: 1.32, color: C.inkSoft, marginTop: 12 }}>{n.text}</div>
          </div>
        </Appear>
      ))}
    </SceneShell>
  );
};
