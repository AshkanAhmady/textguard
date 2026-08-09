# TextGuard Roadmap — Verified Status

> Status below is checked against actual source code. Use this alongside `TEXTGUARD-PROJECT.md`.

Legend: ✅ Done · 🟡 Partial / in progress · ❌ Not started

---

## Near-term execution order

1. **Package README standardization.** Root README, package audit, `@textguard/all`, Persian/English, all detection READMEs, and Arabic README consistency are complete; only the final package-wide consistency pass remains.
2. **Arabic language parity — lower priority.** Complete `@textguard/plugin-ar` after README cleanup.
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
| M0.6 — Consumer Setup / DX | ✅ Done | Copy/paste setup, `init`, shared config (`allowlist`, `ignorePaths`, suppressions), executable consumer example, and packaged external E2E validation are complete. |
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

### Package README standardization — current high priority

- ✅ root README replaced;
- ✅ published-package audit completed in `docs/PACKAGE-README-AUDIT.md`;
- ✅ `@textguard/all` README rewritten;
- ✅ Persian and English READMEs corrected;
- ✅ P0 detector READMEs corrected — Phone, IP, UUID, Credit Card, IBAN;
- ✅ P1 detector READMEs standardized — Email and URL;
- ✅ Arabic README now matches the actual foundation-only implementation state;
- 🟡 next: final package-wide consistency pass;
- every published package needs a useful README;
- examples must match current APIs and remain simple for normal npm consumers.

### Arabic language parity — lower priority

`@textguard/plugin-ar` is currently a published foundation: `arDictionary` has no words and `arPack` is empty. Bring it to the Persian/English quality bar only after README standardization is closed.

### Other technical debt

- `packages/presets/` versus `packages/all/src/presets/` ownership/duplication.
- ADR-001 renderer/API documentation drift.
- overlap ranking remains order-dependent in some ties.
- HTML Debug renderer remains missing.

---

## Current product-quality focus

**finish README consistency → Arabic parity → adoption feedback.**
