import { describe, expect, it } from "vitest";

import { ArabicNormalizer } from "../normalizers/arabicNormalizer";

describe("ArabicNormalizer", () => {
  const normalizer = new ArabicNormalizer();

  it("normalizes common alef and hamza variants", () => {
    expect(normalizer.normalize("أ إ آ ؤ ئ")).toBe("ا ا ا و ی");
  });

  it("normalizes alef maqsura and taa marbuta", () => {
    expect(normalizer.normalize("فتى مدرسة")).toBe("فتی مدرسه");
  });

  it("removes common Arabic diacritics", () => {
    expect(normalizer.normalize("قَحْبَة")).toBe("قحبه");
    expect(normalizer.normalize("أَحْمَق")).toBe("احمق");
  });
});
