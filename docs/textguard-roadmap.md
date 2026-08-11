# TextGuard Roadmap — Verified Status

> Status below is checked against actual source code. Use this alongside `TEXTGUARD-PROJECT.md` and the stable wider-product vision in `GUARD-ECOSYSTEM.md`.

Legend: ✅ Done · 🟡 Partial / in progress · ❌ Not started

---

## Near-term execution order

1. **Release hardening — ✅ complete.** Safe Changesets planning, bounded npm candidate checks, release docs, and canonical package taxonomy are in place.
2. **AR1/AR2 package release — ✅ complete.** `@textguard/core@1.0.3`, `@textguard/all@1.0.3`, `@textguard/ar@1.1.0`, `@textguard/en@1.0.2`, and `@textguard/fa@1.0.2` are published.
3. **Arabic language parity — ✅ complete for the current architecture.** AR1-AR4 cover baseline dictionaries, normalization hardening, tested dialect expansion, and bundle/preset inclusion.
4. **Release cadence policy — ✅ batched.** Changesets remain per behavior/API change; npm publishing is intentionally deferred and grouped across several coherent milestones unless a critical/consumer-blocking release is justified.
5. **Adoption validation — 🟡 current focus.** Gather real consumer signals and use them to rank the next milestone.
6. **Roadmap reassessment — next.** Choose one implementation slice using evidence, architectural leverage, maintenance cost, and the Guard Ecosystem Decision Filter.

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
| M2 — Renderers | 🟡 Partial | Console/JSON/Markdown exist; HTML remains missing. |
| M3 — Timeline | ✅ Done | Timeline implemented. |
| M4 — Performance Diagnostics | ✅ Done | Performance diagnostics implemented. |
| M5 — Explain API | ✅ Done | Structured Explain domain, builder, public `filter.explain(text)`, tests and public core docs complete. |
| M6 — Future Integrations | ❌ Not started | VS Code / Chrome / CLI / Playground / AI later. |

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

Before selecting the next major feature, collect and review:

- npm/package usage and install trends;
- repeated setup/API friction from consumers;
- false-positive and false-negative reports;
- recurring requests across independent users/projects;
- package discoverability/taxonomy confusion;
- integration requests that clearly reuse existing architecture;
- maintenance and regression cost of each candidate change.

Do not promote a feature solely because it is interesting or because it appears once in the long-term roadmap.

### Release safety — ✅ hardened

- never run root `npm publish`;
- keep Changesets per public behavior/API change;
- batch normal npm releases across several coherent milestones;
- preview Changesets with `pnpm release:plan` when opening a release batch;
- review generated version/changelog diff before commit;
- compare local public package versions with npm before `changeset publish`;
- require explicit confirmation of the exact candidate count;
- keep `docs/RELEASING.md` as the canonical procedure.

### Other technical debt

- `packages/presets/` versus `packages/all/src/presets/` ownership/duplication.
- ADR-001 renderer/API documentation drift.
- overlap ranking remains order-dependent in some ties.
- HTML Debug renderer remains missing.

---

## Current product-quality focus

**adoption validation → evidence-driven roadmap reassessment → one coherent implementation milestone.**
