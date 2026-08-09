# TextGuard Roadmap — Verified Status

> Status below is checked against actual source code. Use this alongside `TEXTGUARD-PROJECT.md`.

Legend: ✅ Done · 🟡 Partial / in progress · ❌ Not started

---

## Near-term execution order

1. **PII consumer integration / DX hardening.** Current focus. Consumer init and policy configuration are merged; external install/commit/CI validation is now in progress.
2. **Package README standardization.** Audit all published package READMEs using the PII README as the quality reference.
3. **Arabic language parity — lower priority.** Complete `@textguard/plugin-ar` after PII DX and README cleanup.

---

## Phase 7 — Advanced Features

### Epic 0 — PII / Compliance CI Guard ⭐⭐⭐⭐⭐

**Status: 🟡 Consumer DX hardening in progress.**

| Milestone | Status | Detail |
| --- | --- | --- |
| M0.1 — Scope & Naming | ✅ Done | `@textguard/plugin-pii`; email, phone, credit card, IBAN. |
| M0.2 — Scan Core | ✅ Done | `piiPreset`, `scanText()` and `scanMany()` implemented. |
| M0.3 — Pre-commit Hook Mode | 🟡 Partial | Scanner blocks commits and `init` wires consumer hooks; external commit validation is being automated in CI. |
| M0.4 — GitHub Action Mode | 🟡 Partial | CI scanner/workflow setup exists; external pass/fail validation is being automated in CI. |
| M0.5 — Reporting Output | ✅ Done | Console/markdown reporting exists. |
| M0.6 — Consumer Setup / DX | 🟡 In progress | `init` and shared policy configuration are merged. Current step packs and installs the package in a clean consumer fixture, verifies real commit blocking, allowlist/ignore behavior, and CI blocking. Final public-doc pass follows after E2E is green. |
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

### Package README standardization — high priority after PII DX

- every published package needs a useful README;
- use `@textguard/plugin-pii` as the structural/quality reference;
- examples must match current APIs;
- no empty README may ship.

### Arabic language parity — lower priority

Bring `@textguard/plugin-ar` to the Persian/English quality bar after PII DX and README standardization.

### Other technical debt

- `packages/presets/` versus `packages/all/src/presets/` ownership/duplication.
- ADR-001 renderer/API documentation drift.
- overlap ranking remains order-dependent in some ties.
- HTML Debug renderer remains missing.

---

## Current product-quality focus

**usable PII integration in real consumer repos → strong npm/package documentation → adoption feedback.**
