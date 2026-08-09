import type { Match } from "../../domain/match";
import type { BaseDebugEvent } from "./BaseDebugEvent";

export type MatchRejectionReason = "overlap";

export interface MatchRejectedEvent extends BaseDebugEvent {
  readonly type: "match:rejected";
  readonly plugin: string;
  readonly rule: string;
  readonly match: Match;
  readonly reason: MatchRejectionReason;
  readonly winner: Match;
}
