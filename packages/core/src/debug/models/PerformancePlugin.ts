import type { PerformanceRule } from "./PerformanceRule";

export interface PerformancePlugin {
  readonly name: string;
  readonly duration: number;
  readonly rules: readonly PerformanceRule[];
}
