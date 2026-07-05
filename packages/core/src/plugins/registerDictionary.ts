import type { Dictionary } from "../types";
import type { PluginContext } from "../domain/pluginContext";
import { DictionaryRule } from "../rules/dictionaryRule";

export function registerDictionary(
  context: PluginContext,
  dictionary: Dictionary,
): void {
  for (const entry of dictionary.words) {
    context.addRule(new DictionaryRule(entry));
  }
}
