import { createFilter, strictPreset } from "@textguard/all";

const engine = createFilter(strictPreset);

const session = engine.debug("سلام");

console.log(session.getEvents());
