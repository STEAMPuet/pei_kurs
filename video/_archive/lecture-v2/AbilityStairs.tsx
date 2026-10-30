import { interpolate, useCurrentFrame } from "remotion";
import { ABILITIES, C } from "./theme";
import { Appear, ease, easeBack } from "./ui";

const HINTS = ["помітити емоцію", "спрямувати мислення", "пояснити причини", "регулювати реакції"];

// Головна схема моделі МСК: чотири сходинки від базової до найскладнішої.
export const AbilityStairs: React.FC<{
  readonly appear: readonly number[];
  readonly arrowAt: number;
  readonly style?: React.CSSProperties;
}> = ({ appear, arrowAt, style }) => {
  const frame = useCurrentFrame();
  const arrow = interpolate(frame, [arrowAt, arrowAt + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <div style={{ position: "relative", width: 1600, height: 560, ...style }}>
      <svg width={1600} height={200} style={{ position: "absolute", left: 0, top: 0 }}>
        <path
          d="M 60 180 C 500 170 1000 110 1540 30"
          fill="none"
          stroke={C.inkMute}
          strokeWidth={4}
          strokeDasharray="1600"
          strokeDashoffset={1600 * (1 - arrow)}
          strokeLinecap="round"
        />
        <path d="M 1512 22 L 1544 28 L 1526 56" fill="none" stroke={C.inkMute} strokeWidth={4} opacity={arrow > 0.95 ? 1 : 0} strokeLinecap="round" />
        {/* світна крапка, що раз у раз «піднімається» стрілкою від базового рівня до найвищого */}
        {arrow > 0.95
          ? (() => {
              const t = ((frame - arrowAt - 40) % 110) / 110;
              const u = 1 - t;
              const x = u * u * u * 60 + 3 * u * u * t * 500 + 3 * u * t * t * 1000 + t * t * t * 1540;
              const y = u * u * u * 180 + 3 * u * u * t * 170 + 3 * u * t * t * 110 + t * t * t * 30;
              const fade = Math.min(1, t * 6, (1 - t) * 6);
              return (
                <>
                  <circle cx={x} cy={y} r={20} fill={C.lav} opacity={0.25 * fade} />
                  <circle cx={x} cy={y} r={9} fill={C.lavDeep} opacity={fade} />
                </>
              );
            })()
          : null}
      </svg>
      <div style={{ position: "absolute", left: 60, top: 40, fontSize: 32, fontWeight: 600, color: C.inkSoft, opacity: arrow }}>
        від базової до найскладнішої
      </div>
      {ABILITIES.map((a, i) => (
        <GrowStep
          key={a.n}
          at={appear[i]}
          style={{
            position: "absolute",
            left: i * 400,
            bottom: 0,
            width: 380,
            height: 250 + i * 90,
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              height: "100%",
              borderRadius: 32,
              backgroundColor: a.soft,
              borderTop: `12px solid ${a.color}`,
              padding: "28px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 70,
                backgroundColor: a.color,
                color: "#FFFDF9",
                fontWeight: 800,
                fontSize: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {a.n}
            </div>
            <div style={{ fontWeight: 800, fontSize: 46, color: C.ink }}>{a.title}</div>
            <div style={{ fontWeight: 600, fontSize: 32, color: C.inkSoft }}>{HINTS[i]}</div>
          </div>
        </GrowStep>
      ))}
    </div>
  );
};

// Сходинка «виростає» знизу з легкою пружинкою; номер вискакує трохи пізніше.
const GrowStep: React.FC<{ readonly at: number; readonly style: React.CSSProperties; readonly children: React.ReactNode }> = ({
  at,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [at, at + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeBack });
  const fade = interpolate(frame, [at, at + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ ...style, opacity: fade, scale: `1 ${Math.max(0.001, grow)}`, transformOrigin: "50% 100%" }}>{children}</div>;
};

// Компактна вертикальна «драбина» для сцен окремих здібностей: активна сходинка виділена й м'яко пульсує.
export const AbilityLadder: React.FC<{ readonly active: number; readonly style?: React.CSSProperties }> = ({
  active,
  style,
}) => {
  const frame = useCurrentFrame();
  const pulse = 7 + 6 * Math.sin(frame / 14);
  return (
  <div style={{ display: "flex", flexDirection: "column-reverse", gap: 18, width: 470, ...style }}>
    {ABILITIES.map((a, i) => {
      const on = i === active;
      return (
        <Appear key={a.n} at={6 + i * 4} from="left" distance={30} idle={0}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "18px 24px",
              marginLeft: i * 22,
              borderRadius: 26,
              backgroundColor: on ? a.color : a.soft,
              opacity: on ? 1 : 0.6,
              boxShadow: on ? `0 0 0 ${pulse}px ${a.soft}, ${C.shadow}` : undefined,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 56,
                backgroundColor: on ? "#FFFDF9" : a.color,
                color: on ? a.color : "#FFFDF9",
                fontWeight: 800,
                fontSize: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {a.n}
            </div>
            <div style={{ fontWeight: 800, fontSize: 38, color: on ? "#FFFDF9" : C.ink }}>{a.title}</div>
          </div>
        </Appear>
      );
    })}
  </div>
  );
};
