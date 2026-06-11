export interface DictionaryEntry {
  word: string;
  severity?: "low" | "medium" | "high";
  category?: string;
}

export interface Dictionary {
  name: string;
  language: string;
  version: string;
  words: DictionaryEntry[];
}

export interface FilterOptions {
  dictionaries: Dictionary[];
  whitelist?: string[];
  mask?: string; // مثلاً "***" یا "###" یا "🌟"
}

export interface Match {
  word: string;
  matchedText: string;
  start: number;
  end: number;
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