# TextGuard Roadmap — Verified Status

> Status below is checked against actual source code. Use this alongside `TEXTGUARD-PROJECT.md`.

Legend: ✅ Done · 🟡 Partial / in progress · ❌ Not started

---

## Near-term execution order

1. **PII consumer integration / DX hardening.** Current focus. Consumer init and policy configuration are merged; external validation now runs through the executable `examples/pii-consumer` walkthrough; final public docs follow.
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
| M0.3 — Pre-commit Hook Mode | 🟡 Partial | Scanner blocks commits; `init` wires consumer hooks and shared policy configuration is merged. |
| M0.4 — GitHub Action Mode | 🟡 Partial | CI scanner exists; consumer workflow setup and shared policy configuration are merged. |
| M0.5 — Reporting Output | ✅ Done | Console/markdown reporting exists. |
| M0.6 — Consumer Setup / DX | 🟡 In progress | `npx textguard-pii init` and `textguard-pii.config.json` policy are merged. Current step validates the packaged consumer flow through `examples/pii-consumer`, including real commit blocking, allowlist/ignore behavior, and CI pass/fail. Final public docs follow after E2E is green. |
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
