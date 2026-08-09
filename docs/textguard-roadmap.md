# TextGuard Roadmap — Verified Status

> Status below is checked against actual source code. Use this alongside `TEXTGUARD-PROJECT.md`.

Legend: ✅ Done · 🟡 Partial / in progress · ❌ Not started

---

## Near-term execution order

1. **Package README standardization — ✅ complete.**
2. **Arabic language parity — 🟡 in progress.** AR1 is merged. AR2 now audits normalization and expands high-confidence vocabulary in one reviewable slice.
3. **Adoption feedback / next roadmap reassessment.** Use real package usage and feedback before expanding into broader integrations or paid features.

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

### Arabic language parity — 🟡 in progress

| Slice | Status | Scope |
| --- | --- | --- |
| AR1 — usable dictionary baseline | ✅ Done | Conservative profanity + insult dictionaries, populated `arDictionary`/`arPack`, public API tests, README, and release metadata. |
| AR2 — normalization + coverage hardening | 🟡 Current PR | Audit the existing Core normalizer, add diacritic/Alef-Maqsura coverage, expand common high-confidence profanity/insults, and add benign regression cases. |
| AR3 — dialect/coverage expansion | ❌ Later | Expand dialect-specific vocabulary only with evidence and false-positive tests; evaluate spam/pattern resources separately. |
| AR4 — bundle/preset parity | ❌ Later | Decide when Arabic should join higher-level presets/bundles after quality is sufficient. |

Arabic profanity coverage is intentionally not treated as a finite “complete list”; dialect and spelling variation require incremental, tested expansion.

### Other technical debt

- `packages/presets/` versus `packages/all/src/presets/` ownership/duplication.
- ADR-001 renderer/API documentation drift.
- overlap ranking remains order-dependent in some ties.
- HTML Debug renderer remains missing.

---

## Current product-quality focus

**Arabic parity → adoption feedback → roadmap reassessment.**
