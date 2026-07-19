import type { PerformancePlugin } from "./PerformancePlugin";

export interface PerformanceReport {
  readonly totalDuration: number;

  readonly plugins: readonly PerformancePlugin[];
}
