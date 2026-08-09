# TextGuard — Project Documentation

> Persistent ground-truth orientation for contributors and AI assistants. Implementation/tests are the runtime source of truth; `textguard-roadmap.md` is delivery-status truth; ADRs are architecture-decision truth.

## 1. Product

TextGuard is an extensible TypeScript text-processing/detection engine. It supports profanity/language rules, structured-data detection, filtering/masking, Debug diagnostics, a structured Explain API, and a PII guard for local commits and pull-request CI. The core stays plugin-oriented so new detectors can be added without coupling them into the engine.

Current product focus is **package README quality and simpler npm onboarding**, then lower-priority Arabic parity.

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

`filter.explain(text)` is implemented as Epic 1 / M5. It returns original/normalized input, final accepted matches, plugin/rule metadata, structured reason data, and a summary. Explain uses the same debug-capable engine execution path; it does not re-run rules separately.

## 4. Debug and Explain architecture

The Debug Engine provides the foundation required for reliable Explain behavior:

- DebugSession stores original input, normalized input, final overlap-resolved matches, and events.
- Match lifecycle is explicit: `match:found` is a candidate, then `match:accepted` or `match:rejected` records final resolution.
- Match lifecycle events preserve plugin identity and rule metadata (`id`, `name`, `category`, `severity`, `priority`).
- Explain only projects final accepted matches.
- Explain reasons remain intentionally generic (`rule-match`) until rules expose richer structured facts. The core must not invent detector-specific explanations.

Architecture decisions are recorded under `docs/architecture/`.

## 5. Plugin state

### Language plugins

- Persian: established/full relative to the current language architecture.
- English: established/full relative to the current language architecture.
- Arabic: published but intentionally thinner; parity work is tracked at lower priority after README cleanup.

### Structured-data detection

Email, URL, Phone, IP, UUID, Credit Card, and IBAN plugins exist. Credit Card and IBAN include validator logic rather than relying only on regex shape.

### PII package

`@textguard/plugin-pii` combines the relevant PII detectors and provides scanning/CLI/CI surfaces.

Consumer capabilities through M0.6 are complete:

- `npx textguard-pii init` wires a Husky pre-commit command and creates the GitHub workflow without overwriting an existing workflow file;
- `textguard-pii.config.json` provides detector-specific allowlists, ignored paths/globs, and narrowly scoped suppressions;
- both pre-commit and CI scanners use the same policy layer;
- detection stays strict and policy decides whether a finding should block;
- `examples/pii-consumer` is a simple executable consumer reference;
- CI packs the real published package shape into a clean temporary repository and validates blocked commits, policy-approved commits, ignored paths, and CI pass/fail behavior.

Husky must be installed and initialized in the consuming project before the generated `.husky/pre-commit` hook can execute. The PII README documents the full copy/paste setup sequence.

## 6. Completed milestone — PII Consumer DX Hardening

Execution sequence is complete:

1. Consumer init foundation — ✅ merged.
2. Shared policy/configuration layer — ✅ merged.
3. External end-to-end validation — ✅ merged and green.
4. Final public documentation — ✅ merged.

M0.3, M0.4, and M0.6 are complete. M0.7 (paid tier) intentionally remains later until open-source usage validates demand.

## 7. Current milestone — Documentation quality

The root README replacement and published-package README audit are complete. Audit findings and rewrite order live in `docs/PACKAGE-README-AUDIT.md`.

Confirmed priorities:

- `@textguard/all` is P0 because its published README is empty;
- Persian and English READMEs are P0 because they document removed APIs and have malformed markdown;
- Phone, IP, UUID, Credit Card, and IBAN READMEs are P0 because copied or invalid examples misrepresent package behavior;
- Email and URL are P1 consistency/quality work;
- Core and PII are already useful, with PII serving as the quality reference;
- Arabic README cleanup stays conservative until the lower-priority Arabic parity implementation work.

The next implementation sequence is package-by-package README rewriting in that priority order. Examples must stay short, copy/paste-ready, compatible with shipped public APIs, and safe for the repository PII scan without broad ignore rules.

For workflows with meaningful consumer setup, prefer examples under `examples/` that developers can inspect and CI can execute. Executable examples are part of the public documentation surface.

## 8. Known technical debt

Still tracked:

- Arabic language parity.
- `packages/presets/` vs `packages/all/src/presets/` ownership/duplication.
- existing `enterprisePreset` naming collides conceptually with the future secrets/JWT/API-key roadmap feature.
- ADR-001 renderer/API plan does not perfectly match the shipped Debug surface.
- overlap ranking can still be registration/order-dependent for some equal-span/equal-length cases; Debug/Explain expose the final decision correctly but do not change ranking semantics.
- HTML Debug renderer remains missing.
- published-package README cleanup is the current priority.

## 9. Development discipline

Every coherent change-set should:

1. start from latest `main` on its own branch;
2. include relevant tests when behavior changes;
3. update stale roadmap/project/ADR/README/example documentation in the same branch;
4. open a PR for maintainer review;
5. merge only with required checks green;
6. delete the feature branch after merge.

See `docs/DEVELOPMENT-WORKFLOW.md` for the persistent execution sequence.

## 10. Long-term roadmap guardrail

Near-term sequence is now:

**Explain complete → PII consumer DX complete → root README complete → package README audit complete → package-by-package README standardization → Arabic parity → reassess adoption and broader roadmap.**

Secrets presets, benchmark suite, VS Code/Chrome integrations, AI work, and the paid PII tier remain later roadmap items.
