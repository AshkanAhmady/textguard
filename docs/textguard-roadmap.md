# TextGuard Roadmap — Verified Status

> Status below is checked against actual source code. Use this alongside `TEXTGUARD-PROJECT.md`.

Legend: ✅ Done · 🟡 Partial / in progress · ❌ Not started

---

## Near-term execution order

Follow this order unless the maintainer explicitly changes it:

1. **PII consumer integration / DX hardening.** Validate `@textguard/plugin-pii` in a fresh external repository and make installation configure the consuming project. Preferred direction: `npx textguard-pii init` for pre-commit and/or CI setup. Add a policy/configuration layer for intentional findings: allowlisted values, ignored paths/globs, and narrowly scoped suppressions without weakening detection itself.
2. **Package README standardization.** Audit every published package README. Empty, incomplete, or stale READMEs must be rewritten with a consistent structure and quality based on the current `@textguard/plugin-pii` README. Examples must match shipped APIs and be copy/paste-ready.
3. **Arabic language parity — lower priority.** Complete `@textguard/plugin-ar` dictionaries/rules/tests after the items above.

---

## Phases 1–6 — Foundation through Developer Experience

Verified as substantially complete:

- ✅ Monorepo setup (pnpm workspace, Turborepo, Changesets)
- ✅ Core engine (`createFilter`, rule engine, dictionary engine, plugin engine, pipeline)
- ✅ Official language plugins: Persian, English
- 🟡 Arabic plugin published but functionally thin
- ✅ Detection plugins: Email, URL, Phone, IP, UUID, Credit Card, IBAN
- ✅ `@textguard/all` bundle package with presets
- ✅ Tests and coverage tooling
- ✅ npm releases for core/language/detection packages and `@textguard/all`

---

## Phase 7 — Advanced Features

### Epic 0 — PII / Compliance CI Guard ⭐⭐⭐⭐⭐

**Status: 🟡 Core capability exists; consumer integration needs hardening.**

| Milestone | Status | Detail |
| --- | --- | --- |
| M0.1 — Scope & Naming | ✅ Done | `@textguard/plugin-pii`; v1 detection scope: email, phone, credit card, IBAN. |
| M0.2 — Scan Core | ✅ Done | `piiPreset`, `scanText()` and `scanMany()` implemented. |
| M0.3 — Pre-commit Hook Mode | 🟡 Partial | Scanner/CLI can block commits; external consumer setup is still manual. |
| M0.4 — GitHub Action Mode | 🟡 Partial | TextGuard's own PR scan works; external consumer setup/template is still missing. |
| M0.5 — Reporting Output | ✅ Done | Shared console/markdown reporting exists. |
| M0.6 — Consumer Setup / DX | ❌ Next | Validate from a clean external project; implement/document setup, preferably `npx textguard-pii init`; verify commit/PR blocking end-to-end; add allowlisted values, ignored paths/globs, and narrow suppressions. |
| M0.7 — Paid Tier | ❌ Later | Only after open-source usage validates demand. |

### Epic 1 — Debug Engine ⭐⭐⭐⭐⭐

| Milestone | Status | Detail |
| --- | --- | --- |
| M1 — Debug Foundation | ✅ Done | `DebugSession`, `DebugEvent`, `DebugCollector`, `filter.debug()` implemented. |
| M2 — Renderers | 🟡 Partial | Console/JSON/Markdown exist; HTML renderer remains missing. |
| M3 — Timeline | ✅ Done | Timeline builder/model implemented. |
| M4 — Performance Diagnostics | ✅ Done | `session.performance()` implemented. |
| M5 — Explain API | ✅ Done | Debug hardening, structured Explain domain, `ExplainBuilder`, public `filter.explain(text)`, integration/edge-case tests, and public core docs are complete. |
| M6 — Future Integrations | ❌ Not started | VS Code / Chrome / CLI / Playground / AI consumers come later. |

M5 architecture is recorded in ADR-002 through ADR-006 and the implementation sequence is recorded in `docs/DEVELOPMENT-WORKFLOW.md`.

### Epic 2 — Enterprise Preset (secrets/JWT/API keys/tokens/wallets/SSH keys) ⭐⭐⭐⭐

❌ Not started. The existing `enterprisePreset` name in `@textguard/all` already means something else; naming must be resolved first.

### Epic 3 — Benchmark Suite ⭐⭐⭐

❌ Not started.

### Epic 4 — VS Code Extension ⭐⭐⭐⭐

❌ Not started. Depends on stable Debug/Explain APIs.

### Epic 5 — Chrome Extension ⭐⭐⭐

❌ Not started.

### Epic 6 — AI Platform (`@textguard/plugin-ai`) ⭐⭐⭐⭐⭐

❌ Not started. Deferred until fundamentals and adoption improve.

---

## Product-quality backlog

### Package README standardization — high priority after PII DX

Definition of Done:

- every published package has a useful README;
- use `@textguard/plugin-pii` README as the structural/quality reference;
- installation, basic usage, API surface, examples, behavior/limitations, and related packages are clear where relevant;
- examples match current exports/API;
- no package ships an empty README.

`@textguard/core` README was corrected as part of M5.6 because Explain is a new public API. The repository-wide README pass remains a separate milestone.

### Arabic language parity — lower priority

`@textguard/plugin-ar` should eventually reach the Persian/English quality bar: real dictionaries/rules, tests, useful README, and explicit supported behavior. It remains intentionally below PII DX and README standardization.

### Other technical debt still tracked

- `packages/presets/` versus `packages/all/src/presets/` ownership/duplication.
- ADR-001 documented renderer/API shape versus actual implementation.
- overlap ranking remains order-dependent in some equal-span/equal-length cases; Debug now makes the decision observable but does not change ranking semantics.
- HTML Debug renderer remains missing.

---

## Current product-quality focus

**usable PII integration in real consumer repos → strong npm/package documentation → adoption feedback.**

Only after those are stable should the roadmap expand aggressively into secrets presets, IDE/browser integrations, benchmarking, or AI features.

---

## Beyond TextGuard

Guard Ecosystem (SchemaGuard, ApiGuard, ConfigGuard, FormGuard, GitGuard) remains vision-only. Defer it until TextGuard demonstrates stronger usage and product fit.
