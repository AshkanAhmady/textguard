import { createFilter } from "@textguard/all";

const engine = createFilter({
  plugins: [],
});

const session = engine.debug("سلام دنیا");

console.log(session.getEvents());
