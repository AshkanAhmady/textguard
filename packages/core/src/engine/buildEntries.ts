import type { Dictionary } from "../types";

export function buildEntries(
  dictionaries: Dictionary[],
  customWords: (string | RegExp)[],
) {
  const dictionaryEntries = dictionaries.flatMap((dict) => dict.words);

  const customEntries = customWords.map((word) => ({
    word,
    severity: "high" as const,
    category: "custom",
  }));

  return [...dictionaryEntries, ...customEntries];
}
