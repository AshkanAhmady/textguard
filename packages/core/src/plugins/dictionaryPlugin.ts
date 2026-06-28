import type { Dictionary } from "../types";
import type { Plugin } from "../domain/plugin";
import type { PluginContext } from "../domain/pluginContext";
import { DictionaryRule } from "../rules/dictionaryRule";

export class DictionaryPlugin implements Plugin {
  readonly name = "dictionary";

  constructor(
    private readonly dictionaries: readonly Dictionary[],
    private readonly customWords: readonly (string | RegExp)[],
  ) {}

  setup(context: PluginContext): void {
    for (const dictionary of this.dictionaries) {
      for (const entry of dictionary.words) {
        context.addRule(new DictionaryRule(entry));
      }
    }

    for (const word of this.customWords) {
      context.addRule(
        new DictionaryRule({
          word,
          category: "custom",
          severity: "high",
        }),
      );
    }
  }
}
