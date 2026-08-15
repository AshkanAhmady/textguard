# ADR-014: Debug Signal Projection

## Status

Accepted for the Quality Hardening phase.

## Context

TextGuard's Debug Engine intentionally records rule lifecycle events so deep diagnostics, performance analysis, and future tooling can inspect the complete execution trace. Under large presets this creates a high-volume raw stream: adversarial Playground validation reproduced hundreds of events for small inputs because every dictionary rule emits `rule:started` and `rule:finished` even when it produces no match.

The same validation also exposed a Timeline correctness/noise problem. Dictionary rules intentionally share the public name `Dictionary Rule`, so associating timeline matches by `plugin + rule name` can copy one match into multiple rule entries and make the Timeline projection look as repetitive as the raw execution trace.

Removing raw events from collection would reduce observability and change existing public behavior. Changing `getEvents()`, `report().events`, or the default timeline shape would also risk breaking consumers that depend on the raw trace.

## Decision

Keep the raw Debug trace as the canonical execution record and add an explicit signal projection for normal developer-facing inspection.

- `DebugSession.getEvents()` remains unchanged and returns the full raw trace.
- `DebugSession.getSignalEvents()` returns pipeline boundaries and all match lifecycle events, plus rule lifecycle events only for executions that produced match activity. Plugin lifecycle events are retained when such events exist for an active plugin; the current rule runner does not synthesize plugin lifecycle events.
- Signal rule lifecycle is associated by the actual sequential `rule:started → ... → rule:finished` execution segment, not by non-unique rule names.
- `DebugSession.timeline()` keeps the existing public shape and includes empty rule executions by default.
- Timeline construction is single-pass and associates `match:found` events with the currently executing rule segment, preventing duplicate-name dictionary rules from inheriting each other's matches.
- `DebugSession.timeline({ includeEmptyRules: false })` omits rule executions with no `match:found` activity and plugins that therefore have no visible rules.
- `DebugSession.report()` remains backward-compatible and continues to expose raw events and the full timeline shape.
- Playground uses signal events and the concise timeline mode, then renders a compact projection containing plugin, rule, match count, and ranges instead of repeating complete Match objects.

## Consequences

### Positive

- existing raw Debug consumers retain their current contract;
- normal Playground/debug inspection becomes proportional to meaningful activity rather than total preset rule count;
- Timeline match attribution is correct even when many rule instances share the same public name;
- Timeline construction is linear in event count instead of repeatedly rescanning the full event stream for every finished rule;
- signal projection is reusable by future developer tools instead of duplicating event filtering;
- deep diagnostics remain available when needed.

### Tradeoffs

- debug execution still collects the full raw event stream, so this slice improves signal-to-noise and Timeline construction rather than collector memory/runtime cost;
- a rule that executes but produces no match is intentionally absent from the concise projection;
- consumers investigating non-matches must use the raw trace/full timeline;
- the current engine exposes plugin lifecycle event types but does not emit them from the sequential rule runner, so the signal projection does not invent missing lifecycle data.

## Guardrails

- do not silently redefine `getEvents()` or `report().events` as concise output;
- keep concise projection deterministic and derived only from recorded events;
- never associate rule executions solely by display name when multiple instances can share that name;
- do not add UI-specific concepts to Core; compact Playground serialization stays at the integration boundary;
- benchmark raw `debug().report()` separately from presentation-level signal volume;
- if collector overhead itself becomes material, address it in a separate architecture slice with explicit compatibility analysis.
