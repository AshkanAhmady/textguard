# TextGuard Development Workflow

This file is part of the project's persistent working memory. It records the development discipline to follow so implementation, roadmap status, release state, and documentation do not drift apart.

## Change workflow

1. Start each implementation change-set from the latest `main` on a dedicated branch.
2. Keep one coherent scope per branch. Avoid unrelated refactors.
3. Update or add tests for changed behavior.
4. Update every affected documentation source in the same branch before the PR is complete.
5. Add Changesets when published package behavior changes.
6. Open a pull request to `main` for maintainer review. Do not merge automatically.
7. Required CI checks are part of Definition of Done. Do not merge while required checks are failing.
8. After merge, delete the feature branch and start the next change from the new latest `main`.
9. When merged Changesets imply an npm release, explicitly remind the maintainer which package(s) and release level are pending.

## Safe release workflow

`docs/RELEASING.md` is the canonical release procedure.

- Never run `npm publish` from the monorepo root.
- Run `pnpm release:plan` before versioning and review every planned package.
- Run `pnpm version-packages`, then inspect `git diff` before committing generated release files.
- Run tests/type-check/build before publishing.
- `pnpm release` first runs `scripts/release-check.mjs`, which compares local public package versions with npm and requires explicit confirmation of the candidate count.
- If the candidate list contains any unexpected package, cancel the release.
- Changesets uses semver-compatible workspace ranges for public runtime dependencies to avoid unnecessary patch-release waves.

## Documentation is project memory

Whenever implementation changes product behavior, public APIs, architecture, milestone status, package usage, CI/developer workflow, or release behavior, review and update every affected source:

- `docs/textguard-roadmap.md`
- `docs/TEXTGUARD-PROJECT.md`
- `docs/architecture/*.md`
- package/root `README.md` files
- relevant `examples/` projects
- `docs/RELEASING.md`
- this file

## Completed work sequences

- Epic 1 / M5 Explain API — ✅ complete.
- PII Consumer DX through M0.6 — ✅ complete.
- Package README standardization — ✅ complete.
- Arabic AR1 usable baseline — ✅ merged.
- Arabic AR2 normalization + high-confidence coverage hardening — ✅ merged and released.
- Arabic AR3 first dialect coverage slice — ✅ merged.
- Release hardening and canonical package-taxonomy migration — ✅ complete.

## Current work sequence

1. **AR4 — bundle/preset parity — current PR.** Add Arabic moderation to the higher-level `strictPreset` and `enterprisePreset` with preset-level regression tests and no Core API changes.
2. **Adoption validation.** Reassess broader roadmap based on external usage after Arabic parity closeout.
3. **Broader roadmap reassessment.** Pick the next product milestone from evidence rather than adding scope automatically.

## Arabic parity rules

- Preserve existing exports (`arDictionary`, `arPack`, `arLanguage`) where practical.
- Use the existing `Dictionary` contract instead of adding Arabic-specific Core APIs.
- Dictionary entries must align with canonical output from the shared normalization pipeline.
- Test user-visible behavior through `createFilter()`.
- Treat Arabic profanity coverage as iterative, not exhaustive.
- Prefer high-confidence additions and benign negative tests over bulk dialect/slang imports.

## Queued project-memory task

After the active Arabic PR flow is stable, add the canonical Guard Ecosystem master document to Git in a dedicated documentation PR so business/vision context is persistent without mixing it into TextGuard's per-commit roadmap.
