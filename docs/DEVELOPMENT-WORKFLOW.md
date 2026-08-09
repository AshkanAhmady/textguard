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

## Current work sequence — Explain API preparation

Before implementing Epic 1 / M5 Explain API, the Debug Engine is being hardened in small reviewable PRs.

Planned sequence:

1. **M5.0 — Debug Contract Audit** — add contract tests that capture current Debug Engine behavior, including candidate matches versus final overlap-resolved matches.
2. **M5.1 — DebugSession authoritative state** — preserve original input, normalized input, and final matches in `DebugSession` while keeping existing APIs backward compatible.
3. **M5.2 — Match lifecycle events** — make candidate/accepted/rejected match semantics explicit so Debug/Explain consumers cannot confuse candidates with final results.
4. **M5.3 — Rule/plugin metadata preservation** — preserve enough rule metadata for reliable explanations without changing the existing `Match` public contract unnecessarily.
5. **M5.4+ — Explain domain/API** — build Explain as a projection of DebugSession, not as a second rule-execution engine.

Each item should normally ship as its own branch and pull request unless two steps are inseparable and keeping them separate would make the repository temporarily invalid.

## Current branch note

`agent/debug-engine-hardening` establishes the M5.0 baseline only. It adds Debug Engine contract tests and intentionally does not change production runtime behavior or the public API. The overlap test documents the current known gap: `match:found` represents a discovered candidate before overlap resolution and therefore is not necessarily a final match.

This branch also fixes two CI issues discovered by its PR validation: the Debug Engine test now asserts event order without relying on an `id` field that is not present on every `DebugEvent` union member, and the PII workflow now lets the repository's `packageManager` field provide the pnpm version instead of configuring a second version in the action.
