import type { Dictionary } from "@textguard/core";

import { arInsults } from "./insults";
import { arProfanity } from "./profanity";

export { arProfanity };
export { arInsults };

export const arPack = {
  profanity: arProfanity,
  insults: arInsults,
};

export const arDictionary: Dictionary = {
  name: "ar",
  language: "ar",
  version: "1.0.0",
  words: [...arProfanity.words, ...arInsults.words],
};

export const arLanguage = {
  code: "ar",
  nativeName: "العربية",
  englishName: "Arabic",
};
