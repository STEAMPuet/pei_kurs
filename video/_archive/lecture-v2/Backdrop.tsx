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
  // Кільця й крапки, що повільно пливуть угору з різною швидкістю (паралакс).
  const floaters = [
    { x: 160, r: 70, speed: 9, ring: true, color: C.teal },
    { x: 520, r: 10, speed: 14, ring: false, color: C.lav },
    { x: 860, r: 46, speed: 7, ring: true, color: C.lav },
    { x: 1240, r: 12, speed: 12, ring: false, color: C.teal },
    { x: 1600, r: 90, speed: 6, ring: true, color: C.teal },
    { x: 1820, r: 9, speed: 16, ring: false, color: C.lav },
    { x: 360, r: 8, speed: 11, ring: false, color: C.teal },
    { x: 1420, r: 38, speed: 10, ring: true, color: C.lav },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      {blob(1550 + 60 * Math.sin(t / 23), 260 + 40 * Math.cos(t / 31), 620, C.blob1)}
      {blob(260 + 50 * Math.cos(t / 27), 860 + 40 * Math.sin(t / 19), 560, C.blob2)}
      {blob(980 + 80 * Math.sin(t / 37), 1040, 480, C.blob3)}
      {floaters.map((f, i) => {
        const span = 1080 + f.r * 4;
        const y = 1080 + f.r * 2 - ((t * f.speed + i * 397) % span);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: f.x + 40 * Math.sin(t / 9 + i) - f.r,
              top: y - f.r,
              width: f.r * 2,
              height: f.r * 2,
              borderRadius: "50%",
              border: f.ring ? `3px solid ${f.color}` : undefined,
              backgroundColor: f.ring ? undefined : f.color,
              opacity: f.ring ? 0.16 : 0.22,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
