interface Dictionary {
    name: string;
    language: string;
    version: string;
    words: Array<{
        word: string | RegExp;
        severity: "high" | "medium" | "low";
        category?: string;
    }>;
}

export const faInsults: Dictionary = {
    name: "fa-insults",
    language: "fa",
    version: "1.0.0",
    words: [
        // === توهین‌های ناموسی لایت و دیاثت ===
        { word: "دیوث", severity: "high", category: "insult" },
        { word: "دیوص", severity: "high", category: "insult" },
        { word: "دیوس", severity: "high", category: "insult" },
        { word: "دیوس خان", severity: "high", category: "insult" },
        { word: "بیناموس", severity: "high", category: "insult" },
        { word: "بیناموس", severity: "high", category: "insult" },
        { word: "قرمصاق", severity: "high", category: "insult" },
        { word: "قرمساق", severity: "high", category: "insult" },
        { word: "غرمساق", severity: "high", category: "insult" },
        { word: "غرمصاق", severity: "high", category: "insult" },
        { word: "زن قوه", severity: "high", category: "insult" },
        { word: "بی شرف", severity: "high", category: "insult" },
        { word: "بی آبرو", severity: "high", category: "insult" },
        { word: "بی غیرت", severity: "high", category: "insult" },
        { word: "بی عفت", severity: "high", category: "insult" },
        { word: "لاشی", severity: "high", category: "insult" },
        { word: "هرزه", severity: "high", category: "insult" },
        { word: "سلیطه", severity: "high", category: "insult" },

        // === حرام‌زادگی و بی‌‌پدری ===
        { word: "حرومزاده", severity: "high", category: "insult" },
        { word: "حروم‌لقمه", severity: "high", category: "insult" },
        { word: "حرومی", severity: "high", category: "insult" },
        { word: "بی پدر", severity: "high", category: "insult" },
        { word: "بی پدرو مادر", severity: "high", category: "insult" },
        { word: "هزار پدر", severity: "high", category: "insult" },
        { word: "ننه مرده", severity: "medium", category: "insult" },

        // === توهین‌های شخصیتی و ضریب هوشی (سخت‌گیرانه) ===
        { word: "احمق", severity: "high", category: "insult" },
        { word: "ابله", severity: "high", category: "insult" },
        { word: "بیشعور", severity: "high", category: "insult" },
        { word: "بی شعور", severity: "high", category: "insult" },
        { word: "اسکل", severity: "high", category: "insult" },
        { word: "اسگل", severity: "high", category: "insult" },
        { word: "اوسکل", severity: "high", category: "insult" },
        { word: "اوسگل", severity: "high", category: "insult" },
        { word: "اوصگل", severity: "high", category: "insult" },
        { word: "اوصکل", severity: "high", category: "insult" },
        { word: "اصکل", severity: "high", category: "insult" },
        { word: "کسخل", severity: "high", category: "insult" },
        { word: "کصخل", severity: "high", category: "insult" },
        { word: "کس خل", severity: "high", category: "insult" },
        { word: "خرفت", severity: "high", category: "insult" },
        { word: "نفهم", severity: "medium", category: "insult" },
        { word: "گاگول", severity: "medium", category: "insult" },
        { word: "ملنگ", severity: "medium", category: "insult" },
        { word: "پپه", severity: "low", category: "insult" },
        { word: "خng", severity: "low", category: "insult" },
        { word: "خنگ", severity: "low", category: "insult" },
        { word: "دلقک", severity: "medium", category: "insult" },
        { word: "بدبخت", severity: "medium", category: "insult" },
        { word: "بی عرضه", severity: "low", category: "insult" },
        { word: "بی مصرف", severity: "low", category: "insult" },

        // === نسبت دادن حیوانی (Animal Insults) ===
        { word: "پدرسگ", severity: "high", category: "insult" },
        { word: "پدر سگ", severity: "high", category: "insult" },
        { word: "مادرسگ", severity: "high", category: "insult" },
        { word: "سگ پدر", severity: "high", category: "insult" },
        { word: "تخم‌سگ", severity: "high", category: "insult" },
        { word: "تخمسگ", severity: "high", category: "insult" },
        { word: "توله سگ", severity: "high", category: "insult" },
        { word: "سگی", severity: "medium", category: "insult" },
        { word: "سگ صفت", severity: "high", category: "insult" },
        { word: "حیوانی", severity: "medium", category: "insult" },
        { word: "شغال", severity: "medium", category: "insult" },
        { word: "انگل", severity: "high", category: "insult" },
        { word: "کرم", severity: "low", category: "insult" },
        { word: "خر", severity: "medium", category: "insult" },
        { word: "خری", severity: "medium", category: "insult" },
        { word: "گاو", severity: "medium", category: "insult" },
        { word: "گاوی", severity: "medium", category: "insult" },
        { word: "اسب", severity: "low", category: "insult" },
        { word: "اسبی", severity: "low", category: "insult" },
        { word: "گوسفند", severity: "low", category: "insult" },
        { word: "الاغ", severity: "medium", category: "insult" },
        { word: "الاق", severity: "medium", category: "insult" },

        // === عبارات طردکننده و دستوری زشت ===
        { word: "سیکتیر", severity: "high", category: "insult" },
        { word: "خفه شو", severity: "medium", category: "insult" },
        { word: "خفه", severity: "medium", category: "insult" },
        { word: "خفه خون", severity: "high", category: "insult" },
        { word: "دهنتوببند", severity: "medium", category: "insult" },
        { word: "زرنزن", severity: "medium", category: "insult" },
        { word: "زر نزن", severity: "medium", category: "insult" },
        { word: "گمشو", severity: "medium", category: "insult" },
        { word: "مرتیکه", severity: "medium", category: "insult" },
        { word: "مردیکه", severity: "medium", category: "insult" },
        { word: "زنیکه", severity: "medium", category: "insult" },

        // === صفات و عبارات تحقیرآمیز فرعی ===
        { word: "پشمام", severity: "low", category: "insult" },
        { word: "پلشت", severity: "medium", category: "insult" },
        { word: "آشغال", severity: "medium", category: "insult" },
        { word: "دهن سرویس", severity: "medium", category: "insult" },
        { word: "پدر سوخته", severity: "medium", category: "insult" },
        { word: "پدر صلواتی", severity: "low", category: "insult" },
        { word: "لامصب", severity: "low", category: "insult" },
        { word: "عوضی", severity: "medium", category: "insult" },
        { word: "پاچه‌خوار", severity: "medium", category: "insult" },
        { word: "مفت‌خور", severity: "medium", category: "insult" },
        { word: "لاشخور", severity: "medium", category: "insult" },
        { word: "خبیث", severity: "medium", category: "insult" },
        { word: "بدطینت", severity: "medium", category: "insult" },
        { word: "زالو", severity: "medium", category: "insult" },
        { word: "ناکس", severity: "medium", category: "insult" },
        { word: "عقده‌ای", severity: "high", category: "insult" },
        { word: "چاقال", severity: "high", category: "insult" },
        { word: "چاغال", severity: "high", category: "insult" },
        { word: "دوزاری", severity: "medium", category: "insult" },
        { word: "قرمدنگ", severity: "medium", category: "insult" },
        { word: "جفنگ", severity: "low", category: "insult" },
        { word: "بی فانوس", severity: "medium", category: "insult" }
    ],
};