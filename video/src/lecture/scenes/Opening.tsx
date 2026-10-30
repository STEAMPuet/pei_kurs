import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { aim, BigText, Callout, Camera, ChapterTag, Glow, Link, LOOKS, MoodCloud, Person, Pill, Plate, SceneFade, Show, Veil } from "../kit";
import { C, SANS } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { ease } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FLOOR = 770;
const HEAD = FLOOR - 426;

// ───────────────────────── Вступ ─────────────────────────
// Профіль голови, у якому сходяться два світла — «пізнання» й «емоції».
const HeadProfile: React.FC<{ readonly x: number; readonly y: number; readonly merge: number }> = ({ x, y, merge }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const r = 70 * (1 - merge);
  const a = t * 0.6;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 600, height: 700 }}>
      <svg width={600} height={700} viewBox="0 0 600 700" style={{ overflow: "visible" }}>
        <path
          d="M 180 690 C 180 610 150 570 150 505 C 110 470 92 400 100 330 C 112 200 212 110 332 110 C 452 110 532 192 542 302 C 546 340 562 362 578 392 C 586 406 572 416 556 419 C 558 440 554 456 546 466 C 554 482 546 496 530 501 C 536 532 520 556 480 556 C 448 557 420 553 402 561 C 396 602 402 642 422 690 Z"
          fill="#FFFDF9"
          stroke={C.ink}
          strokeWidth={6}
          opacity={0.95}
        />
        <circle cx={330 + r * Math.cos(a)} cy={300 + r * 0.7 * Math.sin(a)} r={80} fill={C.teal} opacity={0.45} />
        <circle cx={330 - r * Math.cos(a)} cy={300 - r * 0.7 * Math.sin(a)} r={80} fill={C.lav} opacity={0.45} />
        <circle cx={330} cy={300} r={60 + 50 * merge} fill="#FFF3D9" opacity={0.6 * merge} />
      </svg>
    </div>
  );
};

