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

export const enSpam: Dictionary = {
    name: "en-spam",
    language: "en",
    version: "1.0.0",
    words: [
        { word: "free followers", severity: "high", category: "spam" },
        { word: "buy followers", severity: "high", category: "spam" },
        { word: "make money fast", severity: "high", category: "spam" },
        { word: "earn dollars online", severity: "high", category: "spam" },
        { word: "crypto signals", severity: "high", category: "spam" },
        { word: "trading bot", severity: "high", category: "spam" },
        { word: "online casino", severity: "high", category: "spam" },
        { word: "betting site", severity: "high", category: "spam" },
        { word: "click here to win", severity: "high", category: "spam" },
        { word: "work from home high pay", severity: "medium", category: "spam" },
        { word: "free iphone", severity: "medium", category: "spam" },
        { word: "cheap viagra", severity: "high", category: "spam" }
    ],
};