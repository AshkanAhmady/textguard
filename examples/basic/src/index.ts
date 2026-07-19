import {
  createFilter,
  strictPreset,
  JsonRenderer,
  DebugReportBuilder,
} from "@textguard/all";

const renderer = new JsonRenderer();

const engine = createFilter(strictPreset);

const session = engine.debug("کیر");

const report = new DebugReportBuilder().build(session);

console.log(renderer.render(report));
console.log(renderer.render(session));
console.log(report.statistics);
console.log(report.events.length);
