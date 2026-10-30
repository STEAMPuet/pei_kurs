// Швидка перевірка кадрів: один бандл, багато стоп-кадрів.
// node tools/stills.mjs <outDir> ch-intro:120 ch-iq:500 Lecture1:9000 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [outDir, ...targets] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const cache = new Map();
for (const t of targets) {
  const [id, frame] = t.split(":");
  if (!cache.has(id)) {
    cache.set(id, await selectComposition({ serveUrl, id }));
  }
  const output = path.join(outDir, `${id}_${frame}.png`);
  await renderStill({ serveUrl, composition: cache.get(id), frame: Number(frame), output, scale: 0.5 });
  console.log(output);
}
