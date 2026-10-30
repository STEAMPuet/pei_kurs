import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "./theme";

// Спільне тло всієї лекції: кремовий фон і дуже повільні м'які плями.
export const Backdrop: React.FC<{ readonly offset?: number }> = ({ offset = 0 }) => {
  const t = (useCurrentFrame() + offset) / 30;
  const blob = (x: number, y: number, r: number, color: string) => (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, ${color}00 70%)`,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      {blob(1550 + 60 * Math.sin(t / 23), 260 + 40 * Math.cos(t / 31), 620, C.blob1)}
      {blob(260 + 50 * Math.cos(t / 27), 860 + 40 * Math.sin(t / 19), 560, C.blob2)}
      {blob(980 + 80 * Math.sin(t / 37), 1040, 480, C.blob3)}
    </AbsoluteFill>
  );
};
