# ADR-010: Preserve Original-Input Ranges Through Normalization

## Status

Accepted for the Quality Hardening phase.

## Context

TextGuard rules execute against normalized text, but the public `Match` contract is consumed against the original user input by filtering, editor diagnostics, Debug, Explain, and downstream integrations.

Some built-in normalizers change UTF-16 string length. Reproduced cases include:

- Arabic diacritic removal;
- Unicode canonical composition such as decomposed `e\u0301` becoming `é`;
- invisible Unicode obfuscation inserted inside a matched term;
- compatibility forms such as full-width Latin characters.

Before this decision, `NormalizationPipeline` returned only the normalized string. Rule ranges were therefore interpreted directly as original-input ranges even when normalization had changed string length. That could make `start`, `end`, `matchedText`, masking, Debug events, and Explain output point at the wrong source span.

Quality-hardening tests in the external consumer-validation repository reproduced this defect before implementation work started.

## Decision

Normalization becomes range-aware internally while keeping the existing normalizer contract backward compatible.

`Normalizer.normalize(text): string` remains valid and unchanged for existing custom normalizers. A normalizer may additionally implement the optional `normalizeWithMapping()` hook, which returns:

- the normalized text;
- a UTF-16 boundary map from the normalized output back to that normalizer's input.

`NormalizationPipeline` composes boundary maps across normalization stages. Rules still execute and resolve overlaps in normalized coordinates. Before a match leaves the engine, Core projects it back to original-input coordinates and rebuilds `matchedText` from the original input.

The same projection is applied to Debug match lifecycle events so Debug and Explain observe the same public ranges as `filter()` and `findBadWords()`.

Built-in Unicode, Persian, and Arabic normalizers provide explicit mapping. Existing custom normalizers that only implement `normalize()` continue to work. Length-preserving custom normalization receives identity mapping; legacy behavior is retained as a fallback for un-mapped length-changing custom normalization.

During Quality Hardening, the built-in Unicode stage also establishes a conservative anti-obfuscation policy:

- use NFKC compatibility normalization so full-width and equivalent compatibility forms collapse to their canonical consumer-facing form;
- remove U+200B ZERO WIDTH SPACE, U+2060 WORD JOINER, and U+FEFF ZERO WIDTH NO-BREAK SPACE/BOM because they have no required lexical role in TextGuard matching and are commonly usable as invisible separators;
- do **not** automatically strip U+200C ZERO WIDTH NON-JOINER or U+200D ZERO WIDTH JOINER in this generic stage because they can carry meaningful Persian/Arabic shaping or orthographic intent. Their abuse-resistance policy must be handled with language-aware tests rather than a global destructive transform.

## Consequences

### Positive

- public `Match.start` / `Match.end` stay aligned with the original input;
- masking no longer cuts the wrong source span after built-in length-changing normalization;
- Debug, Explain, filter results, and editor-facing consumers share one range coordinate system;
- full-width compatibility variants and selected invisible separators no longer trivially bypass matching;
- existing custom normalizers remain source-compatible.

### Tradeoffs

- normalization now carries a small boundary-map allocation proportional to text length;
- NFKC is more aggressive than NFC and intentionally folds compatibility distinctions before matching;
- built-in normalizers that can change length must maintain their mapping implementation alongside normalization behavior;
- arbitrary third-party length-changing normalizers cannot be mapped perfectly unless they opt into the mapping hook;
- ZWNJ/ZWJ remain a separate adversarial surface until language-aware handling is proven not to create unacceptable false positives.

## Guardrails

- overlap resolution continues to happen in normalized coordinates;
- projection occurs only at the engine/public-observability boundary;
- public ranges are UTF-16 indices, matching JavaScript string slicing semantics;
- any future normalization that deletes, expands, composes, or folds characters must include range-regression tests;
- do not remove semantically meaningful join controls globally without multilingual false-positive coverage;
- adversarial consumer validation remains the external release gate for original-range correctness.
