import type { DebugEvent } from "../events";
import type { DebugSession } from "../models/DebugSession";

function ruleKey(plugin: string, rule: string): string {
  return `${plugin}\u0000${rule}`;
}

export class SignalEventsBuilder {
  public build(session: DebugSession): readonly DebugEvent[] {
    const events = session.getEvents();
    const activeRules = new Set<string>();
    const activePlugins = new Set<string>();

    for (const event of events) {
      if (
        event.type === "match:found" ||
        event.type === "match:accepted" ||
        event.type === "match:rejected"
      ) {
        activeRules.add(ruleKey(event.plugin, event.rule));
        activePlugins.add(event.plugin);
      }
    }

    return Object.freeze(
      events.filter((event) => {
        switch (event.type) {
          case "pipeline:started":
          case "pipeline:finished":
          case "match:found":
          case "match:accepted":
          case "match:rejected":
            return true;

          case "plugin:started":
          case "plugin:finished":
            return activePlugins.has(event.plugin);

          case "rule:started":
          case "rule:finished":
            return activeRules.has(ruleKey(event.plugin, event.rule));
        }
      }),
    );
  }
}
