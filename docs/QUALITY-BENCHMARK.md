# TextGuard Quality Benchmark

This benchmark is an internal engineering quality gate for the Quality Hardening phase. It is not a public performance SLA and does not add a runtime API or package.

## Run

```bash
pnpm install --frozen-lockfile
pnpm benchmark:quality
```

`benchmark:quality` builds the current monorepo and then benchmarks the built `@textguard/all` bundle from this checkout.

## Workloads

The harness uses representative inputs around 1 KB, 10 KB, and 100 KB. Each workload is warmed up before measurement. Smaller workloads use more iterations because shared CI and developer machines are noisy.

## Operations

The benchmark records median and p95 latency plus median throughput for:

- `filter()`;
- `explain()`;
- raw `debug()` session construction;
- `debug().report()`;
- full Debug timeline construction;
- signal-event projection;
- concise timeline projection.

It also records raw event count, signal event count, full timeline rule count, concise timeline rule count, and event-per-token ratios.

## Interpretation

Use repeated runs and material differences. Small timing changes on shared or developer hardware are not release failures.

The important diagnostic split is:

1. `debug-session` versus `filter` indicates raw collection overhead;
2. `debug-report` versus `debug-session` indicates report-building overhead;
3. `debug-full-timeline` versus `debug-concise-timeline` exposes timeline projection cost;
4. raw versus signal event counts measure developer-facing signal-to-noise independently of runtime cost.

Collector-level architecture should only change if repeated measurements show material raw collection overhead. Presentation-level noise alone is not justification to remove raw trace events.

## Published-artifact comparison

The source benchmark complements, but does not replace, the published-artifact benchmark in `textguard-consumer-validation`. Before a quality checkpoint is accepted, publish only affected packages, update that repository to the new npm versions, rerun its benchmark and complete adversarial matrix, and compare the results with the previous published baseline.
