import { describe, expect, it } from "vitest";
import { createFilter } from "../createFilter";
import type { Plugin } from "../domain/plugin";
import type { Rule } from "../domain/rule";

const rule: Rule = {
  id: "content.sample",
  name: "Sample Content",
  category: "test",
  severity: "high",
  priority: 7,
  supports: () => true,
  match: () => [
    {
      word: "sample-token",
      matchedText: "sample-token",
      start: 0,
      end: 12,
    },
  ],
};

const plugin: Plugin = {
  name: "debug-metadata-plugin",
  setup(context) {
    context.addRule(rule);
  },
};

describe("Debug rule metadata", () => {
  it("preserves plugin and rule metadata on match lifecycle events", () => {
    const session = createFilter({ plugins: [plugin] }).debug("sample-token");
    const matchEvents = session
      .getEvents()
      .filter(
        (event) =>
          event.type === "match:found" ||
          event.type === "match:accepted" ||
          event.type === "match:rejected",
      );

    expect(matchEvents.length).toBeGreaterThan(0);

    for (const event of matchEvents) {
      expect(event.plugin).toBe("debug-metadata-plugin");
      expect(event.rule).toBe("Sample Content");
      expect(event.ruleMetadata).toEqual({
        id: "content.sample",
        name: "Sample Content",
        category: "test",
        severity: "high",
        priority: 7,
      });
    }
  });
});
