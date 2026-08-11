import type { DebugReport } from "../models/DebugReport";
import type { DebugRenderer } from "./DebugRenderer";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export class HtmlRenderer implements DebugRenderer<string> {
  public render(report: DebugReport): string {
    return `<section class="textguard-debug-report">
  <h1>TextGuard Debug Report</h1>
  <h2>Statistics</h2>
  <pre>${escapeHtml(JSON.stringify(report.statistics, null, 2))}</pre>
  <h2>Timeline</h2>
  <pre>${escapeHtml(JSON.stringify(report.timeline, null, 2))}</pre>
  <h2>Performance</h2>
  <pre>${escapeHtml(JSON.stringify(report.performance, null, 2))}</pre>
  <h2>Events</h2>
  <pre>${escapeHtml(JSON.stringify(report.events, null, 2))}</pre>
</section>`;
  }
}
