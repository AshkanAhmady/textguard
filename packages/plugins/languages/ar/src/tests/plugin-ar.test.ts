import { createFilter } from "@textguard/core";
import { describe, expect, it } from "vitest";

import { arDictionary, arInsults, arPack, arProfanity } from "../index";

describe("TextGuard Arabic language coverage", () => {
  it("exports populated profanity and insult dictionaries", () => {
    expect(arProfanity.words.length).toBeGreaterThanOrEqual(15);
    expect(arInsults.words.length).toBeGreaterThanOrEqual(10);
    expect(arDictionary.words.length).toBe(
      arProfanity.words.length + arInsults.words.length,
    );
    expect(arPack.profanity).toBe(arProfanity);
    expect(arPack.insults).toBe(arInsults);
  });

  it("detects Arabic profanity through the public filter API", () => {
    const filter = createFilter({ dictionaries: [arDictionary] });

    expect(filter.hasBadWord("هذا كلام قحبة")).toBe(true);
    expect(filter.hasBadWord("هذا كلام قَحْبَة")).toBe(true);
    expect(filter.hasBadWord("هذا كلام قحبه")).toBe(true);
    expect(filter.hasBadWord("يا ابن الكلب")).toBe(true);
  });

  it("detects high-confidence dialect profanity variants", () => {
    const filter = createFilter({ dictionaries: [arDictionary] });

    expect(filter.hasBadWord("كلام طيز")).toBe(true);
    expect(filter.hasBadWord("كلام زبي")).toBe(true);
    expect(filter.hasBadWord("هذا خرا")).toBe(true);
    expect(filter.hasBadWord("يا عرص")).toBe(true);
  });

  it("detects expanded Arabic insults", () => {
    const filter = createFilter({ dictionaries: [arDictionary] });

    expect(filter.hasBadWord("لا تكن غبي")).toBe(true);
    expect(filter.hasBadWord("هذا شخص حقير")).toBe(true);
    expect(filter.hasBadWord("هذا تصرف وضيع")).toBe(true);
    expect(filter.hasBadWord("قليل الأدب")).toBe(true);
  });

  it("handles shared Arabic/Persian canonical letter variants", () => {
    const filter = createFilter({ dictionaries: [arDictionary] });

    expect(filter.hasBadWord("أنت أحمق")).toBe(true);
    expect(filter.hasBadWord("أنت احمق")).toBe(true);
    expect(filter.hasBadWord("أنت كلب")).toBe(true);
    expect(filter.hasBadWord("أنت کلب")).toBe(true);
  });

  it("does not flag ordinary Arabic text", () => {
    const filter = createFilter({ dictionaries: [arDictionary] });

    expect(filter.hasBadWord("مرحبا بك في TextGuard")).toBe(false);
    expect(filter.hasBadWord("هذه مدرسة جميلة في المدينة")).toBe(false);
    expect(filter.hasBadWord("اللغة العربية لغة جميلة")).toBe(false);
  });
});
