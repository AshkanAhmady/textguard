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

`filter.explain(text)` is part of Epic 1 / M5 and is implemented. It returns original/normalized input, final accepted matches, plugin/rule metadata, structured reason data, and a summary. Explain uses the same debug-capable engine execution path; it does not re-run rules separately.

## 4. Debug and Explain architecture

The Debug Engine provides the foundation required for reliable Explain behavior:

- DebugSession stores original input, normalized input, final overlap-resolved matches, and events.
- Match lifecycle is explicit: `match:found` is a candidate, then `match:accepted` or `match:rejected` records final resolution.
- Match lifecycle events preserve plugin identity and rule metadata (`id`, `name`, `category`, `severity`, `priority`).
- Explain only projects final accepted matches.
- Explain reasons remain intentionally generic (`rule-match`) until rules expose richer structured facts. The core must not invent detector-specific explanations.

Architecture decisions are recorded in ADR-001 through ADR-006 under `docs/architecture/`.

## 5. Plugin state

### Language plugins

- Persian: established/full relative to the current language architecture.
- English: established/full relative to the current language architecture.
- Arabic: published but intentionally thinner; parity work is tracked at lower priority after PII DX and README cleanup.

### Structured-data detection

Email, URL, Phone, IP, UUID, Credit Card, and IBAN plugins exist. Credit Card and IBAN include validator logic rather than relying only on regex shape.

### PII package

`@textguard/plugin-pii` combines the relevant PII detectors and provides scanning/CLI/CI surfaces.

Current consumer capabilities:

- `npx textguard-pii init` wires a Husky pre-commit command and creates the GitHub workflow without overwriting an existing workflow file;
- `textguard-pii.config.json` provides detector-specific allowlists, ignored paths/globs, and narrowly scoped suppressions;
- both pre-commit and CI scanners use the same policy layer;
- detection stays strict and policy decides whether a finding should block.

`examples/pii-consumer` is the executable consumer reference. Developers can inspect the same setup path that CI executes. Its E2E harness packs the real package into a clean temporary git repository and verifies a blocked commit, allowlisted/ignored-path behavior, and CI pass/fail behavior. This keeps examples and product behavior aligned.

Husky still needs to be installed/initialized in the consuming project before the generated `.husky/pre-commit` hook can execute; the README must state this clearly until setup handling changes.

## 6. Current milestone — PII Consumer DX Hardening

Execution sequence:

1. Consumer init foundation — merged.
2. Shared policy/configuration layer — merged.
3. External end-to-end validation — current, implemented as the executable `examples/pii-consumer` walkthrough plus CI harness.
4. Final public documentation — next after E2E is green.

M0.6 must not be marked complete until the external E2E check is green and the final copy/paste-ready documentation pass is merged.

## 7. Documentation backlog

Package README quality is inconsistent. After PII DX, audit every published package and use the current `@textguard/plugin-pii` README as the reference format/quality bar.

For workflows with meaningful consumer setup, prefer examples under `examples/` that developers can inspect and CI can execute. Executable examples are part of the public documentation surface.

No published package should ship with an empty or obsolete README.

## 8. Known technical debt

Still tracked:

- Arabic language parity.
- `packages/presets/` vs `packages/all/src/presets/` ownership/duplication.
- existing `enterprisePreset` naming collides conceptually with the future secrets/JWT/API-key roadmap feature.
- ADR-001 renderer/API plan does not perfectly match the shipped Debug surface.
- overlap ranking can still be registration/order-dependent for some equal-span/equal-length cases; Debug/Explain expose the final decision correctly but do not change ranking semantics.
- HTML Debug renderer remains missing.
- repository-wide package README cleanup remains pending.

## 9. Development discipline

Every coherent change-set should:

1. start from latest `main` on its own branch;
2. include relevant tests;
3. update stale roadmap/project/ADR/README/example documentation in the same branch;
4. open a PR for maintainer review;
5. merge only with required checks green;
6. delete the feature branch after merge.

See `docs/DEVELOPMENT-WORKFLOW.md` for the persistent execution sequence.

## 10. Long-term roadmap guardrail

Do not jump directly from Explain into broad new feature breadth. Near-term sequence is:

**Explain complete → PII consumer DX → package README standardization → Arabic parity → reassess adoption and broader roadmap.**

Secrets presets, benchmark suite, VS Code/Chrome integrations, and AI work remain later roadmap items.
