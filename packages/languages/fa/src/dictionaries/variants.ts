import type { Dictionary } from "@textguard/core";

/**
 * Common colloquial/misspelled forms observed in real sentence-level usage.
 * Keep this list explicit rather than broadening Persian morphology globally.
 */
export const faProfanityVariants: Dictionary = {
  name: "fa-profanity-variants",
  language: "fa",
  version: "1.0.0",
  words: [
    { word: "خارمادر", severity: "high", category: "profanity" },
    { word: "گاییم", severity: "high", category: "profanity" },
  ],
};
