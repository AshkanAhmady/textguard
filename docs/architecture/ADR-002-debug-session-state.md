# ADR-002: DebugSession owns authoritative execution state

- **Status:** Accepted
- **Date:** 2026-08-09
- **Context:** Epic 1 / M5 Explain API preparation (M5.1)

## Context

The initial Debug Engine implementation stored only an immutable list of `DebugEvent` values in `DebugSession`. Higher-level consumers could derive timelines, statistics, and performance information from those events.

That model is insufficient for Explain API because event history is not the same thing as final execution state. In particular, `match:found` is emitted when a rule discovers a candidate, before overlap resolution. A candidate may therefore appear in the event stream even when it is absent from the final `findBadWords()` result.

Reconstructing final state from debug events would make Explain and future integrations depend on event-order and overlap-resolution implementation details. It would also make changes to instrumentation risk changing the interpreted detection result.

## Decision

`DebugSession` is an execution snapshot as well as an event log.

A debug run preserves four authoritative values:

- original input;
- normalized input used by rule matching;
- final overlap-resolved matches returned by the engine;
- immutable debug events describing execution history.

The public session API exposes:

```ts
session.getInput(): string
session.getNormalizedInput(): string
session.getMatches(): readonly Match[]
session.getEvents(): readonly DebugEvent[]
```

`DebugCollector` captures the execution state supplied by `EnginePipeline` and constructs the session from that snapshot.

The existing `new DebugSession(events)` constructor remains supported for backward compatibility. Sessions created through that legacy constructor use empty input/normalized input/final-match state while retaining the supplied events.

## Consequences

### Positive

- Explain API can treat `session.getMatches()` as the authoritative detection result instead of reconstructing it from candidate events.
- Original and normalized inputs are available without introducing normalization-specific debug events first.
- Event instrumentation can evolve independently from final detection state.
- Existing consumers of `getEvents()`, `statistics()`, `timeline()`, `performance()`, and `report()` remain compatible.
- No rule, plugin, or `Match` public contract changes are required.

### Tradeoffs

- A `DebugSession` now contains a small amount of duplicated state: final matches are stored directly while candidate match events may also contain `Match` objects.
- The legacy constructor cannot provide meaningful execution-state values because it never received them; its new getters intentionally return empty state.
- `match:found` remains semantically ambiguous to consumers that assume it means an accepted result. M5.2 will address this by adding explicit candidate/accepted/rejected match lifecycle semantics.

## Rejected alternatives

### Reconstruct final matches from events

Rejected because `match:found` occurs before overlap resolution and therefore cannot reliably represent the final result.

### Re-run the engine from Explain API

Rejected because Explain must be a projection of one execution, not a second execution path that can drift from the original result or double runtime cost.

### Change the existing `Match` interface

Rejected for this milestone because authoritative session state can be added without a breaking public API change. Rule/plugin explanation metadata is handled separately in M5.3.

## Follow-up

M5.2 will make match lifecycle events explicit. M5.3 will preserve rule/plugin metadata required for reliable explanations. Explain API will then consume `DebugSession` rather than execute rules independently.
