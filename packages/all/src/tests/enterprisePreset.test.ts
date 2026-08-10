import { describe, expect, it } from "vitest";
import { createFilter } from "../index";
import { enterprisePreset } from "../presets";

describe("enterprisePreset", () => {
  const filter = createFilter(enterprisePreset);

  it("detects sensitive information", () => {
    expect(filter.hasBadWord("4111111111111111")).toBe(true);
    expect(filter.hasBadWord("IR062960000000100324200001")).toBe(true);
    expect(filter.hasBadWord("hello@example.com")).toBe(true);
    expect(filter.hasBadWord("+989121234567")).toBe(true);
  });

  it("includes Arabic moderation dictionaries", () => {
    expect(filter.hasBadWord("هذا كلام قحبة")).toBe(true);
    expect(filter.hasBadWord("يا عرص")).toBe(true);
  });
});
