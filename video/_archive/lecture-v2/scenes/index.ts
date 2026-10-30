import type React from "react";
import type { SceneData } from "../timeline";
import { Approaches } from "./Approaches";
import { Case } from "./Case";
import { Emotions } from "./Emotions";
import { History } from "./History";
import { Intro } from "./Intro";
import { Iq } from "./Iq";
import { Manage } from "./Manage";
import { Model } from "./Model";
import { Msceit } from "./Msceit";
import { Perceive } from "./Perceive";
import { Psychologist } from "./Psychologist";
import { Social } from "./Social";
import { Summary } from "./Summary";
import { Task } from "./Task";
import { Understand } from "./Understand";
import { Use } from "./Use";

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
