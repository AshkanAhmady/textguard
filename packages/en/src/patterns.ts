import type { Dictionary } from "@textguard/core";

export const enPatterns: Dictionary = {
    name: "en-patterns",
    language: "en",
    version: "1.0.0",
    words: [
        // الگوی استاندارد و امن برای تشخیص ایمیل‌ها
        { word: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", severity: "high", category: "pattern" },
        // الگوی هوشمند برای تشخیص URLها و لینک‌های اینترنتی (http/https/www)
        { word: "(https?://)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,})+[^\\s]*", severity: "high", category: "pattern" }
    ],
};