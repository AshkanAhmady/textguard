import { Dictionary } from "@textguard/core";

export const faSpam: Dictionary = {
    name: "fa-spam",
    language: "fa",
    version: "1.0.0",
    words: [
        // شبکه های اجتماعی و ربات‌ها
        { word: "خرید فالوور", severity: "high", category: "spam" },
        { word: "فالوور رایگان", severity: "high", category: "spam" },
        { word: "لایک تضمینی", severity: "medium", category: "spam" },
        { word: "سین تلگرام", severity: "medium", category: "spam" },
        { word: "فروش پیج", severity: "high", category: "spam" },
        { word: "فالو کن فالو بک", severity: "medium", category: "spam" },
        { word: "فالو=فالو", severity: "medium", category: "spam" },

        // سیستم‌های پانزی، کریپتو زرد و کلاهبرداری
        { word: "درآمد دلاری تضمینی", severity: "high", category: "spam" },
        { word: "پولدار شدن سریع", severity: "high", category: "spam" },
        { word: "استخراج بیت کوین در خانه", severity: "high", category: "spam" },
        { word: "سیگنال فیوچرز", severity: "high", category: "spam" },
        { word: "ربات ترید", severity: "high", category: "spam" },
        { word: "سرمایه‌گذاری با سود ثابت", severity: "high", category: "spam" },
        { word: "ارز دیجیتال رایگان", severity: "medium", category: "spam" },

        // قمار، شرط بندی و تبلیغات زرد
        { word: "پیش‌بینی فوتبال", severity: "high", category: "spam" },
        { word: "سایت شرط بندی", severity: "high", category: "spam" },
        { word: "انفجار بدون باخت", severity: "high", category: "spam" },
        { word: "کازینو آنلاین", severity: "high", category: "spam" },
        { word: "شارژ رایگان ایرانسل", severity: "high", category: "spam" },
        { word: "اینترنت رایگان واقعی", severity: "medium", category: "spam" },
        { word: "کلیک کن پول بگیر", severity: "high", category: "spam" },
        { word: "کار در منزل با حقوق بالا", severity: "medium", category: "spam" }
    ],
};