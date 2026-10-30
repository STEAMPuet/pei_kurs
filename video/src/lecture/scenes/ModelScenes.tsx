import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DAY_H, DAY_W, DayWorld, stationX } from "../DayWorld";
import { BigText, ChapterTag, Glow, Link, Pill, SceneFade, Show } from "../kit";
import { ABILITIES, C, SANS, SERIF } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { ease } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Віконце в «день героїні»: показує одну локацію світу DayWorld у зменшеному масштабі.
const PANEL_W = 860;
const PANEL_H = 330;
const StationPanel: React.FC<{ readonly i: number; readonly at: number; readonly next?: number; readonly x: number; readonly y: number }> = ({ i, at, next, x, y }) => {
  const frame = useCurrentFrame();
  const on = interpolate(frame, [at - 4, at + 14], [0, 1], { ...clamp, easing: ease });
  const active = frame >= at - 4 && (next === undefined || frame < next - 4);
  const s = PANEL_W / 2000;
  const a = ABILITIES[i];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: PANEL_W,
        height: PANEL_H,
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: active ? `0 0 0 8px ${a.color}, ${C.shadow}` : `0 0 0 3px ${a.soft}, ${C.shadow}`,
        scale: String(0.97 + 0.03 * on),
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, width: DAY_W, height: DAY_H, transformOrigin: "0 0", transform: `scale(${s}) translate(${-stationX(i) - 100}px, ${-60}px)`, opacity: 0.7 + 0.3 * on, filter: `saturate(${0.65 + 0.35 * on})` }}>
        <DayWorld />
      </div>
      <div style={{ position: "absolute", left: 18, top: 18, display: "flex", alignItems: "center", gap: 14, padding: "8px 26px 8px 8px", borderRadius: 999, backgroundColor: "rgba(255,253,249,0.97)", boxShadow: C.shadow }}>
        <div style={{ width: 64, height: 64, borderRadius: 64, backgroundColor: a.color, color: "#FFFDF9", fontFamily: SANS, fontWeight: 800, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>{a.n}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 48, color: C.ink }}>{a.title}</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.inkSoft }}>· {["ранок", "полудень", "вечір", "ніч"][i]}</div>
      </div>
    </div>
  );
};

