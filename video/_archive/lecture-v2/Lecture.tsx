import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Backdrop } from "./Backdrop";
import { Captions, ProgressBar } from "./Captions";
import { SCENES } from "./scenes";
import { SECTIONS, SectionWipe, WIPE_LEAD, WIPE_LENGTH } from "./SectionWipe";
import { getScene, timeline, type SceneData } from "./timeline";

// Одна глава: візуальна сцена + озвучка її бітів (кадри відносно початку глави).
const Chapter: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const Visual = SCENES[scene.id];
  if (!Visual) {
    throw new Error(`Для сцени «${scene.id}» немає компонента в scenes/index.ts`);
  }
  return (
    <>
      <Visual scene={scene} />
      {scene.beats.map((b) => (
        <Sequence key={b.src} name={`Озвучка ${b.src}`} from={b.from} durationInFrames={b.durationInFrames} layout="none">
          {/* підсилення задає tools/voiceover.py, щоб голос звучав ≈ −16 LUFS */}
          <Audio src={staticFile(b.src)} volume={timeline.volume} />
        </Sequence>
      ))}
    </>
  );
};

// Повна відеолекція: усі глави поспіль за таймлайном озвучки.
export const Lecture: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    {timeline.scenes.map((s) => (
      <Sequence key={s.id} name={s.title} from={s.from} durationInFrames={s.durationInFrames}>
        <Chapter scene={s} />
      </Sequence>
    ))}
    {timeline.scenes
      .filter((s) => SECTIONS[s.id])
      .map((s) => (
        <Sequence key={`wipe-${s.id}`} name={`Розділ: ${SECTIONS[s.id].title}`} from={s.from - WIPE_LEAD} durationInFrames={WIPE_LENGTH}>
          <SectionWipe n={SECTIONS[s.id].n} title={SECTIONS[s.id].title} />
        </Sequence>
      ))}
    <ProgressBar />
    <Captions />
  </AbsoluteFill>
);

// Окрема глава для перегляду й правок у Studio — так само, як у повному відео.
export const ChapterPreview: React.FC<{ readonly sceneId: string }> = ({ sceneId }) => {
  const scene = getScene(sceneId);
  return (
    <AbsoluteFill>
      <Backdrop offset={scene.from} />
      <Chapter scene={scene} />
      <ProgressBar offsetFrames={scene.from} />
      <Captions offsetFrames={scene.from} />
    </AbsoluteFill>
  );
};
