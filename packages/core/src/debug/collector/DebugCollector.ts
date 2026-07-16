import { DebugSession } from "../models/DebugSession";
import type { DebugEvent } from "../events";
import type { Match } from "../../domain/match";
import type { ExecutionObserver } from "../observer/ExecutionObserver";
import type { RegisteredRule } from "../../domain/registeredRule";
import type { DistributiveOmit } from "../types/DistributiveOmit";

export class DebugCollector implements ExecutionObserver {
  private readonly events: DebugEvent[] = [];
  private nextEventId = 1;

  public addEvent(event: DistributiveOmit<DebugEvent, "id" | "level">): void {
    this.events.push({
      id: this.nextEventId++,
      level: "trace",
      ...event,
    } as DebugEvent);
  }

  public build(): DebugSession {
    return new DebugSession(Object.freeze([...this.events]));
  }

  public onPipelineStarted(): void {}

  public onPipelineFinished(): void {}

  public onRuleStarted(registeredRule: RegisteredRule): void {
    this.addEvent({
      type: "rule:started",
      plugin: registeredRule.plugin,
      rule: registeredRule.rule.name,
      timestamp: Date.now(),
    });
  }

  public onRuleFinished(registeredRule: RegisteredRule): void {
    this.addEvent({
      type: "rule:finished",
      plugin: registeredRule.plugin,
      rule: registeredRule.rule.name,
      timestamp: Date.now(),
    });
  }

  public onMatchFound(registeredRule: RegisteredRule, match: Match): void {
    this.addEvent({
      type: "match:found",
      plugin: registeredRule.plugin,
      rule: registeredRule.rule.name,
      matchedText: match.matchedText,
      start: match.start,
      end: match.end,
      timestamp: Date.now(),
    });
  }
}
