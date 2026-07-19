import type { BaseDebugEvent } from "./BaseDebugEvent";
import type { Match } from "../../domain/match";

export interface MatchFoundEvent extends BaseDebugEvent {
  readonly type: "match:found";

  readonly plugin: string;
  readonly rule: string;

  readonly match: Match;
}
