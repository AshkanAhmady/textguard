import type { DebugReport } from "../models/DebugReport";
import type { DebugRenderer } from "./DebugRenderer";

export class MarkdownRenderer implements DebugRenderer<string> {
  public render(report: DebugReport): string {
    const events = report.events
      .map((event) => `- ${event.type}`)
      .join("\n");

    return [
      "# TextGuard Debug Report",
      "",
      "## Statistics",
      "",
      "```json",
      JSON.stringify(report.statistics, null, 2),
      "```",
      "",
      "## Performance",
      "",
      "```json",
      JSON.stringify(report.performance, null, 2),
      "```",
      "",
      "## Timeline",
      "",
      "```json",
      JSON.stringify(report.timeline, null, 2),
      "```",
      "",
      "## Events",
      "",
      events || "No events recorded.",
      "",
    ].join("\n");
  }
}
