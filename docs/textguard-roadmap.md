# TextGuard Roadmap — Verified Status

> Status below is checked against actual source code. Use this alongside `TEXTGUARD-PROJECT.md`, `PRODUCT-GROWTH-PLAN.md`, `ADOPTION-VALIDATION.md`, and the stable wider-product vision in `GUARD-ECOSYSTEM.md`.

Legend: ✅ Done · 🟡 Partial / in progress · ❌ Not started · ⏸️ Evidence-gated

---

## Current position

TextGuard's current engineering foundation is complete for the present architecture. The comprehensive external consumer-validation matrix is now **green**, the corrective npm releases are published, and the public Playground is deployed successfully through GitHub Pages.

The product is now entering the **lightweight Launch Surface** phase. The operating rule from this point is: **make it easy to understand and try → promote it → measure real usage → collect feedback → build only evidence-backed improvements.**

Public Playground: `https://ashkanahmady.github.io/textguard/`

---

## Near-term execution order

1. **Release hardening — ✅ complete.** Safe Changesets planning, bounded npm candidate checks, release docs, canonical package taxonomy, branch protection, and Marketplace packaging hardening are in place.
2. **Core/language/detection foundation — ✅ complete for the current architecture.** Persian, English, Arabic parity, structured-data detectors, Debug, Explain, and overlap determinism are implemented for the current milestone.
3. **PII open-source consumer DX — ✅ complete through M0.6.** Local commit protection, CI scanning, policy/configuration, reporting, setup, and external E2E validation exist.
4. **Developer integration slice — ✅ complete for the current milestone.** CLI, public VS Code extension, and browser Playground are shipped for their current scopes.
5. **Documentation truth reconciliation — ✅ complete for the launch-readiness checkpoint.** Project/Roadmap docs reflect the final corrective release baseline, green validation state, and deployed Playground.
6. **Comprehensive consumer validation project — ✅ green for the current published surface.** The external `textguard-consumer-validation` repository exercises packages/presets, detectors, languages, Debug/Explain, PII workflow, CLI, browser/Vite, Marketplace VSIX plus a real VS Code extension host, and Playground deployment behavior.
7. **Launch-blocker cleanup — ✅ complete.** The `@textguard/all` runtime export defect, CLI version metadata defect, declaration-bundle regression, and Pages configuration blocker are fixed and externally revalidated.
8. **Stable release checkpoint — ✅ complete.** `@textguard/all@1.1.2` and `@textguard/cli@0.2.1` are published as the corrected release baseline and the external matrix passes against published artifacts.
9. **Lightweight launch surface — 🟡 current.** README and Playground exist. Before broad promotion, make the product immediately understandable with concise positioning, install path, core capabilities, Playground, GitHub/npm/Marketplace links, and a clear feedback entry point. No auth/billing/dashboard is needed.
10. **Developer distribution — ❌ next after launch-surface polish.** Promote through technical content and developer communities rather than paid advertising first.
11. **Adoption validation — 🟡 infrastructure complete, real evidence still early.** Gather real consumer signals through issue #65, package usage trends, Marketplace data, optional feedback/survey responses, and direct early-user conversations.
12. **Evidence-driven roadmap reassessment — 🟡 standing process.** Select the next product milestone only when repeated or high-impact evidence identifies a developer problem worth solving.
13. **Monetization / paid team capability — ⏸️ evidence-gated.** Billing, SaaS, organization features, and AI-assisted paid capabilities remain deferred until repeated commercial demand exists.
14. **Guard Ecosystem expansion — ⏸️ evidence-gated.** Additional Guard products remain vision-stage until TextGuard demonstrates durable adoption or a validated path to revenue.

---

## Phase 7 — Advanced Features

### Epic 0 — PII / Compliance CI Guard ⭐⭐⭐⭐⭐

**Status: ✅ Open-source consumer DX complete through M0.6. M0.7 remains intentionally evidence-gated.**

| Milestone | Status | Detail |
| --- | --- | --- |
| M0.1 — Scope & Naming | ✅ Done | `@textguard/plugin-pii`; email, phone, credit card, IBAN. |
| M0.2 — Scan Core | ✅ Done | `piiPreset`, `scanText()` and `scanMany()` implemented. |
| M0.3 — Pre-commit Hook Mode | ✅ Done | Scanner blocks real commits; `npx textguard-pii init` wires Husky safely and shared policy configuration is enforced. |
| M0.4 — GitHub Action Mode | ✅ Done | CI scanner and generated consumer workflow exist; packaged E2E verifies CI pass/fail behavior using the shared policy. |
| M0.5 — Reporting Output | ✅ Done | Console/markdown reporting exists. |
| M0.6 — Consumer Setup / DX | ✅ Done | Copy/paste setup, `init`, shared config, executable consumer example, and packaged external E2E validation are complete. |
| M0.7 — Paid Tier | ⏸️ Evidence-gated | Start only after open-source usage validates repeated team/organization demand. |

### Epic 1 — Debug Engine ⭐⭐⭐⭐⭐

| Milestone | Status | Detail |
| --- | --- | --- |
| M1 — Debug Foundation | ✅ Done | `DebugSession`, events, collector, `filter.debug()`. |
| M2 — Renderers | ✅ Done | Console, JSON, Markdown, and HTML renderers are implemented and publicly exported. |
| M3 — Timeline | ✅ Done | Timeline implemented. |
| M4 — Performance Diagnostics | ✅ Done | Performance diagnostics implemented. |
| M5 — Explain API | ✅ Done | Structured Explain domain, builder, public `filter.explain(text)`, tests and public core docs complete. |
| M6 — Future Integrations | 🟡 Partial / evidence-gated | CLI, VS Code, and Playground are complete for current scope. Chrome, AI, framework adapters, and other integrations are candidates only when adoption evidence justifies them. |

