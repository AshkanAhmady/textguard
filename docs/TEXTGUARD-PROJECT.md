# TextGuard — Project Documentation

> Persistent ground-truth orientation. Implementation/tests are runtime truth; `textguard-roadmap.md` is delivery-status truth; ADRs are architecture-decision truth; `PRODUCT-GROWTH-PLAN.md` defines the product-growth sequence.

## 1. Product

TextGuard is an extensible TypeScript text-processing and detection toolkit for profanity/language moderation, structured-data detection, filtering/masking, Debug diagnostics, Explain provenance, CLI/editor/browser integrations, and PII protection for commits and pull requests.

The current quality-hardening checkpoint has been implemented, published, and externally revalidated. The active product phase is now **Launch Surface → Developer Distribution → Adoption Validation** rather than speculative feature expansion.

## 2. Architecture

The repository is a pnpm/Turborepo monorepo using Changesets, Vitest, Husky/lint-staged, CI, and PII scanning.

Key packages:

- `@textguard/core` — engine and extension API;
- `@textguard/all` — complete bundle and presets;
- `@textguard/fa`, `@textguard/en`, `@textguard/ar` — language packages;
- Email, URL, Phone, IP, UUID, Credit Card, and IBAN detector plugins;
- `@textguard/plugin-pii` — commit/PR PII guard;
- `@textguard/cli` — command-line surface.

Core remains plugin-oriented. Language packages share the same Dictionary/normalization engine; no language-specific second engine should be introduced without architectural evidence.

## 3. Public core API

```ts
const filter = createFilter(options);

filter.hasBadWord(text: string): boolean;
filter.findBadWords(text: string): Match[];
filter.filter(text: string): FilterResult;
filter.debug(text: string): DebugSession;
filter.explain(text: string): ExplainResult;
filter.use(plugin: Plugin): void;
```

Backward compatibility of this surface remains a release constraint.

## 4. Preset naming

`defaultPreset` is the canonical recommended ready-made preset for new consumers.

`strictPreset` is retained as a deprecated backward-compatible alias that references the same configuration object. This avoids breaking existing imports while aligning the public API with the Playground's newcomer-facing `Default moderation` terminology.

New docs, examples, and Playground internals should use `defaultPreset`. Legacy Playground URLs containing `preset=strict` are accepted and mapped to `default`.

A breaking removal of `strictPreset` is not planned for the current roadmap and would require a deliberate future major-version migration justified by adoption evidence.

## 5. Debug and Explain

- Debug retains raw diagnostics and also exposes a signal projection for normal developer use.
- Timeline projection can omit empty rules without mutating the raw trace.
- Explain projects final accepted matches from the authoritative execution path.
- Structured detectors retain truthful plugin/rule provenance.
- Overlap resolution is deterministic and regression-tested.

## 6. Normalization and detection quality

Quality hardening established these standing invariants:

- accepted `Match.start/end` ranges map back to the original input even when normalization changes length;
- multilingual matching does not rely on naive ASCII-only word-boundary semantics;
- bounded leetspeak/compatibility handling requires false-positive regression coverage;
- realistic sentence-context fixtures exist for English and Persian Playground failures;
- credible bypass/false-positive reports become regression cases before fixes.

## 7. Current published checkpoint

The published launch checkpoint includes:

- `@textguard/core@1.1.1`;
- `@textguard/all@1.1.4` with canonical `defaultPreset` and deprecated-compatible `strictPreset`;
- `@textguard/cli@0.2.2`;
- `@textguard/plugin-pii@0.3.1`;
- `@textguard/en@1.0.3` and `@textguard/fa@1.0.3`;
- `@textguard/ar@1.2.0` (unchanged in the checkpoint);
- direct structured detector packages at `1.0.3`.

`textguard-consumer-validation` pins and tests published npm artifacts directly rather than substituting workspace source. The `@textguard/all@1.1.4` checkpoint passed Node 20/22, CLI, PII, browser/Vite, benchmark, and real VS Code extension-host validation against published artifacts.

## 8. Validation and benchmark discipline

The external consumer-validation repository remains a standing executable gate across Node 20/22, CLI, PII workflows, browser/Vite, the real VS Code extension host, adversarial fixtures, and published-artifact benchmarks.

Benchmarking covers `filter()`, `explain()`, and `debug().report()` at representative 1 KB, 10 KB, and 100 KB workloads. Shared-runner timings are engineering signals, not a public performance SLA.

External Marketplace/service availability failures should not be confused with TextGuard runtime failures. The strongest VS Code gate downloads the Marketplace artifact and activates it in a real Electron host.

## 9. Development discipline

Every coherent TextGuard product change should:

1. start from current `main` on its own branch;
2. be driven by a reproduced finding or explicit product requirement;
3. include regression tests where behavior changes;
4. preserve public compatibility unless a major-version decision is justified;
5. update relevant docs in the same PR;
6. include Changesets when published package behavior/API changes;
7. merge only with required checks green.

The external `textguard-consumer-validation` repository is a test lab and is maintained directly on `main`.

## 10. Product-growth discipline

`PRODUCT-GROWTH-PLAN.md` is canonical for the sequence:

**validate → make easy to try → promote to developers → measure real usage → collect feedback → identify repeated pain → build the smallest justified improvement → release and repeat**.

The next bottleneck is adoption evidence, not feature count. Chrome, AI/provider integrations, framework adapters, new detectors/languages, team SaaS, billing, organization administration, and additional Guard products remain evidence-gated.

Issue #65 is the canonical adoption signal log. Do not add invasive runtime telemetry to Core for product analytics.

## 11. Near-term sequence

**polish README/npm/Playground/feedback surfaces → distribute organically to relevant developers → record adoption evidence → select the next feature only from repeated/high-impact pain → consider monetization only after repeated team/commercial demand.**
