import { describe, expect, it } from "vitest";

import { createFilter } from "@textguard/core";
import { enterprisePreset, strictPreset } from "../presets";

describe("Arabic preset parity", () => {
  it("includes Arabic moderation in strictPreset", () => {
    const filter = createFilter(strictPreset);

    expect(filter.hasBadWord("هذا كلام قحبة")).toBe(true);
    expect(filter.hasBadWord("هذا كلام خرا")).toBe(true);
  });

  it("includes Arabic moderation in enterprisePreset", () => {
    const filter = createFilter(enterprisePreset);

    expect(filter.hasBadWord("هذا كلام قحبة")).toBe(true);
    expect(filter.hasBadWord("يا عرص")).toBe(true);
  });
});
