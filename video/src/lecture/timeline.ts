import data from "./timeline.json";

// timeline.json генерує tools/voiceover.py — не редагуйте його вручну.
export type Word = { text: string; from: number };
export type Beat = { src: string; from: number; durationInFrames: number; words: Word[] };
export type SceneData = {
  id: string;
  title: string;
  from: number;
  durationInFrames: number;
  beats: Beat[];
};
export type Caption = { text: string; startMs: number; endMs: number; words?: { text: string; ms: number }[] };

export const timeline = data as {
  fps: number;
  durationInFrames: number;
  volume: number;
  scenes: SceneData[];
  captions: Caption[];
};

export const getScene = (id: string): SceneData => {
  const scene = timeline.scenes.find((s) => s.id === id);
  if (!scene) {
    throw new Error(`Сцену «${id}» не знайдено в timeline.json`);
  }
  return scene;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ʼ’]/g, "'")
    .replace(/[«»"“”.,:;!?—–()]/g, "");

// Кадр (відносно сцени), коли диктор вимовляє фразу.
// beat — шукати лише в цьому біті (корисно, якщо слово повторюється).
export const cue = (scene: SceneData, phrase: string, beat?: number): number => {
  const target = phrase.split(/\s+/).map(norm);
  const beats = beat === undefined ? scene.beats : [scene.beats[beat]];
  for (const b of beats) {
    const words = b.words.map((w) => ({ ...w, n: norm(w.text) }));
    for (let i = 0; i + target.length <= words.length; i++) {
      if (target.every((t, j) => words[i + j].n === t)) {
        return words[i].from;
      }
    }
  }
  throw new Error(`Фразу «${phrase}» не знайдено в сцені «${scene.id}»`);
};

export const beatStart = (scene: SceneData, i: number) => scene.beats[i].from;
