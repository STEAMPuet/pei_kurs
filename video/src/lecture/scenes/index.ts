import type React from "react";
import type { SceneData } from "../timeline";
import { Summary, Task } from "./Closing";
import { Manage, Perceive, Understand, Use } from "./Day";
import { Model, Msceit } from "./ModelScenes";
import { Emotions, Intro, Iq, Social } from "./Opening";
import { Case, Psychologist } from "./Practice";
import { Approaches, History } from "./Timeline";

// id сцени (з lecture/script.json) → візуальний компонент.
export const SCENES: Record<string, React.FC<{ readonly scene: SceneData }>> = {
  intro: Intro,
  iq: Iq,
  social: Social,
  emotions: Emotions,
  history: History,
  approaches: Approaches,
  model: Model,
  perceive: Perceive,
  use: Use,
  understand: Understand,
  manage: Manage,
  msceit: Msceit,
  psychologist: Psychologist,
  case: Case,
  task: Task,
  summary: Summary,
};
