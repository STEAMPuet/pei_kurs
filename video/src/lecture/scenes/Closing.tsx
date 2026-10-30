import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { aim, BigText, Camera, ChapterTag, Glow, Link, type Look, LOOKS, MoodCloud, type Mood, Person, Pill, SceneFade, Show } from "../kit";
import { CLI, HEAD_Y, PSY, Room, ROOM_H, ROOM_W } from "../Room";
import { ABILITIES, C, SANS, SERIF } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { ease } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ───────────────────────── Завдання для рефлексії ─────────────────────────
// Розворот «щоденника»: безпечна умова зі шкалою інтенсивності, далі робочий аркуш із шести кроків.
const ROWS = [
  { w: "перший", t: "Ситуація тижня", d: "коротко опишіть", c: C.ink, ex: "Колега в останню хвилину переніс важливу зустріч" },
  { w: "другий", t: "Сприйняття", d: "емоція та її прояви", c: ABILITIES[0].color, ex: "Роздратування: стиснута щелепа, різкий тон" },
  { w: "третій", t: "Використання", d: "вплив на думки й рішення", c: ABILITIES[1].color, ex: "Хотілося відповісти різко — рішення відклала" },
  { w: "четвертий", t: "Розуміння", d: "причина й розвиток", c: ABILITIES[2].color, ex: "Причина — зірвані плани й утома" },
  { w: "п'ятий", t: "Управління", d: "як регулювали, що інакше", c: ABILITIES[3].color, ex: "Пауза, потім спокійно уточнила нову дату" },
  { w: "шостий", t: "Висновок", d: "сильна здібність і та, що варто тренувати", c: C.tealDeep, ex: "Сильне — сприйняття; тренувати — паузу" },
];
const ROW_Y = (i: number) => 1080 + i * 230;

// Приклад заповнення «від руки»: рядок поступово проявляється зліва направо.
const Handwritten: React.FC<{ readonly at: number; readonly x: number; readonly y: number; readonly color: string; readonly children: string }> = ({ at, x, y, color, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at + 15, at + 60], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ position: "absolute", left: x, top: y, whiteSpace: "nowrap", fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 46, color, clipPath: `inset(-10px ${100 - p * 100}% -10px 0)` }}>
      {children}
    </div>
  );
};

