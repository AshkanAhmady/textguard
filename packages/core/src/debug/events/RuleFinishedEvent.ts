export interface RuleFinishedEvent {
  readonly type: "rule:finished";
  readonly rule: string;
  readonly plugin: string;
  readonly timestamp: number;
}
