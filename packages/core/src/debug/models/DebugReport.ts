import type { DebugEvent } from "../events";
import type { DebugStatistics } from "./DebugStatistics";
import type { Timeline } from "./Timeline";
import type { PerformanceReport } from "./PerformanceReport";

export interface DebugReport {
  readonly statistics: DebugStatistics;

  readonly timeline: Timeline;

  readonly performance: PerformanceReport;

  readonly events: readonly DebugEvent[];
}
