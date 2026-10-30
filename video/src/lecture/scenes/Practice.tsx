import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { aim, BigText, Bubble, Callout, Camera, ChapterTag, Glow, Link, MoodCloud, Pill, SceneFade, Show, Veil } from "../kit";
import { CHEST_Y, CLI, HEAD_Y, PSY, Room, ROOM_FLOOR, ROOM_H, ROOM_W } from "../Room";
import { ABILITIES, C, SANS } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { ease } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BOUND_X = 1200;

// Великий заголовок пункту, що змінюється від біту до біту.
const PointTitle: React.FC<{ readonly at: number; readonly until?: number; readonly n: string; readonly title: string; readonly color: string }> = ({ at, until, n, title, color }) => (
  <Show at={at} until={until} from="left" style={{ position: "absolute", left: 70, top: 110 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "14px 34px 14px 14px", borderRadius: 999, backgroundColor: "rgba(255,253,249,0.92)", boxShadow: C.shadow }}>
      <div style={{ width: 84, height: 84, borderRadius: 84, backgroundColor: color, color: "#FFFDF9", fontFamily: SANS, fontWeight: 800, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ink }}>{title}</div>
    </div>
  </Show>
);

// Кільця спокою навколо фігури (саморегуляція, видих).
const CalmRings: React.FC<{ readonly x: number; readonly y: number; readonly at: number; readonly until?: number; readonly color?: string }> = ({ x, y, at, until, color = "#9ED3CB" }) => {
  const frame = useCurrentFrame();
  if (frame < at || (until !== undefined && frame > until)) {
    return null;
  }
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      {[0, 1, 2].map((k) => {
        const t = ((frame - at + k * 32) % 96) / 96;
        return <circle key={k} cx={x} cy={y} r={120 + 190 * t} fill="none" stroke={color} strokeWidth={5} opacity={0.6 * (1 - t)} />;
      })}
    </svg>
  );
};

