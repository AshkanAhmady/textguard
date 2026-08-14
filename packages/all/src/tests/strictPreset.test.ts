import { describe, expect, it } from "vitest";

import { createFilter } from "@textguard/core";
import { strictPreset } from "../presets/strict";

const emailSample = ["hello", "example.com"].join("@");
const phoneSample = ["0918", "417", "4117"].join("");

describe("strictPreset", () => {
  it("should register all official plugins", () => {
    const filter = createFilter(strictPreset);

    const result = filter.findBadWords(`Contact me at ${emailSample}`);

    expect(result).toHaveLength(1);
  });

  it.each([
    [emailSample, "email"],
    [phoneSample, "phone"],
  ] as const)(
    "attributes %s to the structured %s detector",
    (sample, expectedPlugin) => {
      const filter = createFilter(strictPreset);
      const explanation = filter.explain(sample);

      expect(explanation.matches).toHaveLength(1);
      expect(explanation.matches[0]?.source.plugin).toBe(expectedPlugin);
      expect(explanation.matches[0]?.source.rule.id).toBe(expectedPlugin);
      expect(explanation.matches[0]?.source.rule.category).toBe(expectedPlugin);
    },
  );
});
