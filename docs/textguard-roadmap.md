# TextGuard Roadmap — Verified Status

> Status below is checked against actual source code and external consumer evidence. Use this alongside `TEXTGUARD-PROJECT.md`, `PRODUCT-GROWTH-PLAN.md`, `ADOPTION-VALIDATION.md`, and the stable wider-product vision in `GUARD-ECOSYSTEM.md`.

Legend: ✅ Done · 🟡 Partial / in progress · ❌ Not started · ⏸️ Evidence-gated

---

## Current position

TextGuard's integration/release foundation is complete for the present architecture. The original external consumer-validation matrix is green, corrected npm releases are published, and the public Playground is deployed at `https://ashkanahmady.github.io/textguard/`.

Real usage of that public Playground immediately produced new evidence: detection bypasses, a false positive, incorrect Explain source attribution, excessive Debug event noise, and unclear preset/default wording. A dedicated adversarial pass in `textguard-consumer-validation` reproduced those issues and expanded them into a broader quality matrix.

The active phase is therefore **Quality Hardening / Adversarial Validation / Benchmarking before broad promotion**. Launch Surface work is temporarily paused, not abandoned. The operating rule remains: **validate what exists → fix demonstrated quality pain → make it easy to try → promote it → measure real usage → build only evidence-backed improvements.**

---

## Near-term execution order

1. **Release hardening — ✅ complete.** Safe Changesets planning, bounded npm candidate checks, release docs, canonical package taxonomy, branch protection, and Marketplace packaging hardening are in place.
2. **Core/language/detection foundation — ✅ complete for the current architecture.** Persian, English, Arabic, structured-data detectors, Debug, Explain, and overlap determinism are implemented for the current milestone.
3. **PII open-source consumer DX — ✅ complete through M0.6.** Local commit protection, CI scanning, policy/configuration, reporting, setup, and external E2E validation exist.
4. **Developer integration slice — ✅ complete for the current milestone.** CLI, public VS Code extension, and browser Playground are shipped for their current scopes.
5. **Original comprehensive consumer validation — ✅ integration-green.** Published packages, CLI, PII, browser/Vite, VS Code and Playground deployment all pass the original 12-phase matrix.
6. **Quality Hardening / adversarial validation — 🟡 current.** Treat real Playground findings as product evidence. Expand hostile-input and false-positive testing across normalization, languages, detectors, Explain, Debug, CLI/browser/editor parity, ranges, overlaps and stress workloads.
7. **Performance benchmark baseline — 🟡 current.** Maintain a reproducible internal benchmark for `filter()`, `explain()` and `debug()` at representative input sizes. Benchmarking is an engineering quality gate, not a new public API/package or performance SLA.
8. **Evidence-backed quality fixes — 🟡 next/current in slices.** Fix only reproduced defects/gaps with regression tests and backward-compatible designs. Avoid speculative feature expansion while this gate is red.
9. **Quality checkpoint release + external revalidation — ❌ after fixes.** Publish only affected packages, rerun the complete consumer + adversarial matrix against npm artifacts, compare benchmarks, and torture-test the deployed Playground.
10. **Lightweight launch surface — ⏸️ paused until quality gate is green.** README and Playground exist. Resume positioning/install/examples/feedback polish once the quality checkpoint is accepted.
11. **Developer distribution — ❌ after launch-surface polish.** Promote through technical content and developer communities rather than paid advertising first.
12. **Adoption validation — 🟡 infrastructure complete, real evidence now beginning.** Playground findings are already valid qualitative evidence; continue issue #65, package trends, Marketplace signals and direct developer conversations after promotion resumes.
13. **Evidence-driven roadmap reassessment — 🟡 standing process.** Select later product features only from repeated/high-impact evidence.
14. **Monetization / paid team capability — ⏸️ evidence-gated.** Billing, SaaS, organization features and paid capabilities remain deferred until repeated commercial demand exists.
15. **Guard Ecosystem expansion — ⏸️ evidence-gated.** Additional Guard products remain vision-stage until TextGuard demonstrates durable adoption or a validated revenue path.

---

## Quality Hardening milestone

### Why this milestone exists

The original consumer-validation project correctly proved installability, API integration and cross-surface execution. It did not claim adversarial moderation robustness or mature Debug/Explain UX. Manual testing of the deployed Playground exposed a second quality layer that must be addressed before broad distribution.

Current reproduced findings include:

- invisible Unicode format controls can bypass known English, Persian and Arabic dictionary terms;
- compatibility/full-width and common leetspeak variants can bypass tested English profanity;
- `Scunthorpe is a town in England` is falsely flagged, proving a substring-boundary precision problem;
- Explain attributes tested email/phone matches to a generic dictionary source instead of their structured detector;
- a five-token realistic input produces roughly 794 raw Debug events;
- Playground presents `strict` as the default user-facing preset label, which is implementation-oriented and unclear for a new developer.

### Adversarial validation scope

The external `textguard-consumer-validation` repository is the executable quality gate and must test published artifacts directly. Its quality matrix covers:

