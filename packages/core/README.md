Markdown

# @textguard/core 🛡️

> **The ultimate, blazing-fast text moderation and profanity filtering engine for modern JavaScript/TypeScript applications.**

`@textguard/core` is the lightweight heart of the TextGuard ecosystem. Built with performance and flexibility in mind, it allows you to create highly customizable text filters, handle multi-language packs seamlessly, and eliminate unwanted content with zero-dependency overhead.

---

### ✨ Features

- 🚀 **Zero Dependencies:** Ultra-light bundle size with maximum performance.
- 📦 **Modular Architecture:** Keep your bundle size small by only importing the language packs (`fa`, `en`, etc.) you actually need.
- 🧠 **Advanced Engine (`createFilter`):** Intelligently combines patterns, handles complex regex variations, and provides context-aware filtering.
- ⚡ **Full TypeScript Support:** Strictly typed for a world-class developer experience.

---

### 🚀 Installation

```bash
pnpm add @textguard/core
💻 Quick Start
The core engine revolves around the powerful createFilter method. You can instantly combine multiple official language packs or inject your own custom rules.

TypeScript
import { createFilter } from '@textguard/core';
import { faRules } from '@textguard/fa';
import { enRules } from '@textguard/en';

// Initialize the filter engine with selected language configurations
const filter = createFilter({
  languages: [faRules, enRules],
  customBlacklist: ['spam-link-example.com'], // Easily extend on the fly
});

// 1. Simple Check
const hasBadWords = filter.hasProfanity("This is a clean sentence with an idiot mentioned.");
console.log(hasBadWords); // true

// 2. Clean and Mask Text
const cleanedText = filter.clean("این یک متن نمونه است احمق!");
console.log(cleanedText); // "این یک متن نمونه است ****!"
🌐 The Roadmap (Multi-Language Ecosystem)
TextGuard is built to scale globally. Currently, it fully supports:

🟢 @textguard/fa (Official Persian Pack)

🟢 @textguard/en (Official English Pack)

💡 More languages (such as Arabic, Spanish, and German) are actively under development and coming very soon!

📄 License
MIT © Ashkan Ahmadi
```
