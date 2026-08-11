# TextGuard — Project Documentation

> Persistent ground-truth orientation for contributors and AI assistants. Implementation/tests are the runtime source of truth; `textguard-roadmap.md` is delivery-status truth; ADRs are architecture-decision truth; `GUARD-ECOSYSTEM.md` is stable product/business vision.

## 1. Product

TextGuard is an extensible TypeScript text-processing/detection engine. It supports profanity/language rules, structured-data detection, filtering/masking, Debug diagnostics, a structured Explain API, and a PII guard for local commits and pull-request CI.

Arabic implementation parity is complete for the current architecture. The current product focus is **adoption validation and evidence-driven roadmap reassessment** rather than automatic feature expansion.

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

## 9. Release safety and cadence

Release hardening is complete. The repository uses Changesets with release planning, explicit npm candidate checks, bounded registry lookup, canonical package taxonomy, and a documented procedure in `docs/RELEASING.md`.

The latest published baseline includes `@textguard/core@1.0.3`, `@textguard/all@1.0.3`, `@textguard/ar@1.1.0`, `@textguard/en@1.0.2`, and `@textguard/fa@1.0.2`.

The repository now uses a **batched publishing cadence**: public behavior/API PRs still get Changesets, but npm publishing is normally deferred across several coherent milestones. Immediate publish is reserved for intentional stable checkpoints, consumer blockers, critical fixes, or independently valuable completed capabilities.

The currently versioned Arabic parity batch is `@textguard/ar@1.2.0` and `@textguard/all@1.1.0`. These versions may remain ahead of npm while additional milestones are developed; future behavior changes should add new Changesets rather than forcing another immediate release cycle.

Never run `npm publish` from the repository root. Review the release plan and final npm candidate list before every publish.

## 10. Known technical debt

- `packages/presets/` vs `packages/all/src/presets/` ownership/duplication.
- existing `enterprisePreset` naming collides conceptually with the future secrets/JWT/API-key roadmap feature.
- ADR-001 renderer/API plan does not perfectly match the shipped Debug surface.
- overlap ranking can still be registration/order-dependent for some equal-span/equal-length cases.
- HTML Debug renderer remains missing.

## 11. Development discipline

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

## 12. Guard Ecosystem memory

`docs/GUARD-ECOSYSTEM.md` is the canonical stable document for the wider product/business vision. It intentionally stays separate from this file and `textguard-roadmap.md`, which track TextGuard's changing implementation state.

The wider ecosystem remains vision-stage. TextGuard should earn adoption and validate developer/business demand before implementation starts on additional Guard products.

## 13. Long-term roadmap guardrail

Near-term sequence is:

**adoption validation → evidence-driven roadmap reassessment → one coherent implementation milestone → batched release when justified.**
