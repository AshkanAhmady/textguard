import type { Match } from "../domain/match";

export type EditorDiagnosticSeverity = "warning";

export interface EditorDiagnostic {
  start: number;
  end: number;
  message: string;
  source: "TextGuard";
  severity: EditorDiagnosticSeverity;
  matchedText: string;
}

export function toEditorDiagnostics(matches: Match[]): EditorDiagnostic[] {
  return matches.map((match) => ({
    start: match.start,
    end: match.end,
    matchedText: match.matchedText,
    message: `TextGuard matched "${match.matchedText}"`,
    source: "TextGuard",
    severity: "warning",
  }));
}
