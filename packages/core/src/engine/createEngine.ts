import type { Match } from "../domain/match";
import type { FilterOptions, FilterResult, TextGuardInstance } from "../types";
import { findMatches } from "./findMatches";
import { createEngineState } from "./state";
import { NormalizationPipeline } from "./normalizationPipeline";
import { UnicodeNormalizer } from "../normalizers/unicodeNormalizer";
import { PersianNormalizer } from "../normalizers/persianNormalizer";
import { ArabicNormalizer } from "../normalizers/arabicNormalizer";
import { PluginContext } from "../domain/pluginContext";
import { PluginManager } from "./pluginManager";
import { RuleCollection } from "./ruleCollection";
import { NormalizerCollection } from "./normalizerCollection";
import { DictionaryPlugin } from "../plugins/dictionaryPlugin";

export function createEngine(options: FilterOptions): TextGuardInstance {
  const state = createEngineState(options);
  const ruleCollection = new RuleCollection();
  const normalizerCollection = new NormalizerCollection([
    new UnicodeNormalizer(),
    new PersianNormalizer(),
    new ArabicNormalizer(),
  ]);

  const pipeline = new NormalizationPipeline(normalizerCollection.getAll());
  const pluginContext: PluginContext = {
    addRule(rule) {
      ruleCollection.add(rule);
    },

    addNormalizer(normalizer) {
      normalizerCollection.add(normalizer);
    },
  };
  const pluginManager = new PluginManager(pluginContext);
  pluginManager.register(new DictionaryPlugin(state.dictionaries));

  function findBadWords(text: string): Match[] {
    if (!text) return [];

    const normalizedText = pipeline.run(text);

    return findMatches(ruleCollection.getAll(), {
      text: normalizedText,
      state,
    });
  }

  function hasBadWord(text: string): boolean {
    if (!text) return false;

    return findBadWords(text).length > 0;
  }

  function filter(text: string): FilterResult {
    const matches = findBadWords(text);

    if (matches.length === 0) {
      return {
        originalText: text,
        filteredText: text,
        matches: [],
      };
    }

    let filteredText = text;

    const sortedMatchesForReplacement = [...matches].sort(
      (a, b) => b.start - a.start,
    );

    for (const match of sortedMatchesForReplacement) {
      const maskString =
        state.mask.length === 1
          ? state.mask.repeat(match.matchedText.length)
          : state.mask;

      filteredText =
        filteredText.substring(0, match.start) +
        maskString +
        filteredText.substring(match.end);
    }

    return {
      originalText: text,
      filteredText,
      matches,
    };
  }

  return {
    filter,
    hasBadWord,
    findBadWords,
    use(plugin) {
      pluginManager.register(plugin);
    },
  };
}
