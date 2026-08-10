# TextGuard Roadmap — Verified Status

> Status below is checked against actual source code. Use this alongside `TEXTGUARD-PROJECT.md`.

Legend: ✅ Done · 🟡 Partial / in progress · ❌ Not started

---

## Near-term execution order

1. **Release hardening — 🟡 current PR.** Restore the intended pending release state, reduce unnecessary Changesets propagation, add release preview/publish guards, and document the safe npm flow.
2. **Publish pending AR1/AR2 package releases safely.** Review the release plan and candidate list before publishing.
3. **Arabic language parity — 🟡 in progress.** AR1 and AR2 are merged; AR3 dialect coverage slice 1 remains open separately in PR #22.
4. **Adoption feedback / roadmap reassessment.** Use external package usage and feedback before expanding broader feature scope.

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
| AR2 — normalization + coverage hardening | ✅ Done | Existing Arabic normalization audited/hardened, diacritic/Alef-Maqsura coverage added, vocabulary expanded, and benign regression cases added. |
| AR3 — dialect/coverage expansion slice 1 | 🟡 Open PR #22 | Small high-confidence dialect additions with public API and benign regression tests. Keep separate from release hardening. |
| AR4 — bundle/preset parity | ❌ Later | Decide when Arabic should join higher-level presets/bundles after quality is sufficient. |

Arabic profanity coverage is intentionally not treated as a finite “complete list”; dialect and spelling variation require incremental, tested expansion.

### Release safety — 🟡 current hardening

- never run root `npm publish`;
- preview Changesets with `pnpm release:plan` before versioning;
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

**safe release flow → Arabic parity → adoption feedback → roadmap reassessment.**
