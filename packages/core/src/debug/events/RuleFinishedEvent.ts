import type { BaseDebugEvent } from "./BaseDebugEvent";

export interface RuleFinishedEvent extends BaseDebugEvent {
  readonly type: "rule:finished";
  readonly plugin: string;
  readonly rule: string;
}
