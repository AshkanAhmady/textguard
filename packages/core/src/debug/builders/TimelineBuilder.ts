import type { MatchFoundEvent } from "../events";
import type { DebugSession } from "../models/DebugSession";
import type { Timeline } from "../models/Timeline";
import type { TimelineRule } from "../models/TimelineRule";

interface MutableTimelinePlugin {
  name: string;
  rules: TimelineRule[];
}

export class TimelineBuilder {
  public build(session: DebugSession): Timeline {
    const events = session.getEvents();

    const pluginMap = new Map<string, MutableTimelinePlugin>();

    for (const event of events) {
      if (event.type !== "rule:finished") {
        continue;
      }

      let plugin = pluginMap.get(event.plugin);

      if (!plugin) {
        plugin = {
          name: event.plugin,
          rules: [],
        };

        pluginMap.set(event.plugin, plugin);
      }

      const matches = events
        .filter(
          (e): e is MatchFoundEvent =>
            e.type === "match:found" &&
            e.plugin === event.plugin &&
            e.rule === event.rule,
        )
        .map((e) => e.match);

      plugin.rules.push({
        name: event.rule,
        matches,
      });
    }

    return {
      plugins: [...pluginMap.values()],
    };
  }
}
