import { createFilter, Dictionary } from "@textguard/core";
import { describe, it, expect } from "vitest";
import { enProfanity } from "../profanity";
import { enInsults } from "../insults";
import { enLeetspeakMapping } from "../leetspeak";
import { enDictionary, enPatterns } from "../index";

describe("TextGuard Engine - English & Leetspeak Detection", () => {
  const filterEngine = createFilter({
    dictionaries: [enProfanity, enInsults],
    leetspeakMapping: enLeetspeakMapping,
  });

  it("باید کلمات لیت‌اسپیک ترکیبی و عددی/نمادی را با دقت بالا دیتکت و سانسور کند", () => {
    const res1 = filterEngine.filter("Don't be a b1tch");

    expect(filterEngine.hasBadWord("b1tch")).toBe(true);
    expect(filterEngine.hasBadWord("fμ¢k")).toBe(true);
    expect(filterEngine.hasBadWord("5tup1d")).toBe(true);

    expect(res1.filteredText).toContain("*****");
  });

  it("detects the canonical English profanity entry and its leetspeak form", () => {
    expect(filterEngine.hasBadWord("shit")).toBe(true);
    expect(filterEngine.hasBadWord("sh1t")).toBe(true);
  });

  it("keeps profanity visible inside ordinary sentence context", () => {
    const matches = filterEngine.findBadWords(
      "This sentence contains fuck and asshole among otherwise ordinary words.",
    );
    const matchedText = matches.map((match) => match.matchedText);

    expect(matchedText).toEqual(expect.arrayContaining(["fuck", "asshole"]));
  });

  it("keeps English structured patterns as explicit RegExp entries", () => {
    expect(enPatterns.words.every((entry) => entry.word instanceof RegExp)).toBe(true);
  });

  it("does not synthesize broad matches from pattern source text in clean English", () => {
    const guard = createFilter({
      dictionaries: [enDictionary],
      leetspeakMapping: enLeetspeakMapping,
    });
    const matches = guard.findBadWords(
      "You are very kind because you seem nice and this ordinary sentence has no profanity.",
    );

    expect(matches).toHaveLength(0);
  });

  it("should ignore overlapped matches", () => {
    const dictionary: Dictionary = {
      name: "test",
      language: "fa",
      version: "1.0.0",
      words: [
        {
          word: "احمق",
          severity: "high",
        },
        {
          word: "احمقانه",
          severity: "high",
        },
      ],
    };

    const guard = createFilter({
      dictionaries: [dictionary],
    });

    const matches = guard.findBadWords("این رفتار احمقانه است");

    expect(matches).toHaveLength(1);
    expect(matches[0].matchedText).toBe("احمقانه");
  });
});
