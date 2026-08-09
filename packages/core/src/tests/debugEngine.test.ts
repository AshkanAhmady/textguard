import { describe, expect, it } from "vitest";
import { createFilter } from "../createFilter";
import { DebugSession } from "../debug";
import type { Plugin } from "../domain/plugin";
import type { Rule } from "../domain/rule";

function createTestPlugin(...rules: Rule[]): Plugin {
  return {
    name: "debug-test-plugin",
    setup(context) {
      for (const rule of rules) {
        context.addRule(rule);
      }
    },
  };
}

describe("Debug Engine contract", () => {
  it("captures pipeline, rule, and match events in execution order", () => {
    const rule: Rule = {
      id: "debug-test-rule",
      name: "Debug Test Rule",
      category: "test",
      severity: "low",
      priority: 1,
      supports: () => true,
      match: () => [{ word: "bad", matchedText: "bad", start: 0, end: 3 }],
    };

    const filter = createFilter({ plugins: [createTestPlugin(rule)] });
    const session = filter.debug("bad");
    const events = session.getEvents();

    expect(events[0]?.type).toBe("pipeline:started");
    expect(events.at(-1)?.type).toBe("pipeline:finished");
    expect(events.some((event) => event.type === "rule:started")).toBe(true);
    expect(events.some((event) => event.type === "rule:finished")).toBe(true);
    expect(events.some((event) => event.type === "match:found")).toBe(true);

    const eventTypes = events.map((event) => event.type);
    expect(eventTypes.indexOf("rule:started")).toBeLessThan(
      eventTypes.indexOf("match:found"),
    );
    expect(eventTypes.indexOf("match:found")).toBeLessThan(
      eventTypes.indexOf("rule:finished"),
    );
  });

  it("preserves original input, normalized input, and final matches", () => {
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

    const input = "e\u0301";
    const session = createFilter({
      plugins: [createTestPlugin(shorterRule, longerRule)],
    }).debug(input);

    expect(session.getInput()).toBe(input);
    expect(session.getNormalizedInput()).toBe("é");
    expect(session.getMatches()).toEqual([
      { word: "abc", matchedText: "abc", start: 0, end: 3 },
    ]);
    expect(Object.isFrozen(session.getMatches())).toBe(true);
  });

  it("records candidate matches even when overlap resolution removes one", () => {
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

    const filter = createFilter({
      plugins: [createTestPlugin(shorterRule, longerRule)],
    });

    const finalMatches = filter.findBadWords("abc");
    const session = filter.debug("abc");
    const debugMatches = session
      .getEvents()
      .filter((event) => event.type === "match:found")
      .map((event) => event.match);

    expect(finalMatches).toEqual([
      { word: "abc", matchedText: "abc", start: 0, end: 3 },
    ]);
    expect(session.getMatches()).toEqual(finalMatches);
    expect(debugMatches).toEqual([
      { word: "ab", matchedText: "ab", start: 0, end: 2 },
      { word: "abc", matchedText: "abc", start: 0, end: 3 },
    ]);
  });

  it("keeps the legacy DebugSession(events) constructor compatible", () => {
    const session = new DebugSession([]);

    expect(session.getInput()).toBe("");
    expect(session.getNormalizedInput()).toBe("");
    expect(session.getMatches()).toEqual([]);
    expect(session.getEvents()).toEqual([]);
  });

  it("derives statistics, timeline, performance, and report from one session", () => {
    const rule: Rule = {
      id: "report-rule",
      name: "Report Rule",
      category: "test",
      severity: "medium",
      priority: 1,
      supports: () => true,
      match: () => [{ word: "x", matchedText: "x", start: 0, end: 1 }],
    };

    const session = createFilter({
      plugins: [createTestPlugin(rule)],
    }).debug("x");

    expect(session.statistics().matchEvents).toBe(1);
    expect(session.timeline().plugins).toHaveLength(1);
    expect(session.performance().plugins).toHaveLength(1);
    expect(session.report().events).toEqual(session.getEvents());
  });
});
