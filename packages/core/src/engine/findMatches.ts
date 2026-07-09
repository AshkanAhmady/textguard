import type { ExecutionObserver } from "../debug/observer/ExecutionObserver";
import type { MatchContext } from "../domain/matchContext";
import type { Rule } from "../domain/rule";
import { runRules } from "./runRules";

export function findMatches(
  rules: readonly Rule[],
  context: MatchContext,
  observer?: ExecutionObserver,
) {
  return runRules(rules, context, observer);
}
