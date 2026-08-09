# TextGuard — Project Documentation

> Persistent ground-truth orientation for contributors and AI assistants. Implementation/tests are the runtime source of truth; `textguard-roadmap.md` is delivery-status truth; ADRs are architecture-decision truth.

## 1. Product

TextGuard is an extensible TypeScript text-processing/detection engine. It supports profanity/language rules, structured-data detection, filtering/masking, Debug diagnostics, and a structured Explain API. The core stays plugin-oriented so new detectors can be added without coupling them into the engine.

Current product focus after Explain is **PII consumer reliability and developer experience**, then package README quality, then lower-priority Arabic parity.

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

`filter.explain(text)` is part of Epic 1 / M5 and is now implemented. It returns original/normalized input, final accepted matches, plugin/rule metadata, structured reason data, and a summary. Explain uses the same debug-capable engine execution path; it does not re-run rules separately.

## 4. Debug and Explain architecture

The Debug Engine now provides the foundation required for reliable Explain behavior:

- DebugSession stores original input, normalized input, final overlap-resolved matches, and events.
- Match lifecycle is explicit: `match:found` is a candidate, then `match:accepted` or `match:rejected` records final resolution.
- Match lifecycle events preserve plugin identity and rule metadata (`id`, `name`, `category`, `severity`, `priority`).
- Explain only projects final accepted matches.
- Explain reasons remain intentionally generic (`rule-match`) until rules expose richer structured facts. The core must not invent detector-specific explanations.

Architecture decisions are recorded in:

- ADR-001 — Debug Engine foundation
- ADR-002 — DebugSession authoritative state
- ADR-003 — match lifecycle events
- ADR-004 — rule metadata preservation
- ADR-005 — Explain domain projection
- ADR-006 — public `filter.explain()` entry point

M5.6 adds final integration coverage for empty/clean input, Unicode normalization, overlap resolution, and multiple plugins, plus current public core documentation.

## 5. Plugin state

### Language plugins

- Persian: established/full relative to the current language architecture.
- English: established/full relative to the current language architecture.
- Arabic: published but intentionally thinner; parity work is tracked at lower priority after PII DX and README cleanup.

### Structured-data detection

Email, URL, Phone, IP, UUID, Credit Card, and IBAN plugins exist. Credit Card and IBAN include validator logic rather than relying only on regex shape.

### PII package

`@textguard/plugin-pii` combines the relevant PII detectors and provides scanning/CLI/CI surfaces. TextGuard's own repository can run pre-commit/PR scanning, but installing the npm package into a fresh consumer project does **not yet** automatically configure that consumer's Husky hook or GitHub workflow.

That gap is the next product-quality milestone.

## 6. Next milestone — PII Consumer DX Hardening

After Explain M5 is merged complete, work should move directly to PII consumer integration before broad roadmap expansion.

Planned goals:

- validate package installation in a clean external-style project;
- preferred setup flow: `npx textguard-pii init`;
- verify real pre-commit blocking;
- verify real PR/GitHub Action blocking;
- add configuration/policy for intentional findings:
  - allowlisted values;
  - ignored paths/globs;
  - narrowly scoped suppressions;
- keep this policy outside the individual detectors;
- document setup with copy/paste-ready examples.

Detection answers "is this PII-like?"; the PII policy layer answers "should this finding block this repository?"

## 7. Documentation backlog

Package README quality is inconsistent. After PII DX, audit every published package and use the current `@textguard/plugin-pii` README as the reference format/quality bar.

`@textguard/core` README is corrected as part of M5.6 because its old examples used obsolete APIs and Explain needs public documentation. The repository-wide README cleanup remains separate work.

## 8. Known technical debt

Still tracked:

- Arabic language parity.
- `packages/presets/` vs `packages/all/src/presets/` ownership/duplication.
- existing `enterprisePreset` naming collides conceptually with the future secrets/JWT/API-key roadmap feature.
- ADR-001 renderer/API plan does not perfectly match the shipped Debug surface.
- overlap ranking can still be registration/order-dependent for some equal-span/equal-length cases; Debug/Explain now expose the final decision correctly but do not change ranking semantics.
- HTML Debug renderer remains missing.
- repository-wide package README cleanup remains pending.

## 9. Development discipline

Every coherent change-set should:

1. start from latest `main` on its own branch;
2. include relevant tests;
3. update stale roadmap/project/ADR/README documentation in the same branch;
4. open a PR for maintainer review;
5. merge only with required checks green;
6. delete the feature branch after merge.

See `docs/DEVELOPMENT-WORKFLOW.md` for the persistent execution sequence.

## 10. Long-term roadmap guardrail

Do not jump directly from Explain into broad new feature breadth. Near-term sequence is:

**Explain complete → PII consumer DX → package README standardization → Arabic parity → reassess adoption and broader roadmap.**

Secrets presets, benchmark suite, VS Code/Chrome integrations, and AI work remain later roadmap items.
