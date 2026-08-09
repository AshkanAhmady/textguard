import type { Match } from "../../domain/match";
import type { DebugRuleMetadata } from "../models/DebugRuleMetadata";
import type { BaseDebugEvent } from "./BaseDebugEvent";

export interface MatchAcceptedEvent extends BaseDebugEvent {
  readonly type: "match:accepted";
  readonly plugin: string;
  readonly rule: string;
  readonly ruleMetadata: DebugRuleMetadata;
  readonly match: Match;
}
