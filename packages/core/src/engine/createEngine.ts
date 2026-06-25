import type { FilterOptions, TextGuardInstance } from "../types";
import type { EngineState } from "./state";

export function createEngine(options: FilterOptions): TextGuardInstance {
  const state: EngineState = {
    dictionaries: options.dictionaries ?? [],
    customWords: options.customWords ?? [],
    whitelist: options.whitelist ?? [],
    mask: options.mask ?? "*",
    leetspeakMapping: options.leetspeakMapping ?? {},
    faLookalikesMapping: options.faLookalikesMapping ?? {},
  };

  return {
    hasBadWord() {
      void state;
      throw new Error("Not implemented");
    },

    findBadWords() {
      void state;
      throw new Error("Not implemented");
    },

    filter() {
      void state;
      throw new Error("Not implemented");
    },
  };
}
