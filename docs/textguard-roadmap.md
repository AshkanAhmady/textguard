# TextGuard Roadmap — Verified Status

> Status below is checked against actual source code. Use this alongside `TEXTGUARD-PROJECT.md` and the stable wider-product vision in `GUARD-ECOSYSTEM.md`.

Legend: ✅ Done · 🟡 Partial / in progress · ❌ Not started

---

## Near-term execution order

1. **Release hardening — ✅ complete.** Safe Changesets planning, bounded npm candidate checks, release docs, and canonical package taxonomy are in place.
2. **AR1/AR2 package release — ✅ complete.** `@textguard/core@1.0.3`, `@textguard/all@1.0.3`, `@textguard/ar@1.1.0`, `@textguard/en@1.0.2`, and `@textguard/fa@1.0.2` are published.
3. **Arabic language parity — ✅ complete for the current architecture.** AR1-AR4 cover baseline dictionaries, normalization hardening, tested dialect expansion, and bundle/preset inclusion.
4. **Release cadence policy — ✅ batched.** Changesets remain per behavior/API change; npm publishing is intentionally deferred and grouped across several coherent milestones unless a critical/consumer-blocking release is justified.
5. **Adoption validation — 🟡 current focus.** Gather real consumer signals through structured GitHub intake and package usage data, then use them to rank the next milestone.
6. **Developer integration slice — 🟡 in progress.** The initial CLI milestone is feature-complete for current scope. The VS Code host supports diagnostics, Explain quick fixes, preset selection, workspace whitelists, reproducible VSIX packaging, dedicated extension CI, and an explicit trusted-publishing workflow; Marketplace publisher/trust configuration and first publication remain external release steps.
7. **Roadmap reassessment — 🟡 in progress.** Small correctness work may proceed when it removes known engine nondeterminism without expanding product scope.

---

## Phase 7 — Advanced Features

### Epic 0 — PII / Compliance CI Guard ⭐⭐⭐⭐⭐

**Status: ✅ Open-source consumer DX complete through M0.6. M0.7 remains intentionally later.**

| Milestone | Status | Detail |
| --- | --- | --- |
| M0.1 — Scope & Naming | ✅ Done | `@textguard/plugin-pii`; email, phone, credit card, IBAN. |
| M0.2 — Scan Core | ✅ Done | `piiPreset`, `scanText()` and `scanMany()` implemented. |
| M0.3 — Pre-commit Hook Mode | ✅ Done | Scanner blocks real commits; `npx textguard-pii init` wires Husky safely and shared policy configuration is enforced. |
| M0.4 — GitHub Action Mode | ✅ Done | CI scanner and generated consumer workflow exist; packaged E2E verifies CI pass/fail behavior using the shared policy. |
| M0.5 — Reporting Output | ✅ Done | Console/markdown reporting exists. |
| M0.6 — Consumer Setup / DX | ✅ Done | Copy/paste setup, `init`, shared config, executable consumer example, and packaged external E2E validation are complete. |
| M0.7 — Paid Tier | ❌ Later | Only after open-source usage validates demand. |

### Epic 1 — Debug Engine ⭐⭐⭐⭐⭐

| Milestone | Status | Detail |
| --- | --- | --- |
| M1 — Debug Foundation | ✅ Done | `DebugSession`, events, collector, `filter.debug()`. |
| M2 — Renderers | ✅ Done | Console, JSON, Markdown, and HTML renderers are implemented and publicly exported. |
| M3 — Timeline | ✅ Done | Timeline implemented. |
| M4 — Performance Diagnostics | ✅ Done | Performance diagnostics implemented. |
| M5 — Explain API | ✅ Done | Structured Explain domain, builder, public `filter.explain(text)`, tests and public core docs complete. |
| M6 — Future Integrations | 🟡 Partial | `@textguard/cli` is complete for its initial scope. VS Code integration now supports manual/save-time diagnostics, Explain quick fixes, preset selection, workspace whitelist control, VSIX packaging, dedicated CI validation, and a manual OIDC Marketplace publish workflow. First Marketplace publication, Chrome, Playground, and AI integrations remain later. |

---

## Product-quality backlog

### Package README standardization — ✅ complete

Future public API/behavior changes must update affected READMEs in the same PR.

### Arabic language parity — ✅ complete for the current architecture

| Slice | Status | Scope |
| --- | --- | --- |
| AR1 — usable dictionary baseline | ✅ Done | Conservative profanity + insult dictionaries, populated `arDictionary`/`arPack`, public API tests, README, and release metadata. |
| AR2 — normalization + coverage hardening | ✅ Done | Existing Arabic normalization audited/hardened, diacritic/Alef-Maqsura coverage added, vocabulary expanded, and benign regression cases added. |
| AR3 — dialect/coverage expansion slice 1 | ✅ Done | Small high-confidence dialect additions with public API and benign regression tests. |
| AR4 — bundle/preset parity | ✅ Done | `arDictionary` is included in `strictPreset` and `enterprisePreset` with preset-level Arabic regression coverage. |

Arabic profanity coverage is intentionally not treated as a finite “complete list”; future vocabulary changes should be evidence-driven rather than treated as a standing roadmap obligation.

### Adoption validation — 🟡 current

Structured GitHub issue forms are the primary qualitative intake surface for runtime bugs, detection quality, DX friction, and feature requests. A single issue is evidence, not automatic roadmap priority.

### Release safety — ✅ hardened

- never run root `npm publish`;
- keep Changesets per public behavior/API change;
- batch normal npm releases across several coherent milestones;
- preview Changesets with `pnpm release:plan` when opening a release batch;
- review generated version/changelog diff before commit;
- compare local public package versions with npm before `changeset publish`;
- require explicit confirmation of the exact candidate count;
- keep `docs/RELEASING.md` as the canonical procedure.

### Engine correctness

- overlap ranking determinism — ✅ fixed: longer matches still win; equal-length overlaps preserve lower numeric rule priority, then use stable plugin/rule identity tie-breakers instead of registration order.

### Other technical debt

- historical preset-ownership documentation mentions `packages/presets/`, but that top-level package directory no longer exists; current preset ownership lives under `packages/all` and the stale debt item should not drive a refactor.
- future integrations beyond the current VS Code slice should be selected from adoption evidence rather than added as standing scope.

---

## Current product-quality focus

**dedicated VS Code CI → trusted Marketplace publishing → first public release → adoption feedback.**
