import type { Match } from "../domain/match";
import type { Rule } from "../domain/rule";
import type { MatchContext } from "../domain/matchContext";
import type { DictionaryEntry } from "../types";

export class RegexRule implements Rule {
  readonly id = "regex";
  readonly name = "Regex Rule";

  readonly category: string;
  readonly severity: "low" | "medium" | "high";

  constructor(readonly entry: DictionaryEntry) {
    this.category = entry.category ?? "regex";
    this.severity = entry.severity;
  }

  match(_context: MatchContext): Match[] {
    throw new Error("Not implemented");
  }
}
