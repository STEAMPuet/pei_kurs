import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../Backdrop";
import "../fonts";

const IntroInner = () => {
  const frame = useCurrentFrame();

  return (
    <>
      <Backdrop />
      {/* Пульсуючі кільця — образ «емоційного сигналу» */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <svg width={1100} height={1100} viewBox="0 0 1100 1100">
          <circle
            cx={550}
            cy={550}
            r={interpolate(frame, [0, 120], [300, 360])}
            fill="none"
            stroke="#00b8c4"
            strokeWidth={3}
            opacity={interpolate(frame, [0, 20], [0, 0.6], { extrapolateRight: "clamp" })}
          />
          <circle
            cx={550}
            cy={550}
            r={interpolate(frame, [0, 120], [380, 450])}
            fill="none"
            stroke="#f065ad"
            strokeWidth={2}
            strokeDasharray="6 14"
            opacity={interpolate(frame, [8, 28], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          />
          <circle
            cx={550}
            cy={550}
            r={interpolate(frame, [0, 120], [460, 540])}
            fill="none"
            stroke="#41536a"
            strokeWidth={2}
            opacity={interpolate(frame, [16, 36], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 40 }}
      >
        <Interactive.Div
          name="Бренд"
          style={{
            fontFamily: "JetBrains Mono",
            fontWeight: 700,
            fontSize: 44,
            letterSpacing: 10,
            color: "#00b8c4",
            opacity: interpolate(frame, [0, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [0, 18], ["0px 30px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          ПСИХОЛОГІЯ.LAB
        </Interactive.Div>
        <Interactive.Div
          name="Назва курсу"
          style={{
            fontFamily: "Unbounded",
            fontWeight: 900,
            fontSize: 150,
            lineHeight: 1.05,
            textAlign: "center",
            color: "#edf3fa",
            opacity: interpolate(frame, [8, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [8, 40], [0.92, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              output: "perceptual-scale",
            }),
          }}
        >
          Емоційний
          <br />
          інтелект
        </Interactive.Div>
        <Interactive.Div
          name="Підзаголовок"
          style={{
            fontFamily: "Exo Two",
            fontWeight: 600,
            fontSize: 64,
            color: "#b9c7d8",
            opacity: interpolate(frame, [28, 48], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [28, 48], ["0px 24px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          курс психології для фахівців
        </Interactive.Div>
      </AbsoluteFill>
    </>
  );
};

export const Intro = Interactive.create({
  Component: IntroInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});
