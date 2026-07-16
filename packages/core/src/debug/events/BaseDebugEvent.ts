import type { DebugLevel } from "./DebugLevel";

export interface BaseDebugEvent {
  readonly id: number;
  readonly timestamp: number;
  readonly level: DebugLevel;
}
