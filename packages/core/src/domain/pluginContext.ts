import type { Rule } from "./rule";
import type { Normalizer } from "./normalizer";
import type { Dictionary } from "../types";

export interface PluginContext {
  addRule(rule: Rule): void;
  addNormalizer(normalizer: Normalizer): void;
  addDictionary(dictionary: Dictionary): void;
}
