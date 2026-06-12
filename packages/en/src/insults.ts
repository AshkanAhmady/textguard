import type { Dictionary } from "@textguard/core";

export const enInsults: Dictionary = {
    name: "en-insults",
    language: "en",
    version: "1.0.0",
    words: [
        { word: "idiot", severity: "medium", category: "insult" },
        { word: "stupid", severity: "medium", category: "insult" },
        { word: "dumb", severity: "medium", category: "insult" },
        { word: "loser", severity: "medium", category: "insult" },
        { word: "moron", severity: "high", category: "insult" },
        { word: "retard", severity: "high", category: "insult" },
        { word: "clown", severity: "low", category: "insult" },
        { word: "nerd", severity: "low", category: "insult" },
        { word: "jerk", severity: "medium", category: "insult" },
        { word: "fool", severity: "low", category: "insult" },
        { word: "suck", severity: "medium", category: "insult" },
        { word: "sucker", severity: "medium", category: "insult" }
    ],
};