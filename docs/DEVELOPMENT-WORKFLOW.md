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

Prefer executable examples when a feature has a concrete consumer setup path. When practical, CI should exercise the same example developers are expected to follow so examples and product behavior cannot drift silently.

## Completed work sequence — Explain API

Epic 1 / M5 Explain API is complete: Debug hardening, Explain domain/builder, public `filter.explain()`, integration tests, and core public docs are merged.

## Completed work sequence — PII Consumer DX Hardening

1. **PII DX 1 — consumer init foundation — ✅ merged.** `npx textguard-pii init` safely wires the pre-commit scanner and GitHub workflow without overwriting existing setup.
2. **PII DX 2 — policy/configuration layer — ✅ merged.** Detector-specific allowlists, ignored paths/globs, and narrowly scoped suppressions are shared by CLI and CI; detectors remain strict.
3. **PII DX 3 — external end-to-end validation — ✅ merged and green.** `examples/pii-consumer` is both the simple developer walkthrough and the regression harness.
4. **PII DX 4 — final public docs — ✅ merged.** The PII README is copy/paste-ready and M0.3/M0.4/M0.6 are complete.

## Current work sequence — README standardization

Stay on this sequence before Arabic parity or broader roadmap features:

1. **Root README — ✅ merged.**
2. **Published package audit — ✅ merged.** Findings and priorities are in `docs/PACKAGE-README-AUDIT.md`.
3. **`@textguard/all` README — 🟡 current PR.** Replace the empty README with a simple current quick start, package map, preset guidance, Explain/Debug entry points, and honest notes about incomplete presets.
4. **Persian + English READMEs — next.** Remove obsolete APIs and fix malformed markdown.
5. **Detection P0 READMEs.** Fix Phone, IP, UUID, Credit Card, and IBAN correctness issues.
6. **Detection P1 READMEs.** Standardize Email and URL.
7. **Arabic README consistency.** Keep scope documentation-only until Arabic parity work begins.
8. **Final consistency pass.** Confirm every published package is current, non-empty, and easy to follow.

## README rewrite rules

- Use `@textguard/plugin-pii` as the quality reference, not as a rigid template.
- Prefer short install + quick-start paths over architecture-heavy explanations.
- Every code sample must match the current exported API.
- Detector README claims must match actual validation behavior.
- Avoid raw PII literals in repository docs when equivalent safe examples can be assembled without weakening PII enforcement.
- Do not expand Arabic implementation scope during documentation cleanup; describe its current state accurately and leave parity work for its planned phase.

## Priorities after README standardization

1. Arabic language parity at lower priority.
2. Reassess adoption feedback and the broader roadmap before expanding feature breadth.

## Current branch note

`agent/all-readme` is documentation-only. It fixes the highest-impact empty package README without changing runtime behavior. The next branch fixes the obsolete Persian and English package documentation.
