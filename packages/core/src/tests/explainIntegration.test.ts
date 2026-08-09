import { describe, expect, it } from "vitest";
import { createFilter } from "../createFilter";
import type { Plugin } from "../domain/plugin";
import type { Rule } from "../domain/rule";

function plugin(name: string, ...rules: Rule[]): Plugin {
  return {
    name,
    setup(context) {
      for (const rule of rules) context.addRule(rule);
    },
  };
}

describe("Explain integration", () => {
  it("returns an empty explanation for empty and clean input", () => {
    const filter = createFilter();

    expect(filter.explain("")).toMatchObject({ matched: false, matches: [] });
    expect(filter.explain("clean-text")).toMatchObject({
      matched: false,
      matches: [],
    });
  });

  it("reports normalized input from the same execution snapshot", () => {
    const composed = "é";
    const decomposed = "e\u0301";
    const rule: Rule = {
      id: "unicode.nfc",
      name: "Unicode NFC",
      category: "test",
      severity: "low",
      priority: 1,
      supports: () => true,
      match: (context) =>
        context.text === composed
          ? [{ word: composed, matchedText: composed, start: 0, end: 1 }]
          : [],
    };

    const result = createFilter({ plugins: [plugin("unicode-test", rule)] }).explain(
      decomposed,
    );

    expect(result.input).toBe(decomposed);
    expect(result.normalizedInput).toBe(composed);
    expect(result.matched).toBe(true);
  });

  it("explains only the final accepted match after overlap resolution", () => {
    const shortRule: Rule = {
      id: "overlap.short",
      name: "Short Match",
      category: "test",
      severity: "low",
      priority: 1,
      supports: () => true,
      match: () => [{ word: "ab", matchedText: "ab", start: 0, end: 2 }],
    };
    const longRule: Rule = {
      id: "overlap.long",
      name: "Long Match",
      category: "test",
      severity: "high",
      priority: 2,
      supports: () => true,
      match: () => [{ word: "abc", matchedText: "abc", start: 0, end: 3 }],
    };

    const result = createFilter({
      plugins: [plugin("overlap-test", shortRule, longRule)],
    }).explain("abc");

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]?.match.matchedText).toBe("abc");
    expect(result.matches[0]?.source.rule.id).toBe("overlap.long");
  });

  it("preserves source metadata across multiple plugins", () => {
    const firstRule: Rule = {
      id: "first.rule",
      name: "First Rule",
      category: "first",
      severity: "low",
      priority: 1,
      supports: () => true,
      match: () => [{ word: "a", matchedText: "a", start: 0, end: 1 }],
    };
    const secondRule: Rule = {
      id: "second.rule",
      name: "Second Rule",
      category: "second",
      severity: "medium",
      priority: 1,
      supports: () => true,
      match: () => [{ word: "b", matchedText: "b", start: 2, end: 3 }],
    };

    const result = createFilter({
      plugins: [plugin("first-plugin", firstRule), plugin("second-plugin", secondRule)],
    }).explain("a b");

    expect(result.matches.map((item) => item.source.plugin)).toEqual([
      "first-plugin",
      "second-plugin",
    ]);
    expect(result.summary.plugins).toEqual(["first-plugin", "second-plugin"]);
    expect(result.summary.categories).toEqual(["first", "second"]);
  });
});
