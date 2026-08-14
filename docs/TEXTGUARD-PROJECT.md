# TextGuard — Project Documentation

> Persistent ground-truth orientation for contributors and AI assistants. Implementation/tests are the runtime source of truth; `textguard-roadmap.md` is delivery-status truth; ADRs are architecture-decision truth; `GUARD-ECOSYSTEM.md` is stable product/business vision; `PRODUCT-GROWTH-PLAN.md` records the post-foundation product-growth sequence.

## 1. Product

TextGuard is an extensible TypeScript text-processing/detection engine. It supports profanity/language rules, structured-data detection, filtering/masking, Debug diagnostics, a structured Explain API, and a PII guard for local commits and pull-request CI.

Arabic implementation parity is complete for the current architecture. The comprehensive external consumer-validation matrix is green for the current published surface. The current product focus is now **lightweight launch-surface clarity, developer distribution, and adoption discovery** rather than additional speculative feature expansion.

## 2. Repository and architecture

The repository is a pnpm/Turborepo monorepo with Changesets, Vitest, Husky/lint-staged, CI, and a PII PR scan.

Key packages:

- `packages/core` → `@textguard/core`
- `packages/all` → `@textguard/all`
- language packages: `@textguard/fa`, `@textguard/en`, `@textguard/ar`
- detection plugins: Email, URL, Phone, IP, UUID, Credit Card, IBAN
- `packages/guards/pii` → `@textguard/plugin-pii`

Core remains plugin-oriented. Language packages use the shared `Dictionary` contract and normalization pipeline; no Arabic-specific Core API was introduced.

## 3. Current public core API

```ts
const filter = createFilter(options);

filter.hasBadWord(text: string): boolean;
filter.findBadWords(text: string): Match[];
filter.filter(text: string): FilterResult;
filter.debug(text: string): DebugSession;
filter.explain(text: string): ExplainResult;
filter.use(plugin: Plugin): void;
```

## 4. Debug and Explain architecture

- DebugSession stores original input, normalized input, final overlap-resolved matches, and events.
- Explain projects final accepted matches from the same debug-capable execution path.
- Explain does not introduce a second detection engine.
- The current public Debug renderer implementations are `ConsoleRenderer`, `JsonRenderer`, `MarkdownRenderer`, and `HtmlRenderer`.
- The renderer barrel exports all four implementations through the public Debug exports.
- overlap ranking determinism is covered by regression tests: equal-priority/equal-length winners remain stable across reversed plugin registration order, while lower numeric rule priority still wins equal-length overlaps.

## 5. Package state

### Language packages

- Persian: established/full relative to the current language architecture.
- English: established/full relative to the current language architecture.
- Arabic: AR1-AR4 provide baseline dictionaries, normalization hardening, high-confidence coverage, a first tested dialect slice, and inclusion in `strictPreset` / `enterprisePreset`.

### Structured-data detection

Email, URL, Phone, IP, UUID, Credit Card, and IBAN plugins exist. Credit Card uses Luhn validation and IBAN uses mod-97 validation.

### PII package

`@textguard/plugin-pii` provides strict scanning plus consumer policy for commits/CI. Consumer DX is complete through M0.6.

## 6. Completed milestone — PII Consumer DX Hardening

Consumer init, shared policy configuration, external E2E validation, and final public documentation are complete through M0.6. M0.7 remains intentionally later until usage validates demand.

## 7. Completed milestone — Package README standardization

The npm-facing documentation cleanup is complete. Public behavior/API changes must continue updating affected documentation in the same PR.

## 8. Completed milestone — Arabic implementation parity

Arabic parity was delivered incrementally and without a second language-specific Core path.

### AR1 — usable dictionary baseline — ✅ complete

- `arProfanity` and `arInsults` added;
- existing `arDictionary`, `arPack`, and `arLanguage` preserved;
- public `createFilter()` integration tests added;
- package README and release metadata updated.

### AR2 — normalization + coverage hardening — ✅ complete and released

- existing Core `ArabicNormalizer` audited instead of introducing a second normalization path;
- common Arabic diacritics removed before matching;
- Alef Maqsura normalized consistently;
- high-confidence profanity/insult coverage expanded;
- public regression coverage added for variants and benign Arabic text.

### AR3 — dialect coverage slice 1 — ✅ complete

AR3 added a small high-confidence dialect vocabulary slice while preserving the public API and conservative false-positive policy.

### AR4 — bundle/preset parity — ✅ complete

- `arDictionary` is included in `strictPreset` and `enterprisePreset`;
- Arabic moderation is verified through preset-level tests;
- `socialMediaPreset` remains unchanged because it is an unrelated placeholder;
- no Core changes or second Arabic configuration path were introduced.

Arabic vocabulary is not treated as a finite “complete list.” Further coverage work should be driven by real false negatives, user reports, or other evidence rather than permanent roadmap expansion.

