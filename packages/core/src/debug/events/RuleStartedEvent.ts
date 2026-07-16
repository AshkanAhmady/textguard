import type { BaseDebugEvent } from "./BaseDebugEvent";

export interface RuleStartedEvent extends BaseDebugEvent {
  readonly type: "rule:started";
  readonly plugin: string;
  readonly rule: string;
}
