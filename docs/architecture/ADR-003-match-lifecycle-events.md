# ADR-003: Explicit Match Lifecycle Events

## Status

Accepted

## Context

The Debug Engine already emitted `match:found`, but that event is produced as soon as a rule returns a candidate. Overlap resolution happens afterwards, so a `match:found` event does not guarantee that the candidate survives into the final result.

M5.1 made `DebugSession#getMatches()` the authoritative final result, but Explain API still needs the execution history to state clearly which candidates survived and which were discarded.

## Decision

Keep `match:found` unchanged for backward compatibility and define it as a candidate-discovery event.

Add two explicit lifecycle events:

- `match:accepted` — emitted only for matches that remain in the final overlap-resolved result.
- `match:rejected` — emitted for a candidate removed by overlap resolution. The event records `reason: "overlap"` and the winning `Match`.

Accepted events are emitted after all rules finish so they represent final acceptance rather than provisional acceptance. Rejected events may be emitted when overlap resolution makes the rejection final.

The existing overlap-selection algorithm is intentionally unchanged in this milestone. This ADR describes observability semantics, not a new ranking policy.

New `ExecutionObserver` lifecycle callbacks are optional so existing observer implementations remain source-compatible.

## Consequences

- Debug and future Explain consumers can distinguish discovered candidates from final matches without reconstructing state heuristically.
- Existing `match:found` consumers continue to work with the same meaning and payload.
- `DebugSession#getMatches()` remains the authoritative final output; lifecycle events explain how execution arrived there.
- Overlap policy debt remains separate and can be addressed later without changing these lifecycle concepts.
- Rule/plugin metadata beyond the current plugin/rule names remains deferred to M5.3.
