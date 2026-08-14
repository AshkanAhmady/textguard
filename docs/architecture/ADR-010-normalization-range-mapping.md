# ADR-010: Preserve Original-Input Ranges Through Normalization

## Status

Accepted for the Quality Hardening phase.

## Context

TextGuard rules execute against normalized text, but the public `Match` contract is consumed against the original user input by filtering, editor diagnostics, Debug, Explain, and downstream integrations.

Some built-in normalizers change UTF-16 string length. Two reproduced cases are:

- Arabic diacritic removal;
- Unicode NFC composition such as decomposed `e\u0301` becoming `é`.

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

## Consequences

### Positive

- public `Match.start` / `Match.end` stay aligned with the original input;
- masking no longer cuts the wrong source span after built-in length-changing normalization;
- Debug, Explain, filter results, and editor-facing consumers share one range coordinate system;
- future zero-width and compatibility normalization can be added without silently corrupting ranges;
- existing custom normalizers remain source-compatible.

### Tradeoffs

- normalization now carries a small boundary-map allocation proportional to text length;
- built-in normalizers that can change length must maintain their mapping implementation alongside normalization behavior;
- arbitrary third-party length-changing normalizers cannot be mapped perfectly unless they opt into the mapping hook.

## Guardrails

- overlap resolution continues to happen in normalized coordinates;
- projection occurs only at the engine/public-observability boundary;
- public ranges are UTF-16 indices, matching JavaScript string slicing semantics;
- any future normalization that deletes, expands, composes, or folds characters must include range-regression tests;
- adversarial consumer validation remains the external release gate for original-range correctness.
