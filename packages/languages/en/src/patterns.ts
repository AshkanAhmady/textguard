import type { Dictionary } from "@textguard/core";

export const enPatterns: Dictionary = {
  name: "en-patterns",
  language: "en",
  version: "1.0.0",
  words: [
    // Standard email detection. Keep this as RegExp so DictionaryRule uses
    // explicit pattern semantics rather than generated word-obfuscation matching.
    {
      word: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
      severity: "high",
      category: "pattern",
    },
    // URL/domain detection for direct language-pack consumers.
    {
      word: /(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+[^\s]*/,
      severity: "high",
      category: "pattern",
    },
  ],
};