export const Task: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  const pick = interpolate(frame, [cue(scene, "середньої") - 5, cue(scene, "середньої") + 30], [0.1, 0.45], { ...clamp, easing: ease });
  const keys = [
    aim(0, 960, 440, 0.9, 960, 440, 1),
    aim(6, 960, 460, 1.0, 960, 440, 50),
    aim(b1, 960, ROW_Y(1) - 20, 0.92, 960, 450, 70),
    aim(b2, 960, ROW_Y(4) + 40, 0.92, 960, 450, 70),
  ];
  return (
    <SceneFade duration={durationInFrames}>
      <Camera keys={keys} width={1920} height={2500}>
        {/* аркуш щоденника */}
        <div style={{ position: "absolute", left: 180, top: 60, width: 1560, height: 2380, borderRadius: 30, backgroundColor: "#FFFCF5", boxShadow: "0 30px 70px rgba(31,43,71,0.12)", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 69px, rgba(142,128,191,0.12) 69px 72px)" }} />
        {Array.from({ length: 22 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 150, top: 120 + i * 100, width: 60, height: 26, borderRadius: 13, border: `5px solid ${C.inkMute}`, backgroundColor: C.bg }} />
        ))}
        <div style={{ position: "absolute", left: 280, top: 120, fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: C.ink }}>Мій розбір емоційної ситуації</div>

        {/* безпечна умова: шкала інтенсивності */}
        <Show at={cue(scene, "Оберіть")} from="up" style={{ position: "absolute", left: 280, top: 280, width: 1360 }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 48, color: C.ink, marginBottom: 26 }}>Інтенсивність ситуації</div>
          <div style={{ position: "relative", height: 70, borderRadius: 35, background: `linear-gradient(90deg, ${C.tealSoft} 0%, #F2E6C9 55%, #F2C9B6 80%, #E9A98F 100%)` }}>
            <div style={{ position: "absolute", left: "30%", width: "30%", top: -14, bottom: -14, borderRadius: 30, border: `5px solid ${C.tealDeep}`, opacity: frame > cue(scene, "середньої") ? 1 : 0 }} />
            <div style={{ position: "absolute", left: `${pick * 100}%`, top: -30, width: 26, height: 130, borderRadius: 13, backgroundColor: C.ink, translate: "-50% 0" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, fontFamily: SANS, fontWeight: 800, fontSize: 40 }}>
            <span style={{ color: C.inkSoft }}>легка</span>
            <Show at={cue(scene, "середньої")}>
              <span style={{ color: C.tealDeep }}>середня — так</span>
            </Show>
            <Show at={cue(scene, "травматичну")}>
              <span style={{ color: "#B3654C" }}>травматична — ні</span>
            </Show>
          </div>
        </Show>
        <Show at={cue(scene, "Якщо")} from="up" style={{ position: "absolute", left: 280, top: 600, width: 1360 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "28px 36px", borderRadius: 30, backgroundColor: C.lavSoft }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 22, height: 80, borderRadius: 8, backgroundColor: C.lavDeep }} />
              <div style={{ width: 22, height: 80, borderRadius: 8, backgroundColor: C.lavDeep }} />
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.lavDeep, lineHeight: 1.2 }}>
              Стало надто важко — зупиніться.
              <Show at={cue(scene, "підтримку")}>
                <span style={{ fontWeight: 700, color: C.ink }}>Можна звернутися до близьких або фахівця.</span>
              </Show>
            </div>
          </div>
        </Show>

        {/* шість кроків аркуша */}
        {ROWS.map((r, i) => {
          const at = cue(scene, r.w);
          return (
            <Show key={r.w} at={at} until={i < 3 ? b2 + 24 : undefined} from="left" style={{ position: "absolute", left: 280, top: ROW_Y(i) - 80, width: 1360 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
                <div style={{ width: 110, height: 110, flexShrink: 0, borderRadius: 110, backgroundColor: r.c, color: "#FFFDF9", fontFamily: SANS, fontWeight: 800, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {frame > at + 90 ? "✓" : i + 1}
                </div>
                <div>
                  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 62, color: C.ink }}>{r.t}</div>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, color: C.inkSoft }}>{r.d}</div>
                </div>
              </div>
            </Show>
          );
        })}
        {ROWS.map((r, i) => (
          <Show key={`s-${r.w}`} at={0} until={i < 3 ? b2 + 24 : undefined} from="none">
            <Handwritten at={cue(scene, r.w)} x={420} y={ROW_Y(i) + 62} color={r.c}>
              {r.ex}
            </Handwritten>
          </Show>
        ))}
        <Show at={cue(scene, "перший")} until={b2 + 24} from="up" style={{ position: "absolute", right: 260, top: ROW_Y(0) - 170 }}>
          <Pill color={C.lavDeep} bg={C.lavSoft} size={36}>приклад заповнення</Pill>
        </Show>
      </Camera>
      <ChapterTag>5 · Практика</ChapterTag>
    </SceneFade>
  );
};

// ───────────────────────── Висновки ─────────────────────────
const QUESTIONS = [
  { w: "які зміни", t: "Які зміни в поглядах на інтелект підготували появу поняття ЕІ?", c: C.teal },
  { w: "чим управління", t: "Чим управління емоціями відрізняється від їх придушення?", c: C.lav },
  { w: "як емоційний", t: "Як ЕІ допомагає психологові запобігати вигоранню?", c: C.lavDeep },
];

// Картка «людина + шкала IQ» (той самий образ, що в розділі про межі IQ); cloud — додається емоційний стан.
const MindCard: React.FC<{ readonly look: Look; readonly fill: number; readonly label: string; readonly color: string; readonly cloud?: boolean }> = ({ look, fill, label, color, cloud }) => (
  <div style={{ position: "relative", width: 360, height: 600, borderRadius: 34, backgroundColor: C.surface, boxShadow: C.shadow }}>
    <Person look={look} x={150} y={470} scale={0.85} mood={cloud ? "calm" : "neutral"} />
    {cloud ? <MoodCloud x={150} y={95} r={70} color={C.lav} amp={0.06} /> : null}
    <div style={{ position: "absolute", left: 280, top: 160, width: 34, height: 310, borderRadius: 17, border: `5px solid ${C.ink}`, overflow: "hidden", backgroundColor: C.surface }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, backgroundColor: C.teal }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 506, textAlign: "center" }}>
      <Pill color={color} size={36}>{label}</Pill>
    </div>
  </div>
);

