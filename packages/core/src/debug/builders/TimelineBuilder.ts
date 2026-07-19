import type { DebugReport } from "../models/DebugReport";
import type { Timeline } from "../models/Timeline";

export class TimelineBuilder {
  public build(report: DebugReport): Timeline {
    return {
      nodes: [],
    };
  }
}
