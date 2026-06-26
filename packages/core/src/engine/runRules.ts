import type { Match } from "../domain/match";
import type { MatchContext } from "../domain/matchContext";
import type { Rule } from "../domain/rule";

export function runRules(
  rules: readonly Rule[],
  context: MatchContext,
): Match[] {
  const matches: Match[] = [];

  for (const rule of rules) {
    if (!rule.supports(context)) continue;

    matches.push(...rule.match(context));
  }

  return matches.sort((a, b) => a.start - b.start);
}