// Чотири етапи консультації Ірини — у тих самих формулюваннях, що й у розборі.
const CASE_STEPS = [
  "помітила жар в обличчі й підвищений голос клієнта",
  "напругу сприйняла як сигнал про контакт",
  "свій страх і те, що клієнт почувається непочутим",
  "видих, пауза — і спокійна відповідь",
];

// Мініатюра кабінету з розбору ситуації: настрій і ключова деталь кожного етапу.
const CaseThumb: React.FC<{ readonly step: number }> = ({ step }) => {
  const moods: { psy: Mood; cli: Mood; flush: number; warmth: number }[] = [
    { psy: "tense", cli: "angry", flush: 0.8, warmth: 0.3 },
    { psy: "focus", cli: "angry", flush: 0.3, warmth: 0.4 },
    { psy: "tense", cli: "sad", flush: 0, warmth: 0.5 },
    { psy: "calm", cli: "calm", flush: 0, warmth: 1 },
  ];
  const m = moods[step];
  return (
    <div style={{ position: "relative", width: 400, height: 180, borderRadius: 22, overflow: "hidden", boxShadow: C.shadow }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: ROOM_W, height: ROOM_H, transformOrigin: "0 0", transform: "scale(0.267) translate(-450px, -120px)" }}>
        <Room psyMood={m.psy} cliMood={m.cli} psyFlush={m.flush} warmth={m.warmth}>
          {step === 0 ? <div style={{ position: "absolute", left: CLI.x - 260, top: 140, width: 320, height: 120, borderRadius: 40, backgroundColor: C.peachSoft, border: `6px solid ${C.peach}` }} /> : null}
          {step === 1 ? <div style={{ position: "absolute", left: 1140, top: 230, width: 120, height: 120, borderRadius: 120, backgroundColor: "#F4C77A" }} /> : null}
          {step === 2 ? (
            <>
              <MoodCloud x={PSY.x + 200} y={HEAD_Y - 150} r={90} color={C.teal} amp={0.06} />
              <MoodCloud x={CLI.x + 180} y={HEAD_Y - 150} r={90} color={C.lav} amp={0.06} />
            </>
          ) : null}
          {step === 3 ? <div style={{ position: "absolute", left: PSY.x + 120, top: 140, width: 360, height: 120, borderRadius: 40, backgroundColor: C.tealSoft, border: `6px solid ${C.teal}` }} /> : null}
        </Room>
      </div>
    </div>
  );
};

