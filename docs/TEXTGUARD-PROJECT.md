# TextGuard — Project Documentation

> Persistent ground-truth orientation for contributors and AI assistants. Implementation/tests are the runtime source of truth; `textguard-roadmap.md` is delivery-status truth; ADRs are architecture-decision truth.

## 1. Product

TextGuard is an extensible TypeScript text-processing/detection engine. It supports profanity/language rules, structured-data detection, filtering/masking, Debug diagnostics, a structured Explain API, and a PII guard for local commits and pull-request CI. The core stays plugin-oriented so new detectors can be added without coupling them into the engine.

Package README standardization is complete. Current product-quality feature work is **Arabic implementation parity**.

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
- Arabic: parity is now in progress. AR1 adds conservative `arProfanity` and `arInsults` resources and populates the existing `arDictionary` and `arPack` exports without changing Core or removing existing Arabic exports.

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

The npm-facing documentation cleanup is complete. The permanent rule remains: public behavior/API changes update affected documentation in the same PR.

## 8. Current milestone — Arabic implementation parity

Arabic parity is intentionally incremental and should not trigger unrelated Core refactors.

### AR1 — usable dictionary baseline — current PR

- add `arProfanity` and `arInsults` dictionaries;
- populate the existing `arDictionary` from those resources;
- populate the existing `arPack` while preserving its export name;
- retain `arLanguage` unchanged;
- add integration tests through the public `createFilter()` API;
- update the package README and add a Changesets minor release entry.

### AR2 — normalization — next

Treat Arabic normalization as a separate design concern. Evaluate Arabic letter variants and diacritics (`أ`, `إ`, `آ`, `ى`, combining marks, etc.) with explicit tests before adding a mapping. Avoid transformations that create broad false positives.

### AR3 / AR4 — later

Expand Arabic coverage/categories conservatively, then decide whether quality is sufficient for bundle/preset inclusion. Spam/pattern resources should not be copied mechanically from other languages.

## 9. Known technical debt

Still tracked:

- Arabic parity beyond AR1.
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
