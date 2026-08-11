import { describe, expect, it } from "vitest";
import { toEditorDiagnostics } from "../integrations/editorDiagnostics";

describe("toEditorDiagnostics", () => {
  it("maps matches to stable editor diagnostics", () => {
    const diagnostics = toEditorDiagnostics([
      {
        word: "secret",
        matchedText: "secret",
        start: 6,
        end: 12,
      },
    ]);

    expect(diagnostics).toEqual([
      {
        start: 6,
        end: 12,
        matchedText: "secret",
        message: 'TextGuard matched "secret"',
        source: "TextGuard",
        severity: "warning",
      },
    ]);
  });

  it("preserves match order and returns an empty array for clean input", () => {
    expect(toEditorDiagnostics([])).toEqual([]);

    const diagnostics = toEditorDiagnostics([
      { word: "one", matchedText: "one", start: 0, end: 3 },
      { word: "two", matchedText: "two", start: 4, end: 7 },
    ]);

    expect(diagnostics.map((diagnostic) => diagnostic.matchedText)).toEqual([
      "one",
      "two",
    ]);
  });
});
