import type { ExecutionObserver } from "../debug/observer/ExecutionObserver";
import type { Match } from "../domain/match";
import type { MatchContext } from "../domain/matchContext";
import type { RegisteredRule } from "../domain/registeredRule";

interface ResolvedMatch {
  readonly match: Match;
  readonly registeredRule: RegisteredRule;
}

function compareTieBreakers(
  current: ResolvedMatch,
  existing: ResolvedMatch,
): number {
  const priorityDifference =
    current.registeredRule.rule.priority - existing.registeredRule.rule.priority;

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  const pluginDifference = current.registeredRule.plugin.localeCompare(
    existing.registeredRule.plugin,
  );

  if (pluginDifference !== 0) {
    return pluginDifference;
  }

  const ruleIdDifference = current.registeredRule.rule.id.localeCompare(
    existing.registeredRule.rule.id,
  );

  if (ruleIdDifference !== 0) {
    return ruleIdDifference;
  }

  return current.registeredRule.rule.name.localeCompare(
    existing.registeredRule.rule.name,
  );
}

export function runRules(
  rules: readonly RegisteredRule[],
  context: MatchContext,
  observer?: ExecutionObserver,
  projectMatch: (match: Match) => Match = (match) => match,
): Match[] {
  const matches: ResolvedMatch[] = [];
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
      observer?.onMatchFound(registeredRule, projectMatch(match));

      const overlappedIndex = matches.findIndex(
        (existing) =>
          match.start < existing.match.end && match.end > existing.match.start,
      );

      if (overlappedIndex === -1) {
        matches.push({ match, registeredRule });
        continue;
      }

      const existing = matches[overlappedIndex];

      const existingLength = existing.match.end - existing.match.start;
      const currentLength = match.end - match.start;
      const currentResolved = { match, registeredRule };

      const currentWins =
        currentLength > existingLength ||
        (currentLength === existingLength &&
          compareTieBreakers(currentResolved, existing) < 0);

      if (currentWins) {
        observer?.onMatchRejected?.(
          existing.registeredRule,
          projectMatch(existing.match),
          projectMatch(match),
        );
        matches[overlappedIndex] = currentResolved;
      } else {
        observer?.onMatchRejected?.(
          registeredRule,
          projectMatch(match),
          projectMatch(existing.match),
        );
      }
    }

    observer?.onRuleFinished(registeredRule);
  }

  const resolvedMatches = matches.sort((a, b) => a.match.start - b.match.start);
  const projectedMatches = resolvedMatches.map((resolved) => ({
    registeredRule: resolved.registeredRule,
    match: projectMatch(resolved.match),
  }));

  for (const resolved of projectedMatches) {
    observer?.onMatchAccepted?.(resolved.registeredRule, resolved.match);
  }

  return projectedMatches.map((resolved) => resolved.match);
}
