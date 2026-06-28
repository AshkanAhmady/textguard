import type { Rule } from "./rule";
import type { Normalizer } from "./normalizer";

export interface PluginContext {
  addRule(rule: Rule): void;

  addNormalizer(normalizer: Normalizer): void;
}
