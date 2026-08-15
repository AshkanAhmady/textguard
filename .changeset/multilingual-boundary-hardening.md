---
"@textguard/core": patch
---

Use Unicode-aware outer boundaries for string dictionary matching so benign larger words are not flagged while internal spacing, punctuation, join controls, and repeated-character obfuscations remain detectable.
