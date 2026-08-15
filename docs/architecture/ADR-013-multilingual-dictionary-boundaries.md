# ADR-013: Script-Aware Dictionary Boundaries

## Status

Accepted for the Quality Hardening phase.

## Context

Dictionary string rules intentionally tolerate internal obfuscation such as repeated characters, whitespace, punctuation, Persian ZWNJ, Arabic tatweel, and configured leetspeak alternatives. Before this decision, generated string regexes had no outer token boundary at all. Consumer validation reproduced benign Latin false positives with `Scunthorpe` and `class assignment`.

The first implementation attempted one Unicode-wide outer-boundary rule. CI immediately demonstrated that this is not backward-compatible for languages with productive morphology: the Persian dictionary entry `احمق` is intentionally expected to match the derived form `احمقانه`. Treating every adjacent Persian letter as a hard boundary incorrectly removed that behavior.

A single language-agnostic token-boundary policy is therefore not sufficient for all supported scripts.

## Decision

TextGuard introduces script-aware boundary hardening incrementally.

For string entries containing Latin-script letters:

- outer continuation includes Latin-script letters, Unicode numbers, combining marks, ZWNJ, and ZWJ;
- a Latin dictionary entry cannot be extracted as an arbitrary substring from a larger Latin token;
- internal whitespace, Unicode punctuation/symbols, ZWNJ, ZWJ, and Arabic tatweel may still separate expected characters, preserving deliberate-obfuscation detection;
- matching uses Unicode regex mode.

For non-Latin string entries, existing outer-boundary behavior is preserved for now. This is deliberate backward compatibility, not a claim that Persian/Arabic boundary semantics are solved. A future morphology-aware language policy must define suffix/derivation behavior before Core can safely tighten those boundaries.

Explicit `RegExp` dictionary entries retain their author-defined boundary semantics in all scripts.

## Consequences

### Positive

- reproduced Latin false positives such as `Scunthorpe` and `class assignment` are fixed generically without hard-coded whitelists;
- English leetspeak, spacing, punctuation, repeated-character, ZWNJ, and ZWJ obfuscations remain detectable;
- existing Persian derivational behavior such as `احمق` matching `احمقانه` is not broken;
- the policy can evolve per language/script instead of pretending one Unicode boundary is linguistically correct everywhere.

### Tradeoffs

- Persian and Arabic substring false positives are not globally solved by this slice;
- Core now distinguishes Latin-script entries for boundary purposes;
- morphology-aware non-Latin boundary behavior remains future hardening work and requires evidence-driven language tests.

## Guardrails

- do not solve boundary false positives with hard-coded place names or phrase whitelists;
- do not impose Latin token assumptions on Persian or Arabic;
- preserve published language-pack morphology unless a language-specific change is explicitly tested and released;
- any future separator or boundary expansion must include both positive evasion tests and negative false-positive tests;
- consumer-validation remains the external adversarial release gate.
