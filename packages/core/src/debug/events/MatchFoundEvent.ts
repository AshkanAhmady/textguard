import type { BaseDebugEvent } from "./BaseDebugEvent";

export interface MatchFoundEvent extends BaseDebugEvent {
  readonly type: "match:found";

  readonly plugin: string;
  readonly rule: string;

  readonly matchedText: string;

  readonly start: number;
  readonly end: number;

  readonly replacement?: string;
}
