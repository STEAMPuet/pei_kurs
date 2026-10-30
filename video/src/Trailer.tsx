import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { useVideoConfig } from "remotion";
import { Hook } from "./scenes/Hook";
import { Intro } from "./scenes/Intro";
import { Modules } from "./scenes/Modules";
import { Outro } from "./scenes/Outro";
import { Stats } from "./scenes/Stats";

// Тривалість: 4 + 3.5 + 6 + 4 + 4.5 − 4 × 0.5 (переходи) = 20 с
export const Trailer = () => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Вступ" durationInFrames={4 * fps}>
        <Intro name="Вступ" style={{ backgroundColor: "#101722" }} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence name="Теза" durationInFrames={3.5 * fps}>
        <Hook name="Теза" style={{ backgroundColor: "#101722" }} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence name="Теми" durationInFrames={6 * fps}>
        <Modules name="Теми" style={{ backgroundColor: "#101722" }} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence name="Цифри" durationInFrames={4 * fps}>
        <Stats name="Цифри" style={{ backgroundColor: "#101722" }} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence name="Фінал" durationInFrames={4.5 * fps}>
        <Outro name="Фінал" style={{ backgroundColor: "#101722" }} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
