import { describe, expect, it } from "vitest";
import { createFilter } from "../createFilter";
import type { Plugin } from "../domain/plugin";
import type { Rule } from "../domain/rule";

function createPlugin(name: string, rule: Rule): Plugin {
  return {
    name,
    setup(context) {
      context.addRule(rule);
    },
  };
}

function createTieRule(id: string, word: string): Rule {
  return {
    id,
    name: id,
    category: "test",
    severity: "low",
    priority: 1,
    supports: () => true,
    match: () => [{ word, matchedText: "abc", start: 0, end: 3 }],
  };
}

describe("overlap ranking determinism", () => {
  it("returns the same winner when equal-priority equal-length rules are registered in reverse order", () => {
    const alpha = createPlugin("alpha-plugin", createTieRule("alpha-rule", "alpha"));
    const beta = createPlugin("beta-plugin", createTieRule("beta-rule", "beta"));

    const alphaFirst = createFilter({ plugins: [alpha, beta] }).findBadWords("abc");
    const betaFirst = createFilter({ plugins: [beta, alpha] }).findBadWords("abc");

    expect(alphaFirst).toEqual([
      { word: "alpha", matchedText: "abc", start: 0, end: 3 },
    ]);
    expect(betaFirst).toEqual(alphaFirst);
  });

  it("preserves lower numeric rule priority as the winner for equal-length overlaps", () => {
    const preferredRule = createTieRule("preferred-rule", "preferred");
    const fallbackRule = {
      ...createTieRule("fallback-rule", "fallback"),
      priority: 2,
    };

    const result = createFilter({
      plugins: [
        createPlugin("z-plugin", fallbackRule),
        createPlugin("a-plugin", preferredRule),
      ],
    }).findBadWords("abc");

    expect(result).toEqual([
      { word: "preferred", matchedText: "abc", start: 0, end: 3 },
    ]);
  });
});
