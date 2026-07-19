import type { DebugEvent } from "../events";
import type { DebugStatistics } from "./DebugStatistics";

export interface DebugReport {
  readonly statistics: DebugStatistics;
  readonly events: readonly DebugEvent[];
}
