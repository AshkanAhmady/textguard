import { Match } from "./domain/match";
import type { Dictionary, DictionaryEntry } from "./domain/dictionary";
import type { Plugin } from "./domain/plugin";
import type { DebugSession } from "./debug";
import type { ExplainResult } from "./explain";

export interface FilterOptions {
  dictionaries?: Dictionary[];
  customWords?: (string | RegExp)[];
  whitelist?: string[];
  mask?: string; // مثلاً "***" یا "###" یا "🌟"
  leetspeakMapping?: Record<string, string[]>;
  faLookalikesMapping?: Record<string, string>;
  plugins?: Plugin[];
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
  debug(text: string): DebugSession;
  explain(text: string): ExplainResult;
  use(plugin: Plugin): void;
}

export type { Dictionary, DictionaryEntry };