// ───────────────────────── ЕІ у роботі психолога ─────────────────────────
export const Psychologist: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b = [0, 1, 2, 3, 4, 5, 6].map((i) => beatStart(scene, i));
  const boundary = interpolate(frame, [cue(scene, "відокремлювати"), cue(scene, "відокремлювати") + 30], [0, 1], { ...clamp, easing: ease });
  const storm = interpolate(frame, [b[4], b[4] + 30, b[5], b[5] + 20], [0, 1, 1, 0.3], clamp);
  const drain = cue(scene, "виснаження");
  const refill = cue(scene, "саморегуляції", 5);
  const battery = interpolate(frame, [b[5], drain, drain + 30, refill, refill + 50], [0.85, 0.85, 0.22, 0.22, 0.9], clamp);
  const keys = [
    aim(0, ROOM_W / 2, 440, 0.62, 960, 440, 1),
    aim(4, ROOM_W / 2, 450, 0.8, 960, 460, 60),
    aim(b[1], 1100, 430, 0.95, 1000, 470, 50),
    aim(b[2], BOUND_X, 430, 0.95, 960, 470, 50),
    aim(b[3], CLI.x, 430, 1.15, 1120, 470, 50),
    aim(b[4], ROOM_W / 2, 450, 0.8, 900, 470, 50),
    aim(b[5], PSY.x, 430, 1.15, 860, 470, 50),
    aim(b[6], ROOM_W / 2, 450, 0.8, 960, 470, 60),
  ];
  return (
    <SceneFade duration={durationInFrames}>
      <Camera keys={keys} width={ROOM_W} height={ROOM_H}>
        <Room
          psyMood={frame > b[4] && frame < b[5] ? "focus" : "calm"}
          cliMood={frame < b[2] ? "sad" : frame < b[4] ? "neutral" : frame < b[5] ? "sad" : "neutral"}
          behind={
            <>
              <Glow x={PSY.x} y={CHEST_Y} r={330} color="#BFE3DE" opacity={0.9} />
              <Glow x={CLI.x} y={CHEST_Y} r={330 + 80 * storm} color={storm > 0.5 ? "#C9BCD9" : "#E2D8EC"} opacity={0.9} />
              {/* професійна межа між «моїм» і «клієнтовим» */}
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
                <line x1={BOUND_X} y1={ROOM_FLOOR} x2={BOUND_X} y2={ROOM_FLOOR - 620 * boundary} stroke={C.tealDeep} strokeWidth={5} strokeDasharray="16 14" opacity={0.7} />
              </svg>
            </>
          }
        >
          {/* b0: стрес і криза клієнта */}
          <Show at={cue(scene, "стрес")} until={b[3]}>
            <MoodCloud x={CLI.x + 60} y={HEAD_Y - 200} r={115 + 40 * storm} color="#9C8FB0" amp={0.14 + 0.12 * storm} label={frame > b[1] && frame < b[3] ? "клієнта" : "стрес · криза"} />
          </Show>
          {/* b1: усвідомленість — моє окремо від клієнтового */}
          <Show at={cue(scene, "власні переживання")} until={b[2]}>
            <MoodCloud x={PSY.x + 190} y={HEAD_Y - 190} r={95} color={C.teal} label="моє" amp={0.06} />
          </Show>
          <Show at={cue(scene, "відокремлювати") + 20} until={b[3]} from="scale" style={{ position: "absolute", left: BOUND_X - 70, top: 110 }}>
            <Pill color={C.tealDeep} bg={C.tealSoft}>межа</Pill>
          </Show>
          <Show at={cue(scene, "позицію")} until={b[2]} from="up" style={{ position: "absolute", left: PSY.x - 330, top: ROOM_FLOOR - 70 }}>
            <Pill color={C.tealDeep}>професійна позиція</Pill>
          </Show>
          {/* b2: емпатія — міст довіри над межею, а не замість неї */}
          <Show at={b[2]} until={b[3]} from="none">
            <Link at={cue(scene, "довірливого")} x1={PSY.x + 90} y1={CHEST_Y - 40} x2={CLI.x - 90} y2={CHEST_Y - 40} bend={-0.28} color={C.teal} width={10} dur={40} />
          </Show>
          <Show at={cue(scene, "довіри")} until={b[3]} from="scale" style={{ position: "absolute", left: BOUND_X - 230, top: CHEST_Y - 330 }}>
            <Pill color="#FFFDF9" bg={C.teal} size={46}>довіра · співпраця</Pill>
          </Show>
          {/* b3: діагностика — приховане як гіпотеза */}
          <Show at={cue(scene, "приховані")} until={b[4]}>
            <div style={{ position: "absolute", left: CLI.x - 30, top: CHEST_Y - 120, width: 300, height: 220, borderRadius: "50%", border: `5px dashed ${C.lavDeep}`, backgroundColor: "rgba(236,231,246,0.55)" }} />
          </Show>
          <Show at={0} until={b[4]} from="none">
            <Callout at={cue(scene, "приховані") + 6} x={CLI.x + 200} y={CHEST_Y - 100} tx={CLI.x + 330} ty={HEAD_Y - 150} color={C.lavDeep} size={44}>
              приховані переживання?
            </Callout>
          </Show>
          <Show at={cue(scene, "помилок")} until={b[4]} from="up" style={{ position: "absolute", left: CLI.x + 260, top: CHEST_Y + 20, width: 380 }}>
            <div style={{ padding: "16px 28px", borderRadius: 24, backgroundColor: "rgba(255,253,249,0.95)", fontFamily: SANS, fontWeight: 700, fontSize: 40, lineHeight: 1.25, color: C.inkSoft, boxShadow: C.shadow }}>
              гіпотеза для перевірки, а не вирок
            </div>
          </Show>
          {/* b4: робота з людьми в кризі */}
          <Show at={b[4]} until={b[5]}>
            <MoodCloud x={CLI.x + 40} y={HEAD_Y - 215} r={120} color="#8E80A8" amp={0.18} label="криза" labelColor="#FFFDF9" />
          </Show>
          <CalmRings x={PSY.x} y={CHEST_Y} at={cue(scene, "саморегуляція", 4)} until={b[5]} />
          <Show at={cue(scene, "саморегуляція", 4)} until={b[5]} from="up" style={{ position: "absolute", left: PSY.x - 420, top: ROOM_FLOOR - 70 }}>
            <Pill color={C.tealDeep} size={42}>саморегуляція · стійкість · витримка</Pill>
          </Show>
          {/* b5: ресурс психолога — виснаження і відновлення */}
          <Show at={b[5]} until={b[6]} style={{ position: "absolute", left: PSY.x + 170, top: HEAD_Y - 60 }}>
            <div style={{ width: 120, height: 330, borderRadius: 30, border: `8px solid ${C.ink}`, position: "relative", backgroundColor: C.surface }}>
              <div style={{ position: "absolute", left: 50, top: -26, width: 36, height: 18, borderRadius: 6, backgroundColor: C.ink }} />
              <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: `${battery * 290}px`, borderRadius: 18, backgroundColor: battery < 0.4 ? C.peach : C.teal }} />
            </div>
          </Show>
          <Show at={0} until={b[6]} from="none">
            <Callout at={cue(scene, "ресурсів")} x={PSY.x + 230} y={HEAD_Y - 60} tx={PSY.x + 430} ty={HEAD_Y - 150} color={C.tealDeep} size={40}>
              ресурси
            </Callout>
          </Show>
          <Show at={drain + 6} until={refill} from="scale" style={{ position: "absolute", left: PSY.x - 560, top: HEAD_Y + 40 }}>
            <Pill color="#C46F52" size={40}>ознаки виснаження</Pill>
          </Show>
          <Show at={refill + 10} until={b[6]} from="scale" style={{ position: "absolute", left: PSY.x - 560, top: HEAD_Y + 40 }}>
            <Pill color={C.tealDeep} size={40}>відновлення</Pill>
          </Show>
        </Room>
      </Camera>

      {/* заголовки пунктів */}
      <Show at={cue(scene, "методів")} until={b[1]} style={{ position: "absolute", left: 70, top: 110 }}>
        <div style={{ padding: "18px 36px", borderRadius: 30, backgroundColor: "rgba(255,253,249,0.92)", boxShadow: C.shadow, fontFamily: SANS, fontWeight: 800, fontSize: 64 }}>
          методи <span style={{ color: C.inkMute }}>+</span> <span style={{ color: C.tealDeep }}>ЕІ фахівця</span>
        </div>
      </Show>
      <PointTitle at={b[1]} until={b[2]} n="1" title="Усвідомленість" color={C.teal} />
      <PointTitle at={b[2]} until={b[3]} n="2" title="Емпатія й альянс" color="#5E8FB0" />
      <PointTitle at={b[3]} until={b[4]} n="3" title="Психодіагностика" color={C.lav} />
      <PointTitle at={b[4]} until={b[5]} n="4" title="Робота з людьми в кризі" color={C.lavDeep} />
      <PointTitle at={b[5]} until={b[6]} n="5" title="Профілактика вигорання" color={C.tealDeep} />
      {/* із ким працює психолог у кризі — окрема панель праворуч, поза персонажами */}
      <Show at={cue(scene, "військовослужбовцями") - 4} until={b[5]} from="right" style={{ position: "absolute", left: 1390, top: 300, width: 470 }}>
        <div style={{ boxSizing: "border-box", padding: "26px 30px", borderRadius: 30, backgroundColor: "rgba(255,253,249,0.95)", boxShadow: C.shadow, fontFamily: SANS }}>
          <div style={{ fontWeight: 700, fontSize: 30, color: C.inkSoft, marginBottom: 14 }}>З ким працює психолог:</div>
          {[
            { w: "військовослужбовцями", t: "військовослужбовці" },
            { w: "ветеранами", t: "ветерани" },
            { w: "переміщеними", t: "внутрішньо переміщені особи" },
            { w: "втрату", t: "люди після втрати чи травми" },
          ].map((x) => (
            <Show key={x.w} at={cue(scene, x.w)} from="left">
              <div style={{ display: "flex", gap: 14, alignItems: "baseline", fontWeight: 800, fontSize: 34, lineHeight: 1.2, color: C.lavDeep, marginTop: 10 }}>
                <span style={{ width: 14, height: 14, flexShrink: 0, borderRadius: 14, backgroundColor: C.lav, translate: "0 -4px" }} />
                {x.t}
              </div>
            </Show>
          ))}
        </div>
      </Show>

      {/* висновок розділу */}
      <Veil at={b[6]} full />
      <div style={{ position: "absolute", left: 120, right: 120, top: 150 }}>
        <BigText at={b[6] + 6} size={86}>
          ЕІ — <span style={{ color: C.tealDeep }}>інтегральна</span> професійно важлива якість психолога
        </BigText>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 50 }}>
          {[
            { w: "консультативної", t: "консультативна", c: C.teal },
            { w: "психодіагностичної", t: "психодіагностична", c: "#5E8FB0" },
            { w: "психокорекційної", t: "психокорекційна", c: C.lav },
            { w: "психотерапевтичної", t: "психотерапевтична", c: C.lavDeep },
          ].map((x) => (
            <Show key={x.w} at={cue(scene, x.w)} from="scale">
              <Pill color="#FFFDF9" bg={x.c} size={50}>{x.t}</Pill>
            </Show>
          ))}
        </div>
        <Show at={cue(scene, "діяльності", 6)} style={{ marginTop: 34 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, color: C.inkSoft }}>діяльність</div>
        </Show>
      </div>
      <ChapterTag>4 · ЕІ у роботі психолога</ChapterTag>
    </SceneFade>
  );
};

