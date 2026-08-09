import type { Match } from "../../domain/match";
import type { DebugRuleMetadata } from "../../debug/models/DebugRuleMetadata";
import type { ExplainReason } from "./ExplainReason";

export interface ExplainedMatchSource {
  readonly plugin: string;
  readonly rule: DebugRuleMetadata;
}

export interface ExplainedMatch {
  readonly match: Match;
  readonly source: ExplainedMatchSource;
  readonly reason: ExplainReason;
}
