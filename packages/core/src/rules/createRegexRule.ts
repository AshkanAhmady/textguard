import type { Match } from "../domain/match";
import type { MatchContext } from "../domain/matchContext";
import type { Rule } from "../domain/rule";

export interface RegexRuleOptions {
  id: string;
  name: string;
  category: string;
  severity: "low" | "medium" | "high";
  priority: number;
  regex: RegExp;
  word: string;
}

export function createRegexRule(options: RegexRuleOptions): Rule {
  return {
    id: options.id,
    name: options.name,
    category: options.category,
    severity: options.severity,
    priority: options.priority,

    supports() {
      return true;
    },

    match(context: MatchContext): Match[] {
      const matches: Match[] = [];

      const regex = new RegExp(
        options.regex.source,
        options.regex.flags.includes("g")
          ? options.regex.flags
          : options.regex.flags + "g",
      );

      let match: RegExpExecArray | null;

      while ((match = regex.exec(context.text)) !== null) {
        matches.push({
          word: options.word,
          matchedText: match[0],
          start: match.index,
          end: match.index + match[0].length,
        });
      }

      return matches;
    },
  };
}
