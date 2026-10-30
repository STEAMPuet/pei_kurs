// Manrope (500–800) і Lora Italic 500 з кирилицею — локальні файли з public/fonts.
import "../local-fonts";

export const SANS = "Manrope";
export const SERIF = "Lora";

// Тепла світла палітра: кремове тло, темно-синій текст,
// приглушені бірюзові й лавандові акценти.
export const C = {
  bg: "#F7F1E8",
  blob1: "#E9F1EC",
  blob2: "#EEE8F4",
  blob3: "#F6E6DA",
  surface: "#FFFDF9",
  line: "#E6DCCB",
  ink: "#1F2B47",
  inkSoft: "#56607A",
  inkMute: "#8A90A3",
  teal: "#4E9C96",
  tealDeep: "#2F7A74",
  tealSoft: "#DDEEEA",
  lav: "#8E80BF",
  lavDeep: "#6A5CA3",
  lavSoft: "#ECE7F6",
  peach: "#D9967A",
  peachSoft: "#F8E5DA",
  shadow: "0 18px 44px rgba(31, 43, 71, 0.08)",
};

// Чотири здібності моделі МСК: кольори від бірюзового до лавандового.
export const ABILITIES = [
  { n: 1, title: "Сприйняття", verb: "сприйняти", color: "#4E9C96", soft: "#DDEEEA" },
  { n: 2, title: "Використання", verb: "використати", color: "#5E8FB0", soft: "#E0EBF3" },
  { n: 3, title: "Розуміння", verb: "зрозуміти", color: "#8E80BF", soft: "#ECE7F6" },
  { n: 4, title: "Управління", verb: "управляти", color: "#6A5CA3", soft: "#E4DFF2" },
] as const;
