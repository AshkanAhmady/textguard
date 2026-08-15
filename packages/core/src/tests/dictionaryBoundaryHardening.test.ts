import { describe, expect, it } from "vitest";

import { createFilter } from "../createFilter";

describe("dictionary boundary hardening", () => {
  it.each([
    "Scunthorpe is a town in England",
    "The class assignment is ready",
  ])("does not match profanity substrings inside benign words: %s", (input) => {
    const filter = createFilter({ customWords: ["cunt", "ass"] });

    expect(filter.hasBadWord(input)).toBe(false);
  });

  it.each([
    "fuck",
    "f.u.c.k",
    "f u c k",
    "f-u-c-k",
    "f_u_c_k",
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
  ])("does not cross an outer word continuation boundary: %s", (input) => {
    const filter = createFilter({ customWords: ["fuck"] });

    expect(filter.hasBadWord(input)).toBe(false);
  });

  it("treats punctuation around a standalone match as a boundary", () => {
    const filter = createFilter({ customWords: ["fuck"] });

    expect(filter.hasBadWord("(fuck)!")) .toBe(true);
  });
});
