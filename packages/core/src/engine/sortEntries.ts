import type { DictionaryEntry } from "../domain/dictionary";

type Entry = DictionaryEntry & {
  word: string | RegExp;
};

export function sortEntries(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => {
    const lenA =
      a.word instanceof RegExp ? a.word.source.length : a.word.length;

    const lenB =
      b.word instanceof RegExp ? b.word.source.length : b.word.length;

    return lenB - lenA;
  });
}
