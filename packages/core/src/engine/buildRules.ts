import { DictionaryRule } from "../rules/dictionaryRule";
import type { Rule } from "../domain/rule";
import { buildEntries } from "./buildEntries";
import { sortEntries } from "./sortEntries";
import { EngineState } from "./state";

export function buildRules(state: EngineState): readonly Rule[] {
  return sortEntries(buildEntries(state.dictionaries, state.customWords)).map(
    (entry) => new DictionaryRule(entry),
  );
}
