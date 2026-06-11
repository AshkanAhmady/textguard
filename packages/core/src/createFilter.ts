import { FilterOptions, FilterResult, Match, TextGuardInstance } from "./types";

// مپینگ حروف مشابه برای خنثی‌سازی ترفند تشابه کاراکترها
const LOOKALIKES: Record<string, string> = {
    'ک': '[کك]', 'ك': '[کك]',
    'ی': '[یی‌ي]', 'ي': '[یی‌ي]',
    'ا': '[ااآأإ]', 'آ': '[ااآأإ]', 'أ': '[ااآأإ]', 'إ': '[ااآأإ]',
    // حروف مشابه انگلیسی (اختیاری اما بسیار کاربردی)
    'o': '[o0]', '0': '[o0]',
    'i': '[i1l|]', 'l': '[i1l|]', '1': '[i1l|]',
    'a': '[a@4]', 'e': '[e3]',
    's': '[s5$]', 't': '[t7]',
};

// تابع کمکی برای Escape کردن کاراکترهای خاص در Regex
function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// موتور ساخت Regex پویا برای هر کلمه
function buildWordRegex(word: string): RegExp {
    // جداکننده‌های مجاز: فاصله، نقطه، خط‌تیره، آندراسکور، ستاره، نیم‌فاصله (\u200c) و کشیدگی حروف (\u0640)
    const separator = '[\\s\\._\\-*\\u200c\\u0640]*';

    const parts = Array.from(word).map((char) => {
        const lowerChar = char.toLowerCase();
        const pattern = LOOKALIKES[lowerChar] || escapeRegExp(char);
        return `${pattern}+`; // علامت + تکرار حروف (مثل احممممق) را پوشش می‌دهد
    });

    return new RegExp(parts.join(separator), 'gi');
}

export function createFilter(options: FilterOptions): TextGuardInstance {
    const { dictionaries, whitelist = [], mask = "*" } = options;

    // پیدا کردن تمام کلمات نامناسب همراه با جزئیات و موقعیت آن‌ها
    function findBadWords(text: string): Match[] {
        if (!text) return [];
        const matches: Match[] = [];

        // سورتیگ کلمات دیکشنری براساس طول (نزولی) برای اولویت دادن به عبارات طولانی‌تر
        const sortedWords = [...dictionaries]
            .flatMap((dict) => dict.words)
            .sort((a, b) => b.word.length - a.word.length);

        for (const entry of sortedWords) {
            const regex = buildWordRegex(entry.word);
            let match;

            regex.lastIndex = 0;
            while ((match = regex.exec(text)) !== null) {
                const matchedText = match[0];
                const start = match.index;
                const end = start + matchedText.length;

                // بررسی لیست سفید (وایت‌لیست)
                const isWhitelisted = whitelist.some(
                    (w) => w.toLowerCase() === matchedText.toLowerCase() ||
                        w.toLowerCase() === text.substring(start, end).toLowerCase()
                );

                if (isWhitelisted) continue;

                // جلوگیری از تداخل یا هم‌پوشانی (Overlapping) با کلماتی که قبلاً بزرگ‌تر بوده‌اند و دیتکت شده‌اند
                const isOverlapped = matches.some(
                    (m) => (start >= m.start && start < m.end) || (end > m.start && end <= m.end)
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
        const sortedMatchesForReplacement = [...matches].sort((a, b) => b.start - a.start);

        for (const match of sortedMatchesForReplacement) {
            // اگر ماسک ۱ کاراکتر بود (مثل *) آن را به تعداد طول متن هماهنگ‌شده تکرار می‌کنیم، در غیر این صورت کل استرینگ (مثل [سانسور]) را می‌گذاریم
            const maskString = mask.length === 1 ? mask.repeat(match.matchedText.length) : mask;

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