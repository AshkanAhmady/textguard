import type { Plugin } from "../domain/plugin";
import type { PluginContext } from "../domain/pluginContext";
import type { Rule } from "../domain/rule";
import type { Normalizer } from "../domain/normalizer";
import type { RuleCollection } from "../engine/ruleCollection";
import type { NormalizerCollection } from "../engine/normalizerCollection";

export function createPluginContext(
  plugin: Plugin,
  rules: RuleCollection,
  normalizers: NormalizerCollection,
): PluginContext {
  return {
    addRule(rule: Rule): void {
      rules.add(rule, plugin.name);
    },

    addNormalizer(normalizer: Normalizer): void {
      normalizers.add(normalizer);
    },
  };
}
