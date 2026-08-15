import { performance } from "node:perf_hooks";
import { createFilter, strictPreset } from "../packages/all/dist/index.js";

const quantile = (values, q) => {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil(sorted.length * q) - 1),
  );
  return sorted[index];
};

const buildInput = (targetLength) => {
  const unit =
    "clean developer text with occasional asshole and contact markers repeated for benchmark stability. ";
  let value = "";
  while (value.length < targetLength) value += unit;
  return value.slice(0, targetLength);
};

const workloads = [
  { name: "small", bytes: 1_000, iterations: 80 },
  { name: "medium", bytes: 10_000, iterations: 30 },
  { name: "large", bytes: 100_000, iterations: 8 },
];

const filter = createFilter(strictPreset);
const results = [];

function measure(operation, workload, run) {
  for (let i = 0; i < 5; i += 1) run();

  const samples = [];
  for (let i = 0; i < workload.iterations; i += 1) {
    const started = performance.now();
    run();
    samples.push(performance.now() - started);
  }

  const medianMs = quantile(samples, 0.5);
  const p95Ms = quantile(samples, 0.95);

  return {
    operation,
    iterations: workload.iterations,
    medianMs: Number(medianMs.toFixed(3)),
    p95Ms: Number(p95Ms.toFixed(3)),
    medianMBPerSecond: Number(
      ((workload.bytes / 1_000_000) / (medianMs / 1000)).toFixed(3),
    ),
  };
}

for (const workload of workloads) {
  const input = buildInput(workload.bytes);
  const tokenCount = input.trim().split(/\s+/u).length;

  const operations = [
    ["filter", () => filter.filter(input)],
    ["explain", () => filter.explain(input)],
    ["debug-session", () => filter.debug(input)],
    ["debug-report", () => filter.debug(input).report()],
    ["debug-full-timeline", () => filter.debug(input).timeline()],
    [
      "debug-signal-events",
      () => filter.debug(input).getSignalEvents(),
    ],
    [
      "debug-concise-timeline",
      () => filter.debug(input).timeline({ includeEmptyRules: false }),
    ],
  ];

  for (const [operation, run] of operations) {
    const measurement = measure(operation, workload, run);
    results.push({
      workload: workload.name,
      bytes: workload.bytes,
      tokenCount,
      ...measurement,
    });
  }

  const session = filter.debug(input);
  const rawEvents = session.getEvents();
  const signalEvents = session.getSignalEvents();
  const fullTimeline = session.timeline();
  const conciseTimeline = session.timeline({ includeEmptyRules: false });
  const fullRules = fullTimeline.plugins.reduce(
    (count, plugin) => count + plugin.rules.length,
    0,
  );
  const conciseRules = conciseTimeline.plugins.reduce(
    (count, plugin) => count + plugin.rules.length,
    0,
  );

  results.push({
    workload: workload.name,
    bytes: workload.bytes,
    tokenCount,
    operation: "debug-volume",
    rawEventCount: rawEvents.length,
    signalEventCount: signalEvents.length,
    rawEventsPerToken: Number((rawEvents.length / tokenCount).toFixed(3)),
    signalEventsPerToken: Number((signalEvents.length / tokenCount).toFixed(3)),
    fullTimelineRuleCount: fullRules,
    conciseTimelineRuleCount: conciseRules,
  });
}

console.log(
  JSON.stringify(
    {
      schemaVersion: 1,
      node: process.version,
      platform: `${process.platform}-${process.arch}`,
      source: "textguard-monorepo-current-build",
      notes: [
        "Run `pnpm build` before this benchmark.",
        "Shared CI timings are observational, not a release SLA.",
        "Compare repeated runs and material changes rather than tiny deltas.",
      ],
      results,
    },
    null,
    2,
  ),
);
