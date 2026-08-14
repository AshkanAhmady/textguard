# TextGuard — Project Documentation

> Persistent ground-truth orientation for contributors and AI assistants. Implementation/tests are the runtime source of truth; `textguard-roadmap.md` is delivery-status truth; ADRs are architecture-decision truth; `GUARD-ECOSYSTEM.md` is stable product/business vision; `PRODUCT-GROWTH-PLAN.md` records the post-foundation product-growth sequence.

## 1. Product

TextGuard is an extensible TypeScript text-processing/detection engine. It supports profanity/language rules, structured-data detection, filtering/masking, Debug diagnostics, a structured Explain API, and a PII guard for local commits and pull-request CI.

The original comprehensive external consumer-validation matrix is green for the current published integration surface, and the public Playground is operational. Real Playground usage then exposed quality weaknesses that the original integration matrix did not attempt to prove. The current product focus is therefore **Quality Hardening / Adversarial Validation / Benchmarking before broad promotion**.

This is evidence-backed reliability work on already-shipped behavior, not speculative feature expansion.

## 2. Repository and architecture

The repository is a pnpm/Turborepo monorepo with Changesets, Vitest, Husky/lint-staged, CI, and a PII PR scan.

Key packages:

- `packages/core` → `@textguard/core`
- `packages/all` → `@textguard/all`
- language packages: `@textguard/fa`, `@textguard/en`, `@textguard/ar`
- detection plugins: Email, URL, Phone, IP, UUID, Credit Card, IBAN
- `packages/guards/pii` → `@textguard/plugin-pii`

Core remains plugin-oriented. Language packages use the shared `Dictionary` contract and normalization pipeline; no language-specific second engine should be introduced during hardening.

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

Backward compatibility of this surface remains a hardening constraint.

## 4. Debug and Explain architecture

- DebugSession stores original input, normalized input, final overlap-resolved matches, and events.
- Explain projects final accepted matches from the same debug-capable execution path.
- Explain does not introduce a second detection engine.
- Public Debug renderers are `ConsoleRenderer`, `JsonRenderer`, `MarkdownRenderer`, and `HtmlRenderer`.
- overlap ranking determinism has regression coverage.

New adversarial evidence adds two active requirements:

- structured detector matches must retain truthful detector/rule attribution through Explain;
- developer-facing Debug output must have usable signal-to-noise at normal input sizes while preserving compatibility for raw diagnostics where required.

## 5. Package state

### Language packages

Persian, English, and Arabic are implemented for the current language architecture. Vocabulary remains evidence-driven; no language dictionary is treated as permanently complete.

### Structured-data detection

Email, URL, Phone, IP, UUID, Credit Card, and IBAN plugins exist. Credit Card uses Luhn validation and IBAN uses mod-97 validation.

### PII package

`@textguard/plugin-pii` provides strict scanning plus consumer policy for commits/CI. Consumer DX is complete through M0.6. Paid/team expansion remains evidence-gated.

## 6. Completed foundation milestones

The following foundation work remains complete:

- PII Consumer DX through M0.6;
- npm-facing package README standardization;
- Arabic implementation parity for the current architecture;
- CLI current scope;
- public VS Code extension current scope;
- browser Playground current scope;
- release hardening and Changesets workflow;
- original external consumer-integration matrix;
- GitHub Pages deployment at `https://ashkanahmady.github.io/textguard/`.

## 7. Current published validation baseline

The current published baseline includes:

- `@textguard/core@1.1.0`
- `@textguard/all@1.1.2`
- `@textguard/cli@0.2.1`
- `@textguard/plugin-pii@0.3.0`
- `@textguard/ar@1.2.0`
- `@textguard/en@1.0.2`
- `@textguard/fa@1.0.2`
- direct detector packages at `1.0.2`.

The original external integration matrix passes this baseline. The newer adversarial quality matrix intentionally does not.

## 8. Active milestone — Quality Hardening / Adversarial Validation / Benchmarking

### Trigger

Manual use of the deployed public Playground produced credible product evidence that integration-green was not equivalent to moderation-quality complete. The findings were converted into executable tests in `textguard-consumer-validation/main` and reproduced against published npm artifacts.

### Reproduced findings

