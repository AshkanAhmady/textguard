import { Rule, Match, MatchContext } from "@textguard/core";
import { EMAIL_REGEX } from "../regex/emailRegex";

export class EmailRule implements Rule {
  readonly id = "email";
  readonly name = "Email Rule";

  readonly category = "email";
  readonly severity = "low";

  readonly priority = 100;

  supports(): boolean {
    return true;
  }

  match(context: MatchContext): Match[] {
    const { text } = context;

    const matches: Match[] = [];

    EMAIL_REGEX.lastIndex = 0;

    let match: RegExpExecArray | null;

    while ((match = EMAIL_REGEX.exec(text)) !== null) {
      matches.push({
        word: "email",
        matchedText: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    return matches;
  }
}
