import { DebugSession } from "../models/DebugSession";
import type { DebugRuleMetadata } from "../models/DebugRuleMetadata";
import type { DebugEvent } from "../events";
import type { Match } from "../../domain/match";
import type { ExecutionObserver } from "../observer/ExecutionObserver";
import type { RegisteredRule } from "../../domain/registeredRule";
import type { DistributiveOmit } from "../types/DistributiveOmit";

function toRuleMetadata(registeredRule: RegisteredRule): DebugRuleMetadata {
  const { rule } = registeredRule;

  return {
    id: rule.id,
    name: rule.name,
    category: rule.category,
    severity: rule.severity,
    priority: rule.priority,
  };
}

export class DebugCollector implements ExecutionObserver {
  private readonly events: DebugEvent[] = [];
  private nextEventId = 1;
  private input = "";
  private normalizedInput = "";
  private matches: readonly Match[] = [];

  public addEvent(event: DistributiveOmit<DebugEvent, "id" | "level">): void {
    this.events.push({
      id: this.nextEventId++,
      level: "trace",
      ...event,
    } as DebugEvent);
  }

  public setExecutionState(
    input: string,
    normalizedInput: string,
    matches: readonly Match[],
  ): void {
    this.input = input;
    this.normalizedInput = normalizedInput;
    this.matches = Object.freeze([...matches]);
  }

  public build(): DebugSession {
    return new DebugSession({
      input: this.input,
      normalizedInput: this.normalizedInput,
      matches: this.matches,
      events: Object.freeze([...this.events]),
    });
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
      ruleMetadata: toRuleMetadata(registeredRule),
      match,
      timestamp: Date.now(),
    });
  }

  public onMatchAccepted(registeredRule: RegisteredRule, match: Match): void {
    this.addEvent({
      type: "match:accepted",
      plugin: registeredRule.plugin,
      rule: registeredRule.rule.name,
      ruleMetadata: toRuleMetadata(registeredRule),
      match,
      timestamp: Date.now(),
    });
  }

  public onMatchRejected(
    registeredRule: RegisteredRule,
    match: Match,
    winner: Match,
  ): void {
    this.addEvent({
      type: "match:rejected",
      plugin: registeredRule.plugin,
      rule: registeredRule.rule.name,
      ruleMetadata: toRuleMetadata(registeredRule),
      match,
      reason: "overlap",
      winner,
      timestamp: Date.now(),
    });
  }
}
