export interface MatchFoundEvent {
  readonly type: "match:found";
  readonly plugin: string;
  readonly rule: string;
  readonly value: string;
  readonly start: number;
  readonly end: number;
  readonly replacement?: string;
  readonly timestamp: number;
}
