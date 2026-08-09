import type { Dictionary } from "@textguard/core";

export const arProfanity: Dictionary = {
  name: "ar-profanity",
  language: "ar",
  version: "1.0.0",
  words: [
    { word: "قحبة", severity: "high", category: "profanity" },
    { word: "شرموط", severity: "high", category: "profanity" },
    { word: "شرموطة", severity: "high", category: "profanity" },
    { word: "كس امك", severity: "high", category: "profanity" },
    { word: "كس أمك", severity: "high", category: "profanity" },
    { word: "ابن القحبة", severity: "high", category: "profanity" },
  ],
};
