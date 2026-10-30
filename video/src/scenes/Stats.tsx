import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../Backdrop";
import { StatCounter } from "../StatCounter";
import "../fonts";

const StatsInner = () => {
  const frame = useCurrentFrame();

  return (
    <>
      <Backdrop glow="rgba(239, 182, 90, 0.12)" />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 90 }}
      >
        <Interactive.Div
          name="Заголовок розділу"
          style={{
            fontFamily: "Unbounded",
            fontWeight: 700,
            fontSize: 84,
            color: "#edf3fa",
            opacity: interpolate(frame, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Теорія + практика
        </Interactive.Div>
        <div style={{ display: "flex", gap: 110 }}>
          <StatCounter
            name="Лекції"
            value={6}
            label="лекцій"
            color="#00b8c4"
            style={{
              opacity: interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: interpolate(frame, [4, 24], ["0px 40px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
            }}
          />
          <StatCounter
            name="Практичні"
            value={14}
            label="практичних"
            color="#f065ad"
            style={{
              opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: interpolate(frame, [10, 30], ["0px 40px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
            }}
          />
          <StatCounter
            name="Самостійні"
            value={6}
            label="самостійних"
            color="#efb65a"
            style={{
              opacity: interpolate(frame, [16, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: interpolate(frame, [16, 36], ["0px 40px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
            }}
          />
          <StatCounter
            name="Тести"
            value={6}
            label="тестів"
            color="#42cc95"
            style={{
              opacity: interpolate(frame, [22, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: interpolate(frame, [22, 42], ["0px 40px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
            }}
          />
        </div>
      </AbsoluteFill>
    </>
  );
};

export const Stats = Interactive.create({
  Component: StatsInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});
