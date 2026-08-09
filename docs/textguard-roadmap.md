# TextGuard Roadmap — Verified Status

> Status below was checked against actual source code (not the older planning docs, which describe intent rather than current reality). Use this alongside `TEXTGUARD-PROJECT.md`.

Legend: ✅ Done &nbsp; 🟡 Partial / in progress &nbsp; ❌ Not started

---

## Near-term execution order

Follow this order unless the maintainer explicitly changes it:

1. **Finish Epic 1 / M5 Explain API.** Complete the current Explain implementation sequence before moving to later roadmap features.
2. **PII consumer integration / DX hardening.** Validate `@textguard/plugin-pii` in a fresh external repository and make installation actually configure the consuming project. Preferred direction: `npx textguard-pii init` to set up pre-commit and/or CI integration. Add a policy/configuration layer for intentional findings: allowlisted values, ignored paths/globs, and narrowly scoped suppressions without weakening detection itself.
3. **Package README standardization.** Audit every package README. Empty, incomplete, or stale READMEs must be rewritten with a consistent structure and quality based on the current `@textguard/plugin-pii` README. All examples must match the shipped API and be copy/paste-ready.
4. **Arabic language parity — lower priority.** Complete `@textguard/plugin-ar` dictionaries/rules/tests after the items above; do not interrupt Explain/PII/README work for it.

---

## Phases 1–6 — Foundation through Developer Experience

All verified as substantially complete based on repo structure and published packages:

- ✅ Monorepo setup (pnpm workspace, Turborepo, Changesets)
- ✅ Core engine (`createFilter`, rule engine, dictionary engine, plugin engine, pipeline)
- ✅ Official language plugins: Persian, English (Arabic is thin — see below)
- ✅ Official detection plugins: Email, URL, Phone, IP, UUID, Credit Card, IBAN
- ✅ `@textguard/all` bundle package with presets, tree-shaking (ESM/CJS via tsup)
- ✅ Tests present across core/plugins; coverage tooling configured
- ✅ npm releases exist for core/language/detection packages and `@textguard/all`

**Caveat:** 🟡 Arabic (`@textguard/plugin-ar`) is published but functionally thin compared with Persian/English. Arabic parity is tracked, but intentionally lower priority than Explain API, PII consumer DX, and README cleanup.

---

## Phase 7 — Advanced Features

### Epic 0 — PII / Compliance CI Guard ⭐⭐⭐⭐⭐

**Status: 🟡 Core capability exists; consumer integration still needs hardening.** The package detects email, phone, credit card, and IBAN and includes CLI/CI entry points, but installing the npm package in an external project does not automatically configure that project's Husky hook or GitHub workflow.

Milestones:

| Milestone | Status | Detail |
| --- | --- | --- |
| M0.1 — Scope & Naming | ✅ Done | Package name: `@textguard/plugin-pii`; v1 detection scope: email, phone, credit card, IBAN. |
| M0.2 — Scan Core | ✅ Done | `piiPreset`, `scanText()` and `scanMany()` implemented. |
| M0.3 — Pre-commit Hook Mode | 🟡 Partial | Scanner/CLI can block a commit, and TextGuard's own repo wires it into Husky. External consumers still need an installation/setup flow. |
| M0.4 — GitHub Action Mode | 🟡 Partial | TextGuard's own workflow scans PRs. External consumers still need a supported setup flow/template. |
| M0.5 — Reporting Output | ✅ Done | Shared console/markdown reporting exists. |
| M0.6 — Consumer Setup / DX | ❌ Not started | After Explain: validate from a clean external project and implement/document setup, preferably via `npx textguard-pii init`. Verify commit/PR blocking end-to-end and add policy configuration for allowlisted values, ignored paths/globs, and narrow suppressions. |
| M0.7 — Paid Tier (later) | ❌ Not started | Multi-repo/org dashboard, history, alerting; only after open-source usage validates demand. |

**Sequencing:** finish Explain first because PII findings become much more useful when they can say why something matched. Then return immediately to consumer integration before broad new feature work.

### Epic 1 — Debug Engine ⭐⭐⭐⭐⭐

| Milestone | Status | Detail |
| --- | --- | --- |
| M1 — Debug Foundation | ✅ Done | `DebugSession`, `DebugEvent`, `DebugCollector`, `filter.debug()` implemented. |
| M2 — Renderers | 🟡 Partial | Console/JSON/Markdown exist; HTML renderer remains missing. |
| M3 — Timeline | ✅ Done | Timeline builder/model implemented. |
| M4 — Performance Diagnostics | ✅ Done | Performance builder/report exposed by `session.performance()`. |
| M5 — Explain API | 🟡 In progress | M5.0–M5.4 are merged. M5.5 exposes public `filter.explain(text)` through the existing debug execution path and `ExplainBuilder`; final integration/edge-case tests and public docs remain before M5 is complete. |
| M6 — Future Integrations | ❌ Not started | VS Code / Chrome / CLI / Playground / AI consumers come later. |

Current M5 sequence is tracked in `docs/DEVELOPMENT-WORKFLOW.md` and architecture ADRs. Do not skip ahead while that sequence is active.

### Epic 2 — Enterprise Preset (secrets/JWT/API keys/tokens/wallets/SSH keys) ⭐⭐⭐⭐

❌ Not started. The existing `enterprisePreset` name in `@textguard/all` already means something else, so naming must be resolved before implementation.

### Epic 3 — Benchmark Suite ⭐⭐⭐

❌ Not started.

### Epic 4 — VS Code Extension ⭐⭐⭐⭐

❌ Not started. Depends on a stable Debug/Explain surface.

### Epic 5 — Chrome Extension ⭐⭐⭐

❌ Not started. Depends on a stable Debug/Explain surface.

### Epic 6 — AI Platform (`@textguard/plugin-ai`) ⭐⭐⭐⭐⭐

❌ Not started. Broader AI/ecosystem work remains deferred until TextGuard fundamentals and adoption improve.

---

## Product-quality backlog

### Package README standardization — high priority after PII DX

Current README quality is inconsistent: some packages are incomplete, some are empty or too thin, and older examples may not match the current public API. Run a package-by-package documentation pass after Explain and PII consumer setup.

Definition of Done:

- every published package has a useful README;
- use the current `@textguard/plugin-pii` README as the structural/quality reference;
- installation, basic usage, API surface, examples, behavior/limitations, and related packages are clear where relevant;
- examples are tested against current package exports/API;
- no package ships an empty README.

### Arabic language parity — lower priority

`@textguard/plugin-ar` should eventually reach the same basic quality bar as Persian/English: real dictionaries/rules, tests, useful README, and explicit supported behavior. It is intentionally scheduled after Explain API, PII consumer DX, and README standardization.

### Other technical debt still tracked

- `packages/presets/` versus `packages/all/src/presets/` ownership/duplication.
- ADR-001 documented renderer/API shape versus actual implementation.
- overlap-resolution ranking remains order-dependent in some equal-span/equal-length cases; M5.2 makes decisions observable but does not change ranking semantics.
- HTML Debug renderer remains missing.

---

## Suggested Definition of Done

Near-term success is not “finish every Phase 7 epic.” The current focus is:

**reliable Debug/Explain → usable PII integration in real consumer repos → strong npm/package documentation → adoption feedback.**

Only after those are stable should the roadmap expand aggressively into secrets presets, IDE/browser integrations, benchmarking, or AI features.

---

## Beyond TextGuard

Guard Ecosystem (SchemaGuard, ApiGuard, ConfigGuard, FormGuard, GitGuard) remains vision-only. Defer it until TextGuard itself demonstrates stronger usage and product fit.
