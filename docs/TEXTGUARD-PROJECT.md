# TextGuard — Project Documentation

> Persistent ground-truth orientation for contributors and AI assistants. Implementation/tests are the runtime source of truth; `textguard-roadmap.md` is delivery-status truth; ADRs are architecture-decision truth.

## 1. Product

TextGuard is an extensible TypeScript text-processing/detection engine. It supports profanity/language rules, structured-data detection, filtering/masking, Debug diagnostics, a structured Explain API, and a PII guard for local commits and pull-request CI. The core stays plugin-oriented so new detectors can be added without coupling them into the engine.

Current product-quality feature work is **Arabic implementation parity**.

## 2. Repository and architecture

The repository is a pnpm/Turborepo monorepo with Changesets, Vitest, Husky/lint-staged, CI, and a PII PR scan.

Key packages:

- `packages/core` → `@textguard/core`
- `packages/all` → `@textguard/all`
- language plugins: Persian, English, Arabic
- detection plugins: Email, URL, Phone, IP, UUID, Credit Card, IBAN
- `packages/plugins/pii` → `@textguard/plugin-pii`

Core architecture remains plugin-oriented. Arabic parity uses the existing `Dictionary` contract and the existing normalization pipeline; no Arabic-specific Core API is being introduced.

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

## 5. Plugin state

### Language plugins

- Persian: established/full relative to the current language architecture.
- English: established/full relative to the current language architecture.
- Arabic: parity is in progress. AR1 established usable profanity/insult dictionaries. AR2 hardens the already-existing Core Arabic normalization and expands high-confidence vocabulary while retaining the same public exports.

### Structured-data detection

Email, URL, Phone, IP, UUID, Credit Card, and IBAN plugins exist. Credit Card uses Luhn validation and IBAN uses mod-97 validation.

### PII package

`@textguard/plugin-pii` provides strict scanning plus consumer policy for commits/CI. Consumer DX is complete through M0.6.

## 6. Completed milestone — PII Consumer DX Hardening

Consumer init, shared policy configuration, external E2E validation, and final public documentation are complete through M0.6. M0.7 remains intentionally later until usage validates demand.

## 7. Completed milestone — Package README standardization

The npm-facing documentation cleanup is complete. Public behavior/API changes must continue updating affected documentation in the same PR.

## 8. Current milestone — Arabic implementation parity

Arabic parity stays incremental and reviewable.

### AR1 — usable dictionary baseline — ✅ merged

- `arProfanity` and `arInsults` added;
- existing `arDictionary`, `arPack`, and `arLanguage` preserved;
- public `createFilter()` integration tests added;
- package README and release metadata updated.

### AR2 — normalization + coverage hardening — current PR

- audit the existing Core `ArabicNormalizer` instead of adding a second normalization path;
- remove common Arabic diacritics before matching;
- normalize Alef Maqsura (`ى`) consistently with the current shared Yeh canonical form;
- retain existing normalization for Alef/Hamza variants and Taa Marbuta;
- expand Arabic profanity/insult dictionaries with common, high-confidence terms;
- add public API regression tests for diacritics, letter variants, expanded vocabulary, and ordinary benign Arabic text.

Arabic vocabulary is not considered a finite “complete list.” Dialect, spelling, and context vary substantially, so further expansion must be driven by tested coverage and false-positive evidence rather than bulk word imports.

### AR3 / AR4 — later

AR3 may add dialect-specific coverage and evaluate spam/pattern resources. AR4 decides whether Arabic quality is sufficient for bundle/preset inclusion.

## 9. Known technical debt

- Arabic parity beyond AR2.
- `packages/presets/` vs `packages/all/src/presets/` ownership/duplication.
- existing `enterprisePreset` naming collides conceptually with the future secrets/JWT/API-key roadmap feature.
- ADR-001 renderer/API plan does not perfectly match the shipped Debug surface.
- overlap ranking can still be registration/order-dependent for some equal-span/equal-length cases.
- HTML Debug renderer remains missing.

## 10. Development discipline

Every coherent change-set should:

1. start from latest `main` on its own branch;
2. include relevant tests when behavior changes;
3. update stale roadmap/project/ADR/README/example documentation in the same branch;
4. include Changesets when published package behavior changes;
5. open a PR for maintainer review;
6. merge only with required checks green;
7. delete the feature branch after merge.

When a merged Changeset means an npm package should be released, explicitly remind the maintainer which package(s) and release level are pending.

## 11. Long-term roadmap guardrail

Near-term sequence is:

**Explain complete → PII consumer DX complete → package README cleanup complete → Arabic parity → reassess adoption and broader roadmap.**

Secrets presets, benchmark suite, VS Code/Chrome integrations, AI work, and the paid PII tier remain later roadmap items.
