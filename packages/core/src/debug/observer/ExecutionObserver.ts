import type { Match } from "../../domain/match";
import type { Rule } from "../../domain/rule";

export interface ExecutionObserver {
  onPipelineStarted(): void;
  onPipelineFinished(): void;
  onRuleStarted(rule: Rule): void;
  onRuleFinished(rule: Rule): void;
  onMatchFound(match: Match): void;
}
