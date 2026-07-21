import type { DebugSession } from "../models/DebugSession";
import type { DebugReport } from "../models/DebugReport";

export class DebugReportBuilder {
  public build(session: DebugSession): DebugReport {
    return {
      statistics: session.statistics(),
      timeline: session.timeline(),
      performance: session.performance(),
      events: session.getEvents(),
    };
  }
}
