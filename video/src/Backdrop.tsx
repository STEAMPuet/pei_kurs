import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// Декоративне тло в стилі ПСИХОЛОГІЯ.LAB: сітка + м'яке світіння.
export const Backdrop: React.FC<{ readonly glow?: string }> = ({
  glow = "rgba(0, 184, 196, 0.22)",
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#101722" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(#1c293a 1px, transparent 1px), linear-gradient(90deg, #1c293a 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: `${interpolate(frame, [0, 300], [0, -80])}px 0px`,
          opacity: 0.7,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glow} 0%, transparent 60%)`,
        }}
      />
    </AbsoluteFill>
  );
};