// ───────────────────────── Розбір ситуації (Ірина) ─────────────────────────
// Банер етапу: яка з чотирьох здібностей зараз працює і що саме робить Ірина.
const StepBanner: React.FC<{ readonly i: 0 | 1 | 2 | 3; readonly at: number; readonly until?: number; readonly caption: string }> = ({ i, at, until, caption }) => {
  const a = ABILITIES[i];
  return (
    <Show at={at} until={until} from="left" style={{ position: "absolute", left: 70, top: 104 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 32px 14px 14px", borderRadius: 44, backgroundColor: "rgba(255,253,249,0.95)", boxShadow: C.shadow }}>
        <div style={{ width: 76, height: 76, flexShrink: 0, borderRadius: 76, backgroundColor: a.color, color: "#FFFDF9", fontFamily: SANS, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{a.n}</div>
        <div style={{ fontFamily: SANS }}>
          <div style={{ fontWeight: 800, fontSize: 48, lineHeight: 1.05, color: C.ink }}>{a.title}</div>
          <div style={{ fontWeight: 700, fontSize: 30, lineHeight: 1.2, color: C.inkSoft, marginTop: 4 }}>{caption}</div>
        </div>
        {/* прогрес: які кроки вже пройдено */}
        <div style={{ display: "flex", gap: 8, marginLeft: 10 }}>
          {ABILITIES.map((b, k) => (
            <div key={b.n} style={{ width: 16, height: 16, borderRadius: 16, backgroundColor: k <= i ? b.color : C.line }} />
          ))}
        </div>
      </div>
    </Show>
  );
};

export const Case: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b = [0, 1, 2, 3, 4].map((i) => beatStart(scene, i));
  const outburst = cue(scene, "Ви мене");
  const exhale = cue(scene, "видих");
  const reply = cue(scene, "Схоже");
  const done = cue(scene, "Емоцію");
  const calm = interpolate(frame, [exhale, exhale + 60, cue(scene, "русло"), cue(scene, "русло") + 30], [0, 0.5, 0.5, 1], clamp);
  const tension = frame > outburst ? 1 - calm : 0;
  // Спокійні ракурси за змістом: реакція клієнта → помічене → пояснення → пауза → відповідь.
  const keys = [
    aim(0, ROOM_W / 2, 450, 0.7, 960, 460, 1),
    aim(4, ROOM_W / 2, 450, 0.82, 960, 470, 60),
    aim(outburst - 12, CLI.x, HEAD_Y + 80, 1.25, 1000, 520, 40), // реакція клієнта
    aim(b[1], PSY.x, HEAD_Y + 80, 1.25, 1150, 520, 45), // що Ірина помічає в собі
    aim(cue(scene, "підвищений") - 8, CLI.x, HEAD_Y + 80, 1.25, 820, 520, 45), // що помічає в клієнті
    aim(b[2], BOUND_X, 430, 0.95, 960, 480, 50), // напруга як сигнал про контакт
    aim(b[3], PSY.x, HEAD_Y + 40, 1.1, 1150, 500, 45), // власна реакція
    aim(cue(scene, "Гнів") - 8, CLI.x, HEAD_Y + 40, 1.1, 800, 500, 45), // можливий стан клієнта
    aim(cue(scene, "виправдовуватися") - 8, BOUND_X, 430, 0.85, 960, 480, 45), // прогноз для обох
    aim(b[4], PSY.x, CHEST_Y, 1.15, 1150, 520, 45), // пауза психолога
    aim(reply - 6, BOUND_X, 430, 0.9, 960, 480, 45), // обрана відповідь
    aim(done, ROOM_W / 2, 450, 0.82, 960, 470, 60),
  ];
  return (
    <SceneFade duration={durationInFrames}>
      <Camera keys={keys} width={ROOM_W} height={ROOM_H}>
        <Room
          psyMood={frame > exhale ? "calm" : frame > outburst ? "tense" : "neutral"}
          cliMood={frame > cue(scene, "русло") ? "calm" : frame > outburst ? "angry" : "neutral"}
          cliSpeaking={frame > outburst && frame < outburst + 50}
          psySpeaking={frame > reply && frame < reply + 140}
          psyFlush={frame > cue(scene, "жар") && frame < exhale ? 0.8 : 0}
          warmth={0.3 + 0.7 * calm}
          behind={
            <>
              <Glow x={CLI.x} y={CHEST_Y} r={320} color={tension > 0.5 ? "#F0C4B0" : "#E2D8EC"} opacity={0.9} />
              <Glow x={PSY.x} y={CHEST_Y} r={300} color="#BFE3DE" opacity={0.8} />
            </>
          }
        >
          {/* реакція клієнта */}
          <Show at={0} until={b[1]} from="none">
            <Bubble at={outburst} x={CLI.x - 160} y={70} tail="right" bg={C.peachSoft} color="#8F4E39" size={56} wiggle>
              «Ви мене взагалі не слухаєте!»
            </Bubble>
          </Show>
          {/* 1 · сприйняття: сигнали в себе (ліворуч від Ірини) й у клієнта (праворуч від нього) */}
          <Show at={0} until={b[2]} from="none">
            <Callout at={cue(scene, "жар")} x={PSY.x - 62} y={HEAD_Y + 12} tx={PSY.x - 400} ty={HEAD_Y - 50} color={C.tealDeep}>
              жар в обличчі
            </Callout>
            <Callout at={cue(scene, "виправдатися")} x={PSY.x - 60} y={HEAD_Y + 110} tx={PSY.x - 420} ty={HEAD_Y + 60} color={C.tealDeep}>
              хочеться виправдатися
            </Callout>
            <Callout at={cue(scene, "підвищений")} x={CLI.x + 60} y={HEAD_Y + 24} tx={CLI.x + 400} ty={HEAD_Y + 20} color="#B3654C">
              підвищений голос
            </Callout>
            <Callout at={cue(scene, "стиснуті")} x={CLI.x + 80} y={ROOM_FLOOR - 187} tx={CLI.x + 400} ty={ROOM_FLOOR - 230} color="#B3654C">
              стиснуті руки
            </Callout>
          </Show>
          {/* 2 · використання: напруга як сигнал про контакт */}
          <Show at={cue(scene, "сигнал")} until={b[3]} from="scale" style={{ position: "absolute", left: BOUND_X - 60, top: CHEST_Y - 260 }}>
            <div style={{ width: 120, height: 120, borderRadius: 120, backgroundColor: "#F4C77A", boxShadow: "0 0 40px #F4C77A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 70, color: "#8A5A16" }}>!</div>
          </Show>
          <Show at={cue(scene, "важливе")} until={b[3]} from="up" style={{ position: "absolute", left: BOUND_X - 300, top: ROOM_FLOOR - 30 }}>
            <Pill color="#8A5A16" bg="#FBEBCB" size={44}>у контакті — щось важливе</Pill>
          </Show>
          <Show at={b[2]} until={b[3]} from="none">
            <Link at={cue(scene, "зосередити")} x1={PSY.x + 80} y1={HEAD_Y} x2={CLI.x - 80} y2={HEAD_Y} bend={-0.1} color={C.teal} width={8} dashed />
          </Show>
          {/* 3 · розуміння: власна тривога, можливий стан клієнта, прогноз */}
          <Show at={cue(scene, "тривога")} until={cue(scene, "Гнів") - 6}>
            <MoodCloud x={PSY.x + 260} y={HEAD_Y - 200} r={150} color={C.teal} amp={0.1} label="страх здатися некомпетентною" labelSize={36} />
          </Show>
          <Show at={cue(scene, "виправдовуватися") - 4} until={b[4]}>
            <MoodCloud x={PSY.x + 260} y={HEAD_Y - 200} r={150} color={C.teal} amp={0.1} label="страх здатися некомпетентною" labelSize={36} />
          </Show>
          <Show at={cue(scene, "непочутим")} until={b[4]}>
            <MoodCloud x={CLI.x + 230} y={HEAD_Y - 170} r={140} color={C.lav} amp={0.1} label="почувається непочутим?" labelSize={36} />
          </Show>
          <Show at={cue(scene, "виправдовуватися")} until={b[4]} from="up" style={{ position: "absolute", left: BOUND_X - 330, top: ROOM_FLOOR - 30 }}>
            <Pill color={C.inkSoft} size={42} outline>виправдання → більше напруги</Pill>
          </Show>
          {/* 4 · управління: видих і пауза, потім спокійна відповідь */}
          <CalmRings x={PSY.x} y={CHEST_Y} at={exhale} until={reply} />
          <Bubble at={reply} x={PSY.x + 120} y={40} tail="left" bg={C.tealSoft} color={C.tealDeep} size={44} maxWidth={700}>
            «Схоже, вам дуже важливо, щоб вас почули. Розкажіть, що я пропустила»
          </Bubble>
        </Room>
      </Camera>
      <StepBanner i={0} at={b[1]} until={b[2]} caption="помічає сигнали в собі й у клієнті" />
      <StepBanner i={1} at={b[2]} until={b[3]} caption="напруга — сигнал, куди дивитися" />
      <StepBanner i={2} at={b[3]} until={b[4]} caption="шукає можливі причини" />
      <StepBanner i={3} at={b[4]} until={done} caption="пауза — і обрана відповідь" />
      <Show at={exhale} until={reply} from="left" style={{ position: "absolute", left: 110, top: 600 }}>
        <Pill color={C.tealDeep} bg="#E3F2EF" size={44}>пауза · повільний видих</Pill>
      </Show>
      <Show at={done} style={{ position: "absolute", left: 0, right: 0, top: 770, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "16px 36px", borderRadius: 30, backgroundColor: "rgba(255,253,249,0.95)", boxShadow: C.shadow, fontFamily: SANS, fontWeight: 800, fontSize: 58 }}>
          не придушила — <span style={{ color: C.tealDeep }}>врахувала</span>
        </div>
      </Show>
      <ChapterTag>5 · Практика</ChapterTag>
    </SceneFade>
  );
};
