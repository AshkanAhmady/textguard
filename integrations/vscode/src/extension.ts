import * as vscode from "vscode";
import { createFilter, strictPreset } from "@textguard/all";

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
      void vscode.window.showInformationMessage(
        `TextGuard: ${items.length} match${items.length === 1 ? "" : "es"} found.`,
      );
    }),
  );
}

export function deactivate(): void {}
