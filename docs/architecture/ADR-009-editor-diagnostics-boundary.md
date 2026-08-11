# ADR-009: Editor diagnostics stay editor-neutral in Core

## Status

Accepted

## Context

TextGuard is moving from the CLI integration slice toward editor integrations, starting with VS Code. Directly importing editor SDK types into `@textguard/core` would couple the engine to a specific host and make the public API harder to reuse in Chrome, Playground, and future integrations.

## Decision

Core exposes a small editor-neutral diagnostic adapter through `toEditorDiagnostics(matches)`.

The adapter preserves TextGuard match offsets and matched text and adds stable display metadata (`source`, `severity`, and `message`). Host integrations translate that contract into VS Code diagnostics or equivalent editor/browser structures at their own boundary.

## Consequences

- `@textguard/core` remains independent of VS Code and browser SDKs.
- editor integrations can share the same deterministic mapping contract.
- host-specific range conversion, decoration, lifecycle, and configuration stay outside Core.
- the existing `Match` contract remains unchanged.
