import type { DictionaryEntry } from "../types";
import type { Match } from "../domain/match";
import type { Rule } from "../domain/rule";
import { MatchContext } from "../domain/matchContext";

export class DictionaryRule implements Rule {
  readonly id = "dictionary";
  readonly name = "Dictionary Rule";

  readonly category: string;
  readonly severity: "low" | "medium" | "high";

  constructor(readonly entry: DictionaryEntry) {
    this.category = entry.category ?? "dictionary";
    this.severity = entry.severity;
  }

  match(_context: MatchContext): Match[] {
    throw new Error("Not implemented");
  }
}
