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

Before implementing Epic 1 / M5 Explain API itself, the Debug Engine is being hardened in small reviewable PRs. Follow this sequence unless the maintainer explicitly changes it; do not jump ahead to later roadmap features while this preparation sequence is active.

Current sequence:

1. **M5.0 — Debug Contract Audit — ✅ merged.** Contract tests capture current Debug Engine behavior, including candidate matches versus final overlap-resolved matches. The same PR also fixed CI issues exposed by the new required checks.
2. **M5.1 — DebugSession authoritative state — ✅ merged.** `DebugSession` preserves original input, normalized input, and final overlap-resolved matches while keeping the legacy constructor and existing APIs backward compatible. Architectural rationale is recorded in `docs/architecture/ADR-002-debug-session-state.md`.
3. **M5.2 — Match lifecycle events — 🟡 current PR.** Keep `match:found` as candidate discovery and add explicit `match:accepted` / `match:rejected` events so Debug/Explain consumers can see the final overlap decision without guessing from the event stream. Architectural rationale is recorded in `docs/architecture/ADR-003-match-lifecycle-events.md`.
4. **M5.3 — Rule/plugin metadata preservation — next.** Preserve enough rule metadata for reliable explanations without changing the existing `Match` public contract unnecessarily.
5. **M5.4+ — Explain domain/API.** Build Explain as a projection of DebugSession, not as a second rule-execution engine.

Each item should normally ship as its own branch and pull request unless two steps are inseparable and keeping them separate would make the repository temporarily invalid.

## Current branch note

`agent/debug-match-lifecycle` implements M5.2 only.

It adds explicit lifecycle semantics without changing detection behavior or overlap ranking:

- `match:found` means a rule discovered a candidate;
- `match:rejected` means overlap resolution removed that candidate and records the winning match;
- `match:accepted` is emitted only for matches that survive into the final result;
- `session.getMatches()` remains the authoritative final detection result.

The overlap-selection algorithm itself is intentionally unchanged. M5.3 will add reliable rule/plugin metadata for Explain without expanding this branch into the Explain API itself.
