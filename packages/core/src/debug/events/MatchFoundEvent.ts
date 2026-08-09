import type { BaseDebugEvent } from "./BaseDebugEvent";
import type { Match } from "../../domain/match";
import type { DebugRuleMetadata } from "../models/DebugRuleMetadata";

export interface MatchFoundEvent extends BaseDebugEvent {
  readonly type: "match:found";

  readonly plugin: string;
  readonly rule: string;
  readonly ruleMetadata: DebugRuleMetadata;

  readonly match: Match;
}
