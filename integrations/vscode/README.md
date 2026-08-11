# TextGuard for VS Code

Initial VS Code integration for TextGuard.

## Current capability

Run **TextGuard: Scan Active Editor** from the Command Palette. The extension scans the full active document and publishes each match as a VS Code warning diagnostic, so matches appear inline and in the Problems panel.

The extension also scans documents automatically when they are saved. This behavior is enabled by default and can be disabled through the `textguard.scanOnSave` VS Code setting.

Choose the scanning policy with `textguard.preset`. Supported values are `strict` (default), `enterprise`, and `socialMedia`. Changing the preset refreshes diagnostics for currently open file documents, and the same preset is used by Explain so diagnostics and explanations stay consistent.

Use `textguard.whitelist` for project-specific allowed words that should not produce diagnostics. The setting is a unique string array and is applied on top of the selected preset. Updating it refreshes currently open file documents immediately.

```json
{
  "textguard.whitelist": ["project-name", "approved-term"]
}
```

For a TextGuard diagnostic, open VS Code Quick Fix actions and choose **Explain TextGuard match**. The extension reuses the Core Explain API and shows the matched text, source, and structured reason without duplicating detection logic in the extension.

Diagnostics for a document are removed when that document is closed.

## Local development

This integration intentionally lives outside the root pnpm workspace during the initial Marketplace shell milestone. That prevents extension-only VS Code tooling from changing the library workspace lockfile or CI dependency graph.

From this directory, install dependencies and run the build/type-check scripts independently.

## Marketplace status

Not published yet. Searching `TextGuard` in the VS Code Extensions view will only work after a later Marketplace publishing milestone. Until then this source is for repository development/testing only.
