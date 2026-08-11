# TextGuard for VS Code

VS Code integration for TextGuard.

## Current capability

Run **TextGuard: Scan Active Editor** from the Command Palette. The extension scans the full active document and publishes each match as a VS Code warning diagnostic, so matches appear inline and in the Problems panel.

The extension also scans documents automatically when they are saved. This behavior is enabled by default and can be disabled through the `textguard.scanOnSave` VS Code setting.

Choose the scanning policy with `textguard.preset`. Supported values are `strict` (default), `enterprise`, and `socialMedia`. Changing the preset refreshes diagnostics for currently open file documents, and the same preset is used by Explain so diagnostics and explanations stay consistent.

Use `textguard.whitelist` for project-specific allowed words that should not produce diagnostics. Updating it refreshes currently open file documents immediately.

```json
{
  "textguard.whitelist": ["project-name", "approved-term"]
}
```

For a TextGuard diagnostic, open VS Code Quick Fix actions and choose **Explain TextGuard match**. The extension reuses the Core Explain API and shows the matched text, source, and structured reason without duplicating detection logic in the extension.

## Package and install locally

The extension remains outside the root pnpm workspace, so its Marketplace tooling does not affect the library workspace lockfile. The current `@vscode/vsce` release requires Node.js 22 or newer for packaging.

From `integrations/vscode`:

```bash
npm install
npm run check-types
npm run package:vsix
```

This produces `textguard-vscode-0.1.0.vsix`. Install it from VS Code using **Extensions → … → Install from VSIX…**, or from the command line:

```bash
code --install-extension textguard-vscode-0.1.0.vsix
```

The `.vscodeignore` file keeps TypeScript sources and build-only files out of the installable VSIX.

## Marketplace status

The extension is now package-ready but is **not published yet**. Marketplace publication still requires a valid Visual Studio Marketplace publisher matching the `publisher` field and an explicit release step. Until that happens, searching `TextGuard` in the VS Code Extensions view will not install this repository's extension.
