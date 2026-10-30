import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../Backdrop";
import "../fonts";

const HookInner = () => {
  const frame = useCurrentFrame();

  return (
    <>
      <Backdrop glow="rgba(240, 101, 173, 0.16)" />
      <AbsoluteFill
        style={{ justifyContent: "center", paddingLeft: 200, flexDirection: "column", gap: 10 }}
      >
        <Interactive.Div
          name="Рядок 1"
          style={{
            fontFamily: "Unbounded",
            fontWeight: 700,
            fontSize: 124,
            color: "#edf3fa",
            opacity: interpolate(frame, [0, 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [0, 18], ["-60px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Емоції —
        </Interactive.Div>
        <Interactive.Div
          name="Рядок 2"
          style={{
            fontFamily: "Unbounded",
            fontWeight: 700,
            fontSize: 124,
            color: "#edf3fa",
            opacity: interpolate(frame, [12, 26], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [12, 30], ["-60px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          це{" "}
          <span style={{ position: "relative", color: "#f065ad" }}>
            {/* Маркерне підкреслення, що «пишеться» зліва направо */}
            <span
              style={{
                position: "absolute",
                left: 0,
                bottom: 18,
                height: 22,
                width: `${interpolate(frame, [30, 48], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1) })}%`,
                backgroundColor: "rgba(240, 101, 173, 0.3)",
              }}
            />
            інформація
          </span>
          ,
        </Interactive.Div>
        <Interactive.Div
          name="Рядок 3"
          style={{
            fontFamily: "Unbounded",
            fontWeight: 700,
            fontSize: 124,
            color: "#6f8199",
            opacity: interpolate(frame, [26, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [26, 44], ["-60px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          а не перешкода.
        </Interactive.Div>
      </AbsoluteFill>
    </>
  );
};

export const Hook = Interactive.create({
  Component: HookInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});
