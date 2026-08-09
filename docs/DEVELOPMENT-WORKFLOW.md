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
- this file

## Completed work sequence — Explain API

Epic 1 / M5 Explain API is complete: Debug hardening, Explain domain/builder, public `filter.explain()`, integration tests, and core public docs are merged.

## Current work sequence — PII Consumer DX Hardening

Stay on this sequence before broad roadmap work:

1. **PII DX 1 — consumer init foundation — 🟡 current PR.** Add `npx textguard-pii init` to safely wire the existing pre-commit scanner and GitHub workflow. Existing hook commands are preserved; an existing workflow file is never overwritten.
2. **PII DX 2 — policy/configuration layer — next.** Add allowlisted values, ignored paths/globs, and narrowly scoped suppressions. Keep policy outside the underlying detectors.
3. **PII DX 3 — external end-to-end validation.** Verify install/init, real commit blocking, and real PR blocking in a clean consumer-style project; fix remaining setup gaps such as Husky initialization.
4. **PII DX 4 — final public docs.** Make the README/setup path copy/paste-ready and mark M0.6 complete only after end-to-end validation passes.

## Priorities after PII DX

1. Package README standardization using `@textguard/plugin-pii` as the quality reference.
2. Arabic language parity at lower priority.

## Current branch note

`agent/pii-init-foundation` implements only the first PII Consumer DX step. It does not yet add allowlist/ignore policy and does not claim full end-to-end consumer validation.
