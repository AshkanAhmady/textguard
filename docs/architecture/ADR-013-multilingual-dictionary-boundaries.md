# ADR-013: Unicode-Aware Dictionary Boundaries

## Status

Accepted for the Quality Hardening phase.

## Context

Dictionary string rules intentionally tolerate internal obfuscation such as repeated characters, whitespace, punctuation, Persian ZWNJ, Arabic tatweel, and configured leetspeak alternatives. Before this decision, the generated regex had no outer token boundary at all. A prohibited entry could therefore match as a substring of a larger benign word; consumer validation reproduced this with `Scunthorpe` and `class assignment`.

A simple ASCII `\b` boundary is insufficient because TextGuard is multilingual and must behave consistently around Persian, Arabic, combining marks, and Unicode digits.

## Decision

String dictionary matching uses Unicode-aware outer boundaries while keeping the existing tolerant matching inside the candidate word.

- Unicode letters, numbers, and combining marks are treated as word continuation characters.
- U+200C ZERO WIDTH NON-JOINER and U+200D ZERO WIDTH JOINER are also treated as word continuation characters at the outer edges so a dictionary entry is not extracted from a larger Persian/Arabic orthographic token.
- Inside a candidate, whitespace, Unicode punctuation/symbols, ZWNJ, ZWJ, and Arabic tatweel may separate expected characters. This preserves deliberate-obfuscation detection without globally deleting semantically meaningful join controls.
- Matching uses Unicode regex mode.

This policy applies to string dictionary entries and custom string words. Explicit `RegExp` dictionary entries retain their author-defined boundary semantics.

## Consequences

### Positive

- benign substring cases such as `Scunthorpe` and `class assignment` no longer trigger string dictionary entries;
- Persian and Arabic word continuation semantics are respected better than with ASCII `\b`;
- spaced, punctuated, repeated-character, ZWNJ, ZWJ, tatweel, and leetspeak obfuscations can still be detected;
- no language-specific whitelist is required in Core.

### Tradeoffs

- string dictionary entries no longer intentionally match arbitrary substrings inside larger alphanumeric words;
- broad internal punctuation tolerance remains an aggressive behavior and must be protected by false-positive regression tests;
- regex dictionary entries are intentionally unaffected and can still match substrings if their pattern allows it.

## Guardrails

- do not solve generic boundary false positives with hard-coded place names or English-only whitelists;
- keep outer boundaries Unicode-aware;
- treat ZWNJ/ZWJ differently at outer boundaries versus internal obfuscation;
- any future separator expansion must include both positive evasion tests and negative false-positive tests;
- consumer-validation remains the external adversarial release gate.
