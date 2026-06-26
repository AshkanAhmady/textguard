import type { Match } from "../domain/match";
import type { MatchContext } from "../domain/matchContext";
import type { Rule } from "../domain/rule";

export class UrlRule implements Rule {
  readonly id = "url";
  readonly name = "URL Rule";
  readonly category = "url";
  readonly severity = "medium" as const;
  readonly priority = 200;
  supports(): boolean {
    return true;
  }

  match(_context: MatchContext): Match[] {
    return [];
  }
}
