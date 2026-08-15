# @textguard/plugin-en

## 1.0.3

### Patch Changes

- 732be08: Expand English and Persian sentence-level profanity coverage from public Playground findings, including standalone `ass` and common observed Persian colloquial variants.
- 1d394c2: Prevent generated dictionary matches from stretching across sparse sentence context, and treat English Email/URL patterns as explicit regular expressions.
- 13d852b: Enable the English leetspeak mapping in the strict and enterprise presets so common symbol and digit obfuscations are detected by default on those surfaces, and correct the canonical English profanity dictionary entry used by both plain and leetspeak matching.

## 1.0.2

### Patch Changes

- Fix published README examples; remove debug logs; remove dead code
- Updated dependencies
  - @textguard/core@1.0.2

## 1.0.0

### Major Changes

- 4b45ff4: initial release of core filter engine and language packs

### Patch Changes

- Updated dependencies [4b45ff4]
  - @textguard/core@1.0.0
