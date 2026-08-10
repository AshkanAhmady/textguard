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
- `docs/GUARD-ECOSYSTEM.md` when stable product/business vision changes
- `docs/architecture/*.md`
- package/root `README.md` files
- relevant `examples/` projects
- `docs/RELEASING.md`
- this file

`GUARD-ECOSYSTEM.md` is intentionally more stable than the TextGuard delivery docs. Do not update it for ordinary implementation churn unless the wider product principles, business model, or ecosystem direction actually change.

## Completed work sequences

- Epic 1 / M5 Explain API — ✅ complete.
- PII Consumer DX through M0.6 — ✅ complete.
- Package README standardization — ✅ complete.
- Arabic AR1 usable baseline — ✅ complete.
- Arabic AR2 normalization + high-confidence coverage hardening — ✅ complete and released.
- Arabic AR3 first dialect coverage slice — ✅ complete.
- Arabic AR4 bundle/preset parity — ✅ complete.
- Release hardening and canonical package-taxonomy migration — ✅ complete.
- Guard Ecosystem canonical project-memory document — ✅ added.

## Current work sequence

1. **Complete the pending AR3/AR4 release.** Review the Changesets release plan and publish only the expected `@textguard/ar` / `@textguard/all` candidates and any intentional dependency propagation.
2. **Adoption validation.** Collect real usage, issues, install/DX friction, false-positive/false-negative reports, and developer feedback.
3. **Broader roadmap reassessment.** Pick the next product milestone from evidence and the Guard Ecosystem Decision Filter rather than adding scope automatically.

## Arabic parity rules

Arabic parity is complete for the current architecture, but future maintenance should preserve these rules:

- Preserve existing exports (`arDictionary`, `arPack`, `arLanguage`) where practical.
- Use the existing `Dictionary` contract instead of adding Arabic-specific Core APIs.
- Dictionary entries must align with canonical output from the shared normalization pipeline.
- Test user-visible behavior through `createFilter()`.
- Treat Arabic profanity coverage as iterative, not exhaustive.
- Prefer high-confidence additions and benign negative tests over bulk dialect/slang imports.

## Guard Ecosystem guardrail

The wider Guard Ecosystem remains vision-stage beyond TextGuard. Do not start SchemaGuard, ApiGuard, ConfigGuard, FormGuard, GitGuard, AI-platform work, or a multi-product SaaS merely because Arabic parity is finished. First validate TextGuard adoption and use `docs/GUARD-ECOSYSTEM.md` as the decision filter for what, if anything, deserves to be built next.
