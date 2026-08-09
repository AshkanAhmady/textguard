import { PerformanceBuilder } from "../builders";
import type { DebugEvent } from "../events";
import type { Match } from "../../domain/match";
import type { DebugStatistics } from "./DebugStatistics";
import type { PerformanceReport } from "./PerformanceReport";
import { TimelineBuilder } from "../builders/TimelineBuilder";
import { DebugReportBuilder } from "../builders/DebugReportBuilder";

import type { Timeline } from "./Timeline";
import type { DebugReport } from "./DebugReport";

export interface DebugSessionData {
  readonly input: string;
  readonly normalizedInput: string;
  readonly matches: readonly Match[];
  readonly events: readonly DebugEvent[];
}

export class DebugSession {
  private readonly input: string;
  private readonly normalizedInput: string;
  private readonly matches: readonly Match[];
  private readonly events: readonly DebugEvent[];

  public constructor(events: readonly DebugEvent[]);
  public constructor(data: DebugSessionData);
  public constructor(dataOrEvents: DebugSessionData | readonly DebugEvent[]) {
    if (Array.isArray(dataOrEvents)) {
      this.input = "";
      this.normalizedInput = "";
      this.matches = Object.freeze([]);
      this.events = dataOrEvents;
      return;
    }

    const data = dataOrEvents as DebugSessionData;
    this.input = data.input;
    this.normalizedInput = data.normalizedInput;
    this.matches = Object.freeze([...data.matches]);
    this.events = data.events;
  }

  public getInput(): string {
    return this.input;
  }

  public getNormalizedInput(): string {
    return this.normalizedInput;
  }

  public getMatches(): readonly Match[] {
    return this.matches;
  }

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
