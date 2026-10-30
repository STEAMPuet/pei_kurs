import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CHEST_DY, DAY_H, DAY_W, DayWorld, FLOOR, HAND_DY, HEAD_DY, HEROINE, MATE_X, stationX } from "../DayWorld";
import { BigText, Bubble, Callout, Camera, type CamKey, ChapterTag, MoodCloud, SceneFade, Show } from "../kit";
import { ABILITIES, C, SANS } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { ease } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Ключ камери, що ставить точку світу (wx, wy) у точку екрана (sx, sy) з масштабом z.
const aim = (at: number, wx: number, wy: number, z: number, sx = 960, sy = 440, dur?: number): CamKey => ({
  at,
  x: wx - (sx - 960) / z,
  y: wy - (sy - 440) / z,
  z,
  dur,
});

const headOf = (x: number) => ({ x, y: FLOOR - HEAD_DY });

// М'яка підкладка під текст у лівій частині кадру.
const LeftVeil: React.FC<{ readonly at: number; readonly until?: number; readonly dark?: boolean; readonly width?: number }> = ({ at, until, dark, width = 62 }) => (
  <Show at={at} until={until} from="none" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 880 }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: dark
          ? `linear-gradient(90deg, rgba(40,46,76,0.9) 0%, rgba(40,46,76,0.7) ${width - 22}%, rgba(40,46,76,0) ${width}%)`
          : `linear-gradient(90deg, rgba(247,241,232,0.96) 0%, rgba(247,241,232,0.8) ${width - 22}%, rgba(247,241,232,0) ${width}%)`,
      }}
    />
  </Show>
);

// Заголовок кроку моделі + міні-драбина в лівій колонці (лише під час визначення).
const StepTitle: React.FC<{ readonly i: 0 | 1 | 2 | 3; readonly lead: string; readonly until: number; readonly dark?: boolean }> = ({ i, lead, until, dark = false }) => {
  const a = ABILITIES[i];
  const ink = dark ? "#FFFDF9" : C.ink;
  return (
    <>
      <LeftVeil at={0} until={until} dark={dark} width={48} />
      <div style={{ position: "absolute", left: 70, top: 120, width: 900 }}>
        <Show at={6} until={until} from="left">
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ width: 110, height: 110, flexShrink: 0, borderRadius: 110, backgroundColor: a.color, color: "#FFFDF9", fontFamily: SANS, fontWeight: 800, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: C.shadow }}>
              {a.n}
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 96, color: ink, lineHeight: 1 }}>{a.title}</div>
          </div>
        </Show>
        <Show at={20} until={until} from="left">
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 52, lineHeight: 1.2, marginTop: 26, color: dark ? "#E8E4F4" : C.inkSoft }}>{lead}</div>
        </Show>
        {/* де ми на «драбині» моделі */}
        <div style={{ display: "flex", flexDirection: "column-reverse", gap: 10, marginTop: 44 }}>
          {ABILITIES.map((b, k) => (
            <Show key={b.n} at={30 + k * 4} until={until} from="left">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  marginLeft: k * 30,
                  padding: "8px 22px",
                  borderRadius: 999,
                  backgroundColor: k === i ? b.color : dark ? "rgba(255,253,249,0.14)" : "rgba(31,43,71,0.06)",
                  color: k === i ? "#FFFDF9" : dark ? "#CFCAE2" : C.inkSoft,
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 32,
                }}
              >
                {b.n} · {b.title}
              </div>
            </Show>
          ))}
        </div>
      </div>
    </>
  );
};

// Висновок: велика фраза ліворуч над м'якою підкладкою.
const Takeaway: React.FC<{ readonly at: number; readonly dark?: boolean; readonly children: React.ReactNode }> = ({ at, dark = false, children }) => (
  <>
    <LeftVeil at={at} dark={dark} width={58} />
    <div style={{ position: "absolute", left: 70, top: 130, width: 900 }}>
      <BigText at={at + 4} size={88} serif color={dark ? "#FFFDF9" : C.ink}>
        {children}
      </BigText>
    </div>
  </>
);

