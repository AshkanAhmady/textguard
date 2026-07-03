import { Rule, Match, MatchContext } from "@textguard/core";

export class EmailRule implements Rule {
  readonly id = "email";
  readonly name = "Email Rule";

  readonly category = "email";
  readonly severity = "low";

  readonly priority = 100;

  supports(_context: MatchContext): boolean {
    return true;
  }

  match(_context: MatchContext): Match[] {
    throw new Error("Not implemented");
  }
}
