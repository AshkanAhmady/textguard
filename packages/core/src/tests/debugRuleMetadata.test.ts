import { describe, expect, it } from "vitest";
import { createFilter } from "../createFilter";
import type { Plugin } from "../domain/plugin";
import type { Rule } from "../domain/rule";

const rule: Rule = {
  id: "pii.email",
  name: "Email",
  category: "pii",
  severity: "high",
  priority: 7,
  supports: () => true,
  match: () => [
    {
      word: "user@example.com",
      matchedText: "user@example.com",
      start: 0,
      end: 16,
    },
  ],
};

const plugin: Plugin = {
  name: "@textguard/plugin-email",
  setup(context) {
    context.addRule(rule);
  },
};

describe("Debug rule metadata", () => {
  it("preserves plugin and rule metadata on match lifecycle events", () => {
    const session = createFilter({ plugins: [plugin] }).debug("user@example.com");
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
      expect(event.plugin).toBe("@textguard/plugin-email");
      expect(event.rule).toBe("Email");
      expect(event.ruleMetadata).toEqual({
        id: "pii.email",
        name: "Email",
        category: "pii",
        severity: "high",
        priority: 7,
      });
    }
  });
});
