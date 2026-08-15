import type { DictionaryEntry } from "../types";
import type { Match } from "../domain/match";
import { MatchContext } from "../domain/matchContext";
import { Rule } from "../domain/rule";
import { isOverlapped, isWhitelisted } from "../engine/helpers";
import { buildWordRegex } from "../engine/buildWordRegex";

const lexicalChar = /[\p{L}\p{N}\p{M}]/u;
const tokenContinuation = /[\p{L}\p{N}\p{M}\u200c\u200d]/u;
const whitespace = /\s/u;

function firstLexicalCharacter(word: string): string | undefined {
  return Array.from(word).find((char) => lexicalChar.test(char));
}

function canPossiblyMatch(
  word: string,
  text: string,
  leetspeakMapping: Record<string, string[]>,
  faLookalikesMapping: Record<string, string>,
): boolean {
  const first = firstLexicalCharacter(word);
  if (!first) return true;

  const lowerFirst = first.toLowerCase();
  const lowerText = text.toLowerCase();

  if (lowerText.includes(lowerFirst)) {
    return true;
  }

  const lookalike = faLookalikesMapping[lowerFirst];
  if (lookalike && new RegExp(lookalike, "iu").test(text)) {
    return true;
  }

  const leetspeakAlternatives = leetspeakMapping[lowerFirst] ?? [];
  return leetspeakAlternatives.some((alternative) =>
    lowerText.includes(alternative.toLowerCase()),
  );
}

function crossesTokenBoundaryThroughWhitespace(
  word: string,
  matchedText: string,
  text: string,
  start: number,
  end: number,
): boolean {
  if (whitespace.test(word) || !whitespace.test(matchedText)) {
    return false;
  }

  const before = start > 0 ? text[start - 1] : undefined;
  const after = end < text.length ? text[end] : undefined;

  return Boolean(
    (before && tokenContinuation.test(before)) ||
      (after && tokenContinuation.test(after)),
  );
}

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

    if (
      !canPossiblyMatch(
        this.entry.word,
        text,
        state.leetspeakMapping,
        state.faLookalikesMapping,
      )
    ) {
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

      if (
        crossesTokenBoundaryThroughWhitespace(
          this.entry.word,
          matchedText,
          text,
          start,
          end,
        )
      ) {
        continue;
      }

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
