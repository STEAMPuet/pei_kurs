import type React from "react";
import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import "./fonts";

const StatCounterInner = ({
  value,
  label,
  color,
  style,
}: {
  readonly value: number;
  readonly label: string;
  readonly color: string;
  readonly style?: React.CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const shown = Math.round(
    interpolate(frame, [5, 50], [0, value], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: "Unbounded",
          fontWeight: 900,
          fontSize: 210,
          lineHeight: 1,
          color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {shown}
      </div>
      <div
        style={{
          fontFamily: "Exo Two",
          fontWeight: 600,
          fontSize: 60,
          color: "#b9c7d8",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const StatCounter = Interactive.create({
  Component: StatCounterInner,
  layout: "none",
  schema: {
    value: {
      type: "number",
      default: 6,
      min: 0,
      integer: true,
      keyframable: false,
      hiddenFromList: false,
      description: "Число",
    },
    label: { type: "string", default: "", description: "Підпис" },
    color: { type: "color", default: "#00b8c4", description: "Колір числа" },
  },
});