export const Summary: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  const thanks = cue(scene, "Дякую");
  const qAt = QUESTIONS.map((q) => cue(scene, q.w, 2));
  const keys = [aim(0, 960, 440, 1, 960, 440, 1), aim(b1, 2880, 440, 1, 960, 440, 30), aim(b2, 4800, 440, 1, 960, 440, 30), aim(thanks, 6720, 440, 1, 960, 440, 30)];
  return (
    <SceneFade duration={durationInFrames}>
      <Camera keys={keys} width={7680} height={880}>
        <Show at={0} until={b1 + 10} from="none">
        {/* 1: від «лише IQ» до ЕІ — знайомі з лекції образи замість абстрактних ліній */}
        <div style={{ position: "absolute", left: 120, top: 200, width: 820 }}>
          <BigText at={cue(scene, "виник")} size={74}>
            ЕІ — відповідь на межі суто <span style={{ color: C.tealDeep }}>когнітивного</span> погляду
          </BigText>
        </div>
        <Show at={cue(scene, "виник") + 10} from="up" style={{ position: "absolute", left: 1000, top: 130 }}>
          <MindCard look={LOOKS.mate} fill={0.85} label="лише IQ" color={C.inkSoft} />
        </Show>
        <Show at={cue(scene, "теорій")} from="scale" style={{ position: "absolute", left: 1375, top: 380 }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.inkMute }}>→</div>
        </Show>
        <Show at={cue(scene, "досліджень")} from="up" style={{ position: "absolute", left: 1460, top: 130 }}>
          <MindCard look={LOOKS.heroine} fill={0.85} label="інтелект + емоції" color={C.tealDeep} cloud />
        </Show>
        </Show>

        <Show at={0} until={b2 + 10} from="none">
        {/* 2: чотири здібності — на прикладі консультації Ірини */}
        <Show at={b1 + 14} from="up" style={{ position: "absolute", left: 1920 + 120, top: 96 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: C.inkSoft }}>Чотири здібності — як у консультації Ірини:</div>
        </Show>
        <div style={{ position: "absolute", left: 1920 + 120, top: 170, display: "flex", gap: 26 }}>
          {CASE_STEPS.map((st, i) => {
            const a = ABILITIES[i];
            return (
              <Show key={a.n} at={Math.min(cue(scene, ["сприйняття", "використання", "розуміння", "управління"][i], 1), b1 + 24 + i * 8)} from="up" style={{ width: 400 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 24px 10px 10px", borderRadius: 999, backgroundColor: a.color, color: "#FFFDF9", fontFamily: SANS, fontWeight: 800, fontSize: 40 }}>
                  <span style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: "rgba(255,253,249,0.25)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{a.n}</span>
                  {a.title}
                </div>
                <div style={{ marginTop: 14 }}>
                  <CaseThumb step={i} />
                </div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, lineHeight: 1.22, color: C.ink, marginTop: 14 }}>{st}</div>
              </Show>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 1920 + 120, top: 590 }}>
          <BigText at={cue(scene, "придушення")} size={76} serif>
            управління <span style={{ color: C.lavDeep }}>≠</span> придушення
          </BigText>
        </div>
        <Show at={cue(scene, "психолога", 1)} from="up" style={{ position: "absolute", left: 1920 + 120, top: 720 }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 48, color: C.ink }}>
            для психолога — компетентність
            <Show at={cue(scene, "здоров'я")} style={{ display: "inline" }}>
              <span style={{ color: C.tealDeep }}> і власне здоров'я</span>
            </Show>
          </div>
        </Show>
        </Show>
        <Show at={0} until={thanks + 10} from="none">
        {/* 3: запитання — по одному, крупно */}
        <div style={{ position: "absolute", left: 3840 + 120, top: 110, fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: 4, color: C.lavDeep, textTransform: "uppercase" }}>Запитання для самоперевірки</div>
        {QUESTIONS.map((q, i) => {
          const next = i < 2 ? qAt[i + 1] : thanks;
          const shrink = interpolate(frame, [next - 10, next + 20], [0, 1], { ...clamp, easing: ease });
          return (
            <Show key={q.w} at={qAt[i]} from="up" style={{ position: "absolute", left: 3840 + 120, top: 200 + i * 175, width: 1680 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 30,
                  padding: `${26 - 10 * shrink}px 36px`,
                  borderRadius: 34,
                  backgroundColor: C.surface,
                  boxShadow: C.shadow,
                  opacity: 1 - 0.35 * shrink,
                }}
              >
                <div style={{ width: 90, height: 90, flexShrink: 0, borderRadius: 90, backgroundColor: q.c, color: "#FFFDF9", fontFamily: SANS, fontWeight: 800, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 58 - 14 * shrink, lineHeight: 1.15, color: C.ink }}>{q.t}</div>
              </div>
            </Show>
          );
        })}
        <Show at={cue(scene, "Зупиніть")} from="up" style={{ position: "absolute", left: 3840 + 120, top: 740 }}>
          <Pill color={C.ink} bg={C.tealSoft} size={46}>⏸ Зупиніть відео й спробуйте відповісти</Pill>
        </Show>

        </Show>
        {/* 4: фінал */}
        <Glow x={6720} y={420} r={700} color="#FFE7C6" opacity={0.9} />
        <div style={{ position: "absolute", left: 5760, top: 260, width: 1920, textAlign: "center" }}>
          <BigText at={thanks} size={130}>
            Дякую за увагу!
          </BigText>
          <Show at={thanks + 12} style={{ marginTop: 30 }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, color: C.inkSoft }}>Лекція 1 · Теоретичні засади психології емоційного інтелекту</div>
          </Show>
        </div>
        <Link at={thanks + 18} x1={6500} y1={640} x2={6940} y2={640} bend={0} color={C.teal} width={10} />
      </Camera>
      <ChapterTag>Підсумки</ChapterTag>
    </SceneFade>
  );
};
