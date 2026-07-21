import type { DebugSession } from "../models/DebugSession";
import type { PerformanceReport } from "../models/PerformanceReport";

interface MutablePerformanceRule {
  name: string;
  duration: number;
  matchCount: number;
}

interface MutablePerformancePlugin {
  name: string;
  duration: number;
  rules: MutablePerformanceRule[];
}

export class PerformanceBuilder {
  public build(session: DebugSession): PerformanceReport {
    const events = session.getEvents();

    const pipelineStarted = events.find((e) => e.type === "pipeline:started");

    const pipelineFinished = [...events]
      .reverse()
      .find((e) => e.type === "pipeline:finished");

    if (!pipelineStarted || !pipelineFinished) {
      return {
        totalDuration: 0,
        plugins: [],
      };
    }

    const totalDuration =
      pipelineFinished.timestamp - pipelineStarted.timestamp;

    const pluginMap = new Map<string, MutablePerformancePlugin>();

    const ruleStarts = new Map<string, number>();

    const ruleMatchCount = new Map<string, number>();

    for (const event of events) {
      switch (event.type) {
        case "rule:started": {
          const key = `${event.plugin}:${event.rule}`;

          ruleStarts.set(key, event.timestamp);

          break;
        }

        case "match:found": {
          const key = `${event.plugin}:${event.rule}`;

          ruleMatchCount.set(key, (ruleMatchCount.get(key) ?? 0) + 1);

          break;
        }

        case "rule:finished": {
          const key = `${event.plugin}:${event.rule}`;

          const startedAt = ruleStarts.get(key);

          if (startedAt === undefined) {
            break;
          }

          const duration = event.timestamp - startedAt;

          const rule: MutablePerformanceRule = {
            name: event.rule,
            duration,
            matchCount: ruleMatchCount.get(key) ?? 0,
          };

          let plugin = pluginMap.get(event.plugin);

          if (!plugin) {
            plugin = {
              name: event.plugin,
              duration: 0,
              rules: [],
            };

            pluginMap.set(event.plugin, plugin);
          }

          plugin.duration += duration;
          plugin.rules.push(rule);

          break;
        }
      }
    }

    return {
      totalDuration,
      plugins: [...pluginMap.values()].map((plugin) => ({
        name: plugin.name,
        duration: plugin.duration,
        rules: plugin.rules.map((rule) => ({
          name: rule.name,
          duration: rule.duration,
          matchCount: rule.matchCount,
        })),
      })),
    };
  }
}
