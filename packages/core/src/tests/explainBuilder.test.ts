import { describe, expect, it } from "vitest";
import { createFilter } from "../createFilter";
import { ExplainBuilder } from "../explain";
import type { Plugin } from "../domain/plugin";
import type { Rule } from "../domain/rule";

const rule: Rule = {
  id: "test.token",
  name: "Token Rule",
  category: "test",
  severity: "medium",
  priority: 3,
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
  name: "debug-test-plugin",
  setup(context) {
    context.addRule(rule);
  },
};

describe("ExplainBuilder", () => {
  it("projects accepted matches and rule metadata from DebugSession", () => {
    const session = createFilter({ plugins: [plugin] }).debug("sample-token");
    const result = new ExplainBuilder().build(session);

    expect(result.matched).toBe(true);
    expect(result.input).toBe("sample-token");
    expect(result.normalizedInput).toBe("sample-token");
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]).toEqual({
      match: {
        word: "sample-token",
        matchedText: "sample-token",
        start: 0,
        end: 12,
      },
      source: {
        plugin: "debug-test-plugin",
        rule: {
          id: "test.token",
          name: "Token Rule",
          category: "test",
          severity: "medium",
          priority: 3,
        },
      },
      reason: {
        code: "rule-match",
        message: 'Matched by rule "Token Rule".',
      },
    });
    expect(result.summary).toEqual({
      matched: true,
      matchCount: 1,
      plugins: ["debug-test-plugin"],
      categories: ["test"],
    });
    expect(Object.isFrozen(result.matches)).toBe(true);
  });

  it("returns an empty explanation when the session has no accepted matches", () => {
    const session = createFilter({ plugins: [plugin] }).debug("clean-text");
    const result = new ExplainBuilder().build(session);

    expect(result.matched).toBe(false);
    expect(result.matches).toEqual([]);
    expect(result.summary).toEqual({
      matched: false,
      matchCount: 0,
      plugins: [],
      categories: [],
    });
  });
});
