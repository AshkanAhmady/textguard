export interface RuleStartedEvent {
  readonly type: "rule:started";
  readonly rule: string;
  readonly plugin: string;
  readonly timestamp: number;
}
