# ADR-013: Script-Aware Dictionary Boundaries

## Status

Accepted for the Quality Hardening phase.

## Context

Dictionary string rules intentionally tolerate internal obfuscation such as repeated characters, whitespace, punctuation, Persian ZWNJ, Arabic tatweel, and configured leetspeak alternatives. Before this decision, generated string regexes had no outer token boundary at all. Consumer validation reproduced benign Latin false positives with `Scunthorpe` and `class assignment`.

The first implementation attempted one Unicode-wide outer-boundary rule. CI immediately demonstrated that this is not backward-compatible for languages with productive morphology: the Persian dictionary entry `احمق` is intentionally expected to match the derived form `احمقانه`. Treating every adjacent Persian letter as a hard boundary incorrectly removed that behavior.

A later public-Playground torture test exposed a second context problem in both Persian and English: internal separators were effectively too permissive for realistic sentence context. Short dictionary words could form artificially sparse spans, and those spans could suppress legitimate nearby matches because overlap resolution intentionally prefers longer overlaps. The English audit also found that the language pack stored Email/URL pattern source text as ordinary strings, causing generated dictionary-word matching to process regex source text instead of explicit regular-expression semantics.

CI then exposed an additional architectural mistake: multi-word dictionary phrases such as `خرید فالوور` were being compiled with the same per-character obfuscation grammar as single-token words. That produced large, ambiguous regexes, allowed phrase entries to stretch across unrelated sentence context, and materially increased preset runtime. A coarse total-span density heuristic was rejected because it also broke supported Persian repetition, multi-space and Kashida behavior.

The matcher therefore needs to distinguish token-internal obfuscation from phrase structure.

## Decision

TextGuard introduces script-aware boundary hardening incrementally.

For string entries containing Latin-script letters:

- outer continuation includes Latin-script letters, Unicode numbers, combining marks, ZWNJ, and ZWJ;
- a Latin dictionary entry cannot be extracted as an arbitrary substring from a larger Latin token;
- matching uses Unicode regex mode.

For generated string dictionary rules:

- token-internal obfuscation gaps are inserted only between adjacent lexical characters from the source entry;
- ordinary whitespace/punctuation/symbol gaps used for obfuscation are bounded to at most three code points;
- Arabic/Persian Kashida (U+0640) uses a separate budget of eight code points;
- repeated expected letters remain supported by the per-character repetition matcher;
- source whitespace inside a multi-word dictionary phrase is treated as phrase structure and matches one to three whitespace characters, rather than receiving additional generic obfuscation gaps around it;
- source punctuation/symbols inside a phrase retain their own literal semantics instead of being treated as arbitrary separator slots.

This preserves representative deliberate obfuscations such as `f-u=c--k`, `f.u.c.k`, `ا   ح   م   ق`, repeated letters, ZWNJ/ZWJ and Kashida, while preventing phrase entries from spanning unrelated sentence tokens.

For non-Latin string entries, existing outer-boundary behavior is preserved for now. This is deliberate backward compatibility, not a claim that Persian/Arabic morphology is solved. A future morphology-aware language policy must define suffix/derivation behavior before Core can safely tighten those boundaries.

Explicit `RegExp` dictionary entries retain their author-defined boundary semantics in all scripts. Language packs must use real `RegExp` entries for regex-based patterns; regex source text must not be stored as ordinary string dictionary words.

## Consequences

### Positive

- reproduced Latin false positives such as `Scunthorpe` and `class assignment` remain fixed without hard-coded whitelists;
- English leetspeak and Persian spacing/repetition/Kashida behavior remain supported;
- multi-word dictionary phrases no longer behave like one giant obfuscated token;
- aggregate presets avoid the pathological regex work introduced by phrase-wide separator injection;
- sentence-level profanity remains visible instead of being hidden by broad phrase matches;
- English Email/URL language-pack patterns use explicit regex semantics;
- existing Persian derivational behavior such as `احمق` matching `احمقانه` is preserved.

### Tradeoffs

- ordinary token-internal separator runs longer than three code points are intentionally outside the generated matcher budget;
- Kashida runs longer than eight code points per gap are intentionally outside the generated matcher budget;
- phrase whitespace is bounded and no longer accepts arbitrary punctuation substitution unless the phrase itself contains that punctuation;
- Persian and Arabic substring false positives are not globally solved by this slice;
- morphology-aware non-Latin outer boundaries remain future work.

## Guardrails

- do not solve boundary false positives with hard-coded place names or phrase whitelists;
- do not impose Latin token assumptions on Persian or Arabic;
- do not apply token-internal obfuscation separators across source phrase boundaries;
- do not restore an unbounded separator quantifier in generated dictionary regexes;
- do not reintroduce a coarse total-span rejection that breaks supported repetition/Kashida behavior;
- do not encode regex source text as a string dictionary word when explicit `RegExp` semantics are intended;
- any future separator-budget expansion must include sentence-context, phrase, performance, positive-evasion and negative false-positive tests;
- consumer-validation remains the external adversarial release gate.
