import type { DictionaryEntry } from "../types";
import type { Match } from "../domain/match";
import { MatchContext } from "../domain/matchContext";
import { Rule } from "../domain/rule";
import { isOverlapped, isWhitelisted } from "../engine/helpers";
import { buildWordRegex } from "../engine/buildWordRegex";

export class DictionaryRule implements Rule {
  readonly id = "dictionary";
  readonly name = "Dictionary Rule";
  readonly priority = 100;
  readonly category: string;
  readonly severity: "low" | "medium" | "high";
  supports(): boolean {
    return true;
  }

  constructor(readonly entry: DictionaryEntry) {
    this.category = entry.category ?? "dictionary";
    this.severity = entry.severity;
  }

  match(context: MatchContext): Match[] {
    const { text, state } = context;
    const matches: Match[] = [];

    if (this.entry.word instanceof RegExp) {
      const flags = this.entry.word.flags.includes("g")
        ? this.entry.word.flags
        : this.entry.word.flags + "g";

      const regex = new RegExp(this.entry.word.source, flags);

      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        const matchedText = match[0];
        if (!matchedText) break;

        const start = match.index;
        const end = start + matchedText.length;

        if (isWhitelisted(state.whitelist, matchedText, text, start, end)) {
          continue;
        }

        if (!isOverlapped(matches, start, end)) {
          matches.push({
            word: this.entry.word.source,
            matchedText,
            start,
            end,
          });
        }
      }

      return matches;
    }

    const regex = buildWordRegex(this.entry.word, {
      leetspeakMapping: state.leetspeakMapping,
      faLookalikesMapping: state.faLookalikesMapping,
    });

    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const matchedText = match[0];
      const start = match.index;
      const end = start + matchedText.length;

      if (isWhitelisted(state.whitelist, matchedText, text, start, end)) {
        continue;
      }

      if (!isOverlapped(matches, start, end)) {
        matches.push({
          word: this.entry.word,
          matchedText,
          start,
          end,
        });
      }
    }

    return matches;
  }
}
