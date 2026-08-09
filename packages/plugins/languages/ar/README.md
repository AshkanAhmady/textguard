# @textguard/plugin-ar 🇸🇦

Arabic language moderation resources for TextGuard.

> **Current status:** usable baseline with normalization-aware coverage. Arabic parity is still in progress.

The package ships built-in profanity and insult dictionaries that work through the normal TextGuard dictionary API. Coverage is intentionally conservative: it focuses on common, high-confidence terms and avoids broad dialect-heavy expansion that would increase false positives.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-ar
```

## Quick start

```ts
import { createFilter } from "@textguard/core";
import { arDictionary } from "@textguard/plugin-ar";

const filter = createFilter({
  dictionaries: [arDictionary],
});

const result = filter.filter("لا تكن غبي");

console.log(result.filteredText);
```

## Exports

```ts
import {
  arDictionary,
  arProfanity,
  arInsults,
  arPack,
  arLanguage,
} from "@textguard/plugin-ar";
```

- `arDictionary` — combined Arabic dictionary used by `createFilter()`.
- `arProfanity` — high-severity profanity dictionary.
- `arInsults` — medium-severity insult dictionary.
- `arPack` — grouped Arabic resources (`profanity` and `insults`).
- `arLanguage` — Arabic locale metadata.

## Normalization

TextGuard Core normalizes Arabic text before dictionary matching. The current pipeline handles common Alef/Hamza variants, `ة`, `ى`, and common Arabic diacritics. Core also canonicalizes Arabic `ي` / `ك` through the shared normalization pipeline.

That means common written variants such as diacritized profanity and `أحمق` / `احمق` can resolve to the same dictionary form.

## Coverage policy

There is no practical "complete" Arabic profanity list: vocabulary varies across regions, dialects, spelling, and context. TextGuard therefore expands Arabic coverage in reviewable slices.

Current policy:

- prioritize common, high-confidence profanity and insults;
- test additions through the public `createFilter()` API;
- keep benign Arabic sentences in regression tests;
- avoid mechanically importing large dialect/slang lists without false-positive evidence;
- keep spam/pattern resources separate from profanity vocabulary.

## Current limitations

Arabic coverage is still smaller than the mature Persian and English packages. Dialect-specific vocabulary, spam/pattern resources, and bundle/preset inclusion remain later parity work.

## License

MIT
