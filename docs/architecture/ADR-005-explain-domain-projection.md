# ADR-005 — Explain Domain Projection

## Status

Accepted for Epic 1 / M5 implementation.

## Context

Explain must describe the same execution result produced by TextGuard without re-running rules or inventing a second detection path. The Debug Engine now preserves authoritative input state, final matches, explicit match lifecycle decisions, and structured rule/plugin metadata.

## Decision

Introduce a dedicated `explain/` module in `@textguard/core` with structured domain models and an `ExplainBuilder`.

`ExplainBuilder` consumes a completed `DebugSession` and projects only `match:accepted` events into `ExplainedMatch` values. Each explained match includes:

- the accepted `Match`;
- plugin identity;
- structured rule metadata;
- a structured reason with code `rule-match` and a human-readable message.

The result also preserves original and normalized input and exposes a small summary.

Explain does not execute rules, resolve overlaps, or reconstruct final state independently.

## Reason semantics

M5 starts with the generic reason code `rule-match`. More specific reasons such as regex technique, dictionary source, checksum/Luhn validation, or other validator facts must only be added when rules expose reliable structured metadata for those facts. Explain must not infer unsupported reasoning.

## Compatibility

This change is additive. Existing Debug APIs and the public `Match` contract remain unchanged.

The public convenience entry point `filter.explain(text)` is intentionally deferred to the next reviewable PR. That API will execute through the existing debug-capable pipeline and delegate projection to `ExplainBuilder`.

## Consequences

- Explain remains consistent with final accepted Debug matches.
- Future consumers such as PII reporting, CLI, VS Code, and AI integrations can depend on structured facts instead of parsing debug text.
- Domain shape can be reviewed before wiring a new `TextGuardInstance` method.
- Specialized explanation reasons require explicit future rule metadata rather than heuristics.
