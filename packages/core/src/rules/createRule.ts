import type { DictionaryEntry } from "../types";
import type { Rule } from "../domain/rule";
import { DictionaryRule } from "./dictionaryRule";

export function createRule(entry: DictionaryEntry): Rule {
  return new DictionaryRule(entry);
}