const Stage: React.FC<{ readonly keys: CamKey[]; readonly world: React.ReactNode }> = ({ keys, world }) => (
  <Camera keys={keys} width={DAY_W} height={DAY_H}>
    {world}
  </Camera>
);

// ───────────────────────── 1. Сприйняття (ранок) ─────────────────────────
export const Perceive: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  const H = headOf(HEROINE[0].x);
  const M = headOf(stationX(0) + MATE_X);
  const mid = (H.x + M.x) / 2;
  const ok = cue(scene, "Усе нормально");
  const asked = cue(scene, "запитає");
  const keys = [
    aim(0, mid, 470, 0.6, 1100, 440, 1),
    aim(4, mid, 470, 0.8, 1100, 470, 60),
    aim(b1, mid + 120, 440, 0.98, 1000, 450, 60),
    aim(b2, mid, 470, 0.82, 1470, 480, 60),
  ];
  return (
    <SceneFade duration={durationInFrames}>
      <Stage
        keys={keys}
        world={
          <DayWorld
            moods={{ heroine: [frame > asked ? "calm" : "focus", "neutral", "neutral", "neutral"], mate: "sad" }}
            speaking={{ mate: frame > ok && frame < ok + 40, heroine: frame > asked && frame < asked + 45 ? 0 : undefined }}
          >
            {/* визначення: свої й чужі емоції, канали сигналів */}
            <Show at={cue(scene, "власні")} until={b1}>
              <MoodCloud x={H.x + 70} y={H.y - 200} r={80} color={C.teal} label="мої" />
            </Show>
            <Show at={cue(scene, "інших людей")} until={b1}>
              <MoodCloud x={M.x - 70} y={M.y - 200} r={80} color={C.lav} label="?" amp={0.12} />
            </Show>
            {[
              { w: "мімікою", t: "міміка", from: [M.x + 64, M.y - 14], to: [M.x + 440, FLOOR - 480] },
              { w: "жестами", t: "жести", from: [M.x + 94, FLOOR - HAND_DY], to: [M.x + 440, FLOOR - 150] },
              { w: "інтонацією", t: "інтонація", from: [M.x + 58, M.y + 28], to: [M.x + 440, FLOOR - 370] },
              { w: "поведінкою", t: "поведінка", from: [M.x + 92, FLOOR - CHEST_DY + 40], to: [M.x + 440, FLOOR - 260] },
            ].map((c) => (
              <Show key={c.w} at={0} until={b1} from="none">
                <Callout at={cue(scene, c.w)} x={c.from[0]} y={c.from[1]} tx={c.to[0]} ty={c.to[1]} color={C.lavDeep}>
                  {c.t}
                </Callout>
              </Show>
            ))}

            {/* приклад: «Усе нормально» і невербальні сигнали */}
            <Show at={0} until={b2} from="none">
              <Bubble at={ok} x={M.x - 70} y={60} tail="left" size={54}>
                «Усе нормально»
              </Bubble>
              <Callout at={cue(scene, "тихо")} x={M.x + 58} y={M.y + 28} tx={M.x + 470} ty={300}>
                тихий голос
              </Callout>
              <Callout at={cue(scene, "погляду")} x={M.x + 64} y={M.y - 14} tx={M.x + 470} ty={410}>
                погляд убік
              </Callout>
              <Callout at={cue(scene, "коротко")} x={M.x + 92} y={FLOOR - CHEST_DY} tx={M.x + 470} ty={520}>
                короткі відповіді
              </Callout>
              <Show at={cue(scene, "розбіжність")} from="scale" style={{ position: "absolute", left: M.x + 450, top: 40 }}>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 130, color: C.peach, lineHeight: 1 }}>≠</div>
              </Show>
              <Show at={cue(scene, "можливо")} from="up" style={{ position: "absolute", left: M.x - 470, top: FLOOR - 60, width: 640 }}>
                <div style={{ padding: "16px 28px", borderRadius: 24, backgroundColor: "rgba(255,253,249,0.94)", fontFamily: SANS, fontWeight: 700, fontSize: 38, lineHeight: 1.25, color: C.inkSoft, boxShadow: C.shadow }}>
                  сигнали — привід уточнити, а не діагноз
                </div>
              </Show>
              <Bubble at={asked} x={H.x - 330} y={110} tail="right" bg={C.tealSoft} color={C.tealDeep} size={52}>
                «Як ти насправді?»
              </Bubble>
            </Show>
          </DayWorld>
        }
      />
      <StepTitle i={0} lead="помітити емоцію — свою та чужу" until={b1 + 4} />
      <Takeaway at={b2}>
        Щоб працювати з емоцією, її спершу треба <span style={{ color: C.tealDeep }}>помітити</span>.
      </Takeaway>
      <Show at={cue(scene, "фундамент")} style={{ position: "absolute", left: 70, top: 520 }}>
        <div style={{ display: "inline-block", padding: "16px 30px", borderRadius: 999, backgroundColor: C.tealSoft, color: C.tealDeep, fontFamily: SANS, fontWeight: 800, fontSize: 46 }}>
          фундамент моделі
        </div>
      </Show>
      <ChapterTag>3 · Модель Маєра–Саловея–Карузо</ChapterTag>
    </SceneFade>
  );
};

