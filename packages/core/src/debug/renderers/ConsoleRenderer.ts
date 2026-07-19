import type { DebugRenderer } from "./DebugRenderer";
import type { DebugReport } from "../models/DebugReport";

export class ConsoleRenderer implements DebugRenderer<string> {
  public render(report: DebugReport): string {
    const lines: string[] = [];

    lines.push("=== TextGuard Debug Report ===");
    lines.push("");

    lines.push("Statistics:");
    lines.push(`  Total Events: ${report.statistics.totalEvents}`);
    lines.push(`  Matches: ${report.statistics.matchEvents}`);
    lines.push("");

    lines.push("Events:");

    for (const event of report.events) {
      lines.push(`[${event.timestamp}] ${event.type}`);
    }

    return lines.join("\n");
  }
}