- Unicode format controls, compatibility forms, normalization and RTL/LTR mixtures;
- profanity obfuscation: spacing, punctuation, repetition, invisible characters and bounded leetspeak;
- false positives and multilingual boundary semantics;
- valid/invalid/boundary cases for Email, URL, Phone, IP, UUID, Credit Card and IBAN;
- match ranges and overlap determinism after normalization;
- plugin ordering, duplicate registration and late registration;
- Explain/filter parity and truthful detector attribution;
- Debug timeline signal-to-noise and deterministic ordering;
- CLI, browser, Playground, VS Code and PII parity where applicable;
- stress inputs, high match density and large-input behavior.

### Benchmarking

Benchmarking is now part of engineering quality control. It is intentionally **not** a public TextGuard feature or API.

Required baseline dimensions:

- `filter()` latency/throughput;
- `explain()` latency/throughput;
- `debug().report()` latency/throughput and event volume;
- representative 1 KB, 10 KB and 100 KB inputs, with larger cases when useful;
- median and p95 measurements after warmup;
- comparison before/after normalization, matcher or Debug architecture changes.

Shared CI hardware is noisy. Tiny timing differences do not fail a release; meaningful repeated regressions require investigation.

### Architectural guardrails

Quality fixes must preserve the current library architecture and public compatibility:

- normalization changes must preserve correct original-input `Match.start/end` mapping;
- do not use naive ASCII-only word boundaries for multilingual matching;
- do not globally map leetspeak characters without false-positive regression coverage;
- do not rename `strictPreset` as a breaking API change merely to improve Playground wording; prefer a clearer UI label first and use aliases/deprecation only if an API rename is later justified;
- do not discard public Debug diagnostics blindly; prefer explicit aggregation/verbosity semantics if raw events are part of the contract;
- Explain must describe the actual winning rule/plugin from the same execution path rather than inventing a second detection model.

### Exit criteria

Quality Hardening is complete when:

- high-impact reproduced bypasses and false positives have regression coverage and an explicit disposition;
- Explain source attribution is trustworthy for dictionaries and structured detectors;
- Debug output is useful at normal scale and benchmarked at larger scale;
- benchmark baselines exist and material performance regressions have been reviewed;
- original integration validation remains green;
- corrected published npm artifacts pass the complete consumer + adversarial matrix;
- the deployed Playground is manually torture-tested again;
- any intentionally unsupported obfuscation/limitation is documented honestly before promotion.

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
| M4 — Performance Diagnostics | 🟡 implemented; quality-hardening active | Performance diagnostics exist, but current adversarial evidence shows raw Debug event volume and runtime need a signal-to-noise review. |
| M5 — Explain API | 🟡 implemented; attribution fix required | Structured Explain exists, but structured detector source attribution is currently reproduced as incorrect under the strict preset. |
| M6 — Future Integrations | 🟡 Partial / evidence-gated | CLI, VS Code and Playground are complete for current scope. Chrome, AI and framework adapters remain evidence-gated. |

---

## Consumer validation status

The original 12-phase integration matrix is still green for the published baseline (`@textguard/all@1.1.2`, `@textguard/cli@0.2.1`, and the other pinned public packages). That evidence remains valid.

The new adversarial quality gate intentionally turns the overall promotion decision back to **PAUSED** until the reproduced quality findings are fixed or explicitly accepted. Integration-green is not equivalent to quality-complete.

The authoritative executable matrix and benchmark evidence live in `textguard-consumer-validation` (`REPORT.md` and `QUALITY-HARDENING-MATRIX.md`).

---

## Launch / distribution plan

Broad promotion is temporarily paused while Quality Hardening is active. Once the hardening checkpoint is green, resume this sequence:

1. GitHub repository and npm package pages — clear positioning, examples, Playground and feedback entry points.
2. Technical articles — real problems such as PII in commits, multilingual moderation, Debug/Explain and structured-data detection.
3. Relevant Reddit communities — technical/value-first posts, not promotion-only spam.
4. Hacker News / Show HN — after the product remains easy to try and the quality gate is green.
5. DEV Community and similar developer publishing channels.
6. Product Hunt — secondary discovery channel.
7. LinkedIn/X — demo-driven build-in-public content and real developer use cases.

Paid advertising remains low priority until organic messaging and use cases are understood.

---

## Adoption measurement and learning

Issue #65 remains the canonical qualitative signal log and `docs/ADOPTION-VALIDATION.md` defines the promotion rule. Manual public-Playground findings count as real product evidence and are why Quality Hardening is now an active milestone.

Measure signals together: npm trends, Marketplace changes, GitHub issues, Playground feedback, direct developer conversations, false-positive/false-negative reports and repeated integration/API requests. Do not add invasive runtime telemetry to Core.

---

## Evidence-gated feature candidates

Chrome/browser extension, AI-assisted integrations, framework adapters, new detectors/languages, richer CI integrations, organization policies, centralized reports, team administration, billing/SaaS and additional Guard products remain **uncommitted** until evidence justifies them.

Quality Hardening and benchmarking are different: they protect already-shipped behavior and therefore do not violate the no-speculative-feature rule.

---

## Current product-quality focus

**Expand the adversarial matrix → fix reproduced quality defects in reviewable slices → benchmark before/after sensitive changes → release affected packages → rerun published consumer + adversarial validation → torture-test the public Playground → resume Launch Surface → developer distribution → adoption evidence → next feature only from repeated pain.**
