import { describe, expect, it } from "vitest";
import { createFilter } from "../createFilter";
import type { Plugin } from "../domain/plugin";
import type { Rule } from "../domain/rule";

const rule: Rule = {
  id: "test.public-explain",
  name: "Public Explain Rule",
  category: "test",
  severity: "medium",
  priority: 1,
  supports: () => true,
  match: (context) =>
    context.text.includes("sample-token")
      ? [
          {
            word: "sample-token",
            matchedText: "sample-token",
            start: 0,
            end: 12,
          },
        ]
      : [],
};

const plugin: Plugin = {
  name: "public-explain-plugin",
  setup(context) {
    context.addRule(rule);
  },
};

describe("filter.explain", () => {
  it("returns the same structured explanation as the debug projection", () => {
    const filter = createFilter({ plugins: [plugin] });

    const result = filter.explain("sample-token");

    expect(result.matched).toBe(true);
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]?.source.plugin).toBe("public-explain-plugin");
    expect(result.matches[0]?.source.rule.id).toBe("test.public-explain");
    expect(result.summary.matchCount).toBe(1);
  });

  it("returns an empty explanation for clean text", () => {
    const filter = createFilter({ plugins: [plugin] });

    expect(filter.explain("clean-text")).toMatchObject({
      matched: false,
      matches: [],
      summary: {
        matched: false,
        matchCount: 0,
      },
    });
  });
});
