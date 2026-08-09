# TextGuard Development Workflow

This file is part of the project's persistent working memory. It records the development discipline to follow so implementation, roadmap status, and architectural documentation do not drift apart.

## Change workflow

1. Start each implementation change-set from the latest `main` on a dedicated branch.
2. Keep one coherent scope per branch. Avoid unrelated refactors.
3. Update or add tests for changed behavior.
4. Update every affected documentation source in the same branch before the PR is complete.
5. Open a pull request to `main` for maintainer review. Do not merge automatically.
6. Required CI checks are part of Definition of Done. Do not merge while required checks are failing.
7. After merge, delete the feature branch and start the next change from the new latest `main`.
8. Avoid temporary/helper branches when the same work can be done directly on the scoped feature branch.

## Documentation is project memory

Whenever implementation changes product behavior, public APIs, architecture, milestone status, package usage, CI/developer workflow, or developer-facing behavior, review and update every affected source:

- `docs/textguard-roadmap.md`
- `docs/TEXTGUARD-PROJECT.md`
- `docs/architecture/*.md`
- package/root `README.md` files
- relevant `examples/` projects
- this file

## Completed work sequence — Explain API

Epic 1 / M5 Explain API is complete.

## Completed work sequence — PII Consumer DX Hardening

PII consumer init, shared policy configuration, external E2E validation, and final public docs are complete through M0.6.

## Current work sequence — README standardization

Stay on this sequence before Arabic parity or broader roadmap features:

1. **Root README — ✅ merged.**
2. **Published package audit — ✅ merged.**
3. **`@textguard/all` README — ✅ merged.**
4. **Persian + English READMEs — ✅ merged.**
5. **Detection P0 READMEs — ✅ merged.**
6. **Detection P1 READMEs — ✅ merged.** Email and URL now use the current API and standard package structure.
7. **Arabic README consistency — ✅ current branch.** Document the exact current exports and foundation-only capability without expanding implementation scope.
8. **Final consistency pass — next.** Confirm every published package README is current, non-empty, easy to follow, and aligned with shipped exports.

## README rewrite rules

- Use `@textguard/plugin-pii` as the quality reference, not as a rigid template.
- Prefer short install + quick-start paths over architecture-heavy explanations.
- Every code sample must match the current exported API.
- Detector README claims must match actual validation behavior.
- Avoid raw PII literals in repository docs when equivalent safe examples can be assembled without weakening PII enforcement.
- Do not expand Arabic implementation scope during documentation cleanup.

## Priorities after README standardization

1. Arabic language parity.
2. Reassess adoption feedback and the broader roadmap before expanding feature breadth.

## Current branch note

`agent/arabic-readme-consistency` is documentation-only. It fixes the Arabic README/export drift and makes the package's current empty dictionary/pack state explicit. The next branch is the final package-wide README consistency pass.
