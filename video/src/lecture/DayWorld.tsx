import type React from "react";
import { ABILITIES, C, SANS } from "./theme";
import { Glow, LOOKS, type Mood, Person } from "./kit";

// Один день однієї героїні — спільний світ для чотирьох здібностей моделі МСК.
// Чотири локації поспіль; камера переїжджає між ними від глави до глави.
export const STATION_W = 2200;
export const DAY_W = STATION_W * 4;
export const DAY_H = 880;
export const FLOOR = 760;
export const stationX = (i: number) => i * STATION_W; // лівий край локації i

// Анатомія персонажа (масштаб 1.3): центр голови, верх зачіски, кисті, груди — відстань угору від підлоги.
export const HEAD_DY = 426;
export const HAND_DY = 187;
export const CHEST_DY = 300;
export const MATE_X = 1250; // одногрупниця на ранковій локації (від лівого краю локації)

// Центри «героїні» на кожній локації (світові координати).
export const HEROINE = [
  { x: stationX(0) + 600, y: FLOOR },
  { x: stationX(1) + 820, y: FLOOR },
  { x: stationX(2) + 760, y: FLOOR },
  { x: stationX(3) + 880, y: FLOOR },
];

const Window: React.FC<{ x: number; y: number; w: number; h: number; sky: string }> = ({ x, y, w, h, sky }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, border: "14px solid #FFFDF9", background: sky, boxShadow: "inset 0 0 0 4px rgba(31,43,71,0.06)" }}>
    <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 10, marginLeft: -5, backgroundColor: "#FFFDF9" }} />
    <div style={{ position: "absolute", top: "45%", left: 0, right: 0, height: 10, backgroundColor: "#FFFDF9" }} />
  </div>
);

const Block: React.FC<{ x: number; y: number; w: number; h: number; color: string; r?: number }> = ({ x, y, w, h, color, r = 16 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, backgroundColor: color }} />
);

export type DayMoods = { heroine?: Mood[]; mate?: Mood; family?: Mood; flush?: number[] };

