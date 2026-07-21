import type { DebugRenderer } from "./DebugRenderer";
import type { DebugReport } from "../models/DebugReport";

export class ConsoleRenderer implements DebugRenderer<string> {
  public render(report: DebugReport): string {
    const lines: string[] = [];

    lines.push("=== TextGuard Debug Report ===");
    lines.push("");

    lines.push("Statistics");
    lines.push("--------------------------------");
    lines.push(`Total Events     : ${report.statistics.totalEvents}`);
    lines.push(`Matches          : ${report.statistics.matchEvents}`);
    lines.push(`Rules Executed   : ${report.statistics.ruleFinishedEvents}`);
    lines.push(`Plugins          : ${report.statistics.plugins.length}`);
    lines.push("");

    lines.push("Performance");
    lines.push("--------------------------------");
    lines.push(`Pipeline Duration: ${report.performance.totalDuration} ms`);

    for (const plugin of report.performance.plugins) {
      lines.push(`• ${plugin.name} (${plugin.duration} ms)`);

      for (const rule of plugin.rules) {
        lines.push(
          `    - ${rule.name} | ${rule.duration} ms | matches: ${rule.matchCount}`,
        );
      }
    }

    lines.push("");

    lines.push("Timeline");
    lines.push("--------------------------------");

    for (const plugin of report.timeline.plugins) {
      lines.push(`Plugin: ${plugin.name}`);

      for (const rule of plugin.rules) {
        lines.push(`  Rule: ${rule.name} (${rule.matches.length} matches)`);

        for (const match of rule.matches) {
          lines.push(
            `    [${match.start}-${match.end}] "${match.matchedText}"`,
          );
        }
      }
    }

    lines.push("");

    lines.push("Events");
    lines.push("--------------------------------");

    for (const event of report.events) {
      lines.push(`[${event.timestamp}] ${event.type}`);
    }

    return lines.join("\n");
  }
}
