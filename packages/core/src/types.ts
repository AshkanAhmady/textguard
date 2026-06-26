import { Match } from "./domain/match";
import type { Dictionary, DictionaryEntry } from "./domain/dictionary";

export interface FilterOptions {
  dictionaries?: Dictionary[];
  customWords?: (string | RegExp)[];
  whitelist?: string[];
  mask?: string; // مثلاً "***" یا "###" یا "🌟"
  leetspeakMapping?: Record<string, string[]>;
  faLookalikesMapping?: Record<string, string>;
}

export interface FilterResult {
  originalText: string;
  filteredText: string;
  matches: Match[];
}

export interface TextGuardInstance {
  hasBadWord(text: string): boolean;
  findBadWords(text: string): Match[];
  filter(text: string): FilterResult;
}

export type { Dictionary, DictionaryEntry };
