import { buildEntries, type Entry } from "./buildEntries";
import { sortEntries } from "./sortEntries";
import type { EngineState } from "./state";

export function buildRules(state: EngineState): readonly Entry[] {
  return sortEntries(buildEntries(state.dictionaries, state.customWords));
}
