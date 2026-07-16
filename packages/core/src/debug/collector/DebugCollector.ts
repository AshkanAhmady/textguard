import { DebugSession } from "../models/DebugSession";
import type { DebugEvent } from "../events";
import type { Match } from "../../domain/match";
import type { ExecutionObserver } from "../observer/ExecutionObserver";
import type { RegisteredRule } from "../../domain/registeredRule";

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

  public onRuleStarted(registeredRule: RegisteredRule): void {
    this.addEvent({
      type: "rule:started",
      rule: registeredRule.rule.name,
      plugin: registeredRule.plugin,
      timestamp: Date.now(),
    });
  }

  public onRuleFinished(registeredRule: RegisteredRule): void {
    this.addEvent({
      type: "rule:finished",
      rule: registeredRule.rule.name,
      plugin: registeredRule.plugin,
      timestamp: Date.now(),
    });
  }

  public onMatchFound(match: Match): void {}
}
