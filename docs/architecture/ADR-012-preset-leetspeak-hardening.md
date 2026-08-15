# ADR-012: Enable Leetspeak Matching in High-Coverage Presets

## Status

Accepted for the Quality Hardening phase.

## Context

TextGuard Core already supports configurable `leetspeakMapping` during dictionary-rule regex construction, and the English language package already exports `enLeetspeakMapping`. The aggregate strict and enterprise presets did not wire that mapping into `FilterOptions`, so common obfuscations such as digit and symbol substitutions could bypass otherwise present English profanity entries.

Quality-hardening consumer validation reproduced this gap with examples such as `a$$h0le`.

## Decision

The strict and enterprise presets pass `enLeetspeakMapping` to Core through the existing `FilterOptions.leetspeakMapping` contract.

This is a preset-level behavior change rather than a new normalization stage. Structured detectors continue to operate on the same normalized text, while dictionary entries gain the existing leetspeak-aware matching behavior.

## Consequences

### Positive

- common English digit and symbol substitutions are detected without requiring consumer configuration;
- no new Core API or global character rewrite is introduced;
- source ranges remain exact because matching happens directly against the normalized input span;
- the behavior reuses the language package's existing mapping instead of duplicating substitutions in `@textguard/all`.

### Tradeoffs

- high-coverage presets become intentionally more aggressive and can expose additional false positives;
- changes to `enLeetspeakMapping` can affect aggregate preset behavior, so mapping changes require adversarial and false-positive regression coverage;
- lower-aggression/custom consumers can continue to omit `leetspeakMapping` or provide their own mapping.

## Guardrails

- do not implement leetspeak by globally rewriting arbitrary user text when dictionary-aware matching is sufficient;
- keep representative bypass regressions in the aggregate preset tests;
- evaluate false-positive behavior in the multilingual/boundary hardening slice before promotion resumes;
- benchmark regex growth and matching cost as the adversarial dictionary suite expands.
