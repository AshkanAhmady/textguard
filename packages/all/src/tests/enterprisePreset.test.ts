import { describe, expect, it } from "vitest";
import { createFilter } from "../index";
import { enterprisePreset } from "../presets";

describe("enterprisePreset", () => {
  const filter = createFilter(enterprisePreset);

  it("should detect sensitive information", () => {
    expect(filter.hasBadWord("4111111111111111")).toBe(true);
    expect(filter.hasBadWord("IR062960000000100324200001")).toBe(true);
    expect(filter.hasBadWord("hello@example.com")).toBe(true);
    expect(filter.hasBadWord("+989121234567")).toBe(true);
  });
});
