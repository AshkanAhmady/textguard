import type { Match } from "../domain/match";
import { buildWordRegex } from "./buildWordRegex";
import { isOverlapped, isWhitelisted } from "./helpers";
import type { EngineState } from "./state";
import type { Entry } from "./buildEntries";

export function findMatches(
  text: string,
  rules: readonly Entry[],
  state: EngineState,
): Match[] {
  if (!text) return [];
  const matches: Match[] = [];

  for (const entry of rules) {
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
