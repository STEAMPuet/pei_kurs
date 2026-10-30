import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS } from "./theme";
import { timeline } from "./timeline";

// Субтитри за таймінгами TTS. offsetFrames — початок відрізка, якщо показуємо окрему главу.
export const Captions: React.FC<{ readonly offsetFrames?: number }> = ({ offsetFrames = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = ((frame + offsetFrames) / fps) * 1000;
  const caps = timeline.captions;
  const i = caps.findIndex((c) => ms >= c.startMs && ms < c.endMs);
  if (i < 0) {
    return null;
  }
  const c = caps[i];
  // Між суміжними репліками без паузи — без мерехтіння, лише заміна тексту.
  const joinedBefore = i > 0 && c.startMs - caps[i - 1].endMs < 200;
  const joinedAfter = i < caps.length - 1 && caps[i + 1].startMs - c.endMs < 200;
  const opacity = Math.min(
    joinedBefore ? 1 : interpolate(ms, [c.startMs, c.startMs + 160], [0, 1], { extrapolateRight: "clamp" }),
    joinedAfter ? 1 : interpolate(ms, [c.endMs - 160, c.endMs], [1, 0], { extrapolateLeft: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 40 }}>
      <div
        style={{
          maxWidth: 1480,
          padding: "14px 34px",
          borderRadius: 22,
          backgroundColor: "rgba(255, 253, 249, 0.94)",
          boxShadow: "0 8px 26px rgba(31, 43, 71, 0.10)",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.32,
          color: C.ink,
          textAlign: "center",
          opacity,
        }}
      >
        {c.words
          ? c.words.map((w, k) => {
              const next = k + 1 < c.words!.length ? c.words![k + 1].ms : c.endMs;
              const active = ms >= w.ms && ms < next;
              return (
                <span key={k}>
                  {k > 0 ? " " : ""}
                  <span
                    style={{
                      borderRadius: 10,
                      padding: "0 4px",
                      margin: "0 -4px",
                      backgroundColor: active ? C.tealSoft : "transparent",
                      color: ms >= w.ms ? C.ink : C.inkSoft,
                    }}
                  >
                    {w.text}
                  </span>
                </span>
              );
            })
          : c.text}
      </div>
    </AbsoluteFill>
  );
};

// Тонка смуга прогресу лекції вгорі кадру.
export const ProgressBar: React.FC<{ readonly offsetFrames?: number }> = ({ offsetFrames = 0 }) => {
  const frame = useCurrentFrame();
  const p = (frame + offsetFrames) / timeline.durationInFrames;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, height: 6, width: `${p * 100}%`, backgroundColor: C.teal, opacity: 0.55 }} />
    </AbsoluteFill>
  );
};
