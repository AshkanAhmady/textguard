import { DebugSession } from "../models/DebugSession";
import type { DebugEvent } from "../events";
import type { Rule } from "../../domain/rule";
import type { Match } from "../../domain/match";
import type { ExecutionObserver } from "../observer/ExecutionObserver";

export class DebugCollector implements ExecutionObserver {
  private readonly events: DebugEvent[] = [];

  public addEvent(event: DebugEvent): void {
    this.events.push(event);
  }

  public build(): DebugSession {
    return new DebugSession(Object.freeze([...this.events]));
  }

  public onPipelineStarted(): void {}

  public onPipelineFinished(): void {}

  public onRuleStarted(rule: Rule): void {
    this.addEvent({
      type: "rule:started",
      rule: rule.constructor.name,
      plugin: "unknown",
      timestamp: Date.now(),
    });
  }

  public onRuleFinished(rule: Rule): void {
    this.addEvent({
      type: "rule:finished",
      rule: rule.constructor.name,
      plugin: "unknown",
      timestamp: Date.now(),
    });
  }

  public onMatchFound(match: Match): void {}
}
