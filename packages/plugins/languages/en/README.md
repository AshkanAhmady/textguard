````markdown
# @textguard/plugin-en 🇺🇸🇬🇧

> **Official English language pack, dictionary, and advanced Leetspeak rules for the `textguard` ecosystem.**

This extension package provides an optimized dictionary of profanities and sophisticated detection rules tailored specifically for English text moderation.

---

### 🔥 Key Highlight: Advanced Leetspeak Detection

Trolls and spammers love to bypass standard filters by replacing letters with numbers or symbols (e.g., writing `1di0t` instead of `idiot`). `@textguard/plugin-en` comes equipped with built-in **Leetspeak obfuscation patterns** that catch these bypass attempts automatically.

---

### 🚀 Installation

```bash
pnpm add @textguard/core @textguard/plugin-en
💻 Usage & Filtering Variations
TypeScript
import { createFilter } from '@textguard/core';
import { enRules } from '@textguard/plugin-en';

const filter = createFilter({
  languages: [enRules]
});

// --- Case 1: Standard Filtering ---
console.log(filter.hasProfanity("Don't act like an idiot!")); // true
console.log(filter.clean("You are an idiot.")); // "You are an ****."

// --- Case 2: Leetspeak Obfuscation Bypass (Smart Detection) ---
// The engine automatically decodes symbols and numbers to their original alphabet meanings
console.log(filter.hasProfanity("Don't act like an 1d10t!")); // true
console.log(filter.clean("Hey 1D10T, leave.")); // "Hey ****, leave."

// --- Case 3: Case Insensitivity ---
console.log(filter.hasProfanity("He is an IDIOT.")); // true
📄 License
MIT © Ashkan Ahmadi
```
````
