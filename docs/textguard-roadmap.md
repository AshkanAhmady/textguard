# TextGuard Roadmap — Verified Status

> Status below was checked against actual source code (not the older planning docs, which describe intent rather than current reality). Use this alongside `TEXTGUARD-PROJECT.md`. Ordering of "Not Started" items is left to the maintainer, except Epic 0, which has an explicit commercial-priority decision behind it (see below).

Legend: ✅ Done &nbsp; 🟡 Partial &nbsp; ❌ Not started

---

## Phases 1–6 — Foundation through Developer Experience

All verified as substantially complete based on repo structure and published packages:

- ✅ Monorepo setup (pnpm workspace, Turborepo, Changesets)
- ✅ Core engine (`createFilter`, rule engine, dictionary engine, plugin engine, pipeline)
- ✅ Official language plugins: Persian, English (Arabic is thin — see below)
- ✅ Official detection plugins: Email, URL, Phone, IP, UUID, Credit Card, IBAN
- ✅ `@textguard/all` bundle package with presets, tree-shaking (ESM/CJS via tsup)
- ✅ Tests present for all plugins (13 test files); coverage tooling configured
- ✅ npm releases live for core, en, fa, ar, all detection plugins, and `@textguard/all` (all at v1.0.1)

**Caveat:** 🟡 Arabic (`@textguard/plugin-ar`) is published but functionally thin — a single `index.ts`, no dictionaries/rules/tests found. If "Phase 3 complete" implies parity across fa/en/ar, it isn't there yet for Arabic.

**Correction:** ❌ No `.github/workflows` existed anywhere in the repo prior to M0.4 below, despite older planning docs listing "GitHub Actions" as done in Phase 5. There was no automated test/lint run on push or PR until the PII Scan workflow was added.

---

## Phase 7 — Advanced Features

### Epic 0 — PII / Compliance CI Guard ⭐⭐⭐⭐⭐ (commercial priority — confirmed)

**Status: 🟡 In progress — M0.1–M0.4 done, M0.5–M0.6 remain.** Added after deciding this is the most direct path to a paying feature: it reuses existing, tested detection plugins (email, phone, credit card, IBAN) instead of requiring new detection logic, and targets a real, expensive problem (PII leaking into commits, logs, or production) that companies already pay to prevent under GDPR/PCI-DSS.

**Naming (decided):** `@textguard/plugin-pii`. Distinct from `enterprisePreset` in `@textguard/all`, which remains an unrelated bundle (language dictionaries + general PII plugins).

Milestones:

