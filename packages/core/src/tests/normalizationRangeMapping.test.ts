import { describe, expect, it } from "vitest";
import { createFilter } from "../createFilter";
import type { Dictionary } from "../types";

const arabicDictionary: Dictionary = {
  name: "range-mapping-ar",
  language: "ar",
  version: "1.0.0",
  words: [
    {
      word: "قحبه",
      severity: "high",
      category: "profanity",
    },
  ],
};

function expectOriginalRange(
  input: string,
  match: { matchedText: string; start: number; end: number },
  expectedText: string,
): void {
  expect(match.matchedText).toBe(expectedText);
  expect(input.slice(match.start, match.end)).toBe(expectedText);
}

describe("normalization range mapping", () => {
  it("maps Arabic diacritic-normalized matches back to the original input", () => {
    const filter = createFilter({ dictionaries: [arabicDictionary] });
    const originalWord = "قَحَبَه";
    const input = `prefix ${originalWord} suffix`;
    const result = filter.filter(input);

    expect(result.matches).toHaveLength(1);
    expectOriginalRange(input, result.matches[0], originalWord);
    expect(result.filteredText).toBe(
      input.replace(originalWord, "*".repeat(originalWord.length)),
    );
  });

  it("maps NFC-composed matches back to decomposed source text", () => {
    const filter = createFilter({ customWords: ["évil"] });
    const originalWord = "e\u0301vil";
    const input = `prefix ${originalWord} suffix`;
    const result = filter.filter(input);

    expect(result.matches).toHaveLength(1);
    expectOriginalRange(input, result.matches[0], originalWord);
    expect(result.filteredText).toBe(
      input.replace(originalWord, "*".repeat(originalWord.length)),
    );
  });

  it.each(["\u200B", "\u2060", "\uFEFF"])(
    "removes invisible obfuscation %s while preserving original ranges",
    (invisible) => {
      const filter = createFilter({ customWords: ["asshole"] });
      const originalWord = `ass${invisible}hole`;
      const input = `prefix ${originalWord} suffix`;
      const result = filter.filter(input);

      expect(result.matches).toHaveLength(1);
      expectOriginalRange(input, result.matches[0], originalWord);
      expect(result.filteredText).toBe(
        input.replace(originalWord, "*".repeat(originalWord.length)),
      );
    },
  );

  it("folds full-width compatibility characters with NFKC and preserves ranges", () => {
    const filter = createFilter({ customWords: ["asshole"] });
    const originalWord = "ａｓｓｈｏｌｅ";
    const input = `prefix ${originalWord} suffix`;
    const result = filter.filter(input);

    expect(result.matches).toHaveLength(1);
    expectOriginalRange(input, result.matches[0], originalWord);
  });

  it("uses original ranges consistently in Debug and Explain", () => {
    const filter = createFilter({ customWords: ["évil"] });
    const originalWord = "e\u0301vil";
    const input = `prefix ${originalWord} suffix`;

    const debugSession = filter.debug(input);
    const debugMatch = debugSession.getMatches()[0];
    const acceptedEvent = debugSession
      .getEvents()
      .find((event) => event.type === "match:accepted");
    const explainedMatch = filter.explain(input).matches[0]?.match;

    expect(debugMatch).toBeDefined();
    expectOriginalRange(input, debugMatch, originalWord);

    expect(acceptedEvent?.type).toBe("match:accepted");
    if (acceptedEvent?.type === "match:accepted") {
      expectOriginalRange(input, acceptedEvent.match, originalWord);
    }

    expect(explainedMatch).toBeDefined();
    if (explainedMatch) {
      expectOriginalRange(input, explainedMatch, originalWord);
    }
  });
});
