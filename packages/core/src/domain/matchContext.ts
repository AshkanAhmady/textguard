import type { EngineState } from "../engine/state";

export interface MatchContext {
  readonly text: string;
  readonly state: EngineState;
}
