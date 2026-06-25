import type { Match } from "../domain/match";
import type { Rule } from "../domain/rule";

export class DictionaryRule implements Rule {
  readonly id = "dictionary";
  readonly name = "Dictionary Rule";
  readonly category = "dictionary";
  readonly severity = "high" as const;

  match(_text: string): Match[] {
    throw new Error("Not implemented");
  }
}
