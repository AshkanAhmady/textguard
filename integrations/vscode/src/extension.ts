import * as vscode from "vscode";
import { createFilter, strictPreset } from "@textguard/all";

const filter = createFilter(strictPreset);
const DIAGNOSTIC_CODE = "textguard.match";

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
    diagnostic.code = DIAGNOSTIC_CODE;
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

function findExplanation(
  document: vscode.TextDocument,
  range: vscode.Range,
): string | null {
  const result = filter.explain(document.getText());
  const start = document.offsetAt(range.start);
  const end = document.offsetAt(range.end);
  const explained = result.matches.find(
    (item) => item.match.start === start && item.match.end === end,
  );

  if (!explained) return null;

  return [
    `TextGuard matched "${explained.match.matchedText}".`,
    `Source: ${explained.source.plugin}`,
    `Reason: ${explained.reason.message}`,
  ].join("\n");
}

class TextGuardCodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    _range: vscode.Range,
    context: vscode.CodeActionContext,
  ): vscode.CodeAction[] {
    return context.diagnostics
      .filter(
        (diagnostic) =>
          diagnostic.source === "TextGuard" && diagnostic.code === DIAGNOSTIC_CODE,
      )
      .map((diagnostic) => {
        const action = new vscode.CodeAction(
          "Explain TextGuard match",
          vscode.CodeActionKind.QuickFix,
        );
        action.diagnostics = [diagnostic];
        action.command = {
          command: "textguard.explainDiagnostic",
          title: "Explain TextGuard match",
          arguments: [document.uri, diagnostic.range],
        };
        return action;
      });
  }
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
    vscode.commands.registerCommand(
      "textguard.explainDiagnostic",
      (uri: vscode.Uri, range: vscode.Range) => {
        const document = vscode.workspace.textDocuments.find(
          (candidate) => candidate.uri.toString() === uri.toString(),
        );
        if (!document) return;

        const explanation = findExplanation(document, range);
        if (!explanation) {
          void vscode.window.showInformationMessage(
            "TextGuard: explanation is no longer available. Scan the document again.",
          );
          return;
        }

        void vscode.window.showInformationMessage(explanation, { modal: true });
      },
    ),
  );

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { scheme: "file" },
      new TextGuardCodeActionProvider(),
      { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] },
    ),
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
