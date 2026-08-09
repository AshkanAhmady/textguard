# TextGuard Roadmap — Verified Status

> Status below is checked against actual source code. Use this alongside `TEXTGUARD-PROJECT.md`.

Legend: ✅ Done · 🟡 Partial / in progress · ❌ Not started

---

## Near-term execution order

1. **Package README standardization — ✅ complete.** Root README and every published package README have been reviewed and aligned with the current public surface.
2. **Arabic language parity — next, lower priority feature work.** Bring `@textguard/plugin-ar` from its published foundation state toward the Persian/English quality bar.
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

### Package README standardization — ✅ complete

- ✅ root README replaced;
- ✅ published-package audit completed in `docs/PACKAGE-README-AUDIT.md`;
- ✅ `@textguard/all` README rewritten;
- ✅ Persian and English READMEs corrected;
- ✅ Phone, IP, UUID, Credit Card, and IBAN READMEs corrected;
- ✅ Email and URL READMEs standardized;
- ✅ Arabic README aligned with its actual foundation-only implementation;
- ✅ final consistency check completed across Core, PII, All, language, and detection packages.

Future public API/behavior changes must continue updating affected READMEs in the same PR.

### Arabic language parity — next

`@textguard/plugin-ar` is currently a published foundation: `arDictionary` has no words and `arPack` is empty. The next feature milestone should define and implement a conservative Arabic parity scope without disturbing Core architecture or existing package APIs.

### Other technical debt

- `packages/presets/` versus `packages/all/src/presets/` ownership/duplication.
- ADR-001 renderer/API documentation drift.
- overlap ranking remains order-dependent in some ties.
- HTML Debug renderer remains missing.

---

## Current product-quality focus

**Arabic parity → adoption feedback → roadmap reassessment.**
