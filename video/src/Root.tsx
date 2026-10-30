import { Composition, Folder } from "remotion";
import { ChapterPreview, Lecture } from "./lecture/Lecture";
import { timeline } from "./lecture/timeline";
import { ModuleCard } from "./ModuleCard";
import { Hook } from "./scenes/Hook";
import { Intro } from "./scenes/Intro";
import { Modules } from "./scenes/Modules";
import { Outro } from "./scenes/Outro";
import { Stats } from "./scenes/Stats";
import { StatCounter } from "./StatCounter";
import { Trailer } from "./Trailer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Відеолекція 1: тривалість і глави беруться з timeline.json (генерує tools/voiceover.py) */}
      <Composition
        id="Lecture1"
        component={Lecture}
        durationInFrames={timeline.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Lecture1-chapters">
        {timeline.scenes.map((s) => (
          <Composition
            key={s.id}
            id={`ch-${s.id}`}
            component={ChapterPreview}
            durationInFrames={s.durationInFrames}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ sceneId: s.id }}
          />
        ))}
      </Folder>
      <Composition
        id="Trailer"
        component={Trailer}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        <Composition
          id="Intro"
          component={Intro}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#101722" } }}
        />
        <Composition
          id="Hook"
          component={Hook}
          durationInFrames={105}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#101722" } }}
        />
        <Composition
          id="Modules"
          component={Modules}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#101722" } }}
        />
        <Composition
          id="Stats"
          component={Stats}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#101722" } }}
        />
        <Composition
          id="Outro"
          component={Outro}
          durationInFrames={135}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ style: { backgroundColor: "#101722" } }}
        />
      </Folder>
      <Folder name="Elements">
        <Composition
          id="ModuleCard"
          component={ModuleCard}
          durationInFrames={90}
          fps={30}
          width={640}
          height={400}
          defaultProps={{
            number: "01",
            label: "Теоретичні засади ЕІ",
            accent: "#00b8c4",
            style: { width: 640, height: 400 },
          }}
        />
        <Composition
          id="StatCounter"
          component={StatCounter}
          durationInFrames={90}
          fps={30}
          width={600}
          height={400}
          defaultProps={{
            value: 14,
            label: "практичних",
            color: "#f065ad",
            style: { backgroundColor: "#101722", height: 400 },
          }}
        />
      </Folder>
    </>
  );
};
