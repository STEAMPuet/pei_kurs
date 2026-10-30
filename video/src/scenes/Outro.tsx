import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../Backdrop";
import "../fonts";

const OutroInner = () => {
  const frame = useCurrentFrame();

  return (
    <>
      <Backdrop />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}
      >
        <Interactive.Div
          name="Рядок 1"
          style={{
            fontFamily: "Unbounded",
            fontWeight: 700,
            fontSize: 110,
            color: "#edf3fa",
            opacity: interpolate(frame, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [0, 20], ["0px 30px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Від теорії —
        </Interactive.Div>
        <Interactive.Div
          name="Рядок 2"
          style={{
            fontFamily: "Unbounded",
            fontWeight: 700,
            fontSize: 110,
            color: "#00b8c4",
            opacity: interpolate(frame, [12, 27], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [12, 32], ["0px 30px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          до власного проєкту
        </Interactive.Div>
        <Interactive.Div
          name="Заклик"
          style={{
            marginTop: 70,
            padding: "28px 64px",
            borderRadius: 999,
            backgroundColor: "#d6006e",
            fontFamily: "Exo Two",
            fontWeight: 700,
            fontSize: 64,
            color: "#ffffff",
            opacity: interpolate(frame, [34, 48], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [34, 56], [0.8, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12 }),
              output: "perceptual-scale",
            }),
          }}
        >
          Почніть з Теми 1 →
        </Interactive.Div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 100 }}>
        <Interactive.Div
          name="Бренд"
          style={{
            fontFamily: "JetBrains Mono",
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: 10,
            color: "#6f8199",
            opacity: interpolate(frame, [50, 65], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          ПСИХОЛОГІЯ.LAB
        </Interactive.Div>
      </AbsoluteFill>
    </>
  );
};

export const Outro = Interactive.create({
  Component: OutroInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});
