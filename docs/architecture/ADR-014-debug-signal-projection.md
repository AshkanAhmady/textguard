# ADR-014: Debug Signal Projection

## Status

Accepted for the Quality Hardening phase.

## Context

TextGuard's Debug Engine intentionally records rule lifecycle events so deep diagnostics, performance analysis, and future tooling can inspect the complete execution trace. Under large presets this creates a high-volume raw stream: adversarial Playground validation reproduced hundreds of events for small inputs because every dictionary rule emits `rule:started` and `rule:finished` even when it produces no match.

Removing those events from collection would reduce observability and change existing public behavior. Changing `getEvents()`, `report().events`, or the default timeline semantics would also risk breaking consumers that depend on the raw trace.

## Decision

Keep the raw Debug trace as the canonical execution record and add an explicit signal projection for normal developer-facing inspection.

- `DebugSession.getEvents()` remains unchanged and returns the full raw trace.
- `DebugSession.getSignalEvents()` returns pipeline boundaries, all match lifecycle events, and plugin/rule lifecycle events only for plugins/rules that produced match activity.
- `DebugSession.timeline()` remains full by default.
- `DebugSession.timeline({ includeEmptyRules: false })` omits rules with no `match:found` events and omits plugins that therefore have no visible rules.
- `DebugSession.report()` remains backward-compatible and continues to expose raw events and the existing full timeline.
- Playground uses the signal projection and concise timeline by default while displaying both signal and raw event counts.

## Consequences

### Positive

- existing raw Debug consumers retain their current contract;
- normal Playground/debug inspection becomes proportional to meaningful activity rather than total preset rule count;
- signal projection is reusable by future developer tools instead of duplicating UI-specific filtering;
- deep diagnostics remain available when needed.

### Tradeoffs

- debug execution still collects the full raw event stream, so this slice improves signal-to-noise rather than collector memory/runtime cost;
- a rule that executes but produces no match is intentionally absent from the signal projection;
- consumers investigating non-matches must use the raw trace/full timeline.

## Guardrails

- do not silently redefine `getEvents()` or `report().events` as concise output;
- keep concise projection deterministic and derived only from recorded events;
- do not add UI-specific concepts to Core;
- benchmark raw `debug().report()` separately from presentation-level signal volume;
- if collector overhead itself becomes material, address it in a separate architecture slice with explicit compatibility analysis.
