# TextGuard — Project Documentation

> Persistent ground-truth orientation for contributors and AI assistants. Implementation/tests are the runtime source of truth; `textguard-roadmap.md` is delivery-status truth; ADRs are architecture-decision truth.

## 1. Product

TextGuard is an extensible TypeScript text-processing/detection engine. It supports profanity/language rules, structured-data detection, filtering/masking, Debug diagnostics, a structured Explain API, and a PII guard for local commits and pull-request CI.

Current product-quality feature work is **Arabic implementation parity**, now in AR4 bundle/preset parity after completing AR1-AR3.

## 2. Repository and architecture

The repository is a pnpm/Turborepo monorepo with Changesets, Vitest, Husky/lint-staged, CI, and a PII PR scan.

Key packages:

- `packages/core` → `@textguard/core`
- `packages/all` → `@textguard/all`
- language packages: `@textguard/fa`, `@textguard/en`, `@textguard/ar`
- detection plugins: Email, URL, Phone, IP, UUID, Credit Card, IBAN
- `packages/guards/pii` → `@textguard/plugin-pii`

Core remains plugin-oriented. Arabic parity uses the existing `Dictionary` contract and shared normalization pipeline; no Arabic-specific Core API is being introduced.

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

### Language packages

- Persian: established/full relative to the current language architecture.
- English: established/full relative to the current language architecture.
- Arabic: AR1-AR3 provide baseline dictionaries, normalization hardening, high-confidence coverage, dialect coverage, and public API regression tests. AR4 integrates Arabic into the higher-level bundle presets.

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

### AR2 — normalization + coverage hardening — ✅ merged and released

- existing Core `ArabicNormalizer` audited instead of introducing a second normalization path;
- common Arabic diacritics removed before matching;
- Alef Maqsura normalized consistently;
- high-confidence profanity/insult coverage expanded;
- public regression coverage added for variants and benign Arabic text.

### AR3 — dialect coverage slice 1 — ✅ merged

AR3 added a small high-confidence dialect vocabulary slice while preserving the existing public API and conservative false-positive policy.

### AR4 — bundle/preset parity — 🟡 current PR

- include `arDictionary` in `strictPreset` and `enterprisePreset`;
- verify Arabic moderation through preset-level tests;
- keep `socialMediaPreset` unchanged because it is still an unrelated placeholder;
- avoid Core changes or a second Arabic configuration path.

Arabic vocabulary is not treated as a finite “complete list.” Dialect, spelling, and context require incremental tested expansion.

## 9. Release safety

Release hardening is complete. The repository now uses Changesets with release planning, explicit npm candidate checks, bounded registry lookup, canonical package taxonomy, and a documented procedure in `docs/RELEASING.md`.

The latest published language/core release includes `@textguard/core@1.0.3`, `@textguard/all@1.0.3`, `@textguard/ar@1.1.0`, `@textguard/en@1.0.2`, and `@textguard/fa@1.0.2`.

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
5. follow `docs/RELEASING.md` for npm releases;
6. open a PR for maintainer review;
7. merge only with required checks green;
8. delete the feature branch after merge.

When a merged Changeset means an npm package should be released, explicitly remind the maintainer which package(s) and release level are pending.

## 12. Guard Ecosystem memory

A dedicated documentation PR is queued to add the canonical Guard Ecosystem master document to Git. It will remain separate from TextGuard's fast-changing technical roadmap and will serve as stable business/vision context.

## 13. Long-term roadmap guardrail

Near-term sequence is:

**AR4 parity closeout → adoption validation → broader roadmap reassessment.**
