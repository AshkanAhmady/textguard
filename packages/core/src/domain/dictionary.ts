import { RuleSeverity } from "../types/severity";

export interface DictionaryEntry {
  word: string | RegExp;
  severity: RuleSeverity;
  category?: string;
}

export interface Dictionary {
  readonly name: string;
  readonly language: string;
  readonly version: string;
  readonly words: readonly DictionaryEntry[];
}
