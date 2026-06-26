import type { Match } from "../domain/match";
import { MatchContext } from "../domain/matchContext";
import { Rule } from "../domain/rule";

export function findMatches(
  rules: readonly Rule[],
  context: MatchContext,
): Match[] {
  const matches: Match[] = [];

  for (const rule of rules) {
    matches.push(...rule.match(context));
  }

  return matches.sort((a, b) => a.start - b.start);
}
