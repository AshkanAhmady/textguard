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
3. **PII DX 3 — external end-to-end validation — ✅ merged and green.** `examples/pii-consumer` is both the simple developer walkthrough and the regression harness. The real packaged artifact is installed into a clean consumer-style repository and commit/CI behavior is verified end to end.
4. **PII DX 4 — final public docs — ✅ closeout.** The PII README is copy/paste-ready and M0.3/M0.4/M0.6 are complete.

## Current work sequence — README standardization

Stay on this sequence before Arabic parity or broader roadmap features:

1. **Root README.** Replace the obsolete Turborepo starter content with a real TextGuard overview, install guidance, core quick start, package map, PII entry point, examples, and contribution/development links.
2. **Published package audit.** Inventory every package README and identify empty, obsolete, inconsistent, or misleading documentation.
3. **Package README standardization.** Use `@textguard/plugin-pii` as the quality reference: purpose, install, quick start, API/options, examples, and relevant validation/limitations.
4. **Example alignment.** Keep examples simple for ordinary developers and make sure documented APIs match shipped behavior.
5. **Closeout.** Update roadmap/project docs with the final audit status before starting Arabic parity.

## Priorities after README standardization

1. Arabic language parity at lower priority.
2. Reassess adoption feedback and the broader roadmap before expanding feature breadth.

## Current branch note

`agent/pii-dx-closeout` closes the PII Consumer DX milestone and moves persistent project focus to README standardization. It intentionally does not rewrite the root README or package READMEs beyond `@textguard/plugin-pii`; those belong to the next dedicated work sequence.
