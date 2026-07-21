import {
  createFilter,
  strictPreset,
  JsonRenderer,
  ConsoleRenderer,
} from "@textguard/all";

const engine = createFilter(strictPreset);

const session = engine.debug("کیر");

const report = session.report();

const renderer = new JsonRenderer();

console.log(renderer.render(report));

const consoleRenderer = new ConsoleRenderer();

console.log(consoleRenderer.render(report));
