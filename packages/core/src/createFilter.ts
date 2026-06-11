import { FilterOptions, FilterResult, Match, TextGuardInstance } from "./types";

export function createFilter(options: FilterOptions): TextGuardInstance {
    // گرفتن دیکشنری‌ها، لیست سفید و کاراکتر ماسک (مقدار پیش‌فرض "*")
    const { dictionaries, whitelist = [], mask = "*" } = options;

    // ترکیب تمام کلمات نامناسب از دیکشنری‌های پاس داده شده
    const allBadWords = dictionaries.flatMap((dict) => dict.words.map((w) => w.word));

    return {
        filter(text: string): FilterResult {
            // TODO: در تسک بعدی این بخش را با Regex Engine هوشمند پر می‌کنیم
            return {
                originalText: text,
                filteredText: text,
                matches: [],
            };
        },

        hasBadWord(text: string): boolean {
            // TODO: پیاده‌سازی تشخیص سریع
            return false;
        },

        findBadWords(text: string): Match[] {
            // TODO: پیدا کردن تمام کلمات نامناسب همراه با موقعیت آن‌ها
            return [];
        },
    };
}