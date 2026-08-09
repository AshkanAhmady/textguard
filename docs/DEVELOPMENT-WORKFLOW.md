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
2. **AR2 — normalization + coverage hardening — 🟡 current branch.** Audit the existing Core Arabic normalizer, add common diacritic/Alef-Maqsura normalization, broaden high-confidence vocabulary, and add benign regression tests.
3. **AR3 — dialect/coverage expansion.** Add dialect-specific vocabulary only when coverage evidence and false-positive tests justify it; evaluate spam/pattern resources independently.
4. **AR4 — bundle/preset parity.** Include Arabic in broader presets/bundles only after coverage and normalization quality are sufficient.

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

`agent/arabic-normalization-coverage` combines the requested vocabulary expansion with the next planned AR2 normalization audit. It changes `@textguard/core` normalization behavior and `@textguard/plugin-ar` coverage, so both packages have release Changesets in this PR.