- invisible Unicode controls (including U+200B and U+2060) bypass tested English/Persian/Arabic dictionary words;
- tested English full-width compatibility forms and common leetspeak bypass detection;
- `Scunthorpe is a town in England` produces a substring false positive;
- Explain attributes tested email and phone matches to a generic dictionary source;
- a five-token realistic input produces roughly 794 raw Debug events;
- Playground uses `strict` as the default user-facing preset label, which is not an ideal newcomer mental model.

The adversarial suite also confirms useful behavior already present: tested spacing/punctuation/repetition obfuscations work, invalid structured-data lookalikes are rejected, duplicate detector registration is deduplicated, filter/Explain accepted matches agree, and tested Unicode/RTL match ranges map correctly back to the original input.

### Engineering principles for fixes

- preserve original-input match ranges across normalization changes;
- do not introduce ASCII-only boundary semantics into a multilingual engine;
- treat leetspeak/compatibility normalization as a false-positive-sensitive decision, not an unconditional global substitution table;
- keep Explain on the same authoritative execution path and repair metadata provenance instead of creating separate explanation logic;
- preserve Debug compatibility and prefer explicit aggregation/verbosity over silent loss of diagnostics;
- preserve `strictPreset` as a public API unless a future alias/deprecation plan justifies a rename; improve Playground wording independently first.

### Benchmark

A reproducible published-artifact benchmark now runs in `textguard-consumer-validation` for `filter()`, `explain()`, and `debug().report()` at 1 KB, 10 KB, and 100 KB workloads. It records median/p95 latency, throughput, and Debug event volume.

The current baseline shows Debug is materially more expensive/noisy than filter/explain, reinforcing the Debug UX finding. Shared-runner timings are directional, not a public SLA. Product-side benchmark fixtures should accompany performance-sensitive architecture work.

## 9. Consumer validation truth

There are now two different gates and they must not be conflated:

1. **Integration/consumer compatibility gate — GREEN.** Packages install, APIs execute, CLI/PII/browser/VS Code work, and Playground deploys.
2. **Quality/adversarial gate — RED while hardening is active.** Hostile normalization, precision, Explain attribution, Debug signal quality and related edge cases still have reproduced failures.

Broad promotion is paused until the quality gate is green or any remaining limitations are explicitly documented and accepted.

`textguard-consumer-validation/REPORT.md` and `QUALITY-HARDENING-MATRIX.md` are the external executable evidence source for this milestone.

## 10. Release safety and cadence

The repository uses Changesets with release planning, explicit npm candidate checks, bounded registry lookup, canonical package taxonomy, and `docs/RELEASING.md` as the release procedure.

Public behavior/API fixes still receive Changesets. Publish a quality checkpoint only after a coherent set of reproduced fixes is ready; do not republish unaffected packages. Never run root `npm publish`.

## 11. Development discipline

Every coherent TextGuard product change should:

1. start from latest `main` on its own branch;
2. be driven by a reproduced test/finding where practical;
3. include relevant product regression tests;
4. update stale roadmap/project/ADR/README/example documentation in the same PR;
5. include Changesets when published package behavior changes;
6. explain tradeoffs before major normalization/matcher/Debug architecture changes;
7. open a PR for maintainer review and merge only with required checks green.

The external `textguard-consumer-validation` repository is intentionally different: it is a test lab and its validation work is maintained directly on `main` as requested by the maintainer.

## 12. Product-growth discipline

`docs/PRODUCT-GROWTH-PLAN.md` remains canonical for the growth sequence:

**validation → launch surface → developer distribution → adoption measurement → evidence-driven iteration → monetization only after commercial signal.**

The current Quality Hardening milestone does not violate that sequence. It was triggered by real use of the public Playground and protects already-shipped behavior. After this gate is green, resume Launch Surface rather than inventing unrelated features.

## 13. Guard Ecosystem memory

`docs/GUARD-ECOSYSTEM.md` remains the stable wider-product vision. Additional Guard products, team SaaS, billing, AI/provider integrations, Chrome/framework adapters, and other expansion remain evidence-gated.

## 14. Near-term sequence

**expand adversarial validation → fix reproduced quality defects in small reviewable slices → benchmark sensitive changes → publish affected quality checkpoint → rerun complete published consumer/adversarial validation → torture-test deployed Playground → resume Launch Surface → developer distribution → adoption evidence → next feature only from repeated/high-impact pain → monetization only after repeated commercial/team demand.**
