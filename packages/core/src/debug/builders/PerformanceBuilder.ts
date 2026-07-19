import type { DebugReport } from "../models/DebugReport";
import type { PerformanceReport } from "../models/PerformanceRule";

export class PerformanceBuilder {
  public build(report: DebugReport): PerformanceReport {
    return {
      totalDuration: 0,
      plugins: [],
    };
  }
}
