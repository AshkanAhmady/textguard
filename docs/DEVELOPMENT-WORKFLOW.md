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
8. Temporary/helper branches are not part of the review flow and should not be created when the same work can be done directly on the scoped feature branch.

## Documentation is project memory

Whenever implementation changes product behavior, public APIs, architecture, milestone status, package usage, CI/developer workflow, or developer-facing behavior, review and update every affected source:

- `docs/textguard-roadmap.md` — delivery status and sequencing.
- `docs/TEXTGUARD-PROJECT.md` — verified capabilities, package state, technical debt, and repository ground truth.
- `docs/architecture/*.md` — architectural decisions and tradeoffs.
- package/root `README.md` files — public usage and API examples.
- this file — development-process changes.

A code change is not complete if it leaves these sources inaccurate.

## Source-of-truth hierarchy

- Implementation and tests: runtime behavior.
- `docs/textguard-roadmap.md`: delivery status and planned sequencing.
- ADRs: accepted architectural decisions.
- `docs/TEXTGUARD-PROJECT.md`: contributor/AI orientation and verified project state.

## Completed work sequence — Explain API

Epic 1 / M5 Explain API was delivered in small reviewable PRs:

1. **M5.0 — Debug Contract Audit — ✅ merged.**
2. **M5.1 — DebugSession authoritative state — ✅ merged.** See `ADR-002`.
3. **M5.2 — Match lifecycle events — ✅ merged.** See `ADR-003`.
4. **M5.3 — Rule/plugin metadata preservation — ✅ merged.** See `ADR-004`.
5. **M5.4 — Explain domain models + builder — ✅ merged.** See `ADR-005`.
6. **M5.5 — Public `filter.explain()` — ✅ merged.** See `ADR-006`.
7. **M5.6 — Explain integration/edge-case tests + public docs — 🟡 current PR.** Covers empty/clean input, normalization, overlap resolution, multiple plugins, and corrects the public `@textguard/core` README. When merged, M5 is complete.

## Next work sequence — PII Consumer DX Hardening

After M5.6 merges, the next work must stay focused on making `@textguard/plugin-pii` reliable in a fresh external consumer repository before broad feature work.

Planned scope:

1. Validate the published package from a clean external-style project.
2. Design and implement consumer setup, preferably `npx textguard-pii init`.
3. Make pre-commit blocking work end-to-end in the consumer project.
4. Make PR/GitHub Action blocking work end-to-end in the consumer project.
5. Add a policy/configuration layer for intentional findings:
   - allowlisted values by detector/type where appropriate;
   - ignored paths/globs;
   - narrowly scoped suppression/ignore controls.
6. Keep policy decisions outside the underlying Email/Phone/CreditCard/IBAN detectors; detectors report findings, the PII policy layer decides whether a finding blocks.
7. Update the PII README and setup documentation with copy/paste-ready instructions.

## Priorities after PII DX

1. **Package README standardization.** Audit every published package and use the current `@textguard/plugin-pii` README as the quality/structure reference. Empty or stale READMEs must be fixed.
2. **Arabic language parity — lower priority.** Complete dictionaries/rules/tests/README later; do not interrupt PII DX or README cleanup for it.

## Current branch note

`agent/explain-m5-finalize` implements M5.6 only. It does not add new detection behavior. It finalizes Explain coverage and public documentation, then advances the roadmap to PII Consumer DX Hardening.
