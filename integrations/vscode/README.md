# TextGuard for VS Code

Initial VS Code integration for TextGuard.

## Current capability

Run **TextGuard: Scan Active Editor** from the Command Palette. The extension scans the full active document with `strictPreset` and publishes each match as a VS Code warning diagnostic, so matches appear inline and in the Problems panel.

## Local development

This integration intentionally lives outside the root pnpm workspace during the initial Marketplace shell milestone. That prevents extension-only VS Code tooling from changing the library workspace lockfile or CI dependency graph.

From this directory, install dependencies and run the build/type-check scripts independently.

## Marketplace status

Not published yet. Searching `TextGuard` in the VS Code Extensions view will only work after a later Marketplace publishing milestone. Until then this source is for repository development/testing only.
