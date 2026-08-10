import { describe, expect, it } from "vitest";

import { createFilter } from "@textguard/core";
import { strictPreset } from "../presets/strict";

describe("strictPreset", () => {
  it("registers official structured-data plugins", () => {
    const filter = createFilter(strictPreset);

    const result = filter.findBadWords("Contact me at hello@example.com");

    expect(result).toHaveLength(1);
  });

  it("includes Arabic moderation dictionaries", () => {
    const filter = createFilter(strictPreset);

    expect(filter.hasBadWord("هذا كلام قحبة")).toBe(true);
    expect(filter.hasBadWord("هذا كلام خرا")).toBe(true);
  });
});
