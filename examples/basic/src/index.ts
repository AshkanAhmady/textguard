import { createFilter, strictPreset } from "@textguard/all";

const engine = createFilter(strictPreset);

const session = engine.debug("کیر");

console.log(session.getEvents());
