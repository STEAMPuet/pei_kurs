import type React from "react";
import { C } from "./theme";
import { Glow, LOOKS, type Mood, Person } from "./kit";

// Кабінет психолога: дві фігури в кріслах, між ними — простір контакту й професійна межа.
export const ROOM_W = 2400;
export const ROOM_H = 880;
export const ROOM_FLOOR = 770;
export const PSY = { x: 820, y: ROOM_FLOOR }; // психолог (сидить, дивиться праворуч)
export const CLI = { x: 1580, y: ROOM_FLOOR }; // клієнт (сидить, дивиться ліворуч)
export const HEAD_Y = ROOM_FLOOR - 426;
export const CHEST_Y = ROOM_FLOOR - 300;

const Armchair: React.FC<{ x: number; color: string; flip?: boolean }> = ({ x, color, flip }) => (
  <div style={{ position: "absolute", left: x - 170, top: ROOM_FLOOR - 330, width: 340, height: 330, scale: flip ? "-1 1" : undefined }}>
    <div style={{ position: "absolute", left: 20, top: 0, width: 300, height: 250, borderRadius: "70px 70px 30px 30px", backgroundColor: color }} />
    <div style={{ position: "absolute", left: 0, top: 150, width: 340, height: 140, borderRadius: 40, backgroundColor: color, filter: "brightness(0.93)" }} />
    <div style={{ position: "absolute", left: 40, top: 290, width: 18, height: 40, borderRadius: 6, backgroundColor: "#8C7B6B" }} />
    <div style={{ position: "absolute", right: 40, top: 290, width: 18, height: 40, borderRadius: 6, backgroundColor: "#8C7B6B" }} />
  </div>
);

export const Room: React.FC<{
  readonly psyMood?: Mood;
  readonly cliMood?: Mood;
  readonly psySpeaking?: boolean;
  readonly cliSpeaking?: boolean;
  readonly psyFlush?: number;
  readonly cliFlush?: number;
  readonly warmth?: number; // 0..1 — наскільки тепле світло в кімнаті (зміна атмосфери)
  readonly behind?: React.ReactNode; // шари позаду персонажів (поля емоцій, межа)
  readonly children?: React.ReactNode;
}> = ({ psyMood = "calm", cliMood = "neutral", psySpeaking, cliSpeaking, psyFlush = 0, cliFlush = 0, warmth = 0.5, behind, children }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #F4EDE3 0%, #F1E9DD 70%)" }}>
    {/* вікно з м'яким світлом */}
    <div style={{ position: "absolute", left: 120, top: 110, width: 380, height: 430, borderRadius: 20, border: "14px solid #FFFDF9", background: "linear-gradient(180deg, #DCEBEA, #F3EBDD)" }}>
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 10, marginLeft: -5, backgroundColor: "#FFFDF9" }} />
    </div>
    <Glow x={330} y={320} r={560} color="#FFF1D8" opacity={0.6 + 0.4 * warmth} />
    <Glow x={1200} y={560} r={700} color="#FFE3C2" opacity={0.25 + 0.45 * warmth} />
    {/* картина й полиця */}
    <div style={{ position: "absolute", left: 1900, top: 150, width: 260, height: 190, borderRadius: 14, border: "10px solid #FFFDF9", background: `linear-gradient(135deg, ${C.tealSoft}, ${C.lavSoft})` }} />
    <div style={{ position: "absolute", left: 1880, top: 420, width: 320, height: 20, borderRadius: 8, backgroundColor: "#C9B39A" }} />
    <div style={{ position: "absolute", left: 1910, top: 360, width: 60, height: 60, borderRadius: 10, backgroundColor: C.teal, opacity: 0.7 }} />
    <div style={{ position: "absolute", left: 1990, top: 340, width: 40, height: 80, borderRadius: 10, backgroundColor: C.lav, opacity: 0.7 }} />
    {/* підлога, килим */}
    <div style={{ position: "absolute", left: 0, right: 0, top: ROOM_FLOOR, bottom: 0, backgroundColor: "#E7DCCB" }} />
    <div style={{ position: "absolute", left: 460, top: ROOM_FLOOR - 10, width: 1480, height: 70, borderRadius: "50%", backgroundColor: "#DCCDB8" }} />
    {behind}
    <Armchair x={PSY.x - 30} color="#B9CFD0" />
    <Armchair x={CLI.x + 30} color="#D3C6DC" flip />
    {/* столик між кріслами */}
    <div style={{ position: "absolute", left: 1130, top: ROOM_FLOOR - 170, width: 140, height: 16, borderRadius: 8, backgroundColor: "#B9967A" }} />
    <div style={{ position: "absolute", left: 1192, top: ROOM_FLOOR - 154, width: 16, height: 154, backgroundColor: "#A88568" }} />
    <div style={{ position: "absolute", left: 1170, top: ROOM_FLOOR - 250, width: 60, height: 80, borderRadius: "30px 30px 10px 10px", backgroundColor: "#7FB0A4" }} />
    <Person look={LOOKS.psych} x={PSY.x} y={PSY.y} seated facing="right" mood={psyMood} speaking={psySpeaking} flush={psyFlush} />
    <Person look={LOOKS.client} x={CLI.x} y={CLI.y} seated facing="left" mood={cliMood} speaking={cliSpeaking} flush={cliFlush} />
    {children}
  </div>
);
