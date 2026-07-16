import type { ExecutionObserver } from "../debug/observer/ExecutionObserver";
import type { Match } from "../domain/match";
import type { MatchContext } from "../domain/matchContext";
import type { RegisteredRule } from "../domain/registeredRule";

export function runRules(
  rules: readonly RegisteredRule[],
  context: MatchContext,
  observer?: ExecutionObserver,
): Match[] {
  const matches: Match[] = [];
  const sortedRules = [...rules].sort(
    (a, b) => a.rule.priority - b.rule.priority,
  );

  for (const registeredRule of sortedRules) {
    const { rule } = registeredRule;

    observer?.onRuleStarted(registeredRule);

    if (!rule.supports(context)) {
      observer?.onRuleFinished(registeredRule);
      continue;
    }

    const ruleMatches = rule.match(context);

    for (const match of ruleMatches) {
      observer?.onMatchFound(registeredRule, match);

      const overlappedIndex = matches.findIndex(
        (existing) => match.start < existing.end && match.end > existing.start,
      );

      if (overlappedIndex === -1) {
        matches.push(match);
        continue;
      }

      const existing = matches[overlappedIndex];

      const existingLength = existing.end - existing.start;
      const currentLength = match.end - match.start;

      if (currentLength > existingLength) {
        matches[overlappedIndex] = match;
      }
    }

    observer?.onRuleFinished(registeredRule);
  }

  return matches.sort((a, b) => a.start - b.start);
}
