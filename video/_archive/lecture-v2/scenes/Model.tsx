import { AbilityStairs } from "../AbilityStairs";
import { C } from "../theme";
import { beatStart, cue, type SceneData } from "../timeline";
import { Appear, Chip, Person, Phase, Quote, SceneShell } from "../ui";

const Author: React.FC<{ readonly at: number; readonly name: string; readonly color: string }> = ({ at, name, color }) => (
  <Appear at={at} from="up">
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 420 }}>
      <Person size={170} color={color} />
      <div style={{ fontWeight: 800, fontSize: 44 }}>{name}</div>
    </div>
  </Appear>
);

export const Model: React.FC<{ readonly scene: SceneData }> = ({ scene }) => {
  const b1 = beatStart(scene, 1);
  return (
    <SceneShell kicker="3 · Центральна модель" title="Модель Маєра–Саловея–Карузо">
      <Phase from={0} to={b1}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 280, display: "flex", justifyContent: "center", gap: 60 }}>
          <Author at={cue(scene, "Джона")} name="Джон Маєр" color={C.teal} />
          <Author at={cue(scene, "Пітера")} name="Пітер Саловей" color="#5E8FB0" />
          <Author at={cue(scene, "Девіда")} name="Девід Карузо" color={C.lav} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 610, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <Appear at={cue(scene, "здібностей", 0)}>
            <Chip style={{ fontSize: 42 }}>модель здібностей</Chip>
          </Appear>
          <Appear at={cue(scene, "найбільш")}>
            <Quote style={{ fontSize: 46, color: C.inkSoft, textAlign: "center", maxWidth: 1400 }}>
              одна з найбільш науково обґрунтованих — базова в академічній психології
            </Quote>
          </Appear>
        </div>
      </Phase>

      <Phase from={b1}>
        <Appear at={cue(scene, "інформацію")} style={{ position: "absolute", left: 110, top: 232 }}>
          <Chip color={C.lavDeep} bg={C.lavSoft}>
            емоції несуть інформацію
          </Chip>
        </Appear>
        <AbilityStairs
          style={{ position: "absolute", left: 160, top: 300 }}
          arrowAt={cue(scene, "від базової")}
          appear={[cue(scene, "сприйняття"), cue(scene, "використання"), cue(scene, "розуміння"), cue(scene, "управління")]}
        />
      </Phase>
    </SceneShell>
  );
};