export const Intro: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  const joinAt = cue(scene, "Він поєднує");
  const merge = interpolate(frame, [joinAt + 30, joinAt + 90], [0, 1], { ...clamp, easing: ease });
  const head = { x: 1200, y: 90 };
  const stops = [
    { at: cue(scene, "як виникло"), x: 2400, y: 640, t: "Як виникло поняття", c: C.teal },
    { at: cue(scene, "чотирьох"), x: 3050, y: 420, t: "Модель із 4 здібностей", c: C.lav },
    { at: cue(scene, "психолога", 2), x: 3700, y: 620, t: "ЕІ у роботі психолога", c: C.lavDeep },
  ];
  const keys = [
    aim(0, 1300, 440, 0.95, 960, 440, 1),
    aim(b1, 1530, 420, 1.15, 1060, 450, 60),
    aim(b2, 3050, 470, 0.85, 960, 470, 70),
  ];
  return (
    <SceneFade duration={durationInFrames}>
      <Camera keys={keys} width={4200} height={880}>
        <Glow x={1530} y={400} r={700} color="#FFE7C6" opacity={0.8} />
        <HeadProfile x={head.x} y={head.y} merge={merge} />
        {/* b1: що вміє людина з ЕІ */}
        <Show at={0} until={b2} from="none">
          <Callout at={cue(scene, "помічати")} x={head.x + 460} y={head.y + 330} tx={head.x + 690} ty={head.y + 150} color={C.tealDeep} size={50}>
            помічати
          </Callout>
          <Callout at={cue(scene, "розуміти")} x={head.x + 400} y={head.y + 260} tx={head.x + 690} ty={head.y + 300} color={C.lavDeep} size={50}>
            розуміти
          </Callout>
          <Callout at={cue(scene, "враховувати")} x={head.x + 380} y={head.y + 330} tx={head.x + 690} ty={head.y + 450} color={C.ink} size={50}>
            враховувати в діях
          </Callout>
          <Show at={joinAt} from="scale" style={{ position: "absolute", left: head.x - 560, top: head.y + 420 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", fontFamily: SANS, fontWeight: 800, fontSize: 46 }}>
              <span style={{ color: C.tealDeep }}>пізнання</span>
              <span style={{ color: C.inkMute }}>+</span>
              <span style={{ color: C.lavDeep }}>емоції</span>
            </div>
          </Show>
        </Show>
        {/* b2: маршрут лекції */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
          <path
            d="M 2050 700 C 2250 720 2300 640 2400 640 C 2600 640 2800 420 3050 420 C 3300 420 3450 620 3700 620 C 3850 620 3950 560 4100 540"
            fill="none"
            stroke={C.line}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray="3000"
            strokeDashoffset={3000 * (1 - interpolate(frame, [b2, b2 + 90], [0, 1], { ...clamp, easing: ease }))}
          />
        </svg>
        {stops.map((s, i) => (
          <Show key={i} at={s.at} from="scale" style={{ position: "absolute", left: s.x - 40, top: s.y - 40 }}>
            <div style={{ width: 80, height: 80, borderRadius: 80, backgroundColor: s.c, border: "8px solid #FFFDF9", boxShadow: C.shadow, color: "#FFFDF9", fontFamily: SANS, fontWeight: 800, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
              {i + 1}
            </div>
            <div style={{ position: "absolute", left: -160, top: i === 1 ? -110 : 100, width: 400, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.ink, lineHeight: 1.1 }}>{s.t}</div>
          </Show>
        ))}
      </Camera>
      {/* b0: назва лекції */}
      <Veil at={0} until={b1} width={55} />
      <div style={{ position: "absolute", left: 110, top: 220, width: 900 }}>
        <Show at={6} until={b1} from="left">
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: C.tealDeep, textTransform: "uppercase" }}>Лекція 1 · Психологія ЕІ</div>
        </Show>
        <BigText at={14} until={b1} size={112}>
          Теоретичні засади
        </BigText>
        <BigText at={24} until={b1} size={112} color={C.lavDeep}>
          емоційного інтелекту
        </BigText>
      </div>
      <Show at={b1} until={b2} style={{ position: "absolute", left: 90, top: 120 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 80, color: C.ink, width: 760, lineHeight: 1.1 }}>Що таке емоційний інтелект?</div>
      </Show>
      <Show at={b2 + 50} style={{ position: "absolute", left: 90, top: 110 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 72, color: C.ink }}>Маршрут лекції</div>
      </Show>
    </SceneFade>
  );
};

// ───────────────────────── Межі IQ ─────────────────────────
export const Iq: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b1 = beatStart(scene, 1);
  const fill = interpolate(frame, [cue(scene, "тести IQ"), cue(scene, "тести IQ") + 40], [0, 0.88], { ...clamp, easing: ease });
  const scenes = [
    { at: cue(scene, "професійного"), x: 2250, t: "професійний успіх?" },
    { at: cue(scene, "спілкування"), x: 2900, t: "спілкування?" },
    { at: cue(scene, "благополуччя"), x: 3800, t: "благополуччя?" },
  ];
  const keys = [
    aim(0, 900, 440, 0.95, 1000, 450, 1),
    aim(b1, 2250, 440, 1.0, 960, 450, 50),
    aim(scenes[1].at - 10, 2900, 440, 1.0, 960, 450, 45),
    aim(scenes[2].at - 10, 3800, 440, 1.0, 960, 450, 45),
  ];
  return (
    <SceneFade duration={durationInFrames}>
      <Camera keys={keys} width={4600} height={880}>
        {/* людина біля «вимірювальної шкали» IQ */}
        <Glow x={950} y={HEAD} r={260} color="#BFE3DE" opacity={fill} />
        <Person look={LOOKS.mate} x={950} y={FLOOR} mood="focus" facing="left" />
        <div style={{ position: "absolute", left: 1250, top: 130, width: 90, height: 640, borderRadius: 45, backgroundColor: C.surface, border: `6px solid ${C.ink}`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, backgroundColor: C.teal }} />
        </div>
        <div style={{ position: "absolute", left: 1380, top: 130, fontFamily: SANS, fontWeight: 800, fontSize: 150, color: C.tealDeep, opacity: fill > 0 ? 1 : 0 }}>IQ</div>
        {[
          { w: "логікою", t: "логіка", y: 270 },
          { w: "аналітичними", t: "аналіз", y: 370 },
          { w: "пам'яттю", t: "пам'ять", y: 470 },
          { w: "навчання", t: "навчання", y: 570 },
        ].map((c) => (
          <Show key={c.w} at={cue(scene, c.w)} from="left" style={{ position: "absolute", left: 360, top: c.y, translate: "0 -50%" }}>
            <Pill color={C.tealDeep} size={46}>{c.t}</Pill>
          </Show>
        ))}
        <Show at={cue(scene, "логікою")} from="none">
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
            <path d="M 650 250 Q 690 250 690 290 L 690 380 Q 690 420 720 420 Q 690 420 690 460 L 690 550 Q 690 590 650 590" fill="none" stroke={C.tealDeep} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
          </svg>
        </Show>
        <Link at={cue(scene, "логікою") + 6} x1={730} y1={420} x2={878} y2={HEAD - 4} bend={-0.15} color={C.tealDeep} width={5} />

        {/* три життєві ситуації, які високий IQ не гарантує */}
        {/* робота */}
        <div style={{ position: "absolute", left: 2130, top: FLOOR - 190, width: 420, height: 24, borderRadius: 10, backgroundColor: "#B98E6E" }} />
        <div style={{ position: "absolute", left: 2330, top: FLOOR - 260, width: 160, height: 70, borderRadius: 8, backgroundColor: "#5E6A86" }} />
        <Person look={LOOKS.mate} x={2100} y={FLOOR} mood="tense" facing="right" seated />
        {/* розмова */}
        <Person look={LOOKS.mate} x={2750} y={FLOOR} mood="sad" facing="right" />
        <Person look={LOOKS.family} x={3080} y={FLOOR} mood="neutral" facing="left" />
        <Show at={scenes[1].at + 10} from="scale" style={{ position: "absolute", left: 2820, top: 140 }}>
          <svg width={200} height={120}>
            <path d="M 20 60 L 80 60 M 120 60 L 180 60" stroke={C.inkMute} strokeWidth={8} strokeLinecap="round" />
            <path d="M 92 40 L 108 80" stroke={C.peach} strokeWidth={8} strokeLinecap="round" />
          </svg>
        </Show>
        {/* самопочуття */}
        <Person look={LOOKS.mate} x={3800} y={FLOOR} mood="sad" facing="front" />
        <Show at={scenes[2].at}>
          <MoodCloud x={3800} y={HEAD - 200} r={110} color="#9C8FB0" amp={0.12} />
        </Show>
        {scenes.map((s) => (
          <Show key={s.t} at={s.at} until={cue(scene, "Людям") + 14} from="up" style={{ position: "absolute", left: s.x - 260, top: 40, width: 520, textAlign: "center" }}>
            <Pill color={C.lavDeep} size={52}>{s.t}</Pill>
          </Show>
        ))}
      </Camera>
      <Show at={cue(scene, "Довгий")} until={b1} style={{ position: "absolute", left: 90, top: 110 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ink, width: 600, lineHeight: 1.1 }}>Що вимірював IQ</div>
      </Show>
      {/* підсумок: труднощі, які не видно в балах */}
      <Veil at={cue(scene, "Людям")} full />
      <div style={{ position: "absolute", left: 120, top: 150 }}>
        <BigText at={cue(scene, "Людям") + 6} size={80}>
          Високий IQ ≠ гарантія
        </BigText>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 22, marginTop: 50, maxWidth: 1660 }}>
          {[
            { w: "взаємодіяти", t: "взаємодія з іншими" },
            { w: "керувати", t: "керування емоціями" },
            { w: "пристосовуватися", t: "пристосування до змін" },
          ].map((x) => (
            <Show key={x.w} at={cue(scene, x.w)} from="scale">
              <Pill color="#FFFDF9" bg={C.lav} size={50}>{x.t}</Pill>
            </Show>
          ))}
        </div>
      </div>
      <ChapterTag>1 · Передумови</ChapterTag>
    </SceneFade>
  );
};

