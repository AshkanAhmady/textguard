import type { Dictionary } from "@textguard/core";

export const arProfanity: Dictionary = {
  name: "ar-profanity",
  language: "ar",
  version: "1.0.0",
  words: [
    { word: "قحبه", severity: "high", category: "profanity" },
    { word: "شرموط", severity: "high", category: "profanity" },
    { word: "شرموطه", severity: "high", category: "profanity" },
    { word: "کس امک", severity: "high", category: "profanity" },
    { word: "ابن القحبه", severity: "high", category: "profanity" },
  ],
};
