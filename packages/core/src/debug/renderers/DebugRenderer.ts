import type { DebugReport } from "../models/DebugReport";

export interface DebugRenderer<TOutput> {
  render(report: DebugReport): TOutput;
}
