import { PerformanceBuilder } from "../builders";
import type { DebugEvent } from "../events";
import type { DebugStatistics } from "./DebugStatistics";
import type { PerformanceReport } from "./PerformanceReport";
import { TimelineBuilder } from "../builders/TimelineBuilder";
import { DebugReportBuilder } from "../builders/DebugReportBuilder";

import type { Timeline } from "./Timeline";
import type { DebugReport } from "./DebugReport";

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

  public performance(): PerformanceReport {
    return new PerformanceBuilder().build(this);
  }

  public timeline(): Timeline {
    return new TimelineBuilder().build(this);
  }

  public report(): DebugReport {
    return new DebugReportBuilder().build(this);
  }
}
