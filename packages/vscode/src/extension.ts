import * as vscode from "vscode";
import { createFilter, strictPreset } from "@textguard/all";
import { toEditorDiagnostics } from "@textguard/core";

const filter = createFilter(strictPreset);

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

      const document = editor.document;
      const matches = filter.findBadWords(document.getText());
      const editorDiagnostics = toEditorDiagnostics(matches);
      const vscodeDiagnostics = editorDiagnostics.map((diagnostic) => {
        const range = new vscode.Range(
          document.positionAt(diagnostic.start),
          document.positionAt(diagnostic.end),
        );
        const item = new vscode.Diagnostic(
          range,
          diagnostic.message,
          vscode.DiagnosticSeverity.Warning,
        );
        item.source = diagnostic.source;
        return item;
      });

      diagnostics.set(document.uri, vscodeDiagnostics);
      void vscode.window.showInformationMessage(
        `TextGuard: ${vscodeDiagnostics.length} match${vscodeDiagnostics.length === 1 ? "" : "es"} found.`,
      );
    }),
  );
}

export function deactivate(): void {}
