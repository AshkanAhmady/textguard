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

1. **Root README — ✅ merged.**
2. **Published package audit — ✅ merged.**
3. **`@textguard/all` README — ✅ merged.**
4. **Persian + English READMEs — ✅ merged.**
5. **Detection P0 READMEs — ✅ merged.**
6. **Detection P1 READMEs — ✅ merged.**
7. **Arabic README consistency — ✅ merged.**
8. **Final package-wide consistency pass — ✅ complete in current branch.** Core, PII, All, language, and detector documentation are aligned with the current published surface.

## README maintenance rules

- Use `@textguard/plugin-pii` as a quality reference, not as a rigid template.
- Prefer short install + quick-start paths over architecture-heavy explanations.
- Every code sample must match the current exported API.
- Detector README claims must match actual validation behavior.
- Avoid raw PII literals in repository docs when equivalent safe examples can be assembled without weakening PII enforcement.
- Update affected README/example documentation in the same PR as future public API or behavior changes.

## Next work sequence — Arabic implementation parity

After this documentation-only PR is merged, start Arabic parity from the latest `main` on a fresh branch.

Before coding:

1. compare Persian, English, and Arabic package structures;
2. define the smallest useful Arabic parity scope;
3. preserve current Arabic exports/backward compatibility where practical;
4. identify dictionary, normalization, tests, package integration, and documentation tasks;
5. only then implement the first coherent Arabic slice.

Do not broaden this into Core refactors or unrelated roadmap work.

## Priorities after Arabic parity

Reassess adoption feedback and the broader roadmap before expanding feature breadth.

## Current branch note

`agent/readme-final-consistency` is documentation-only. It closes the package README cleanup milestone and advances the documented next step to Arabic implementation parity.
