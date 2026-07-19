import type { DebugReport } from "../models/DebugReport";
import type { DebugRenderer } from "./DebugRenderer";

export class JsonRenderer implements DebugRenderer<string> {
  public render(report: DebugReport): string {
    return JSON.stringify(report, null, 2);
  }
}
