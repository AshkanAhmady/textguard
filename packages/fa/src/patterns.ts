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

export const faPatterns: Dictionary = {
    name: "fa-patterns",
    language: "fa",
    version: "1.0.0",
    words: [
        // ۱. تشخیص هوشمند تمام ساختارهای شماره موبایل ایران (0912، 912، +98912، ۰۰۹۸۹۱۲ و غیره)
        {
            word: /(?:(?:\+?98)|0098|0)?9\d{9}/,
            severity: "high",
            category: "privacy_phone"
        },
        // ۲. تشخیص لینک‌ها، آدرس وب‌سایت‌ها و دامنه‌ها (جهت جلوگیری از تبلیغات رقبا یا لینک‌های فیشینگ)
        {
            word: /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            severity: "high",
            category: "privacy_link"
        },
        // ۳. تشخیص آدرس‌های ایمیل استاندارد
        {
            word: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
            severity: "high",
            category: "privacy_email"
        },
        // ۴. تشخیص شماره کارت‌های بانکی ۱۶ رقمی (با یا بدون خط تیره و فاصله)
        {
            word: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/,
            severity: "high",
            category: "privacy_card"
        }
    ],
};