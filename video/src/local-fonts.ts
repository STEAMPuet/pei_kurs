import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import fonts from "./local-fonts.json";

// Шрифти з public/fonts (див. tools/fetch-fonts.mjs): рендер не залежить від мережі.
// Розбиття за unicode-range — як у Google Fonts.
for (const f of fonts) {
  loadFont({
    family: f.family,
    url: staticFile(f.file),
    weight: f.weight,
    style: f.style,
    unicodeRange: f.unicodeRange,
    format: "woff2",
  });
}
