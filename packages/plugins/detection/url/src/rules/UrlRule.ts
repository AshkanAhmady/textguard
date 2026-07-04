import { Rule, Match, MatchContext } from "@textguard/core";
import { URL_REGEX } from "../regex/urlRegex";

export class UrlRule implements Rule {
  readonly id = "url";
  readonly name = "URL Rule";

  readonly category = "url";
  readonly severity = "low";

  readonly priority = 200;

  supports(_context: MatchContext): boolean {
    return true;
  }

  match(context: MatchContext): Match[] {
    const { text } = context;

    const matches: Match[] = [];

    URL_REGEX.lastIndex = 0;

    let match: RegExpExecArray | null;

    while ((match = URL_REGEX.exec(text)) !== null) {
      matches.push({
        word: "url",
        matchedText: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    return matches;
  }
}
