import { FilterOptions, FilterResult, Match, TextGuardInstance } from "./types";
import { escapeRegExp } from "./utils/escapeRegExp";

export function createFilter(options: FilterOptions): TextGuardInstance {
  // استخراج کلمات و الگوهای سفارشی کاربر (customWords) در کنار دیکشنری‌های اصلی
  const {
    dictionaries = [],
    customWords = [],
    whitelist = [],
    mask = "*",
    leetspeakMapping = {},
    faLookalikesMapping = {},
  } = options;

  function buildWordRegex(word: string): RegExp {
    const separator = "[\\s\\._\\-*\\u200c\\u0640]*";

    const parts = Array.from(word).map((char) => {
      const lowerChar = char.toLowerCase();

      // الف: بررسی و اعمال نگاشت کاراکترهای مشابه پویا (پکیج فارسی)
      if (faLookalikesMapping[lowerChar]) {
        return `${faLookalikesMapping[lowerChar]}+`;
      }

      // ب: بررسی و اعمال نگاشت لیت‌اسپیک غنی‌شده (پکیج انگلیسی)
      if (leetspeakMapping[lowerChar]) {
        const alternatives = [
          escapeRegExp(lowerChar),
          ...leetspeakMapping[lowerChar].map(escapeRegExp),
        ];
        return `(${alternatives.join("|")})+`;
      }

      // ج: کاراکترهای معمولی
      return `${escapeRegExp(char)}+`;
    });

    return new RegExp(parts.join(separator), "gi");
  }
  // پیدا کردن تمام کلمات نامناسب همراه با جزئیات و موقعیت آن‌ها
  function findBadWords(text: string): Match[] {
    if (!text) return [];
    const matches: Match[] = [];

    // ۱. تبدیل تمام کلمات دیکشنری‌ها به یک لیست فلت
    const dictionaryEntries = dictionaries.flatMap((dict) => dict.words);

    // ۲. تبدیل کلمات سفارشی کاربر (customWords) به فرمت استاندارد Entry
    const customEntries = customWords.map((word) => ({
      word,
      severity: "high" as const,
      category: "custom",
    }));

    // ادغام هر دو لیست دیتابیس ما و کلمات سفارشی کاربر
    const allEntries = [...dictionaryEntries, ...customEntries];

    // سورتیگ کلمات براساس طول (نزولی) برای اولویت دادن به عبارات طولانی‌تر
    // برای ریجکس‌ها طول سورس متنی آن را ملاک قرار می‌دهیم
    const sortedEntries = allEntries.sort((a, b) => {
      const lenA =
        a.word instanceof RegExp ? a.word.source.length : a.word.length;
      const lenB =
        b.word instanceof RegExp ? b.word.source.length : b.word.length;
      return lenB - lenA;
    });

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
          const isWhitelisted = whitelist.some(
            (w) =>
              w.toLowerCase() === matchedText.toLowerCase() ||
              w.toLowerCase() === text.substring(start, end).toLowerCase(),
          );
          if (isWhitelisted) continue;

          // جلوگیری از تداخل با کلماتی که قبلاً بزرگ‌تر بوده‌اند و دیتکت شده‌اند
          const isOverlapped = matches.some(
            (m) =>
              (start >= m.start && start < m.end) ||
              (end > m.start && end <= m.end),
          );

          if (!isOverlapped) {
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
        const regex = buildWordRegex(entry.word);
        regex.lastIndex = 0;

        while ((match = regex.exec(text)) !== null) {
          const matchedText = match[0];
          const start = match.index;
          const end = start + matchedText.length;

          // بررسی لیست سفید (وایت‌لیست)
          const isWhitelisted = whitelist.some(
            (w) =>
              w.toLowerCase() === matchedText.toLowerCase() ||
              w.toLowerCase() === text.substring(start, end).toLowerCase(),
          );
          if (isWhitelisted) continue;

          // جلوگیری از تداخل یا هم‌پوشانی (Overlapping)
          const isOverlapped = matches.some(
            (m) =>
              (start >= m.start && start < m.end) ||
              (end > m.start && end <= m.end),
          );

          if (!isOverlapped) {
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

  // بررسی سریع وجود یا عدم وجود کلمه نامناسب (پرفورمنس بالا)
  function hasBadWord(text: string): boolean {
    if (!text) return false;

    // اگر حتی یک کلمه پیدا شود که وایت‌لیست نباشد، سریعاً true برمی‌گردانیم
    const matches = findBadWords(text);
    return matches.length > 0;
  }

  // سانسور و فیلتر کردن متن
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
    // تغییرات را از آخر به اول اعمال می‌کنیم تا ایندکس‌های شروع (start) به هم نریزند
    const sortedMatchesForReplacement = [...matches].sort(
      (a, b) => b.start - a.start,
    );

    for (const match of sortedMatchesForReplacement) {
      // اگر ماسک ۱ کاراکتر بود (مثل *) آن را به تعداد طول متن هماهنگ‌شده تکرار می‌کنیم، در غیر این صورت کل استرینگ (مثل [سانسور]) را می‌گذاریم
      const maskString =
        mask.length === 1 ? mask.repeat(match.matchedText.length) : mask;

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
