import type { Match } from "../domain/match";
import type { MatchContext } from "../domain/matchContext";
import type { Rule } from "../domain/rule";

export class RegexRule implements Rule {
  readonly id = "regex";
  readonly name = "Regex Rule";
  readonly category = "regex";
  readonly severity = "high" as const;

  constructor(private readonly pattern: RegExp) {}

  match(_context: MatchContext): Match[] {
    throw new Error("Not implemented");
  }
}
