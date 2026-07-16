import type { Match } from "../../domain/match";
import type { RegisteredRule } from "../../domain/registeredRule";

export interface ExecutionObserver {
  onPipelineStarted(): void;
  onPipelineFinished(): void;
  onRuleStarted(rule: RegisteredRule): void;
  onRuleFinished(rule: RegisteredRule): void;
  onMatchFound(match: Match): void;
}
