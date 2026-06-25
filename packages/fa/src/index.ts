import type { Dictionary } from "@textguard/core";

import { faInsults } from "./insults";
import { faLookalikesMapping } from "./lookalikes";
import { faPatterns } from "./patterns";
import { faProfanity } from "./profanity";
import { faSpam } from "./spam";

export { faProfanity };
export { faInsults };
export { faSpam };
export { faPatterns };
export { faLookalikesMapping };

export const faPack = {
  profanity: faProfanity,
  insults: faInsults,
  spam: faSpam,
  patterns: faPatterns,
  lookalikes: faLookalikesMapping,
};

export const faDictionary: Dictionary = {
  name: "fa",
  language: "fa",
  version: "1.0.0",
  words: [
    ...faProfanity.words,
    ...faInsults.words,
    ...faSpam.words,
    ...faPatterns.words,
  ],
};
