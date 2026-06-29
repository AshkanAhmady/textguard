import type { Dictionary } from "@textguard/core";

import { enInsults } from "./insults";
import { enLeetspeakMapping } from "./leetspeak";
import { enPatterns } from "./patterns";
import { enProfanity } from "./profanity";
import { enSpam } from "./spam";

export { enProfanity };
export { enInsults };
export { enSpam };
export { enPatterns };
export { enLeetspeakMapping };

export const enPack = {
  profanity: enProfanity,
  insults: enInsults,
  spam: enSpam,
  patterns: enPatterns,
  leetspeak: enLeetspeakMapping,
};

export const enDictionary: Dictionary = {
  name: "en",
  language: "en",
  version: "1.0.0",
  words: [
    ...enProfanity.words,
    ...enInsults.words,
    ...enSpam.words,
    ...enPatterns.words,
  ],
};
