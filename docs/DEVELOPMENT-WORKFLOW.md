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

## Completed work sequence — Explain API

Epic 1 / M5 Explain API is complete.

## Completed work sequence — PII Consumer DX Hardening

PII consumer init, shared policy configuration, external E2E validation, and final public docs are complete through M0.6.

## Completed work sequence — README standardization

Root, package audit, All, language, detector, Arabic consistency, and final package-wide README verification are complete.

## Current work sequence — Arabic implementation parity

Keep Arabic parity incremental and do not broaden it into unrelated Core refactors.

1. **AR1 — usable dictionary baseline — 🟡 current PR.** Add conservative profanity and insult dictionaries, populate existing `arDictionary`/`arPack`, keep dictionary entries compatible with Core's canonical Arabic normalization, test through `createFilter()`, update README, and include a Changesets minor entry.
2. **AR2 — Arabic normalization audit — next.** Core already ships `ArabicNormalizer`; audit its current mappings and add focused regression coverage for Arabic letter variants and diacritics before changing behavior.
3. **AR3 — coverage expansion.** Expand vocabulary/categories conservatively; evaluate spam/pattern resources independently rather than copying them from Persian/English.
4. **AR4 — bundle/preset parity.** Only include Arabic in broader presets/bundles after coverage and normalization quality are sufficient.

## Arabic parity rules

- Preserve existing exports (`arDictionary`, `arPack`, `arLanguage`) where practical.
- New resources should use the existing `Dictionary` contract instead of adding language-specific Core APIs.
- Arabic dictionary entries must align with the canonical text produced by the current Core normalization pipeline.
- Test user-visible behavior through the public `createFilter()` API, not only raw arrays.
- Treat normalization changes separately from vocabulary expansion so false-positive regressions are reviewable.
- Keep README and release metadata aligned with each runtime slice.

## README maintenance rules

- Prefer short install + quick-start paths over architecture-heavy explanations.
- Every code sample must match the current exported API.
- Detector README claims must match actual validation behavior.
- Avoid raw PII literals in repository docs when equivalent safe examples can be assembled without weakening PII enforcement.
- Update affected README/example documentation in the same PR as future public API or behavior changes.

## Priorities after Arabic parity

Reassess adoption feedback and the broader roadmap before expanding feature breadth.

## Current branch note

`agent/arabic-usable-baseline` is the first runtime Arabic parity slice. It intentionally limits scope to a usable profanity/insult baseline. The next PR audits the already-existing Arabic normalizer instead of adding a second normalization path.
