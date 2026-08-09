# TextGuard — Project Documentation

> Persistent ground-truth orientation for contributors and AI assistants. Implementation/tests are the runtime source of truth; `textguard-roadmap.md` is delivery-status truth; ADRs are architecture-decision truth.

## 1. Product

TextGuard is an extensible TypeScript text-processing/detection engine. It supports profanity/language rules, structured-data detection, filtering/masking, Debug diagnostics, a structured Explain API, and a PII guard for local commits and pull-request CI. The core stays plugin-oriented so new detectors can be added without coupling them into the engine.

Package README standardization is complete. The next planned product-quality feature milestone is **Arabic implementation parity**.

## 2. Repository and architecture

The repository is a pnpm/Turborepo monorepo with Changesets, Vitest, Husky/lint-staged, CI, and a PII PR scan.

Key packages:

- `packages/core` → `@textguard/core`
- `packages/all` → `@textguard/all`
- language plugins: Persian, English, Arabic
- detection plugins: Email, URL, Phone, IP, UUID, Credit Card, IBAN
- `packages/plugins/pii` → `@textguard/plugin-pii`

Core architecture:

- `createFilter()` / `createEngine()` — public instance creation
- `EnginePipeline` — normalization and rule execution
- `PluginManager` / `RuleCollection` — extension registration
- `DebugCollector` / `DebugSession` — authoritative execution diagnostics
- `ExplainBuilder` — structured projection of DebugSession; no second detection engine

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
- Match lifecycle is explicit: `match:found` is a candidate, then `match:accepted` or `match:rejected` records final resolution.
- Explain only projects final accepted matches and uses the same debug-capable execution path.
- Explain reasons remain intentionally generic (`rule-match`) until rules expose richer structured facts.

Architecture decisions are recorded under `docs/architecture/`.

## 5. Plugin state

### Language plugins

- Persian: established/full relative to the current language architecture. README uses the current `faDictionary` API and optional `faLookalikesMapping`.
- English: established/full relative to the current language architecture. README uses the current `enDictionary` API and optional `enLeetspeakMapping`.
- Arabic: published foundation only. Current source exports `arDictionary`, `arPack`, and `arLanguage`; `arDictionary.words` is empty and `arPack` is empty. Documentation accurately states this. Arabic parity is the next implementation milestone.

### Structured-data detection

Email, URL, Phone, IP, UUID, Credit Card, and IBAN plugins exist. Their package READMEs use current APIs and detector-specific examples; Credit Card documents Luhn validation and IBAN documents mod-97 validation.

### PII package

`@textguard/plugin-pii` combines the relevant PII detectors and provides scanning/CLI/CI surfaces. Consumer capabilities through M0.6 are complete, including `init`, shared policy configuration, executable consumer examples, and external E2E validation.

## 6. Completed milestone — PII Consumer DX Hardening

1. Consumer init foundation — ✅ merged.
2. Shared policy/configuration layer — ✅ merged.
3. External end-to-end validation — ✅ merged and green.
4. Final public documentation — ✅ merged.

M0.7 (paid tier) remains intentionally later until open-source usage validates demand.

## 7. Completed milestone — Package README standardization

The npm-facing documentation cleanup is complete:

- ✅ root README;
- ✅ published package audit;
- ✅ `@textguard/all` README;
- ✅ Persian and English READMEs;
- ✅ all structured-data detector READMEs;
- ✅ Arabic README aligned with the current foundation-only package;
- ✅ final package-wide consistency verification across Core, PII, All, language, and detection packages.

The permanent rule remains: examples should be short, copy/paste-ready, compatible with shipped public APIs, and safe for the repository PII scan without broad ignore rules. Public behavior/API changes update affected documentation in the same PR.

## 8. Next milestone — Arabic implementation parity

Before implementation, inspect the Persian/English language-plugin structure and define a conservative Arabic scope. Preserve existing public exports where possible and avoid unnecessary Core changes.

Current Arabic baseline:

- `arDictionary.words` is empty;
- `arPack` is empty;
- `arLanguage` provides locale metadata;
- package README intentionally does not claim working profanity detection yet.

## 9. Known technical debt

Still tracked:

- Arabic language parity.
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
4. open a PR for maintainer review;
5. merge only with required checks green;
6. delete the feature branch after merge.

See `docs/DEVELOPMENT-WORKFLOW.md` for the persistent execution sequence.

## 11. Long-term roadmap guardrail

Near-term sequence is:

**Explain complete → PII consumer DX complete → package README cleanup complete → Arabic parity → reassess adoption and broader roadmap.**

Secrets presets, benchmark suite, VS Code/Chrome integrations, AI work, and the paid PII tier remain later roadmap items.
