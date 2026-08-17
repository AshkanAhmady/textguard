import { describe, expect, it } from "vitest";

import { createFilter } from "@textguard/core";
import { defaultPreset } from "../presets/default";
import { strictPreset } from "../presets/strict";

const emailSample = ["hello", "example.com"].join("@");
const phoneSample = ["0918", "417", "4117"].join("");

describe("defaultPreset", () => {
  it("keeps strictPreset as the same backward-compatible preset", () => {
    expect(strictPreset).toBe(defaultPreset);
  });

  it("should register all official plugins", () => {
    const filter = createFilter(defaultPreset);
    const result = filter.findBadWords(`Contact me at ${emailSample}`);
    expect(result).toHaveLength(1);
  });

  it.each([[emailSample, "email"], [phoneSample, "phone"]] as const)(
    "attributes %s to the structured %s detector",
    (sample, expectedPlugin) => {
      const filter = createFilter(defaultPreset);
      const explanation = filter.explain(sample);
      expect(explanation.matches).toHaveLength(1);
      expect(explanation.matches[0]?.source.plugin).toBe(expectedPlugin);
      expect(explanation.matches[0]?.source.rule.id).toBe(expectedPlugin);
      expect(explanation.matches[0]?.source.rule.category).toBe(expectedPlugin);
    },
  );

  it.each([["a$$h0le", "asshole"], ["sh1t", "shit"], ["b1tch", "bitch"]] as const)(
    "detects English leetspeak profanity %s",
    (sample, word) => {
      const filter = createFilter(defaultPreset);
      const matches = filter.findBadWords(sample);
      expect(matches.some((match) => match.word === word)).toBe(true);
      expect(matches.some((match) => match.matchedText === sample)).toBe(true);
    },
  );

  it("keeps a known Persian profanity visible inside realistic sentence context", () => {
    const filter = createFilter(defaultPreset);
    const input = "این یک جمله آزمایشی است که کلمه کیر را در میانه متن دارد.";
    expect(filter.findBadWords(input).map((match) => match.matchedText)).toEqual(expect.arrayContaining(["کیر"]));
  });

  it("keeps multiple known Persian matches independently visible in one sentence", () => {
    const filter = createFilter(defaultPreset);
    const input = "این متن آزمایشی چند واژه کیر و دیوث و احمق را میان کلمات معمولی قرار می‌دهد.";
    expect(filter.findBadWords(input).map((match) => match.matchedText)).toEqual(expect.arrayContaining(["کیر", "دیوث", "احمق"]));
  });

  it("covers the English Playground sentence end to end through defaultPreset", () => {
    const filter = createFilter(defaultPreset);
    const input = "son of the betch mother fucker i want to put my deck to your ass and pussy asshole";
    const matchedText = filter.findBadWords(input).map((match) => match.matchedText.toLowerCase());
    expect(matchedText).toEqual(expect.arrayContaining(["betch", "mother fucker", "deck", "ass", "pussy", "asshole"]));
  });

  it("covers common Persian Playground variants through defaultPreset", () => {
    const filter = createFilter(defaultPreset);
    const input = "خارمادرتو گاییم کسکش خارکسده کیرم تو ناموست";
    const matchedText = filter.findBadWords(input).map((match) => match.matchedText);
    expect(matchedText).toEqual(expect.arrayContaining(["خارمادر", "گاییم", "کسکش", "خارکسده", "کیر"]));
  });
});
