import { describe, expect, it } from "vitest";

import { createFilter } from "../createFilter";

describe("dictionary boundary hardening", () => {
  it.each([
    "Scunthorpe is a town in England",
    "The class assignment is ready",
  ])("does not match Latin profanity substrings inside benign words: %s", (input) => {
    const filter = createFilter({ customWords: ["cunt", "ass"] });

    expect(filter.hasBadWord(input)).toBe(false);
  });

  it.each([
    "fuck",
    "f.u.c.k",
    "f u c k",
    "f-u-c-k",
    "f_u_c_k",
    "f-u=c--k",
    "f\u200cu\u200cc\u200ck",
    "f\u200du\u200dc\u200dk",
    "fuuuck",
  ])("still detects deliberate internal obfuscation: %s", (input) => {
    const filter = createFilter({ customWords: ["fuck"] });

    expect(filter.hasBadWord(input)).toBe(true);
  });

  it.each([
    "prefixfuck",
    "fucksuffix",
    "prefix\u200cfuck",
    "fuck\u200csuffix",
    "prefix\u200dfuck",
    "fuck\u200dsuffix",
  ])("does not cross a Latin outer word continuation boundary: %s", (input) => {
    const filter = createFilter({ customWords: ["fuck"] });

    expect(filter.hasBadWord(input)).toBe(false);
  });

  it("treats punctuation around a standalone Latin match as a boundary", () => {
    const filter = createFilter({ customWords: ["fuck"] });

    expect(filter.hasBadWord("(fuck)!")).toBe(true);
  });

  it("preserves existing Persian derivational matching until morphology is explicit", () => {
    const filter = createFilter({ customWords: ["احمق"] });

    expect(filter.hasBadWord("این یک متن احمقانه است")).toBe(true);
  });

  it.each([
    ["fuck", "This sentence keeps fuck detectable inside ordinary context."],
    ["کیر", "این یک جمله آزمایشی است که کلمه کیر را در میانه متن دارد."],
    ["دیوث", "در این جمله آزمایشی واژه دیوث بین کلمات عادی قرار گرفته است."],
  ] as const)("keeps %s detectable inside sentence context", (word, input) => {
    const filter = createFilter({ customWords: [word] });
    const matches = filter.filter(input).matches;

    expect(matches.some((match) => match.matchedText === word)).toBe(true);
  });

  it("does not synthesize a short Persian profanity across a long separator run", () => {
    const filter = createFilter({ customWords: ["کس"] });

    expect(filter.hasBadWord("ک @|--++ س")).toBe(false);
  });

  it("keeps several Persian matches independently visible inside one sentence", () => {
    const filter = createFilter({ customWords: ["کیر", "دیوث", "احمق"] });
    const input = "این متن آزمایشی چند واژه کیر و دیوث و احمق را میان کلمات معمولی قرار می‌دهد.";
    const matchedText = filter.filter(input).matches.map((match) => match.matchedText);

    expect(matchedText).toEqual(expect.arrayContaining(["کیر", "دیوث", "احمق"]));
  });
});
