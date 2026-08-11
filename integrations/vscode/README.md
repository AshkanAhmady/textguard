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

## CI packaging

`.github/workflows/vscode-extension.yml` validates the extension independently from the root pnpm workspace. Changes under `integrations/vscode` are type-checked, built, packaged into a VSIX, and uploaded as a GitHub Actions artifact.

## Marketplace publishing

`.github/workflows/vscode-marketplace-publish.yml` is an explicit, manually triggered release workflow. It uses `@vscode/vsce publish --oidc`, so GitHub Actions can publish with short-lived OpenID Connect credentials instead of storing a long-lived Marketplace PAT.

Before the first publish, create or verify the Visual Studio Marketplace publisher whose ID matches the extension manifest (`textguard`), then configure Marketplace trusted publishing for this repository and the workflow file `.github/workflows/vscode-marketplace-publish.yml`. The workflow requests `id-token: write` and runs in the `vscode-marketplace` GitHub environment.

Once trusted publishing is configured, run **Publish VS Code Extension** from GitHub Actions. Publishing remains deliberate and is not triggered by pull requests or pushes.

Until the first successful Marketplace publication, searching `TextGuard` in the VS Code Extensions view will not install this repository's extension.
