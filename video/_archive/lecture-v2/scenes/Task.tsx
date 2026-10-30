import { ABILITIES, C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, NumberBadge, Phase, SceneShell } from "../ui";

const STEPS = [
  { word: "перший", text: "Згадайте ситуацію з останнього тижня", color: C.ink },
  { word: "другий", text: "Сприйняття: назвіть емоцію та її прояви", color: ABILITIES[0].color },
  { word: "третій", text: "Використання: як вона вплинула на думки й рішення?", color: ABILITIES[1].color },
  { word: "четвертий", text: "Розуміння: причина й можливий розвиток", color: ABILITIES[2].color },
  { word: "п'ятий", text: "Управління: як регулювали, що можна інакше?", color: ABILITIES[3].color },
  { word: "шостий", text: "Висновок: сильна здібність і та, яку варто тренувати", color: C.tealDeep },
];

export const Task: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const b1 = beatStart(scene, 1);
  return (
    <SceneShell kicker="5 · Практика" title="Завдання для самостійної рефлексії">
      <Phase from={0} to={b1}>
        <Appear at={cue(scene, "Оберіть")} style={{ position: "absolute", left: 260, right: 260, top: 300 }}>
          <div style={{ borderRadius: 36, padding: "48px 60px", backgroundColor: C.lavSoft, display: "flex", gap: 44, alignItems: "flex-start" }}>
            <svg width={120} height={120} viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
              <path d="M60 10 L104 28 V58 C104 86 84 104 60 112 C36 104 16 86 16 58 V28 Z" fill={C.lav} opacity={0.85} />
              <path d="M40 60 L54 74 L82 46" fill="none" stroke="#FFFDF9" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div style={{ fontWeight: 800, fontSize: 52, color: C.lavDeep }}>Безпечна рефлексія</div>
              <div style={{ fontWeight: 600, fontSize: 42, lineHeight: 1.35, marginTop: 18 }}>
                Оберіть ситуацію середньої інтенсивності, не травматичну.
              </div>
              <Appear at={cue(scene, "Якщо")} style={{ fontWeight: 600, fontSize: 42, lineHeight: 1.35, marginTop: 18 }}>
                Стало надто важко — зупиніться й за потреби зверніться по підтримку.
              </Appear>
            </div>
          </div>
        </Appear>
      </Phase>

      <Phase from={b1}>
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 260,
            width: 1700,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 36,
          }}
        >
          {STEPS.map((s, i) => (
            <Appear key={s.word} at={cue(scene, s.word)}>
              <div
                style={{
                  boxSizing: "border-box",
                  height: 270,
                  borderRadius: 30,
                  padding: "30px 32px",
                  backgroundColor: C.surface,
                  border: `2px solid ${C.line}`,
                  borderTop: `10px solid ${s.color}`,
                  boxShadow: C.shadow,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                <NumberBadge n={i + 1} color={s.color} size={58} />
                <div style={{ fontWeight: 700, fontSize: 38, lineHeight: 1.28 }}>{s.text}</div>
              </div>
            </Appear>
          ))}
        </div>
      </Phase>
    </SceneShell>
  );
};