export const DayWorld: React.FC<{
  readonly moods?: DayMoods;
  readonly showLabels?: number; // прозорість підписів локацій (оглядовий план моделі)
  readonly speaking?: { mate?: boolean; heroine?: number };
  readonly children?: React.ReactNode;
}> = ({ moods = {}, showLabels = 0, speaking = {}, children }) => {
  const hm = moods.heroine ?? ["neutral", "neutral", "neutral", "neutral"];
  const fl = moods.flush ?? [0, 0, 0, 0];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, #F8E6D5 0%, #F6EEE2 22%, #F3F2EA 38%, #EEE6F0 62%, #D9D2EA 74%, #5C6489 86%, #4E5679 100%)",
      }}
    >
      {/* підлога вздовж усього дня */}
      <div style={{ position: "absolute", left: 0, right: 0, top: FLOOR, bottom: 0, background: "linear-gradient(90deg, #E9D6C2, #E6DED0 35%, #DCD2E2 65%, #3E4566 88%)" }} />

      {/* ── Ранок: коридор університету ── */}
      <Glow x={stationX(0) + 420} y={260} r={520} color="#FFE2B8" opacity={0.9} />
      <Window x={stationX(0) + 180} y={140} w={360} h={470} sky="linear-gradient(180deg, #FFE7C7, #F9D8C0)" />
      <Window x={stationX(0) + 1500} y={140} w={360} h={470} sky="linear-gradient(180deg, #FFE7C7, #F9D8C0)" />
      <Block x={stationX(0) + 1560} y={650} w={300} h={26} color="#C9A98C" />
      <Block x={stationX(0) + 1580} y={676} w={20} h={84} color="#B79478" r={6} />
      <Block x={stationX(0) + 1820} y={676} w={20} h={84} color="#B79478" r={6} />
      <Person look={LOOKS.mate} x={stationX(0) + MATE_X} y={FLOOR} mood={moods.mate ?? "sad"} facing="left" speaking={speaking.mate} />
      <Person look={LOOKS.heroine} x={HEROINE[0].x} y={FLOOR} mood={hm[0]} facing="right" flush={fl[0]} speaking={speaking.heroine === 0} />

      {/* ── Полудень: підготовка до іспиту ── */}
      <Glow x={stationX(1) + 1100} y={200} r={600} color="#FFF3D6" opacity={0.9} />
      <Window x={stationX(1) + 1480} y={130} w={420} h={420} sky="linear-gradient(180deg, #DDEFF2, #F2F6EE)" />
      <div style={{ position: "absolute", left: stationX(1) + 1760, top: 170, width: 80, height: 80, borderRadius: 80, backgroundColor: "#F7D58A" }} />
      <div style={{ position: "absolute", left: stationX(1) + 1250, top: 120, width: 150, height: 150, borderRadius: 150, border: "10px solid #FFFDF9", backgroundColor: "#F3EEE4", boxShadow: C.shadow }}>
        <div style={{ position: "absolute", left: 65, top: 22, width: 8, height: 56, borderRadius: 4, backgroundColor: C.ink }} />
        <div style={{ position: "absolute", left: 65, top: 64, width: 46, height: 8, borderRadius: 4, backgroundColor: C.ink }} />
      </div>
      <Block x={stationX(1) + 900} y={570} w={620} h={30} color="#B98E6E" />
      <Block x={stationX(1) + 930} y={600} w={24} h={160} color="#A57E62" r={8} />
      <Block x={stationX(1) + 1470} y={600} w={24} h={160} color="#A57E62" r={8} />
      <Block x={stationX(1) + 1040} y={520} w={200} h={50} color="#FFFDF9" r={8} />
      <Block x={stationX(1) + 1280} y={480} w={70} h={90} color={C.lav} r={8} />
      <Block x={stationX(1) + 1356} y={500} w={60} h={70} color={C.teal} r={8} />
      <Block x={stationX(1) + 560} y={610} w={260} h={26} color="#8E9AB5" r={10} />
      <Person look={LOOKS.heroine} x={HEROINE[1].x} y={FLOOR} mood={hm[1]} facing="right" seated flush={fl[1]} />

      {/* ── Вечір: дім ── */}
      <Glow x={stationX(2) + 330} y={420} r={420} color="#FFD9A8" opacity={0.85} />
      <Block x={stationX(2) + 310} y={300} w={14} h={460} color="#6B6F86" r={7} />
      <div style={{ position: "absolute", left: stationX(2) + 240, top: 250, width: 160, height: 90, borderRadius: "80px 80px 20px 20px", backgroundColor: "#F2C98F" }} />
      <Window x={stationX(2) + 1300} y={150} w={440} h={400} sky="linear-gradient(180deg, #B9A9D6, #F0B9A0)" />
      <Block x={stationX(2) + 460} y={560} w={620} h={150} color="#9C8FB8" r={40} />
      <Block x={stationX(2) + 460} y={500} w={620} h={90} color="#AFA3C8" r={40} />
      <Person look={LOOKS.family} x={stationX(2) + 1520} y={FLOOR} mood={moods.family ?? "neutral"} facing="left" />
      <Person look={LOOKS.heroine} x={HEROINE[2].x} y={FLOOR} mood={hm[2]} facing="right" seated flush={fl[2]} />

      {/* ── Ніч: повідомлення ── */}
      <Window x={stationX(3) + 1380} y={150} w={420} h={420} sky="linear-gradient(180deg, #2E3557, #4A5380)" />
      <div style={{ position: "absolute", left: stationX(3) + 1640, top: 200, width: 70, height: 70, borderRadius: 70, backgroundColor: "#F4ECD0", boxShadow: "0 0 40px #F4ECD0" }} />
      <Glow x={stationX(3) + 420} y={420} r={480} color="#FFCF94" opacity={0.75} />
      <Block x={stationX(3) + 400} y={300} w={14} h={460} color="#2B3150" r={7} />
      <div style={{ position: "absolute", left: stationX(3) + 330, top: 250, width: 160, height: 90, borderRadius: "80px 80px 20px 20px", backgroundColor: "#F2C98F", boxShadow: "0 0 60px #F2C98F" }} />
      <Block x={stationX(3) + 640} y={520} w={480} h={200} color="#6F6A93" r={50} />
      <Person look={LOOKS.heroine} x={HEROINE[3].x} y={FLOOR} mood={hm[3]} facing="front" seated hold flush={fl[3]} />
      {/* світло екрана телефону */}
      <Glow x={HEROINE[3].x} y={FLOOR - 230} r={130} color="#DFF3F1" opacity={0.9} />

      {/* підписи локацій для оглядового плану */}
      {ABILITIES.map((a, i) => (
        <div
          key={a.n}
          style={{
            position: "absolute",
            left: stationX(i) + 160,
            top: 40,
            opacity: showLabels,
            fontFamily: SANS,
            color: i === 3 ? "#FFFDF9" : C.ink,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 64, letterSpacing: 4, textTransform: "uppercase", opacity: 0.6 }}>{["Ранок", "Полудень", "Вечір", "Ніч"][i]}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 10 }}>
            <div style={{ width: 130, height: 130, borderRadius: 130, backgroundColor: a.color, color: "#FFFDF9", fontWeight: 800, fontSize: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>{a.n}</div>
            <div style={{ fontWeight: 800, fontSize: 120 }}>{a.title}</div>
          </div>
        </div>
      ))}
      {children}
    </div>
  );
};
