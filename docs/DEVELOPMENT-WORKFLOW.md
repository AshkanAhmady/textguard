# TextGuard Development Workflow

This file is part of the project's persistent working memory. It records the development discipline to follow for future product work so that implementation, roadmap status, and architectural documentation do not drift apart.

## Change workflow

1. Start each implementation change-set from the latest `main` on a dedicated branch.
2. Keep one coherent scope per branch. Avoid unrelated refactors.
3. Update or add tests for the behavior being changed.
4. Update every affected documentation source in the same branch before the PR is considered complete.
5. Open a pull request to `main` for maintainer review. Do not merge automatically.
6. Treat required CI checks as part of the change-set's Definition of Done. Do not merge while required checks are failing; investigate and fix the root cause first.
7. After the maintainer merges the PR, delete the feature branch and start the next change from the new latest `main`.

## Documentation is project memory

Whenever implementation changes product behavior, public APIs, architecture, milestone status, package usage, CI/developer workflow, or developer-facing behavior, review the following documentation and update every file that became stale:

- `docs/textguard-roadmap.md` — implementation/milestone status and sequencing.
- `docs/TEXTGUARD-PROJECT.md` — verified current capabilities, package state, technical debt, and repository ground truth.
- `docs/architecture/*.md` — architectural decisions and deviations. Existing accepted ADRs should not be silently rewritten when a new architectural decision is introduced; add a new ADR when appropriate.
- package/root `README.md` files — public usage and API examples affected by the change.
- this file — development-process changes.

A code change is not considered fully complete when it makes any of these documents inaccurate.

## Source-of-truth hierarchy

- Implementation and tests are the source of truth for current runtime behavior.
- `docs/textguard-roadmap.md` is the source of truth for delivery status and planned sequencing.
- ADRs are the source of truth for accepted architectural decisions and their tradeoffs.
- `docs/TEXTGUARD-PROJECT.md` is the contributor/AI orientation document and must be kept synchronized with verified implementation.

If documentation conflicts with implementation, verify the code first and then correct the stale documentation in the same or immediately following maintenance PR.

## Current work sequence — Explain API

Follow this sequence unless the maintainer explicitly changes it. Do not jump ahead to later roadmap features while this sequence is active.

1. **M5.0 — Debug Contract Audit — ✅ merged.** Contract tests capture Debug Engine behavior.
2. **M5.1 — DebugSession authoritative state — ✅ merged.** Original input, normalized input, and final matches are preserved. See `ADR-002`.
3. **M5.2 — Match lifecycle events — ✅ merged.** Candidate/accepted/rejected decisions are explicit. See `ADR-003`.
4. **M5.3 — Rule/plugin metadata preservation — ✅ merged.** Match lifecycle events preserve structured rule metadata and plugin identity. See `ADR-004`.
5. **M5.4 — Explain domain models + builder — ✅ merged.** Structured Explain models and `ExplainBuilder` project accepted matches from `DebugSession`. See `ADR-005`.
6. **M5.5 — Public `filter.explain()` — 🟡 current PR.** Add the convenience method to `TextGuardInstance`, implemented through the existing debug-capable execution path and `ExplainBuilder`.
7. **M5.6 — Explain integration/edge-case tests + public docs — next.** Cover overlap, normalization, empty/no-match behavior, plugin combinations, and README/API examples before marking M5 complete.

Each item should normally ship as its own branch and pull request.

## Product priorities after Explain

Once Explain API is complete and stable, do not jump immediately to broad new feature work. The next product-quality sequence is:

1. **PII consumer integration / DX hardening.** Validate `@textguard/plugin-pii` from a fresh external project. Preferred setup direction: `npx textguard-pii init`. This milestone should include a policy/configuration layer for intentional findings, including allowlisted values, ignored paths/globs, and narrowly scoped suppressions without weakening the underlying detectors.
2. **Package README standardization.** Audit all published package READMEs and standardize their structure/quality around the current `@textguard/plugin-pii` README. Examples must match shipped APIs and be copy/paste-ready.
3. **Arabic language parity — lower priority.** Complete `@textguard/plugin-ar` dictionaries/rules/tests later rather than interrupting Explain, PII DX, or README work.

These priorities are part of project memory and must remain reflected in `docs/textguard-roadmap.md`.

## Current branch note

`agent/explain-public-api` implements M5.5 only.

It exposes `filter.explain(text)` on `TextGuardInstance`. The method reuses the existing debug-capable execution path and `ExplainBuilder`; it does not introduce a second detection engine or change detection semantics. M5 remains in progress until M5.6 integration/edge-case coverage and public documentation are complete.
