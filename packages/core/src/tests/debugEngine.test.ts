import { describe, expect, it } from "vitest";
import { createFilter } from "../createFilter";
import type { Plugin, Rule } from "../types";
import { DebugSession } from "../debug/models/DebugSession";

const createTestPlugin = (...rules: Rule[]): Plugin => ({
  name: "test-plugin",
  setup(context) {
    for (const rule of rules) {
      context.addRule(rule);
    }
  },
});

describe("Debug Engine contract", () => {
  it("captures pipeline, rule, and match events in execution order", () => {
    const rule: Rule = {
      id: "contains-foo",
      name: "Contains foo",
      category: "test",
      severity: "high",
      priority: 1,
      supports: () => true,
      match: (context) => {
        const index = context.text.indexOf("foo");
        return index === -1
          ? []
          : [
              {
                word: "foo",
                matchedText: "foo",
                start: index,
                end: index + 3,
              },
            ];
      },
    };

    const session = createFilter({ plugins: [createTestPlugin(rule)] }).debug(
      "foo",
    );

    expect(session.getEvents().map((event) => event.type)).toEqual([
      "pipeline:started",
      "rule:started",
      "match:found",
      "rule:finished",
      "match:accepted",
      "pipeline:finished",
    ]);
  });

  it("preserves original input, normalized input, and final matches", () => {
    const shorterRule: Rule = {
      id: "shorter",
      name: "Shorter",
      category: "test",
      severity: "low",
      priority: 1,
      supports: () => true,
      match: () => [{ word: "ab", matchedText: "ab", start: 0, end: 1 }],
    };

    const longerRule: Rule = {
      id: "longer",
      name: "Longer",
      category: "test",
      severity: "high",
      priority: 2,
      supports: () => true,
      match: () => [{ word: "abc", matchedText: "abc", start: 0, end: 1 }],
    };

    const input = "e\u0301";
    const session = createFilter({
      plugins: [createTestPlugin(shorterRule, longerRule)],
    }).debug(input);

    expect(session.getInput()).toBe(input);
    expect(session.getNormalizedInput()).toBe("é");
    expect(session.getMatches()).toEqual([
      { word: "ab", matchedText: input, start: 0, end: input.length },
    ]);
    expect(Object.isFrozen(session.getMatches())).toBe(true);
  });

  it("records candidates and explicit accepted/rejected overlap decisions", () => {
    const shorterRule: Rule = {
      id: "shorter",
      name: "Shorter",
      category: "test",
      severity: "low",
      priority: 1,
      supports: () => true,
      match: () => [{ word: "ab", matchedText: "ab", start: 0, end: 2 }],
    };

    const longerRule: Rule = {
      id: "longer",
      name: "Longer",
      category: "test",
      severity: "high",
      priority: 2,
      supports: () => true,
      match: () => [{ word: "abc", matchedText: "abc", start: 0, end: 3 }],
    };

    const session = createFilter({
      plugins: [createTestPlugin(shorterRule, longerRule)],
    }).debug("abcdef");

    const events = session.getEvents();
    const found = events.filter((event) => event.type === "match:found");
    const rejected = events.filter((event) => event.type === "match:rejected");
    const accepted = events.filter((event) => event.type === "match:accepted");

    expect(found).toHaveLength(2);
    expect(rejected).toHaveLength(1);
    expect(accepted).toHaveLength(1);

    expect(rejected[0]).toMatchObject({
      type: "match:rejected",
      rule: "Shorter",
      match: { word: "ab", start: 0, end: 2 },
      winner: { word: "abc", start: 0, end: 3 },
    });
    expect(accepted[0]).toMatchObject({
      type: "match:accepted",
      rule: "Longer",
      match: { word: "abc", start: 0, end: 3 },
    });
  });

  it("rejects a shorter later candidate without changing the final result", () => {
    const longerRule: Rule = {
      id: "longer",
      name: "Longer",
      category: "test",
      severity: "high",
      priority: 1,
      supports: () => true,
      match: () => [{ word: "abc", matchedText: "abc", start: 0, end: 3 }],
    };

    const shorterRule: Rule = {
      id: "shorter",
      name: "Shorter",
      category: "test",
      severity: "low",
      priority: 2,
      supports: () => true,
      match: () => [{ word: "ab", matchedText: "ab", start: 0, end: 2 }],
    };

    const session = createFilter({
      plugins: [createTestPlugin(longerRule, shorterRule)],
    }).debug("abcdef");

    const rejected = session
      .getEvents()
      .filter((event) => event.type === "match:rejected");

    expect(rejected).toHaveLength(1);
    expect(rejected[0]).toMatchObject({
      type: "match:rejected",
      rule: "Shorter",
      match: { word: "ab", start: 0, end: 2 },
      winner: { word: "abc", start: 0, end: 3 },
    });
    expect(session.getMatches()).toEqual([
      { word: "abc", matchedText: "abc", start: 0, end: 3 },
    ]);
  });

  it("keeps the legacy DebugSession(events) constructor compatible", () => {
    const session = new DebugSession([
      {
        id: 1,
        type: "pipeline:started",
        level: "trace",
        timestamp: 1,
      },
      {
        id: 2,
        type: "pipeline:finished",
        level: "trace",
        timestamp: 2,
      },
    ]);

    expect(session.getInput()).toBe("");
    expect(session.getNormalizedInput()).toBe("");
    expect(session.getMatches()).toEqual([]);
    expect(session.getEvents()).toHaveLength(2);
  });

  it("derives statistics, timeline, performance, and report from one session", () => {
    const rule: Rule = {
      id: "contains-foo",
      name: "Contains foo",
      category: "test",
      severity: "high",
      priority: 1,
      supports: () => true,
      match: () => [{ word: "foo", matchedText: "foo", start: 0, end: 3 }],
    };

    const session = createFilter({ plugins: [createTestPlugin(rule)] }).debug(
      "foo",
    );

    expect(session.statistics()).toMatchObject({
      totalRulesEvaluated: 1,
      totalMatchesFound: 1,
      totalMatchesAccepted: 1,
      totalMatchesRejected: 0,
    });
    expect(session.timeline().nodes.length).toBeGreaterThan(0);
    expect(session.performance().totalTime).toBeGreaterThanOrEqual(0);
    expect(session.report()).toMatchObject({
      input: "foo",
      normalizedInput: "foo",
      matches: [{ word: "foo", matchedText: "foo", start: 0, end: 3 }],
    });
  });
});
