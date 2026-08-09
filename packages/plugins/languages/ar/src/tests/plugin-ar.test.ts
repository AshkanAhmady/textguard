import { createFilter } from "@textguard/core";
import { describe, expect, it } from "vitest";

import { arDictionary, arInsults, arPack, arProfanity } from "../index";

describe("TextGuard Arabic language baseline", () => {
  it("exports populated profanity and insult dictionaries", () => {
    expect(arProfanity.words.length).toBeGreaterThan(0);
    expect(arInsults.words.length).toBeGreaterThan(0);
    expect(arDictionary.words.length).toBe(
      arProfanity.words.length + arInsults.words.length,
    );
    expect(arPack.profanity).toBe(arProfanity);
    expect(arPack.insults).toBe(arInsults);
  });

  it("detects Arabic profanity through the public filter API", () => {
    const filter = createFilter({ dictionaries: [arDictionary] });

    expect(filter.hasBadWord("هذا كلام قحبة")).toBe(true);
    expect(filter.findBadWords("هذا كلام قحبة")).toHaveLength(1);
    expect(filter.hasBadWord("هذا كلام قحبه")).toBe(true);
  });

  it("detects Arabic insults and filters them", () => {
    const filter = createFilter({ dictionaries: [arDictionary] });
    const result = filter.filter("لا تكن غبي");

    expect(filter.hasBadWord("لا تكن غبي")).toBe(true);
    expect(result.filteredText).not.toContain("غبي");
  });

  it("handles alef variants through the core Arabic normalizer", () => {
    const filter = createFilter({ dictionaries: [arDictionary] });

    expect(filter.hasBadWord("أنت أحمق")).toBe(true);
    expect(filter.hasBadWord("أنت احمق")).toBe(true);
  });

  it("does not flag ordinary Arabic text", () => {
    const filter = createFilter({ dictionaries: [arDictionary] });

    expect(filter.hasBadWord("مرحبا بك في TextGuard")).toBe(false);
  });
});
