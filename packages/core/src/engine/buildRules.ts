import { Rule } from "../domain/rule";
import { createRule } from "../rules/createRule";
import { buildEntries } from "./buildEntries";
import { sortEntries } from "./sortEntries";
import { EngineState } from "./state";

export function buildRules(state: EngineState): readonly Rule[] {
  const entries = sortEntries(
    buildEntries(state.dictionaries, state.customWords),
  );

  const rules = entries.map(createRule);

  return rules;
}
