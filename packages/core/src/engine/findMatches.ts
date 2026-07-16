import type { ExecutionObserver } from "../debug/observer/ExecutionObserver";
import type { MatchContext } from "../domain/matchContext";
import type { RegisteredRule } from "../domain/registeredRule";
import { runRules } from "./runRules";

export function findMatches(
  rules: readonly RegisteredRule[],
  context: MatchContext,
  observer?: ExecutionObserver,
) {
  return runRules(rules, context, observer);
}
