import type { DebugEvent } from "../events";
import type { DebugStatistics } from "./DebugStatistics";

export class DebugSession {
  public constructor(private readonly events: readonly DebugEvent[]) {}

  public getEvents(): readonly DebugEvent[] {
    return this.events;
  }

  public statistics(): DebugStatistics {
    const plugins = new Set<string>();
    const rules = new Set<string>();

    let pipelineEvents = 0;
    let ruleStartedEvents = 0;
    let ruleFinishedEvents = 0;
    let matchEvents = 0;

    for (const event of this.events) {
      switch (event.type) {
        case "pipeline:started":
        case "pipeline:finished":
          pipelineEvents++;
          break;

        case "rule:started":
          ruleStartedEvents++;
          plugins.add(event.plugin);
          rules.add(event.rule);
          break;

        case "rule:finished":
          ruleFinishedEvents++;
          plugins.add(event.plugin);
          rules.add(event.rule);
          break;

        case "match:found":
          matchEvents++;
          plugins.add(event.plugin);
          rules.add(event.rule);
          break;
      }
    }

    return {
      totalEvents: this.events.length,
      pipelineEvents,
      ruleStartedEvents,
      ruleFinishedEvents,
      matchEvents,
      plugins: [...plugins],
      rules: [...rules],
    };
  }
}
