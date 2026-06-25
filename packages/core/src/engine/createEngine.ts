import type { Match } from "../domain/match";
import type { FilterOptions, FilterResult, TextGuardInstance } from "../types";
import { buildEntries } from "./buildEntries";
import { findMatches } from "./findMatches";
import { sortEntries } from "./sortEntries";
import { createEngineState } from "./state";

export function createEngine(options: FilterOptions): TextGuardInstance {
  const state = createEngineState(options);
  const entries = sortEntries(
    buildEntries(state.dictionaries, state.customWords),
  );

  function findBadWords(text: string): Match[] {
    if (!text) return [];

    return findMatches(text, entries, state);
  }

  function hasBadWord(text: string): boolean {
    if (!text) return false;

    return findBadWords(text).length > 0;
  }

  function filter(text: string): FilterResult {
    const matches = findBadWords(text);

    if (matches.length === 0) {
      return {
        originalText: text,
        filteredText: text,
        matches: [],
      };
    }

    let filteredText = text;

    const sortedMatchesForReplacement = [...matches].sort(
      (a, b) => b.start - a.start,
    );

    for (const match of sortedMatchesForReplacement) {
      const maskString =
        state.mask.length === 1
          ? state.mask.repeat(match.matchedText.length)
          : state.mask;

      filteredText =
        filteredText.substring(0, match.start) +
        maskString +
        filteredText.substring(match.end);
    }

    return {
      originalText: text,
      filteredText,
      matches,
    };
  }

  return {
    filter,
    hasBadWord,
    findBadWords,
  };
}
