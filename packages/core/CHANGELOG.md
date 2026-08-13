# @textguard/core

## 1.1.0

### Minor Changes

- c3052be: Add an editor-neutral diagnostic adapter for translating final TextGuard matches into reusable editor integration metadata.

### Patch Changes

- 3f6b7ba: Make equal-length overlap resolution deterministic by preserving rule priority and using stable plugin/rule identity tie-breakers instead of registration order.
- d6dd4cd: Add a public HTML renderer for debug reports.
- 4b50ec3: Add a public Markdown renderer for debug reports.

## 1.0.3

### Patch Changes

- 5b1b7b6: Improve Arabic normalization for common diacritics and Alef Maqsura, and expand the Arabic moderation dictionaries with conservative high-confidence profanity and insult coverage.

## 1.0.2

### Patch Changes

- Fix published README examples; remove debug logs; remove dead code

## 1.0.0

### Major Changes

- 4b45ff4: initial release of core filter engine and language packs