// ───────────────────────── Модель Маєра–Саловея–Карузо ─────────────────────────
// Великий план назви й авторів → «емоції — це інформація» → огляд дня героїні з чотирма кроками.
export const Model: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const info = cue(scene, "інформацію");
  const reg = cue(scene, "регулятивну");
  const four = cue(scene, "чотири");
  const names = ["сприйняття", "використання", "розуміння", "управління"].map((w) => cue(scene, w, 1));
  const dayIn = interpolate(frame, [four - 6, four + 14], [0, 1], clamp);
  return (
    <SceneFade duration={durationInFrames}>
      {/* огляд «дня»: чотири кроки моделі як чотири моменти одного дня (2×2) */}
      <div style={{ position: "absolute", inset: 0, opacity: dayIn }}>
        {ABILITIES.map((a, i) => (
          <StationPanel key={a.n} i={i} at={names[i]} next={names[i + 1]} x={i % 2 === 0 ? 70 : 990} y={i < 2 ? 195 : 540} />
        ))}
      </div>
      {/* великий план назви моделі та авторів */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 880, opacity: 1 - dayIn }}>
        <Glow x={960} y={420} r={800} color="#FFE7C6" opacity={0.8} />
        <Show at={0} until={reg} style={{ position: "absolute", left: 120, top: 150 }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 5, color: C.tealDeep, textTransform: "uppercase" }}>Центральна частина лекції</div>
        </Show>
        <div style={{ position: "absolute", left: 120, top: 220 }}>
          <BigText at={4} until={reg} size={124}>
            Модель здібностей
          </BigText>
        </div>
        <div style={{ position: "absolute", left: 120, top: 400, display: "flex", gap: 50 }}>
          {[
            { w: "Джона", t: "Джон Маєр", c: C.teal },
            { w: "Пітера", t: "Пітер Саловей", c: "#5E8FB0" },
            { w: "Девіда", t: "Девід Карузо", c: C.lav },
          ].map((a) => (
            <Show key={a.w} at={cue(scene, a.w)} until={reg} from="up">
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: a.c }}>{a.t}</div>
            </Show>
          ))}
        </div>
        <Show at={cue(scene, "найбільш")} until={reg} from="up" style={{ position: "absolute", left: 120, top: 540 }}>
          <Pill color={C.tealDeep} bg={C.tealSoft} size={46}>одна з найбільш науково обґрунтованих</Pill>
        </Show>
        <Show at={cue(scene, "академічній")} until={reg} from="up" style={{ position: "absolute", left: 120, top: 640 }}>
          <Pill color={C.inkSoft} size={46}>базова в академічній психології</Pill>
        </Show>
        {/* пізнавальна функція емоцій */}
        {/* дві функції емоцій: регулятивна (відома) + пізнавальна (акцент моделі) */}
        <Show at={cue(scene, "регулятивну")} until={four} style={{ position: "absolute", left: 120, top: 170, display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 50, color: C.inkSoft }}>функції емоцій:</div>
          <Pill color={C.inkSoft} size={56} outline>регулятивна</Pill>
          <Show at={cue(scene, "пізнавальну")} from="scale" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 60, color: C.inkMute }}>+</span>
            <Pill color="#FFFDF9" bg={C.tealDeep} size={56}>пізнавальна</Pill>
          </Show>
        </Show>
        <div style={{ position: "absolute", left: 120, top: 320 }}>
          <BigText at={info} until={four} size={150} serif>
            емоції — це <span style={{ color: C.tealDeep }}>інформація</span>
          </BigText>
        </div>
      </div>
      <Show at={cue(scene, "від базової")} style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "12px 30px", borderRadius: 999, backgroundColor: "rgba(255,253,249,0.9)", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.ink }}>
          один день — чотири кроки: від базового до найскладнішого
        </div>
      </Show>
      <ChapterTag>3 · Модель Маєра–Саловея–Карузо</ChapterTag>
    </SceneFade>
  );
};

// ───────────────────────── Вимірювання: MSCEIT ─────────────────────────
const ICONS = ["☀", "☀", "◐", "☾"];

