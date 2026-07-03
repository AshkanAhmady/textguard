import type { Match } from "../domain/match";
import type { MatchContext } from "../domain/matchContext";
import type { Rule } from "../domain/rule";

export function runRules(
  rules: readonly Rule[],
  context: MatchContext,
): Match[] {
  const matches: Match[] = [];
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

  for (const rule of sortedRules) {
    if (!rule.supports(context)) continue;

    const ruleMatches = rule.match(context);

    for (const match of ruleMatches) {
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
  }

  return matches.sort((a, b) => a.start - b.start);
}
