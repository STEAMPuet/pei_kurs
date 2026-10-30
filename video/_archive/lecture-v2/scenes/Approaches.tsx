import { C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Phase, SceneShell } from "../ui";

const Icon: React.FC<{ readonly kind: 0 | 1 | 2 }> = ({ kind }) => (
  <svg width={150} height={120} viewBox="0 0 150 120">
    {kind === 0 ? (
      <>
        <rect x={10} y={70} width={34} height={40} rx={10} fill={C.teal} opacity={0.5} />
        <rect x={58} y={45} width={34} height={65} rx={10} fill={C.teal} opacity={0.75} />
        <rect x={106} y={15} width={34} height={95} rx={10} fill={C.teal} />
      </>
    ) : kind === 1 ? (
      <>
        <circle cx={40} cy={60} r={28} fill={C.lav} opacity={0.55} />
        <circle cx={75} cy={60} r={28} fill={C.lav} opacity={0.75} />
        <circle cx={110} cy={60} r={28} fill={C.lav} />
      </>
    ) : (
      <>
        <circle cx={55} cy={60} r={42} fill={C.teal} opacity={0.55} />
        <circle cx={95} cy={60} r={42} fill={C.lav} opacity={0.6} />
      </>
    )}
  </svg>
);

const APPROACHES = [
  { word: "Перший", title: "Когнітивна здібність", text: "ЕІ — різновид інтелекту", color: C.teal },
  { word: "Другий", title: "Риси й компетентності", text: "набір особистісних рис і компетентностей", color: C.lav },
  { word: "Третій", title: "Змішана модель", text: "поєднує здібності й особистісні характеристики", color: C.lavDeep },
] as const;

const FIELDS = [
  { word: "освіті", text: "освіта" },
  { word: "управлінні", text: "управління персоналом" },
  { word: "консультуванні", text: "консультування" },
  { word: "медицині", text: "медицина" },
  { word: "військовій", text: "військова справа" },
  { word: "соціальній", text: "соціальна робота" },
];
const LINKS = [
  { word: "стресостійкістю", text: "стресостійкість" },
  { word: "резильєнтністю", text: "резильєнтність" },
  { word: "благополуччям", text: "благополуччя" },
];

export const Approaches: React.FC<{ readonly scene: SceneData }> = ({ scene }) => (
  <SceneShell kicker="2 · Історія поняття" title="Три підходи до розуміння ЕІ">
    <Phase from={0} to={beatStart(scene, 2)}>
    <div style={{ position: "absolute", left: 110, top: 280, display: "flex", gap: 40 }}>
      {APPROACHES.map((a, i) => (
        <div key={a.word} style={{ position: "relative", width: 540, height: 500 }}>
          {/* порожнє місце-підказка, поки підхід не названо */}
          <Appear at={beatStart(scene, 0) + i * 6} from="none" style={{ position: "absolute", inset: 0 }}>
            <div
              style={{
                height: "100%",
                borderRadius: 32,
                border: `3px dashed ${C.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 120,
                color: C.line,
              }}
            >
              {i + 1}
            </div>
          </Appear>
          <Appear at={cue(scene, a.word)} from="up" style={{ position: "absolute", inset: 0 }}>
            <div
              style={{
                boxSizing: "border-box",
                height: "100%",
                borderRadius: 32,
                backgroundColor: C.surface,
                border: `2px solid ${C.line}`,
                borderTop: `12px solid ${a.color}`,
                boxShadow: C.shadow,
                padding: "40px 40px",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <Icon kind={i as 0 | 1 | 2} />
              <div style={{ fontWeight: 700, fontSize: 30, color: a.color, letterSpacing: 2, textTransform: "uppercase" }}>
                Підхід {i + 1}
              </div>
              <div style={{ fontWeight: 800, fontSize: 48, lineHeight: 1.15 }}>{a.title}</div>
              <div style={{ fontWeight: 600, fontSize: 36, lineHeight: 1.3, color: C.inkSoft }}>{a.text}</div>
            </div>
          </Appear>
        </div>
      ))}
    </div>
    </Phase>

    {/* Сучасний етап: де вивчають ЕІ і з чим його пов'язують */}
    <Phase from={beatStart(scene, 2)}>
      <Appear at={beatStart(scene, 2)} style={{ position: "absolute", left: 110, top: 260 }}>
        <div style={{ fontWeight: 700, fontSize: 40, color: C.inkSoft }}>Сьогодні ЕІ вивчають у сферах:</div>
      </Appear>
      <div style={{ position: "absolute", left: 110, right: 110, top: 340, display: "flex", flexWrap: "wrap", gap: 22 }}>
        {FIELDS.map((f) => (
          <Appear key={f.word} at={cue(scene, f.word)} from="scale">
            <div style={{ padding: "22px 36px", borderRadius: 999, backgroundColor: C.surface, border: `2px solid ${C.line}`, boxShadow: C.shadow, fontWeight: 700, fontSize: 44 }}>
              {f.text}
            </div>
          </Appear>
        ))}
      </div>
      <Appear at={cue(scene, "зв'язок")} style={{ position: "absolute", left: 110, top: 610 }}>
        <div style={{ fontWeight: 700, fontSize: 40, color: C.inkSoft }}>…і його зв'язок із:</div>
      </Appear>
      <div style={{ position: "absolute", left: 110, right: 110, top: 680, display: "flex", gap: 22 }}>
        {LINKS.map((l, i) => (
          <Appear key={l.word} at={cue(scene, l.word)} from="up">
            <div style={{ padding: "22px 40px", borderRadius: 999, backgroundColor: [C.tealSoft, C.lavSoft, C.peachSoft][i], color: [C.tealDeep, C.lavDeep, "#A8644A"][i], fontWeight: 800, fontSize: 46 }}>
              {l.text}
            </div>
          </Appear>
        ))}
      </div>
    </Phase>
  </SceneShell>
);
