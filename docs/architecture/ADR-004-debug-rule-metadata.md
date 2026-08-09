# ADR-004 — Preserve rule metadata in Debug match events

## Status

Accepted

## Context

Explain API needs to answer which plugin and rule produced a match and expose stable rule facts such as id, category, severity, and priority. The existing `Match` public contract only contains text/span information, and changing it would create unnecessary coupling and backward-compatibility risk.

## Decision

Match lifecycle Debug events (`match:found`, `match:accepted`, `match:rejected`) preserve a structured `DebugRuleMetadata` snapshot containing:

- `id`
- `name`
- `category`
- `severity`
- `priority`

The existing `plugin` and `rule` string fields remain unchanged for compatibility. The public `Match` interface is not expanded.

## Consequences

- Explain can project reliable source metadata from `DebugSession` without re-running rules.
- Existing consumers of `Match` and existing event fields remain compatible.
- Debug events become slightly larger, but only debug/explain executions pay that cost.
- Explanation-specific prose remains outside the `Rule` interface; this keeps detection logic separate from presentation.

## Follow-up

The next step is the Explain domain/API itself, built as a projection of the hardened DebugSession rather than as a second execution engine.
