import { describe, it, expect } from "vitest";
import { createFilter } from "./createFilter";
import { Dictionary } from "./types";
import { faInsults, faPatterns, faProfanity } from "@textguard/dictionaries";

// اضافه کردن یک کلمه دارای «ک» برای تست دقیق حروف مشابه
const mockDictionary: Dictionary = {
    name: "test-fa",
    language: "fa",
    version: "1.0.0",
    words: [
        { word: "احمق", severity: "high" },
        { word: "کثیف", severity: "medium" }
    ]
};

describe("TextGuard Regex Engine - Obfuscation Detection", () => {
    const guard = createFilter({
        dictionaries: [mockDictionary]
    });

    it("حالت صفر: تشخیص دقیق و ساده کلمه کثیف", () => {
        expect(guard.hasBadWord("این یک احمق است")).toBe(true);
    });

    it("حالت اول: تشخیص کاراکترهای جداکننده و نمادها", () => {
        expect(guard.hasBadWord("ا.ح.م.ق")).toBe(true);
        expect(guard.hasBadWord("ا_ح_م_ق")).toBe(true);
        expect(guard.hasBadWord("ا*ح*م*ق")).toBe(true);
        expect(guard.hasBadWord("ا-ح-م-ق")).toBe(true);
    });

    it("حالت دوم: تشخیص فاصله‌های معمولی و چندگانه", () => {
        expect(guard.hasBadWord("ا ح م ق")).toBe(true);
        expect(guard.hasBadWord("ا   ح   م   ق")).toBe(true);
    });

    it("حالت سوم: تشخیص نیم‌فاصله (ZWNJ)", () => {
        expect(guard.hasBadWord("ا‌ح‌م‌ق")).toBe(true); // حاوی کاراکتر \u200c
    });

    it("حالت چهارم: تکرار حروف (Padding)", () => {
        expect(guard.hasBadWord("احمممممقققق")).toBe(true);
        expect(guard.hasBadWord("ااححممق")).toBe(true);
    });

    it("حالت پنجم: کشیدگی حروف عربی/فارسی (Kashida)", () => {
        expect(guard.hasBadWord("احـمـق")).toBe(true);
        expect(guard.hasBadWord("احــــــمــــــق")).toBe(true);
    });

    it("حالت ششم: حروف مشابه (Lookalike Characters)", () => {
        // کلمه اصلی «کثیف» با ک فارسی است، اما اینجا با «ك» عربی تست می‌شود
        expect(guard.hasBadWord("این یک كثیف است")).toBe(true);
    });

    it("بررسی عملکرد متد سانسور (filter) و خروجی ساختاریافته", () => {
        const result = guard.filter("تو یک ا.ح.م.ق هستی!");
        expect(result.originalText).toBe("تو یک ا.ح.م.ق هستی!");
        expect(result.filteredText).toBe("تو یک ******* هستی!");
        expect(result.matches).toHaveLength(1);
        expect(result.matches[0].word).toBe("احمق");
    });

    it("تست یکپارچگی: فیلتر کردن متن با استفاده از دیکشنری واقعی پکیج dictionaries", () => {
        const productionGuard = createFilter({
            dictionaries: [faProfanity, faInsults]
        });

        // کلمه «ابله» در faProfanity وجود دارد
        expect(productionGuard.hasBadWord("این یک متن ابلهانه است")).toBe(true);

        const result = productionGuard.filter("عجب آدم ابلهی!");
        expect(result.filteredText).toContain("***");
    });

    it("تست نهایی: فیلتر هوشمند ریجکس، کلمات سفارشی و وایت‌لیست", () => {
        const filterInstance = createFilter({
            dictionaries: [faPatterns],
            customWords: ["تست‌کلمه"],
            whitelist: ["09121111111"] // شماره موبایلی که می‌خواهیم استثنا باشد و سانسور نشود
        });

        // ۱. تست فیلتر شدن شماره موبایل عادی توسط ریجکس پترن
        const res1 = filterInstance.filter("شماره من 09123456789 است");
        expect(res1.filteredText).toContain("***********");

        // ۲. تست وایت‌لیست (شماره استثنا نباید فیلتر شود)
        const res2 = filterInstance.filter("شماره پشتیبانی 09121111111 است");
        expect(res2.filteredText).toContain("09121111111");

        // ۳. تست کلمه سفارشی کاربر
        const res3 = filterInstance.filter("این یک تست‌کلمه است");
        expect(res3.filteredText).toContain("********");
    });
});