---

## Pre-launch validation checklist

The dedicated external consumer-style validation project has evaluated the current published TextGuard surface as an external developer experiences it, rather than only exercising monorepo source packages.

Required validation areas:

- install published packages into a fresh consumer project;
- use `@textguard/all` presets through documented public APIs;
- verify Persian, English, and Arabic moderation behavior;
- verify Email, URL, Phone, IP, UUID, Credit Card, and IBAN detectors;
- verify masking/filter output and match ranges;
- verify Debug session, timeline, diagnostics, and all public renderer formats;
- verify Explain output/source/reason data;
- verify PII scanning, allowlists/configuration, pre-commit initialization, and CI-oriented behavior;
- verify CLI inline/stdin/file/batch inputs, JSON output, Debug/Explain modes, and exit codes;
- verify VS Code extension package/install and key user flows;
- verify Playground production build and deployed public site;
- compare documentation examples against actual consumer behavior;
- record every failure as either launch-blocking, documentation/DX, or non-blocking follow-up.

Current validation result: **GREEN / GO**. All 12 defined phases pass against the corrected published release baseline. `@textguard/all@1.1.2` passes runtime and strict TypeScript consumer validation, `@textguard/cli@0.2.1` passes the complete CLI harness, and the Playground deploys successfully to GitHub Pages.

Exit criterion: **met** for the current published surface.

---

## Launch / distribution plan

Consumer validation and launch-blocker cleanup are complete. Shift engineering capacity toward launch-surface clarity and distribution.

Priority channels:

1. GitHub repository and npm package pages — clear positioning, examples, Playground, and feedback entry points.
2. Technical articles — explain real problems TextGuard solves, such as PII in commits, multilingual moderation, Debug/Explain, or structured-data detection.
3. Relevant Reddit communities — technical/value-first posts, not promotion-only spam.
4. Hacker News / Show HN — the product can now be tried quickly and the validation project is green.
5. DEV Community and similar developer publishing channels.
6. Product Hunt — secondary discovery/launch channel, not the primary source of technical validation.
7. LinkedIn/X — demo-driven build-in-public content and real developer use cases.

Paid advertising is not a priority until organic developer messaging and use cases are understood.

---

## Adoption measurement and learning

Issue #65 is the canonical qualitative signal log and `docs/ADOPTION-VALIDATION.md` defines the promotion rule.

Measure signals together:

- npm download trends by package;
- VS Code Marketplace install/rating changes;
- GitHub issues, feature requests, DX friction, detection-quality reports, and discussions;
- Playground usage when measurable;
- optional feedback/survey responses asking what workflow the developer is solving;
- repeated integration/API/detector/language requests;
- direct conversations with early adopters.

**Important:** npm download counts cannot explain why someone installed the package. Learn motivation through explicit, privacy-respecting feedback mechanisms. Do not add invasive runtime telemetry to Core. Website/Playground analytics may be considered later if clearly documented and kept separate from library runtime behavior.

Directional product checkpoints: first 10 real users → 50 users → 100 recurring users → broader monthly usage. Retention, repeated workflows, and credible user problems matter more than GitHub stars alone.

---

## Evidence-gated feature candidates

These items are intentionally **not committed scope**. They become roadmap milestones only when real evidence justifies them:

- Chrome/browser extension;
- AI-assisted rewrite/review/provider integrations;
- framework-specific adapters;
- new detectors or language coverage;
- richer CI/repository integrations;
- shared organization policies/dictionaries;
- centralized reports and audit history;
- team administration;
- billing/subscriptions/SaaS dashboard;
- additional Guard products.

For each promoted candidate: document supporting evidence → define the user problem → define success criteria → implement the smallest maintainable solution → update roadmap/docs → release when coherent.

---

## Product-complete checkpoint for the current roadmap

The current TextGuard roadmap is considered product-complete when:

- documentation truth matches implementation;
- comprehensive consumer validation passes;
- launch-blocking defects are fixed;
- a stable release checkpoint is published when justified;
- README/landing/Playground make the product easy to understand and try;
- adoption measurement and feedback collection are operating;
- the next feature is selected from real evidence rather than speculative standing scope.

The first four conditions are now met. The current focus is launch-surface clarity, distribution, and adoption learning.

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

Further vocabulary work should be driven by real false negatives or user reports.

### Adoption validation — 🟡 current

Structured GitHub issue forms are the primary qualitative intake surface. Issue #65 is the living signal log. A single issue is evidence, not automatic roadmap priority.

### Release safety — ✅ hardened

- never run root `npm publish`;
- keep Changesets per public behavior/API change;
- batch normal npm releases across coherent milestones;
- preview Changesets with `pnpm release:plan`;
- review generated version/changelog diff;
- compare local public package versions with npm before publish;
- require explicit confirmation of the exact candidate count;
- protect `main` with PR-only changes and required CI checks;
- keep `docs/RELEASING.md` canonical.

### Engine correctness

- overlap ranking determinism — ✅ fixed and regression-tested.

### Other technical debt

- historical preset-ownership references to `packages/presets/` are stale; current ownership is under `packages/all`, and this alone should not trigger a refactor.

---

## Current product-quality focus

**Polish the lightweight launch surface → begin developer distribution → collect adoption evidence → identify repeated/high-impact developer pain → promote only that pain into the next implementation milestone → consider monetization only after repeated commercial/team demand.**
