import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../Backdrop";
import { ModuleCard } from "../ModuleCard";
import "../fonts";

const ModulesInner = () => {
  const frame = useCurrentFrame();

  return (
    <>
      <Backdrop glow="rgba(0, 184, 196, 0.12)" />
      <AbsoluteFill style={{ padding: "100px 80px", flexDirection: "column", gap: 50 }}>
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
          6 тем курсу
        </Interactive.Div>
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: 36,
          }}
        >
          <ModuleCard
            name="Тема 1"
            number="01"
            label="Теоретичні засади ЕІ"
            accent="#00b8c4"
            style={{
              opacity: interpolate(frame, [10, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: interpolate(frame, [10, 30], ["0px 50px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
            }}
          />
          <ModuleCard
            name="Тема 2"
            number="02"
            label="Емоції як ресурс"
            accent="#f065ad"
            style={{
              opacity: interpolate(frame, [18, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: interpolate(frame, [18, 38], ["0px 50px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
            }}
          />
          <ModuleCard
            name="Тема 3"
            number="03"
            label="Саморегуляція і стійкість"
            accent="#efb65a"
            style={{
              opacity: interpolate(frame, [26, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: interpolate(frame, [26, 46], ["0px 50px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
            }}
          />
          <ModuleCard
            name="Тема 4"
            number="04"
            label="Емпатія в комунікації"
            accent="#42cc95"
            style={{
              opacity: interpolate(frame, [34, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: interpolate(frame, [34, 54], ["0px 50px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
            }}
          />
          <ModuleCard
            name="Тема 5"
            number="05"
            label="ЕІ лідера і команди"
            accent="#00b8c4"
            style={{
              opacity: interpolate(frame, [42, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: interpolate(frame, [42, 62], ["0px 50px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
            }}
          />
          <ModuleCard
            name="Тема 6"
            number="06"
            label="Психологічне благополуччя"
            accent="#f065ad"
            style={{
              opacity: interpolate(frame, [50, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              translate: interpolate(frame, [50, 70], ["0px 50px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
            }}
          />
        </div>
      </AbsoluteFill>
    </>
  );
};

export const Modules = Interactive.create({
  Component: ModulesInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});