| Milestone                   | Status         | Detail                                                                                                                                                                                                                                                                                                                                     |
| --------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| M0.1 — Scope & Naming       | ✅ Done        | Package name: `@textguard/plugin-pii`. v1 scope: email, phone, credit card, IBAN (UUID excluded).                                                                                                                                                                                                                                          |
| M0.2 — Scan Core            | ✅ Done        | `packages/plugins/pii/` created: `piiPreset` (composes the four existing detection plugins) + `scanText()`/`scanMany()` built on `filter.findBadWords()`. Tests written. Ships as v0.1.0 — not yet published to npm.                                                                                                                       |
| M0.3 — Pre-commit Hook Mode | ✅ Done        | `textguard-pii` CLI added to `packages/plugins/pii/src/cli.ts`, wired into the repo's `.husky/pre-commit` (runs after `lint-staged`/`pnpm lint`, blocks commit on any PII finding). Added `set -e` to the hook so any step failing actually blocks the commit — this wasn't guaranteed before (only the last command's exit code counted). |
| M0.4 — GitHub Action Mode   | ✅ Done        | `.github/workflows/pii-scan.yml` — first CI workflow in this repo (there wasn't one, despite older docs listing "GitHub Actions" as done in Phase 5). Runs on every PR, diffs base..head, scans changed files via a new `src/ci.ts` entry, fails the check with inline annotations on any PII finding.                                     |
| M0.5 — Reporting Output     | ❌ Not started | Console/Markdown report for v1 — reuse the existing `ConsoleRenderer`/`MarkdownRenderer` rather than building new output formatting. No dashboard yet.                                                                                                                                                                                     |
| M0.6 — Paid Tier (later)    | ❌ Not started | Multi-repo/org dashboard, historical reporting, alerting — only after M0.1–M0.5 validate with real usage. This is the actual monetizable layer; M0.1–M0.5 is the free/open-source foundation it sits on.                                                                                                                                   |

**Dependency to sequence around:** the quality of M0.2's findings (why this matched, how to fix it) improves a lot once Epic 1 / M5 (Explain API) exists. Worth building Explain API either just before or alongside this epic rather than long after.

### Epic 1 — Debug Engine ⭐⭐⭐⭐⭐

| Milestone                                                                   | Status         | Detail                                                                                                                |
| --------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------- |
| M1 — Debug Foundation                                                       | ✅ Done        | `DebugSession`, `DebugEvent` types, `DebugCollector`, `filter.debug()` all implemented and wired into `createEngine`. |
| M2 — Renderers                                                              | 🟡 Partial     | Console ✅, Markdown ✅, JSON ✅. **HTML renderer ❌ not built.**                                                     |
| M3 — Timeline                                                               | ✅ Done        | `TimelineBuilder` + `Timeline` model implemented.                                                                     |
| M4 — Performance Diagnostics                                                | ✅ Done        | `PerformanceBuilder` + `PerformanceReport` implemented, exposed via `session.performance()`.                          |
| M5 — Explain API                                                            | ❌ Not started | No `explain()` method or module found anywhere in `core/src`.                                                         |
| M6 — Future Integrations (VS Code / Chrome / CLI / Website Playground / AI) | ❌ Not started | Expected — these are meant to consume the Debug Engine once finished.                                                 |

**Real state of Epic 1: further along than the planning docs suggest for M1/M3/M4, but M2 is incomplete and M5 hasn't begun.** This is probably the most valuable epic to finish before moving on, since ADR-001 explicitly designs everything else (Explain API, future tools) to depend on it.

### Epic 2 — Enterprise Preset (secrets/JWT/API keys/tokens/wallets/SSH keys) ⭐⭐⭐⭐

❌ **Not started.** No plugin in the codebase detects any of these. Note: the name "enterprisePreset" is already used in `@textguard/all` for something unrelated (a bundle of language + PII plugins) — will need a naming decision before this epic starts.

### Epic 3 — Benchmark Suite ⭐⭐⭐

❌ Not started. No benchmark scripts or comparison infrastructure found.

### Epic 4 — VS Code Extension ⭐⭐⭐⭐

❌ Not started. Depends on Debug Engine (Epic 1) per ADR-001.

### Epic 5 — Chrome Extension ⭐⭐⭐

❌ Not started. Depends on Debug Engine (Epic 1).

### Epic 6 — AI Platform (`@textguard/plugin-ai`) ⭐⭐⭐⭐⭐

❌ Not started — consistent with the decision to pause the wider AI/ecosystem vision and focus on TextGuard fundamentals first.

---

## Items Not on the Original Roadmap But Found During Review

Not new scope — these are fixes/cleanup surfaced by reading the actual code (full detail in `TEXTGUARD-PROJECT.md` §7):

- Published npm READMEs (core, en, fa) show an API that doesn't match the shipped code.
- `@textguard/all` has no README at all.
- Production code logs to console unconditionally on every `createFilter()` call.
- An unused `future/` folder exists in core (dead scaffolding, not imported anywhere).
- `packages/presets/` and `packages/all/src/presets/` may be redundant with each other.
- ADR-001's documented Debug API (`debug.toJSON()` etc.) doesn't match what was actually built (`session.report()` + separate renderer classes).

---

## Suggested Definition of Done (per original vision doc)

TextGuard is considered "Phase 7 complete" when PII/Compliance CI Guard, Debug Engine, Explain API, Enterprise (secrets) Preset, Benchmark Suite, VS Code Extension, Chrome Extension, and AI Platform are all finished. At current verified state, of those eight: **one is mostly done (Debug Engine), one has a concrete near-term plan and confirmed commercial intent (PII/Compliance CI Guard), one is fully missing its most commercially relevant piece (Explain API), and five haven't started.** Worth treating this as a very long-range definition rather than a near-term target — realistically each remaining un-started epic is its own multi-week-to-multi-month effort at evenings/weekends pace. Realistically, near-term effort should concentrate on Epic 0 and finishing Explain API (Epic 1 / M5) — the rest can stay dormant until those two prove the product can make money.

---

## Beyond TextGuard

Guard Ecosystem (SchemaGuard, ApiGuard, ConfigGuard, FormGuard, GitGuard) remains vision-only — no code exists for any of them. Consistent with the earlier decision to defer this until TextGuard itself is validated.
