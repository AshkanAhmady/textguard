import type { Match } from "../domain/match";
import type { FilterOptions, FilterResult, TextGuardInstance } from "../types";
import { buildEntries } from "./buildEntries";
import { buildWordRegex } from "./buildWordRegex";
import { isOverlapped, isWhitelisted } from "./helpers";
import { sortEntries } from "./sortEntries";
import { EngineState } from "./state";

export function createEngine(options: FilterOptions): TextGuardInstance {
  const state: EngineState = {
    dictionaries: options.dictionaries ?? [],
    customWords: options.customWords ?? [],
    whitelist: options.whitelist ?? [],
    mask: options.mask ?? "*",
    leetspeakMapping: options.leetspeakMapping ?? {},
    faLookalikesMapping: options.faLookalikesMapping ?? {},
  };

  function findBadWords(text: string): Match[] {
    if (!text) return [];
    const matches: Match[] = [];

    // ادغام هر دو لیست دیتابیس ما و کلمات سفارشی کاربر
    const allEntries = buildEntries(state.dictionaries, state.customWords);

    // سورتیگ کلمات براساس طول (نزولی) برای اولویت دادن به عبارات طولانی‌تر
    // برای ریجکس‌ها طول سورس متنی آن را ملاک قرار می‌دهیم
    const sortedEntries = sortEntries(allEntries);

    for (const entry of sortedEntries) {
      let match;

      // ─── لایه اول: مدیریت هوشمند الگوهای منظم (RegExp) ───
      if (entry.word instanceof RegExp) {
        // مطمئن می‌شویم که فلگ global (g) فعال است تا همه تکرارهای الگو را در متن پیدا کند
        const flags = entry.word.flags.includes("g")
          ? entry.word.flags
          : entry.word.flags + "g";
        const regex = new RegExp(entry.word.source, flags);

        regex.lastIndex = 0;
        while ((match = regex.exec(text)) !== null) {
          const matchedText = match[0];
          if (!matchedText) break; // جلوگیری از حلقه‌های بی‌نهایت در ریجکس‌های خاص با طول صفر

          const start = match.index;
          const end = start + matchedText.length;

          // بررسی لیست سفید (وایت‌لیست) برای ریجکس
          if (isWhitelisted(state.whitelist, matchedText, text, start, end)) {
            continue;
          }

          if (!isOverlapped(matches, start, end)) {
            matches.push({
              word: entry.word.source, // ذخیره سورس ریجکس به عنوان مرجع کلمه
              matchedText,
              start,
              end,
            });
          }
        }
      }
      // ─── لایه دوم: همان منطق رشته‌های معمولی و خنثی‌سازی ۶ حالته شما ───
      else {
        const regex = buildWordRegex(entry.word, {
          leetspeakMapping: state.leetspeakMapping,
          faLookalikesMapping: state.faLookalikesMapping,
        });
        regex.lastIndex = 0;

        while ((match = regex.exec(text)) !== null) {
          const matchedText = match[0];
          const start = match.index;
          const end = start + matchedText.length;

          // بررسی لیست سفید (وایت‌لیست)
          if (isWhitelisted(state.whitelist, matchedText, text, start, end)) {
            continue;
          }

          if (!isOverlapped(matches, start, end)) {
            matches.push({
              word: entry.word,
              matchedText,
              start,
              end,
            });
          }
        }
      }
    }

    // مرتب‌سازی نهایی مچ‌ها براساس موقعیت شروع در متن
    return matches.sort((a, b) => a.start - b.start);
  }

  function hasBadWord(text: string): boolean {
    if (!text) return false;

    return findBadWords(text).length > 0;
  }

  function filter(text: string): FilterResult {
    const matches = findBadWords(text);

    if (matches.length === 0) {
      return {
        originalText: text,
        filteredText: text,
        matches: [],
      };
    }

    let filteredText = text;

    const sortedMatchesForReplacement = [...matches].sort(
      (a, b) => b.start - a.start,
    );

    for (const match of sortedMatchesForReplacement) {
      const maskString =
        state.mask.length === 1
          ? state.mask.repeat(match.matchedText.length)
          : state.mask;

      filteredText =
        filteredText.substring(0, match.start) +
        maskString +
        filteredText.substring(match.end);
    }

    return {
      originalText: text,
      filteredText,
      matches,
    };
  }

  return {
    filter,
    hasBadWord,
    findBadWords,
  };
}
