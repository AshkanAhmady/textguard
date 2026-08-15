# TextGuard Quality Hardening Checkpoint

Status: **source fixes complete; release acceptance pending published-artifact revalidation**.

This checkpoint records the evidence-backed Quality Hardening work triggered by manual use of the public Playground. It does not declare the milestone complete until the affected npm packages are published and the complete `textguard-consumer-validation` matrix passes against those published artifacts.

## Findings and source-level disposition

- **Original-range correctness after normalization — fixed.** Core now preserves original-input UTF-16 ranges across built-in length-changing normalization, including Arabic diacritic removal and Unicode composition/compatibility normalization. Debug and Explain observe the same projected ranges as Filter.
- **Invisible Unicode / full-width bypasses — fixed for reproduced cases.** Built-in Unicode normalization uses NFKC and removes U+200B ZERO WIDTH SPACE, U+2060 WORD JOINER, and U+FEFF BOM/ZWNBSP while preserving original ranges. ZWNJ/ZWJ are not globally stripped because they are meaningful in Persian/Arabic; dictionary matching handles tested internal join-control obfuscation without destructive normalization.
- **Common English leetspeak bypasses — fixed for reproduced cases.** `strictPreset` and `enterprisePreset` now use the existing English leetspeak mapping. The English `shit` dictionary typo discovered by CI was also corrected.
- **Latin substring false positives — fixed for reproduced cases.** Latin string dictionary rules use script-aware outer boundaries, closing cases such as `Scunthorpe` and `class assignment` while preserving internal punctuation/spacing/repetition obfuscation and existing Persian derivational behavior.
- **Sentence/context robustness — fixed for reproduced Persian and English cases.** Public Playground torture tests showed that isolated profanity could be detected while realistic surrounding sentence context produced sparse or misleading matches. Generated string dictionary rules now use bounded separator grammar instead of unbounded gaps: ordinary separators are capped per gap while Kashida keeps a separate larger budget and repeated expected letters remain supported. English Email/URL language-pack patterns were also corrected from regex source strings to explicit `RegExp` entries so pattern syntax is never processed as an obfuscated dictionary word.
- **Aggregate Playground vocabulary coverage — fixed for reproduced cases.** The public `strictPreset` is now regression-tested end to end against the exact mixed English/Persian sentence shapes that exposed missing matches. English adds standalone `ass` while preserving Latin boundary protection against benign substrings such as `class assignment`; Persian adds explicit colloquial forms observed in the Playground instead of broadening Persian morphology globally. The Pages workflow overlays both current `@textguard/en` and `@textguard/fa` and runs an aggregate smoke assertion before deployment.
- **Explain detector provenance — fixed.** Official structured-data detector rules use explicit precedence ahead of generic dictionary privacy patterns, so equal-span Email/URL/Phone/IP/UUID/Credit Card/IBAN matches retain specialist provenance.
- **Debug Execution Timeline noise — fixed at the developer-facing projection layer.** Raw events remain available for backward-compatible deep diagnostics. `getSignalEvents()` provides concise activity, and Playground displays signal events while still exposing the raw event count.
- **Timeline projection duplication/noise — fixed.** Timeline construction is now single-pass and associates matches with the actual sequential rule execution segment, avoiding collisions between many rules sharing the display name `Dictionary Rule`. Playground uses `timeline({ includeEmptyRules: false })` and renders a compact plugin/rule/match-count/range projection.
- **Playground preset wording — fixed.** The public API name `strictPreset` remains backward compatible; the Playground presents it as `Default moderation (recommended)` with contextual preset descriptions.

## Benchmark evidence

The internal quality benchmark is implemented and runs automatically for relevant changes. The first successful post-merge `main` run completed on Node 22 / Linux.

Representative results from that run:

| Workload | filter median | debug session median | debug report median | raw events | signal events | full rules | concise rules |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ~1 KB | 2.716 ms | 2.737 ms | 2.958 ms | 804 | 24 | 391 | 1 |
| ~10 KB | 6.883 ms | 6.887 ms | 7.119 ms | 986 | 206 | 391 | 1 |
| ~100 KB | 63.501 ms | 56.927 ms | 58.816 ms | 2804 | 2024 | 391 | 1 |

Interpretation: the reproduced Debug problem was primarily a developer-facing signal/noise and Timeline-construction problem. This run does **not** show material raw collector overhead relative to `filter()` that would justify a collector-level architectural refactor. Timings are observational shared-runner evidence, not a public SLA.

## Pending Changesets / expected release scope

The pending Changesets on `main` cover these public packages:

- `@textguard/core` — patch
- `@textguard/all` — patch
- `@textguard/en` — patch
- `@textguard/fa` — patch
- `@textguard/plugin-email` — patch
- `@textguard/plugin-url` — patch
- `@textguard/plugin-phone` — patch
- `@textguard/plugin-ip` — patch
- `@textguard/plugin-uuid` — patch
- `@textguard/plugin-credit-card` — patch
- `@textguard/plugin-iban` — patch

The latest aggregate Playground coverage fix expands the candidate set by `@textguard/fa` because the Persian language package itself gains explicit observed variants. `@textguard/en` was already part of the checkpoint candidate set.

Current published versions before this checkpoint are `@textguard/core@1.1.0`, `@textguard/all@1.1.2`, `@textguard/en@1.0.2`, `@textguard/fa@1.0.2`, and the seven listed detector packages at `1.0.2`. Subject to `pnpm release:plan` being identical, expected next versions are therefore `@textguard/core@1.1.1`, `@textguard/all@1.1.3`, `@textguard/en@1.0.3`, `@textguard/fa@1.0.3`, and detector packages at `1.0.3`.

Do not publish any package that is not surfaced by the repository release plan.

## Acceptance sequence

1. Run `pnpm release:plan` on latest `main` and verify the candidate set.
2. Run `pnpm version-packages` on a dedicated release branch; review the generated versions/changelogs and consumed Changesets.
3. Open and merge the release-generated PR.
4. Publish only the npm candidates surfaced by the release guard.
5. Update `textguard-consumer-validation/main` to the newly published versions.
6. Run the full original integration matrix plus the adversarial Quality Hardening matrix, sentence/context matrix, and published-artifact benchmark.
7. Redeploy/smoke-test the public Playground and manually repeat the original torture cases in isolated and sentence context.
8. Only after all gates are green, update `textguard-roadmap.md` and `TEXTGUARD-PROJECT.md` from "Quality Hardening active" to "Quality checkpoint accepted" and resume Launch Surface.

## Remaining acknowledged limitations

This checkpoint does not claim that profanity detection is mathematically bypass-proof or that multilingual morphology is solved. In particular, Persian/Arabic outer-boundary semantics remain intentionally conservative to preserve existing derivational behavior. New obfuscation or false-positive reports remain evidence for future regression tests rather than justification for speculative global normalization.