// ───────────────────────── 2. Використання (полудень) ─────────────────────────
export const Use: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  const H = headOf(HEROINE[1].x);
  const worry = cue(scene, "хвилювання");
  const signal = cue(scene, "сигнал");
  const aimAt = cue(scene, "спрямовує");
  // хвилювання → зосередження: хмарка меншає й заспокоюється, з'являється промінь уваги
  const f = interpolate(frame, [aimAt, aimAt + 40], [0, 1], { ...clamp, easing: ease });
  const notes = { x: stationX(1) + 1140, y: 540 };
  const keys = [
    // продовження руху вздовж «дня»: з ранку камера пливе до полудня
    aim(0, stationX(0) + 1700, 470, 0.8, 960, 440, 1),
    aim(2, H.x + 300, 470, 0.85, 1250, 470, 70),
    aim(b1, H.x + 300, 440, 1.0, 1100, 450, 60),
    aim(aimAt, H.x + 330, 450, 1.08, 1060, 450, 50),
    aim(b2, H.x + 300, 470, 0.85, 1470, 480, 60),
  ];
  return (
    <SceneFade duration={durationInFrames}>
      <Stage
        keys={keys}
        world={
          <DayWorld moods={{ heroine: ["calm", frame > aimAt ? "focus" : frame > worry ? "tense" : "neutral", "neutral", "neutral"], flush: [0, frame > worry && frame < aimAt ? 0.6 : 0, 0, 0] }}>
            <Show at={0} until={b1} from="none">
              <Callout at={cue(scene, "творчому")} x={H.x + 64} y={H.y - 16} tx={H.x + 600} ty={170} color={ABILITIES[1].color}>
                творчий пошук рішень
              </Callout>
              <Callout at={cue(scene, "аналізі")} x={H.x + 60} y={H.y + 24} tx={H.x + 600} ty={290} color={ABILITIES[1].color}>
                аналіз ситуацій
              </Callout>
            </Show>
            <Show at={worry}>
              <MoodCloud
                x={H.x - 250 + 120 * f}
                y={H.y - 110 + 10 * f}
                r={120 - 45 * f}
                color={f > 0.5 ? C.teal : C.peach}
                amp={0.2 - 0.15 * f}
                label={frame > signal ? (f > 0.5 ? "" : "«Це важливо»") : "хвилювання"}
              />
            </Show>
            {/* промінь уваги від героїні до складних тем */}
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
              <polygon points={`${H.x + 40},${H.y - 40} ${notes.x - 90},${notes.y - 10} ${notes.x + 120},${notes.y + 30}`} fill={C.teal} opacity={0.24 * f} />
            </svg>
            <Show at={0} until={b2} from="none">
              <Callout at={cue(scene, "складні теми")} x={notes.x + 20} y={notes.y} tx={notes.x + 420} ty={330} color={C.tealDeep}>
                складні теми ✓
              </Callout>
            </Show>
          </DayWorld>
        }
      />
      <StepTitle i={1} lead="емоція допомагає думати" until={b1 + 4} />
      <Takeaway at={b2}>
        Емоція не заважає думати — вона <span style={{ color: C.tealDeep }}>спрямовує увагу</span>.
      </Takeaway>
      <ChapterTag>3 · Модель Маєра–Саловея–Карузо</ChapterTag>
    </SceneFade>
  );
};

