# ADR-006: Public Explain API

## Status

Accepted

## Context

ADR-005 established Explain as a structured projection of `DebugSession`. The next step is to expose that capability through the normal TextGuard instance without creating a second execution model.

## Decision

Add `explain(text: string): ExplainResult` to `TextGuardInstance`.

The implementation must reuse the existing debug-capable execution path and pass the resulting `DebugSession` to `ExplainBuilder`:

```text
filter.explain(text)
  -> debug-capable engine execution
  -> DebugSession
  -> ExplainBuilder
  -> ExplainResult
```

`filter.explain()` must not independently run rules or reproduce overlap resolution.

## Compatibility

This is an additive public API. Existing `filter()`, `findBadWords()`, `hasBadWord()`, `debug()`, and `use()` behavior is unchanged.

## Consequences

- Consumers get a direct product-facing Explain entry point.
- Debug remains the execution source of truth for Explain.
- Explain results stay aligned with final accepted matches and preserved rule/plugin metadata.
- M5 is not complete until integration/edge-case coverage and public usage documentation are finished.
