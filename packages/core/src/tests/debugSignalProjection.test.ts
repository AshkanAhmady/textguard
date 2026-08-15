import { describe, expect, it } from "vitest";

import { createFilter } from "../createFilter";

describe("debug signal projection", () => {
  it("keeps the raw trace unchanged while reducing clean executions to pipeline signal", () => {
    const filter = createFilter({ customWords: ["blocked", "forbidden"] });
    const session = filter.debug("clean text");

    const rawEvents = session.getEvents();
    const signalEvents = session.getSignalEvents();

    expect(rawEvents.length).toBeGreaterThan(signalEvents.length);
    expect(signalEvents.map((event) => event.type)).toEqual([
      "pipeline:started",
      "pipeline:finished",
    ]);
    expect(session.getEvents()).toBe(rawEvents);
  });

  it("keeps rule lifecycle context for executions that produced match activity", () => {
    const filter = createFilter({ customWords: ["blocked", "forbidden"] });
    const session = filter.debug("blocked");
    const signalTypes = session.getSignalEvents().map((event) => event.type);

    expect(signalTypes).toContain("rule:started");
    expect(signalTypes).toContain("match:found");
    expect(signalTypes).toContain("match:accepted");
    expect(signalTypes).toContain("rule:finished");
  });

  it("associates duplicate-name dictionary rules with their own execution segment", () => {
    const filter = createFilter({ customWords: ["blocked", "forbidden"] });
    const session = filter.debug("blocked");

    const fullTimeline = session.timeline();
    const signalTimeline = session.timeline({ includeEmptyRules: false });
    const fullRules = fullTimeline.plugins.flatMap((plugin) => plugin.rules);
    const signalRules = signalTimeline.plugins.flatMap((plugin) => plugin.rules);

    expect(fullRules).toHaveLength(2);
    expect(fullRules.reduce((count, rule) => count + rule.matches.length, 0)).toBe(1);
    expect(signalRules).toHaveLength(1);
    expect(signalRules[0]?.matches).toHaveLength(1);
    expect(signalRules[0]?.matches[0]?.matchedText).toBe("blocked");
  });

  it("can omit empty rules from the timeline without changing the default timeline shape", () => {
    const filter = createFilter({ customWords: ["blocked", "forbidden"] });
    const session = filter.debug("blocked");

    const fullTimeline = session.timeline();
    const signalTimeline = session.timeline({ includeEmptyRules: false });
    const fullRuleCount = fullTimeline.plugins.reduce(
      (count, plugin) => count + plugin.rules.length,
      0,
    );
    const signalRuleCount = signalTimeline.plugins.reduce(
      (count, plugin) => count + plugin.rules.length,
      0,
    );

    expect(fullRuleCount).toBeGreaterThan(signalRuleCount);
    expect(signalRuleCount).toBeGreaterThan(0);
    expect(
      signalTimeline.plugins.every((plugin) =>
        plugin.rules.every((rule) => rule.matches.length > 0),
      ),
    ).toBe(true);
  });
});