// ───────────────────────── 3. Розуміння (вечір) ─────────────────────────
export const Understand: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  const H = headOf(HEROINE[2].x);
  const F = headOf(stationX(2) + 1520);
  const cloud = { x: H.x, y: H.y - 190 };
  const CLOUD_R = 170;
  const irritated = cue(scene, "дратуєтеся");
  const notThem = cue(scene, "близьких");
  const tired = cue(scene, "втомі");
  const future = cue(scene, "передбачаєте");
  const cross = interpolate(frame, [notThem + 18, notThem + 34], [0, 1], clamp);
  // точка на краю хмари в напрямку цілі (еліпс r × 0.78r, з невеликим запасом)
  const edge = (x2: number, y2: number) => {
    const a = Math.atan2(y2 - cloud.y, x2 - cloud.x);
    return { x: cloud.x + CLOUD_R * 1.12 * Math.cos(a), y: cloud.y + CLOUD_R * 0.78 * 1.12 * Math.sin(a) };
  };
  const thread = (at: number, x2: number, y2: number, color: string, dashed = true) => {
    const p = interpolate(frame, [at, at + 24], [0, 1], { ...clamp, easing: ease });
    return (
      <line x1={edge(x2, y2).x} y1={edge(x2, y2).y} x2={edge(x2, y2).x + (x2 - edge(x2, y2).x) * p} y2={edge(x2, y2).y + (y2 - edge(x2, y2).y) * p} stroke={color} strokeWidth={6} strokeDasharray={dashed ? "14 12" : undefined} strokeLinecap="round" opacity={p > 0 ? 1 : 0} />
    );
  };
  const keys = [
    aim(0, stationX(1) + 1700, 470, 0.8, 960, 440, 1),
    aim(2, H.x + 350, 450, 0.82, 1250, 470, 70),
    aim(b1, H.x + 400, 430, 0.9, 1150, 460, 60),
    aim(future, H.x + 500, 430, 0.8, 1000, 460, 50),
    aim(b2, H.x + 400, 450, 0.72, 1480, 480, 60),
  ];
  return (
    <SceneFade duration={durationInFrames}>
      <Stage
        keys={keys}
        world={
          <DayWorld moods={{ heroine: ["calm", "focus", frame > tired ? "sad" : frame > irritated ? "tense" : "neutral", "neutral"], family: "neutral" }}>
            {/* визначення: причина → зміна → розвиток; змішані переживання */}
            <Show at={cue(scene, "причини")} until={b1} style={{ position: "absolute", left: H.x - 220, top: 70 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: SANS, fontWeight: 800, fontSize: 50 }}>
                <span style={{ padding: "14px 28px", borderRadius: 999, backgroundColor: C.surface, boxShadow: C.shadow }}>причина</span>
                <Show at={cue(scene, "змінюються")}>
                  <span style={{ color: C.inkMute }}>→ </span>
                  <span style={{ padding: "14px 28px", borderRadius: 999, backgroundColor: C.lavSoft, color: C.lavDeep }}>зміна</span>
                </Show>
                <Show at={cue(scene, "передбачати")}>
                  <span style={{ color: C.inkMute }}>→ </span>
                  <span style={{ padding: "14px 28px", borderRadius: 999, backgroundColor: C.surface, boxShadow: C.shadow }}>розвиток</span>
                </Show>
              </div>
            </Show>
            <Show at={cue(scene, "змішаних")} until={b1}>
              <MoodCloud x={H.x - 40} y={H.y - 170} r={90} color={C.lav} amp={0.1} />
              <MoodCloud x={H.x + 50} y={H.y - 160} r={80} color={C.peach} amp={0.1} label="змішані" />
            </Show>

            {/* приклад: роздратування, хибна й справжня причина, прогноз */}
            <Show at={irritated}>
              <MoodCloud x={cloud.x} y={cloud.y} r={CLOUD_R} color="#9C8FB0" amp={0.14} label="роздратування" labelSize={36} />
            </Show>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
              {thread(notThem, F.x - 60, F.y + 150, C.inkMute)}
              <g opacity={cross}>
                <line x1={F.x - 40} y1={F.y + 110} x2={F.x + 40} y2={F.y + 190} stroke={C.peach} strokeWidth={12} strokeLinecap="round" />
                <line x1={F.x + 40} y1={F.y + 110} x2={F.x - 40} y2={F.y + 190} stroke={C.peach} strokeWidth={12} strokeLinecap="round" />
              </g>
              {thread(tired, H.x - 420, FLOOR - 120, C.lavDeep, false)}
              {thread(future, F.x + 330, 130, C.inkMute)}
            </svg>
            <Show at={notThem + 20} from="scale" style={{ position: "absolute", left: F.x + 100, top: F.y + 120 }}>
              <div style={{ padding: "10px 24px", borderRadius: 999, backgroundColor: "rgba(255,253,249,0.94)", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#C46F52" }}>не причина</div>
            </Show>
            <Show at={tired + 10} from="scale" style={{ position: "absolute", left: H.x - 560, top: FLOOR - 165 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 28px", borderRadius: 999, backgroundColor: C.surface, border: `3px solid ${C.lavDeep}`, boxShadow: C.shadow, fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.lavDeep }}>
                {/* «розряджена батарейка» — утома */}
                <span style={{ display: "inline-block", width: 72, height: 36, borderRadius: 8, border: `4px solid ${C.lavDeep}`, position: "relative" }}>
                  <span style={{ position: "absolute", left: 4, top: 4, bottom: 4, width: 14, borderRadius: 3, backgroundColor: C.peach }} />
                </span>
                утома після дня
              </div>
            </Show>
            <Show at={future + 10} until={b2} from="left" style={{ position: "absolute", left: F.x + 180, top: 70 }}>
              <div style={{ padding: "18px 30px", borderRadius: 30, border: `3px dashed ${C.inkMute}`, fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.inkSoft, backgroundColor: "rgba(255,253,249,0.75)" }}>
                без відпочинку → сварка?
              </div>
            </Show>
          </DayWorld>
        }
      />
      <StepTitle i={2} lead="звідки емоція і куди вона веде" until={b1 + 4} />
      <LeftVeil at={b2} width={72} />
      <div style={{ position: "absolute", left: 70, top: 150, display: "flex", flexDirection: "column", gap: 36 }}>
        <BigText at={cue(scene, "чому")} size={84} serif>
          Чому я це відчуваю?
        </BigText>
        <BigText at={cue(scene, "що може")} size={84} serif color={C.lavDeep}>
          Що може статися далі?
        </BigText>
      </div>
      <ChapterTag>3 · Модель Маєра–Саловея–Карузо</ChapterTag>
    </SceneFade>
  );
};

// ───────────────────────── 4. Управління (ніч) ─────────────────────────
const Breath: React.FC<{ readonly x: number; readonly y: number; readonly at: number; readonly until: number }> = ({ x, y, at, until }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until) {
    return null;
  }
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      {[0, 1, 2].map((k) => {
        const t = ((frame - at + k * 30) % 90) / 90;
        return <circle key={k} cx={x} cy={y} r={110 + 200 * t} fill="none" stroke="#BFE3DE" strokeWidth={5} opacity={0.6 * (1 - t)} />;
      })}
    </svg>
  );
};

export const Manage: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  const H = headOf(HEROINE[3].x);
  const harsh = cue(scene, "різке");
  const pause = cue(scene, "паузу");
  const reply = cue(scene, "Мене засмутив");
  const calm = interpolate(frame, [cue(scene, "видихів"), cue(scene, "видихів") + 60], [0, 1], { ...clamp, easing: ease });
  const phone = { x: stationX(3) + 1200, y: 120 };
  const typed = Math.max(0, Math.min(1, (frame - reply) / 90));
  const replyText = "Мене засмутив тон повідомлення. Пропоную обговорити питання.";
  const keys = [
    aim(0, stationX(2) + 1700, 470, 0.8, 960, 440, 1),
    aim(2, H.x + 300, 450, 0.82, 1250, 470, 70),
    aim(b1, H.x + 330, 430, 0.92, 1000, 450, 60),
    aim(b2, H.x + 300, 450, 0.8, 1300, 470, 60),
  ];
  return (
    <SceneFade duration={durationInFrames}>
      <Stage
        keys={keys}
        world={
          <DayWorld moods={{ heroine: ["calm", "focus", "calm", frame > harsh && calm < 0.5 ? "angry" : frame > harsh ? "calm" : "neutral"], flush: [0, 0, 0, frame > harsh ? 0.7 * (1 - calm) : 0] }}>
            <Show at={0} until={b1} from="none">
              <Callout at={cue(scene, "контролювати")} x={H.x + 64} y={H.y} tx={H.x + 560} ty={210} color={C.tealDeep} size={42}>
                контроль реакцій
              </Callout>
              <Callout at={cue(scene, "рівновагу")} x={H.x + 96} y={FLOOR - CHEST_DY} tx={H.x + 560} ty={340} color={C.tealDeep} size={42}>
                рівновага
              </Callout>
              <Callout at={cue(scene, "допомагати")} x={H.x + 96} y={FLOOR - HAND_DY - 40} tx={H.x + 600} ty={470} color={C.tealDeep} size={42}>
                допомога іншим
              </Callout>
            </Show>

            {/* приклад: різке повідомлення → пауза → спокійна відповідь */}
            <Show at={harsh} until={b2} from="scale" style={{ position: "absolute", left: phone.x, top: phone.y, width: 660 }}>
              <div style={{ borderRadius: 40, padding: "30px 30px 40px", backgroundColor: "#F3F1F8", boxShadow: "0 30px 60px rgba(0,0,0,0.25)" }}>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.inkMute, marginBottom: 18 }}>Робочий чат</div>
                <div style={{ padding: "20px 26px", borderRadius: "26px 26px 26px 6px", backgroundColor: C.peachSoft, border: `3px solid ${C.peach}`, width: 460 }}>
                  <div style={{ height: 16, borderRadius: 8, backgroundColor: C.peach, opacity: 0.6, width: 370 }} />
                  <div style={{ height: 16, borderRadius: 8, backgroundColor: C.peach, opacity: 0.6, width: 250, marginTop: 12 }} />
                  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: "#A8644A", marginTop: 14 }}>різке повідомлення</div>
                </div>
                <div style={{ marginTop: 24, marginLeft: 60, padding: "20px 26px", borderRadius: "26px 26px 6px 26px", backgroundColor: C.tealSoft, minHeight: 60, opacity: frame > reply ? 1 : 0, fontFamily: SANS, fontWeight: 700, fontSize: 38, lineHeight: 1.3, color: C.ink }}>
                  {replyText.slice(0, Math.round(replyText.length * typed))}
                </div>
              </div>
            </Show>
            <Show at={harsh + 6}>
              <MoodCloud x={H.x - 300} y={H.y - 90} r={125 - 50 * calm} color={calm > 0.5 ? "#7FC7BE" : "#E39B7F"} amp={0.24 - 0.2 * calm} label={calm > 0.5 ? "" : "злість"} labelColor="#FFFDF9" />
            </Show>
            <Breath x={H.x} y={FLOOR - CHEST_DY} at={pause} until={b2} />
            <Show at={pause} until={b2} from="scale" style={{ position: "absolute", left: H.x - 640, top: FLOOR - 160 }}>
              <div style={{ padding: "16px 30px", borderRadius: 999, backgroundColor: "rgba(191,227,222,0.95)", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.tealDeep }}>пауза · видих</div>
            </Show>
          </DayWorld>
        }
      />
      <StepTitle i={3} lead="обирати реакцію, а не діяти на автоматі" until={b1 + 4} dark />

      {/* висновок: придушення vs регулювання — дві дороги */}
      <Show at={b2} from="none" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 880 }}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(36,42,70,0.82)" }} />
      </Show>
      <div style={{ position: "absolute", left: 120, right: 120, top: 120, display: "flex", gap: 60 }}>
        <Show at={cue(scene, "придушувати")} from="left" style={{ flex: 1 }}>
          <div style={{ height: 600, boxSizing: "border-box", borderRadius: 40, padding: "44px 48px", backgroundColor: "#3A4066", border: "3px dashed rgba(232,228,244,0.55)", color: "#ECE9F6", fontFamily: SANS, boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>
            <div style={{ fontWeight: 800, fontSize: 76 }}>Придушити</div>
            {/* емоцію запхали в коробку */}
            <div style={{ position: "relative", height: 230, marginTop: 30 }}>
              <div style={{ position: "absolute", left: 60, top: 60, width: 280, height: 160, borderRadius: 16, border: "6px solid #A9A5C4" }} />
              <div style={{ position: "absolute", left: 40, top: 40, width: 320, height: 26, borderRadius: 8, backgroundColor: "#A9A5C4", rotate: "-6deg" }} />
              <div style={{ position: "absolute", left: 160, top: 110, width: 80, height: 60, borderRadius: 40, backgroundColor: "#E39B7F", opacity: 0.5 }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 48, marginTop: 10, color: "#D9D5EA" }}>заперечити, сховати</div>
          </div>
        </Show>
        <Show at={cue(scene, "визнають")} from="right" style={{ flex: 1 }}>
          <div style={{ height: 600, boxSizing: "border-box", borderRadius: 40, padding: "44px 48px", backgroundColor: "rgba(255,253,249,0.96)", color: C.ink, fontFamily: SANS, boxShadow: C.shadow }}>
            <div style={{ fontWeight: 800, fontSize: 76, color: ABILITIES[3].color }}>Регулювати</div>
            <div style={{ position: "relative", height: 230, marginTop: 30 }}>
              <MoodCloud x={150} y={115} r={80} color="#7FC7BE" amp={0.06} />
              <div style={{ position: "absolute", left: 290, top: 80, padding: "18px 26px", borderRadius: "24px 24px 24px 6px", backgroundColor: C.tealSoft, fontWeight: 700, fontSize: 38, color: C.tealDeep }}>«Мене засмутило…»</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 48, marginTop: 10, color: C.inkSoft }}>визнати й обрати, як і коли сказати</div>
          </div>
        </Show>
      </div>
      <ChapterTag>3 · Модель Маєра–Саловея–Карузо</ChapterTag>
    </SceneFade>
  );
};
