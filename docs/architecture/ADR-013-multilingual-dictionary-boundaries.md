# ADR-013: Script-Aware Dictionary Boundaries

## Status

Accepted for the Quality Hardening phase.

## Context

Dictionary string rules intentionally tolerate internal obfuscation such as repeated characters, whitespace, punctuation, Persian ZWNJ, Arabic tatweel, and configured leetspeak alternatives. Before this decision, generated string regexes had no outer token boundary at all. Consumer validation reproduced benign Latin false positives with `Scunthorpe` and `class assignment`.

The first implementation attempted one Unicode-wide outer-boundary rule. CI immediately demonstrated that this is not backward-compatible for languages with productive morphology: the Persian dictionary entry `احمق` is intentionally expected to match the derived form `احمقانه`. Treating every adjacent Persian letter as a hard boundary incorrectly removed that behavior.

A later public-Playground torture test exposed a second context problem in both Persian and English: internal separators were effectively too permissive for realistic sentence context. Short dictionary words could form artificially sparse spans, and those spans could suppress legitimate nearby matches because overlap resolution intentionally prefers longer overlaps. The English audit also found that the language pack stored Email/URL pattern source text as ordinary strings, causing generated dictionary-word matching to process regex source text instead of explicit regular-expression semantics.

An initial total-span density guard was rejected by CI because it also rejected existing supported Persian obfuscation behavior: repeated letters, three-space separation, and long Kashida runs. The correction is to bound separator grammar directly instead of applying a coarse total-length heuristic.

A single language-agnostic token-boundary policy is therefore not sufficient for all supported scripts, and obfuscation tolerance must be bounded without collapsing legitimate language-pack behavior.

## Decision

TextGuard introduces script-aware boundary hardening incrementally.

For string entries containing Latin-script letters:

- outer continuation includes Latin-script letters, Unicode numbers, combining marks, ZWNJ, and ZWJ;
- a Latin dictionary entry cannot be extracted as an arbitrary substring from a larger Latin token;
- internal whitespace, Unicode punctuation/symbols, ZWNJ, ZWJ, and Arabic tatweel may separate expected characters, preserving deliberate-obfuscation detection;
- matching uses Unicode regex mode.

For all generated string dictionary rules:

- ordinary whitespace, punctuation, symbols, ZWNJ and ZWJ are bounded to at most three code points per internal gap;
- Arabic/Persian Kashida (U+0640) uses a separate, larger bounded budget of eight code points per internal gap so existing elongation detection remains supported;
- repeated expected letters remain handled by the per-character repetition matcher and are not rejected by a total-span heuristic;
- representative deliberate obfuscations such as `f-u=c--k`, `f.u.c.k`, `ا   ح   م   ق`, repeated letters, ZWNJ/ZWJ and long Kashida remain detectable;
- long unrelated separator runs cannot be interpreted as one generated dictionary token.

For non-Latin string entries, existing outer-boundary behavior is preserved for now. This is deliberate backward compatibility, not a claim that Persian/Arabic boundary semantics are solved. A future morphology-aware language policy must define suffix/derivation behavior before Core can safely tighten those boundaries.

Explicit `RegExp` dictionary entries retain their author-defined boundary semantics in all scripts. Language packs must use real `RegExp` entries for regex-based patterns; regex source text must not be stored as ordinary string dictionary words.

## Consequences

### Positive

- reproduced Latin false positives such as `Scunthorpe` and `class assignment` are fixed generically without hard-coded whitelists;
- English leetspeak, spacing, punctuation, repeated-character, ZWNJ, and ZWJ obfuscations remain detectable within the bounded separator policy;
- existing Persian multi-space, repetition and Kashida tests remain supported;
- short dictionary words cannot bridge arbitrarily long separator runs and suppress nearby real matches through overlap resolution;
- sentence-level tests keep known English/Persian profanity visible when embedded in ordinary surrounding text;
- English Email/URL language-pack patterns use explicit regex semantics rather than generated word-obfuscation matching;
- existing Persian derivational behavior such as `احمق` matching `احمقانه` is not broken;
- the policy can evolve per language/script instead of pretending one Unicode boundary is linguistically correct everywhere.

### Tradeoffs

- ordinary separator runs longer than three code points between expected letters are intentionally not treated as the same generated dictionary token;
- Kashida runs longer than eight code points per internal gap are intentionally outside the generated string matcher budget;
- Persian and Arabic substring false positives are not globally solved by this slice;
- Core now distinguishes Latin-script entries for boundary purposes;
- morphology-aware non-Latin boundary behavior remains future hardening work and requires evidence-driven language tests.

## Guardrails

- do not solve boundary false positives with hard-coded place names or phrase whitelists;
- do not impose Latin token assumptions on Persian or Arabic;
- preserve published language-pack morphology unless a language-specific change is explicitly tested and released;
- any future separator-budget expansion must include sentence-context, overlap, positive-evasion and negative false-positive tests;
- do not restore an unbounded separator quantifier in generated dictionary regexes;
- do not reintroduce a coarse total-span rejection that breaks supported repetition/Kashida behavior;
- do not encode regex source text as a string dictionary word when explicit `RegExp` semantics are intended;
- consumer-validation remains the external adversarial release gate.