// ───────────────────────── Соціальний і множинний інтелект ─────────────────────────
export const Social: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  const two = cue(scene, "два");
  const rays = [C.peach, "#E7B76A", "#B9C27A", C.teal, "#5E8FB0", C.lav, "#B48CC0", "#C9A0A0"];
  const spread = interpolate(frame, [cue(scene, "багатовимірний") - 10, cue(scene, "багатовимірний") + 30], [0, 1], { ...clamp, easing: ease });
  const keys = [
    aim(0, 900, 440, 0.95, 1150, 450, 1),
    aim(b1, 2500, 440, 0.95, 1100, 450, 60),
    aim(b2, 4300, 440, 0.82, 960, 460, 70),
  ];
  return (
    <SceneFade duration={durationInFrames}>
      <Camera keys={keys} width={5400} height={880}>
        {/* Торндайк: розуміти людей — окремий інтелект */}
        <Person look={LOOKS.heroine} x={700} y={FLOOR} mood="smile" facing="right" />
        <Person look={LOOKS.mate} x={1150} y={FLOOR} mood="smile" facing="left" />
        <Link at={cue(scene, "розуміти людей")} x1={760} y1={HEAD - 90} x2={1090} y2={HEAD - 90} bend={-0.35} color={C.teal} width={10} dur={36} />
        <Show at={cue(scene, "соціального")} from="up" style={{ position: "absolute", left: 560, top: 60, width: 760, textAlign: "center" }}>
          <Pill color="#FFFDF9" bg={C.teal} size={54}>соціальний інтелект</Pill>
        </Show>
        <Show at={cue(scene, "знань")} until={b1} from="up" style={{ position: "absolute", left: 180, top: 560 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Pill color={C.inkSoft} size={42}>знання</Pill>
            <Show at={cue(scene, "уміння взаємодіяти", 0) + 1}>
              <Pill color={C.tealDeep} size={42}>+ уміння взаємодіяти</Pill>
            </Show>
          </div>
        </Show>

        {/* Гарднер: призма — інтелект багатовимірний */}
        <Show at={0} until={b2 + 30} from="none">
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
          <line x1={1900} y1={440} x2={2300} y2={440} stroke="#FFFDF9" strokeWidth={22} opacity={0.9} />
          <line x1={1900} y1={440} x2={2300} y2={440} stroke={C.inkMute} strokeWidth={3} />
          <polygon points="2300,250 2470,620 2130,620" fill="rgba(255,253,249,0.85)" stroke={C.ink} strokeWidth={6} transform="rotate(8 2300 440)" />
          {rays.map((c, i) => {
            const ang = (-24 + (48 * i) / (rays.length - 1)) * (Math.PI / 180);
            const len = 900 * spread;
            const key = i === 3 || i === 5;
            const dim = frame > two && !key ? 0.25 : 1;
            return <line key={i} x1={2390} y1={440} x2={2390 + len * Math.cos(ang)} y2={440 + len * Math.sin(ang)} stroke={c} strokeWidth={key && frame > two ? 18 : 12} strokeLinecap="round" opacity={0.85 * dim} />;
          })}
        </svg>
        <Show at={cue(scene, "Гарднер")} from="up" style={{ position: "absolute", left: 1850, top: 70 }}>
          <Plate at={0} title="Говард Гарднер" sub="інтелект багатовимірний" size={60} />
        </Show>
        <Show at={two} from="scale" style={{ position: "absolute", left: 2980, top: 240 }}>
          <Pill color="#FFFDF9" bg={C.teal} size={46}>між-</Pill>
        </Show>
        <Show at={two + 6} from="scale" style={{ position: "absolute", left: 2980, top: 570 }}>
          <Pill color="#FFFDF9" bg={C.lav} size={46}>внутрішньо-</Pill>
        </Show>

        </Show>

        {/* два види: дивлюся на іншого / дивлюся в себе */}
        <div style={{ position: "absolute", left: 3500, top: 60, width: 760, height: 760, borderRadius: 50, backgroundColor: C.tealSoft, opacity: 0.7 }} />
        <div style={{ position: "absolute", left: 4340, top: 60, width: 760, height: 760, borderRadius: 50, backgroundColor: C.lavSoft, opacity: 0.8 }} />
        <Person look={LOOKS.heroine} x={3720} y={FLOOR} mood="focus" facing="right" />
        <Person look={LOOKS.mate} x={4060} y={FLOOR} mood="neutral" facing="left" />
        <Link at={cue(scene, "Міжособистісний")} x1={3780} y1={HEAD - 60} x2={4000} y2={HEAD - 60} bend={-0.3} color={C.tealDeep} width={8} />
        <Person look={LOOKS.heroine} x={4580} y={FLOOR} mood="calm" facing="right" />
        {/* дзеркало: погляд усередину */}
        <Show at={cue(scene, "Внутрішньоособистісний")} from="scale" style={{ position: "absolute", left: 4780, top: 210 }}>
          <div style={{ width: 200, height: 330, borderRadius: 100, border: `10px solid ${C.lavDeep}`, background: "linear-gradient(160deg, #F6F2FB, #E3DAF1)" }} />
        </Show>
        <Show at={cue(scene, "Внутрішньоособистісний") + 10}>
          <Glow x={4580} y={FLOOR - 300} r={130} color="#FFF0D0" opacity={0.95} />
        </Show>
        <Show at={cue(scene, "Міжособистісний")} from="up" style={{ position: "absolute", left: 3540, top: 90, width: 680 }}>
          <Plate at={0} title="Міжособистісний" sub="розуміти емоції й поведінку інших" color={C.tealDeep} size={58} />
        </Show>
        <Show at={cue(scene, "Внутрішньоособистісний")} from="up" style={{ position: "absolute", left: 4380, top: 90, width: 680 }}>
          <Plate at={0} title="Внутрішньоособистісний" sub="самопізнання, саморегуляція" color={C.lavDeep} size={52} />
        </Show>
      </Camera>
      <Show at={cue(scene, "Торндайк")} until={b1} style={{ position: "absolute", left: 90, top: 110 }}>
        <Plate at={0} title="Едвард Торндайк" sub="соціальний інтелект" size={64} />
      </Show>
      <ChapterTag>1 · Передумови</ChapterTag>
    </SceneFade>
  );
};

// ───────────────────────── Переосмислення ролі емоцій ─────────────────────────
export const Emotions: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const b1 = beatStart(scene, 1);
  const b2 = beatStart(scene, 2);
  const crack = cue(scene, "Сучасні");
  const together = interpolate(frame, [crack + 30, crack + 80], [0, 1], { ...clamp, easing: ease });
  const loop = interpolate(frame, [cue(scene, "складній взаємодії"), cue(scene, "складній взаємодії") + 30], [0, 1], clamp);
  const E = { x: 760 + 180 * together, y: 440 };
  const R = { x: 1840 - 180 * together, y: 440 };
  const nodes = [
    { w: "рішень", t: "рішення", x: 1300, y: 120 },
    { w: "мотивації", t: "мотивація", x: 640, y: 150 },
    { w: "навчанні", t: "навчання", x: 1960, y: 150 },
    { w: "адаптації", t: "адаптація", x: 600, y: 740 },
    { w: "взаємодії", t: "взаємодія з людьми", x: 1990, y: 740 },
  ];
  const keys = [aim(0, 1300, 440, 0.82, 960, 450, 1), aim(b2, 4100, 440, 0.95, 960, 450, 70)];
  const roots = [
    { at: cue(scene, "уявлення про", 2), t: "здібності — ширше", x: 3500 },
    { at: cue(scene, "роль емоцій", 2), t: "емоції — переосмислено", x: 4100 },
    { at: cue(scene, "обмеженість", 2), t: "лише IQ — замало", x: 4700 },
  ];
  const grow = interpolate(frame, [roots[2].at + 20, roots[2].at + 80], [0, 1], { ...clamp, easing: ease });
  return (
    <SceneFade duration={durationInFrames}>
      <Camera keys={keys} width={5400} height={880}>
        {/* дві сфери: емоції та розум */}
        {[
          { p: E, t: "емоції", c: C.lav, s: C.lavSoft, d: C.lavDeep },
          { p: R, t: "розум", c: C.teal, s: C.tealSoft, d: C.tealDeep },
        ].map((o) => (
          <div key={o.t} style={{ position: "absolute", left: o.p.x - 220, top: o.p.y - 220, width: 440, height: 440, borderRadius: 440, backgroundColor: o.s, border: `6px solid ${o.c}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 76, color: o.d, mixBlendMode: "multiply" }}>
            {o.t}
          </div>
        ))}
        {/* стіна-«перешкода», що розсипається */}
        {Array.from({ length: 12 }, (_, i) => {
          const fall = interpolate(frame, [crack + i * 2, crack + i * 2 + 30], [0, 1], { ...clamp, easing: (t) => t * t });
          const appear = interpolate(frame, [cue(scene, "перешкодою") - 6 + i, cue(scene, "перешкодою") + i + 6], [0, 1], clamp);
          return (
            <div key={i} style={{ position: "absolute", left: 1240 + (i % 2) * 64, top: 150 + Math.floor(i / 2) * 96 + 600 * fall, width: 118, height: 86, borderRadius: 10, backgroundColor: "#D79C82", opacity: appear * (1 - fall), rotate: `${fall * (i % 2 ? 40 : -30)}deg` }} />
          );
        })}
        <Show at={cue(scene, "перешкодою")} until={crack + 10} from="up" style={{ position: "absolute", left: 1130, top: 30 }}>
          <Pill color="#B3654C" size={50}>«перешкода»</Pill>
        </Show>
        {/* мережа: емоції живлять мислення й дії */}
        {nodes.map((n) => (
          <div key={n.w}>
            <Link at={cue(scene, n.w)} x1={E.x + (225 * (n.x - E.x)) / Math.hypot(n.x - E.x, n.y - E.y)} y1={E.y + (225 * (n.y - E.y)) / Math.hypot(n.x - E.x, n.y - E.y)} x2={n.x} y2={n.y} bend={0.12} color={C.lav} width={5} />
            <Show at={cue(scene, n.w) + 8} from="scale" style={{ position: "absolute", left: n.x, top: n.y, translate: "-50% -50%" }}>
              <Pill size={48}>{n.t}</Pill>
            </Show>
          </div>
        ))}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
          <path d={`M ${E.x + 120} ${E.y - 150} C ${E.x + 300} ${E.y - 260} ${R.x - 300} ${R.y - 260} ${R.x - 120} ${R.y - 150}`} fill="none" stroke={C.ink} strokeWidth={7} strokeDasharray="900" strokeDashoffset={900 * (1 - loop)} strokeLinecap="round" />
          <path d={`M ${R.x - 120} ${R.y + 150} C ${R.x - 300} ${R.y + 260} ${E.x + 300} ${E.y + 260} ${E.x + 120} ${E.y + 150}`} fill="none" stroke={C.ink} strokeWidth={7} strokeDasharray="900" strokeDashoffset={900 * (1 - loop)} strokeLinecap="round" />
        </svg>

        {/* три зміни → паросток поняття ЕІ */}
        {roots.map((r) => (
          <div key={r.t}>
            <Link at={r.at + 10} x1={r.x} y1={760} x2={4100} y2={560} bend={0.1} color="#B79478" width={10} dur={36} />
            <Show at={r.at} from="up" style={{ position: "absolute", left: r.x - 230, top: 780, width: 460, textAlign: "center" }}>
              <Pill size={40} color={C.ink}>{r.t}</Pill>
            </Show>
          </div>
        ))}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
          <line x1={4100} y1={560} x2={4100} y2={560 - 300 * grow} stroke="#6E9F6A" strokeWidth={14} strokeLinecap="round" />
          <ellipse cx={4100 - 70 * grow} cy={420} rx={70 * grow} ry={30 * grow} fill="#8DBB84" transform="rotate(-25 4030 420)" />
          <ellipse cx={4100 + 70 * grow} cy={360} rx={70 * grow} ry={30 * grow} fill="#8DBB84" transform="rotate(25 4170 360)" />
        </svg>
        <Show at={roots[2].at + 50} from="scale" style={{ position: "absolute", left: 3700, top: 90, width: 800, textAlign: "center" }}>
          <Pill color="#FFFDF9" bg={C.tealDeep} size={60}>емоційний інтелект</Pill>
        </Show>
      </Camera>
      <Show at={0} until={b1} style={{ position: "absolute", left: 90, top: 110 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ink }}>Раніше</div>
      </Show>
      <Show at={b1} until={b2} style={{ position: "absolute", left: 90, top: 110 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ink }}>Тепер</div>
      </Show>
      <Show at={b2} style={{ position: "absolute", left: 90, top: 110 }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.ink, width: 700, lineHeight: 1.1 }}>З чого виросло поняття</div>
      </Show>
      <ChapterTag>1 · Передумови</ChapterTag>
    </SceneFade>
  );
};
