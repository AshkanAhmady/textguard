import type { MatchFoundEvent } from "../events";
import type { RuleFinishedEvent } from "../events";
import type { DebugReport } from "../models/DebugReport";
import type { Timeline } from "../models/Timeline";
import type { TimelinePlugin } from "../models/TimelinePlugin";
import type { TimelineRule } from "../models/TimelineRule";

export class TimelineBuilder {
  public build(report: DebugReport): Timeline {
    const pluginMap = new Map<string, TimelinePlugin>();

    for (const event of report.events) {
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

      const matches = report.events
        .filter(
          (e): e is MatchFoundEvent =>
            e.type === "match:found" &&
            e.plugin === event.plugin &&
            e.rule === event.rule,
        )
        .map((e) => e.match);

      (plugin.rules as TimelineRule[]).push({
        name: event.rule,
        matches,
      });
    }

    return {
      plugins: [...pluginMap.values()],
    };
  }
}
