import * as vscode from "vscode";
import { createFilter, strictPreset } from "@textguard/all";

const filter = createFilter(strictPreset);

function scanDocument(
  document: vscode.TextDocument,
  diagnostics: vscode.DiagnosticCollection,
): number {
  const matches = filter.findBadWords(document.getText());
  const items = matches.map((match) => {
    const range = new vscode.Range(
      document.positionAt(match.start),
      document.positionAt(match.end),
    );
    const diagnostic = new vscode.Diagnostic(
      range,
      `TextGuard matched "${match.matchedText}"`,
      vscode.DiagnosticSeverity.Warning,
    );
    diagnostic.source = "TextGuard";
    return diagnostic;
  });

  diagnostics.set(document.uri, items);
  return items.length;
}

function isScanOnSaveEnabled(): boolean {
  return vscode.workspace
    .getConfiguration("textguard")
    .get<boolean>("scanOnSave", true);
}

export function activate(context: vscode.ExtensionContext): void {
  const diagnostics = vscode.languages.createDiagnosticCollection("textguard");
  context.subscriptions.push(diagnostics);

  context.subscriptions.push(
    vscode.commands.registerCommand("textguard.scanActiveEditor", () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        void vscode.window.showInformationMessage("TextGuard: no active editor to scan.");
        return;
      }

      const matchCount = scanDocument(editor.document, diagnostics);
      void vscode.window.showInformationMessage(
        `TextGuard: ${matchCount} match${matchCount === 1 ? "" : "es"} found.`,
      );
    }),
  );

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (!isScanOnSaveEnabled()) return;
      scanDocument(document, diagnostics);
    }),
  );

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document) => {
      diagnostics.delete(document.uri);
    }),
  );
}

export function deactivate(): void {}
