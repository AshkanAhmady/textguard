import { describe, expect, it } from "vitest";

import { createFilter } from "@textguard/core";
import { strictPreset } from "../presets/strict";

describe("strictPreset", () => {
  it("should register all official plugins", () => {
    const filter = createFilter(strictPreset);

    const result = filter.findBadWords("Contact me at hello@example.com");

    expect(result).toHaveLength(1);
  });
});