export const Msceit: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b1 = beatStart(scene, 1);
  const petals = interpolate(frame, [cue(scene, "кожної"), cue(scene, "кожної") + 50], [0, 1], { ...clamp, easing: ease });
  const lens = [0.7, 0.85, 0.6, 0.78];
  const verbs = ABILITIES.map((a) => ({ ...a, at: cue(scene, a.verb, 1) }));
  const fade0 = interpolate(frame, [b1 - 10, b1 + 10], [1, 0], clamp);
  return (
    <SceneFade duration={durationInFrames}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 880, opacity: fade0 }}>
        <Glow x={1350} y={420} r={600} color="#E8F3F1" opacity={0.9} />
        <Show at={0} until={cue(scene, "тест Маєра")} style={{ position: "absolute", left: 120, top: 150 }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 80, color: C.ink }}>Як виміряти здібності?</div>
        </Show>
        <div style={{ position: "absolute", left: 120, top: 150 }}>
          <BigText at={cue(scene, "тест Маєра")} size={170} color={C.tealDeep}>
            MSCEIT
          </BigText>
          <Show at={cue(scene, "тест Маєра") + 10} style={{ marginTop: 10 }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, color: C.inkSoft }}>тест Маєра–Саловея–Карузо</div>
          </Show>
        </div>
        {/* «каркас» профілю ще до назви тесту: чотири порожні пелюстки, які тест «заповнить» */}
        <Show at={8} from="scale" style={{ position: "absolute", left: 1350, top: 400 }}>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
            {ABILITIES.map((a, i) => {
              const ang = -Math.PI / 4 - (i * Math.PI) / 2;
              const cx = 150 * Math.cos(ang);
              const cy = 150 * Math.sin(ang);
              return (
                <ellipse key={a.n} cx={cx} cy={cy} rx={150} ry={64} fill="none" stroke={a.color} strokeWidth={5} strokeDasharray="14 12" opacity={0.55} transform={`rotate(${(ang * 180) / Math.PI} ${cx} ${cy})`} />
              );
            })}
            <circle cx={0} cy={0} r={46} fill="#FFFDF9" stroke={C.ink} strokeWidth={5} />
            <text x={0} y={16} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={44} fill={C.ink} opacity={1 - petals}>?</text>
          </svg>
        </Show>
        {/* «профіль» чотирьох здібностей: пелюстки різної довжини (абстрактно, без чисел) */}
        <svg style={{ position: "absolute", left: 1350, top: 400, overflow: "visible", opacity: petals > 0 ? 1 : 0 }} width={1} height={1}>
          {ABILITIES.map((a, i) => {
            const ang = -Math.PI / 4 - (i * Math.PI) / 2;
            const L = 300 * lens[i] * petals;
            const x2 = L * Math.cos(ang);
            const y2 = L * Math.sin(ang);
            return (
              <ellipse key={a.n} cx={x2 / 2} cy={y2 / 2} rx={Math.max(1, L / 2)} ry={64 * petals} fill={a.color} opacity={0.82} transform={`rotate(${(ang * 180) / Math.PI} ${x2 / 2} ${y2 / 2})`} />
            );
          })}
          <circle cx={0} cy={0} r={46} fill="#FFFDF9" stroke={C.ink} strokeWidth={5} />
        </svg>
        {ABILITIES.map((a, i) => {
          const ang = -Math.PI / 4 - (i * Math.PI) / 2;
          return (
            <Show key={a.n} at={cue(scene, "кожної") + 20 + i * 6} from="scale" style={{ position: "absolute", left: 1350 + 360 * Math.cos(ang), top: 400 + 300 * Math.sin(ang), translate: "-50% -50%" }}>
              <Pill color={a.color} size={40}>{a.title}</Pill>
            </Show>
          );
        })}
        {/* міст: від теорії до емпірики */}
        <Show at={cue(scene, "теоретичних")} from="left" style={{ position: "absolute", left: 120, top: 730 }}>
          <Pill color={C.inkSoft} size={46} outline>теоретичні міркування</Pill>
        </Show>
        <Link at={cue(scene, "емпіричних") - 10} x1={560} y1={760} x2={780} y2={760} bend={-0.3} color={C.tealDeep} width={8} />
        <Show at={cue(scene, "емпіричних")} from="right" style={{ position: "absolute", left: 800, top: 730 }}>
          <Pill color="#FFFDF9" bg={C.tealDeep} size={46}>емпіричні дослідження</Pill>
        </Show>
      </div>

      {/* мнемоніка: чотири дієслова-сходинки з «моментами дня» героїні */}
      <Show at={b1} from="none" style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 120, top: 120, fontFamily: SANS, fontWeight: 800, fontSize: 60, color: C.ink }}>Порядок легко запам'ятати</div>
        {verbs.map((v, i) => (
          <Show key={v.n} at={v.at} from="up" style={{ position: "absolute", left: 140 + i * 420, top: 610 - i * 110 }}>
            <div style={{ width: 400, height: 140 + i * 110, borderRadius: "34px 34px 0 0", backgroundColor: v.soft, borderTop: `12px solid ${v.color}`, padding: "24px 28px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontFamily: SERIF, fontSize: 46, color: v.color }}>{ICONS[i]}</span>
                <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.ink }}>{v.verb}</span>
              </div>
            </div>
          </Show>
        ))}
        <Show at={cue(scene, "базового")} from="up" style={{ position: "absolute", right: 120, top: 120 }}>
          <Pill color={C.inkSoft} size={42}>від базового → до найвищого</Pill>
        </Show>
      </Show>
      <ChapterTag>3 · Модель Маєра–Саловея–Карузо</ChapterTag>
    </SceneFade>
  );
};
