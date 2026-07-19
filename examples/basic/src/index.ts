import {
  createFilter,
  strictPreset,
  DebugReportBuilder,
  JsonRenderer,
  ConsoleRenderer,
  TimelineBuilder,
} from "@textguard/all";

const engine = createFilter(strictPreset);

const session = engine.debug("سلام کیر test@example.com");

const report = new DebugReportBuilder().build(session);

const timeline = new TimelineBuilder().build(report);

const jsonRenderer = new JsonRenderer();
const consoleRenderer = new ConsoleRenderer();

console.log("====================================");
console.log("Statistics");
console.log("====================================");

console.dir(report.statistics, { depth: null });

console.log("\n====================================");
console.log("Timeline");
console.log("====================================");

console.dir(timeline, { depth: null });

console.log("\n====================================");
console.log("JSON Renderer");
console.log("====================================");

console.log(jsonRenderer.render(report));

console.log("\n====================================");
console.log("Console Renderer");
console.log("====================================");

console.log(consoleRenderer.render(report));

console.log("\n====================================");
console.log("Markdown Renderer");
console.log("====================================");