## 9. Developer integrations

The current developer-integration milestone is complete:

- `@textguard/cli` provides scan, debug, explain, file/stdin input, batch scanning, JSON output, help/version metadata, and documented exit codes;
- the VS Code extension is publicly released and supports manual/scan-on-save diagnostics, presets, whitelist settings, and Explain quick fixes;
- the browser Playground supports presets, example scenarios, shareable URLs, Scan/Explain/Debug visualization, Enterprise detector controls, and a production Vite build;
- GitHub Pages is enabled with GitHub Actions as the deployment source, and the Playground deployment is operational at `https://ashkanahmady.github.io/textguard/`.

Future Chrome, AI, framework-specific, or other integrations are candidates only when adoption evidence justifies them.

## 10. Release safety and cadence

Release hardening is complete. The repository uses Changesets with release planning, explicit npm candidate checks, bounded registry lookup, canonical package taxonomy, and a documented procedure in `docs/RELEASING.md`.

The current published validation baseline includes `@textguard/core@1.1.0`, `@textguard/all@1.1.2`, `@textguard/cli@0.2.1`, `@textguard/plugin-pii@0.3.0`, `@textguard/ar@1.2.0`, `@textguard/en@1.0.2`, and `@textguard/fa@1.0.2`, with the direct detector packages at `1.0.2`.

The repository uses a **batched publishing cadence**: public behavior/API PRs still get Changesets, but npm publishing is normally deferred across several coherent milestones. Immediate publish is reserved for intentional stable checkpoints, consumer blockers, critical fixes, or independently valuable completed capabilities.

Never run `npm publish` from the repository root. Review the release plan and final npm candidate list before every publish.

## 11. Consumer validation and launch readiness

The external `textguard-consumer-validation` repository has evaluated all defined validation phases for the current public surface. The final matrix is **GREEN / GO**.

Passing external consumer execution covers:

- package installation/module resolution on Node 20 and 22;
- Core APIs, languages, detectors, presets, Debug, Explain, renderers, and editor diagnostics;
- `@textguard/all@1.1.2` runtime exports and strict TypeScript declaration consumption;
- `@textguard/cli@0.2.1`, including its comprehensive process-level harness and correct version metadata;
- PII pre-commit/CI workflow behavior;
- browser/Vite bundling;
- the published VS Code Marketplace extension plus a real VS Code/Electron host smoke;
- Playground type-check, production build, Pages configuration, artifact upload, and successful public deployment.

Launch-blocking findings discovered during validation are resolved:

- `@textguard/all@1.1.0` runtime detector exports were corrected;
- `@textguard/cli@0.2.0` stale version metadata was corrected;
- GitHub Pages was enabled for the Playground deployment workflow;
- `@textguard/all@1.1.1` declaration ambiguity was corrected and released as `1.1.2`.

The pre-launch validation gate is therefore complete for the current published surface. The next step is not more speculative engineering; it is the documented Launch Surface → Developer Distribution → Adoption Validation sequence.

Historical docs may still mention a separate `packages/presets/` ownership path, but presets currently live under `packages/all`; that stale path alone is not a refactor requirement.

## 12. Development discipline

Every coherent change-set should:

1. start from latest `main` on its own branch;
2. include relevant tests when behavior changes;
3. update stale roadmap/project/ADR/README/example documentation in the same branch;
4. include Changesets when published package behavior changes;
5. follow `docs/RELEASING.md` when an intentional release batch is opened;
6. open a PR for maintainer review;
7. merge only with required checks green;
8. delete the feature branch after merge.

A merged Changeset means release impact is pending, not that npm must be updated immediately.

## 13. Product-growth discipline

`docs/PRODUCT-GROWTH-PLAN.md` is the canonical operating sequence after the current engineering foundation:

**pre-launch validation → launch surface → developer distribution → adoption measurement → evidence-driven iteration → monetization only after commercial signal → possible Guard Ecosystem expansion later.**

Pre-launch validation is now complete. The current active phase is **Launch Surface**.

The product should not become a feature factory. New work should be tied to a validated developer problem or to launch/reliability requirements for an already-shipped capability.

## 14. Guard Ecosystem memory

`docs/GUARD-ECOSYSTEM.md` is the canonical stable document for the wider product/business vision. It intentionally stays separate from this file and `textguard-roadmap.md`, which track TextGuard's changing implementation state.

The wider ecosystem remains vision-stage. TextGuard should earn adoption and validate developer/business demand before implementation starts on additional Guard products.

## 15. Long-term roadmap guardrail

Near-term sequence is:

**polish the lightweight launch surface → begin developer distribution → measure usage and collect feedback → identify repeated/high-impact developer pain → promote only that pain into the next implementation milestone → monetize only after repeated commercial/team demand.**
