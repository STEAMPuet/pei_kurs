// Завантажує потрібні шрифти Google Fonts у public/fonts, щоб рендер не залежав від інтернету.
// node tools/fetch-fonts.mjs  → public/fonts/*.woff2 + src/local-fonts.json
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const SPECS = [
  { mod: "Manrope", style: "normal", weights: ["500", "600", "700", "800"], subsets: ["cyrillic", "cyrillic-ext", "latin"] },
  { mod: "Lora", style: "italic", weights: ["500"], subsets: ["cyrillic", "cyrillic-ext", "latin"] },
  // шрифти трейлера курсу
  { mod: "Unbounded", style: "normal", weights: ["500", "700", "900"], subsets: ["cyrillic", "latin"] },
  { mod: "Exo2", style: "normal", weights: ["500", "600", "700"], subsets: ["cyrillic", "latin"] },
  { mod: "JetBrainsMono", style: "normal", weights: ["500", "700"], subsets: ["cyrillic", "latin"] },
];

const outDir = path.resolve("public/fonts");
fs.mkdirSync(outDir, { recursive: true });
const manifest = [];
for (const spec of SPECS) {
  const info = require(`@remotion/google-fonts/${spec.mod}`).getInfo();
  for (const weight of spec.weights) {
    for (const subset of spec.subsets) {
      const url = info.fonts[spec.style][weight][subset];
      const file = `fonts/${spec.mod}-${spec.style}-${weight}-${subset}.woff2`;
      const dest = path.resolve("public", file);
      if (!fs.existsSync(dest)) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${url}: ${res.status}`);
        fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
        console.log("завантажено", file);
      }
      manifest.push({ family: info.fontFamily, file, weight, style: spec.style, unicodeRange: info.unicodeRanges[subset] });
    }
  }
}
fs.writeFileSync(path.resolve("src/local-fonts.json"), JSON.stringify(manifest, null, 1));
console.log(`шрифтів: ${manifest.length}`);
