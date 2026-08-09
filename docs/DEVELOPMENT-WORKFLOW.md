# TextGuard Development Workflow

This file is part of the project's persistent working memory. It records the development discipline to follow so implementation, roadmap status, and architectural documentation do not drift apart.

## Change workflow

1. Start each implementation change-set from the latest `main` on a dedicated branch.
2. Keep one coherent scope per branch. Avoid unrelated refactors.
3. Update or add tests for changed behavior.
4. Update every affected documentation source in the same branch before the PR is complete.
5. Add Changesets when published package behavior changes.
6. Open a pull request to `main` for maintainer review. Do not merge automatically.
7. Required CI checks are part of Definition of Done. Do not merge while required checks are failing.
8. After merge, delete the feature branch and start the next change from the new latest `main`.
9. When merged Changesets imply an npm release, explicitly remind the maintainer which package(s) and release level should be published.

## Documentation is project memory

Whenever implementation changes product behavior, public APIs, architecture, milestone status, package usage, CI/developer workflow, or developer-facing behavior, review and update every affected source:

- `docs/textguard-roadmap.md`
- `docs/TEXTGUARD-PROJECT.md`
- `docs/architecture/*.md`
- package/root `README.md` files
- relevant `examples/` projects
- this file

## Completed work sequences

- Epic 1 / M5 Explain API — ✅ complete.
- PII Consumer DX through M0.6 — ✅ complete.
- Package README standardization — ✅ complete.

## Current work sequence — Arabic implementation parity

1. **AR1 — usable dictionary baseline — ✅ merged.** Conservative profanity/insult dictionaries and public API integration tests.
2. **AR2 — normalization + coverage hardening — ✅ merged.** Existing Core Arabic normalization audited and extended; high-confidence coverage and benign regression tests added.
3. **AR3 — dialect/coverage expansion — 🟡 current branch.** Add small dialect-focused vocabulary slices only when entries are high confidence, keep public API tests, and avoid bulk slang imports.
4. **AR4 — bundle/preset parity.** Include Arabic in broader presets/bundles only after coverage quality is sufficient.

## Arabic parity rules

- Preserve existing exports (`arDictionary`, `arPack`, `arLanguage`) where practical.
- Use the existing `Dictionary` contract instead of adding Arabic-specific Core APIs.
- Dictionary entries must align with canonical output from the shared normalization pipeline.
- Test user-visible behavior through `createFilter()`.
- Treat Arabic profanity coverage as iterative, not as a supposedly exhaustive word list.
- Prefer high-confidence additions and benign negative tests over bulk dialect/slang imports.
- Keep README and release metadata aligned with each runtime slice.

## Priorities after Arabic parity

Reassess adoption feedback and the broader roadmap before expanding feature breadth.

## Current branch note

`agent/arabic-dialect-coverage` is AR3 slice 1. It changes only `@textguard/plugin-ar` vocabulary/tests/docs and therefore needs a package Changeset, but no Core release.
