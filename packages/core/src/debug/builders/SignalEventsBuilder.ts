import type { DebugEvent } from "../events";
import type { DebugSession } from "../models/DebugSession";

export class SignalEventsBuilder {
  public build(session: DebugSession): readonly DebugEvent[] {
    const events = session.getEvents();
    const keepLifecycleIndexes = new Set<number>();
    const activePlugins = new Set<string>();
    let activeRuleStartIndex: number | undefined;
    let activeRuleHasActivity = false;

    for (const [index, event] of events.entries()) {
      if (event.type === "rule:started") {
        activeRuleStartIndex = index;
        activeRuleHasActivity = false;
        continue;
      }

      if (
        event.type === "match:found" ||
        event.type === "match:accepted" ||
        event.type === "match:rejected"
      ) {
        activeRuleHasActivity = true;
        activePlugins.add(event.plugin);
        continue;
      }

      if (event.type === "rule:finished") {
        if (activeRuleStartIndex !== undefined && activeRuleHasActivity) {
          keepLifecycleIndexes.add(activeRuleStartIndex);
          keepLifecycleIndexes.add(index);
        }
        activeRuleStartIndex = undefined;
        activeRuleHasActivity = false;
      }
    }

    return Object.freeze(
      events.filter((event, index) => {
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
            return keepLifecycleIndexes.has(index);
        }
      }),
    );
  }
}
