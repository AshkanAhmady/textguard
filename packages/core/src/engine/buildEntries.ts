import type { Dictionary, DictionaryEntry } from "../types";

export type Entry = DictionaryEntry;

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
