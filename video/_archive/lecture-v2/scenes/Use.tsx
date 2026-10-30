import { useCurrentFrame } from "remotion";
import { ABILITIES, C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Arrow, Chip, Phase } from "../ui";
import { AbilityLayout, CONTENT_LEFT, Definition, ExampleLabel, Takeaway } from "./AbilityLayout";

// Хвиля хвилювання, що поступово вирівнюється в спрямовану лінію.
const Wave: React.FC<{ readonly calmFrom: number }> = ({ calmFrom }) => {
  const frame = useCurrentFrame();
  const calm = Math.min(1, Math.max(0, (frame - calmFrom) / 60));
  const amp = 26 * (1 - 0.75 * calm);
  const pts = Array.from({ length: 41 }, (_, i) => {
    const x = 4 + i * 6;
    const y = 40 + amp * Math.sin(i * 0.9 + frame / 9);
    return `${x},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={250} height={80}>
      <polyline points={pts} fill="none" stroke={C.peach} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const Step: React.FC<{ readonly at: number; readonly bg: string; readonly title: string; readonly children?: React.ReactNode }> = ({
  at,
  bg,
  title,
  children,
}) => (
  <Appear at={at} style={{ width: 306 }}>
    <div style={{ boxSizing: "border-box", height: 380, borderRadius: 30, backgroundColor: bg, padding: "30px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {children}
      <div style={{ fontWeight: 700, fontSize: 38, lineHeight: 1.28 }}>{title}</div>
    </div>
  </Appear>
);

export const Use: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  return (
    <AbilityLayout index={1} title="Використання емоцій у мисленні">
      <Phase from={0} to={b1}>
        <Definition index={1} at={cue(scene, "Емоції можуть")}>
          <div style={{ fontWeight: 700, fontSize: 48, lineHeight: 1.25, marginTop: 14 }}>
            Емоції можуть підвищувати ефективність пізнання
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 30 }}>
            <Appear at={cue(scene, "творчому")}>
              <Chip color="#3F6F90" bg={ABILITIES[1].soft}>
                творчий пошук рішень
              </Chip>
            </Appear>
            <Appear at={cue(scene, "аналізі")}>
              <Chip color="#3F6F90" bg={ABILITIES[1].soft}>
                аналіз проблемних ситуацій
              </Chip>
            </Appear>
          </div>
        </Definition>
      </Phase>

      <Phase from={b1} to={b2}>
        <ExampleLabel at={b1} index={1} text="хвилювання перед іспитом" />
        <div style={{ position: "absolute", left: CONTENT_LEFT, top: 370, display: "flex", alignItems: "center", gap: 6 }}>
          <Step at={cue(scene, "хвилювання")} bg={C.peachSoft} title="помірне хвилювання">
            <Wave calmFrom={cue(scene, "сигнал")} />
          </Step>
          <Arrow at={cue(scene, "сигнал")} width={90} />
          <Step at={cue(scene, "сигнал")} bg={C.lavSoft} title="сигнал: «Це для мене важливо»">
            <div style={{ fontWeight: 800, fontSize: 64, color: C.lavDeep, lineHeight: 1 }}>!</div>
          </Step>
          <Arrow at={cue(scene, "спрямовує")} width={90} />
          <Step at={cue(scene, "зосередитися")} bg={C.tealSoft} title="зосередитися й переглянути складні теми">
            <svg width={80} height={80} viewBox="0 0 80 80">
              <circle cx={40} cy={40} r={34} fill="none" stroke={C.teal} strokeWidth={6} />
              <circle cx={40} cy={40} r={18} fill="none" stroke={C.teal} strokeWidth={6} />
              <circle cx={40} cy={40} r={5} fill={C.teal} />
            </svg>
          </Step>
        </div>
      </Phase>

      <Phase from={b2}>
        <Takeaway at={b2} index={1}>
          Емоція тут не заважає думати, а допомагає спрямувати увагу на справді важливе.
        </Takeaway>
      </Phase>
    </AbilityLayout>
  );
};
