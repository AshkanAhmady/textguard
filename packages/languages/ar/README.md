# @textguard/ar

Arabic language moderation resources for TextGuard.

> **Current status:** usable baseline with normalization-aware coverage. Arabic parity is still in progress.

The package ships built-in profanity and insult dictionaries that work through the normal TextGuard dictionary API. Coverage is intentionally conservative: it focuses on common, high-confidence terms and expands dialectal vocabulary in small tested slices.

## Installation

```bash
pnpm add @textguard/core @textguard/ar
```

## Quick start

```ts
import { createFilter } from "@textguard/core";
import { arDictionary } from "@textguard/ar";

const filter = createFilter({ dictionaries: [arDictionary] });
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
} from "@textguard/ar";
```

- `arDictionary` — combined Arabic dictionary used by `createFilter()`.
- `arProfanity` — high-severity profanity dictionary.
- `arInsults` — medium-severity insult dictionary.
- `arPack` — grouped Arabic resources (`profanity` and `insults`).
- `arLanguage` — Arabic locale metadata.

## Normalization

TextGuard Core normalizes Arabic text before dictionary matching. The current pipeline handles common Alef/Hamza variants, `ة`, `ى`, common Arabic diacritics, and the shared Arabic/Persian Yeh/Kaf canonical forms.

## Coverage policy

There is no practical "complete" Arabic profanity list: vocabulary varies across regions, dialects, spelling, and context. TextGuard therefore expands Arabic coverage in reviewable slices.

- prioritize common, high-confidence profanity and insults;
- add dialect vocabulary only with public API tests;
- keep benign Arabic sentences in regression tests;
- avoid mechanically importing large slang lists without false-positive evidence;
- keep spam/pattern resources separate from profanity vocabulary.

The current dialect slice adds a small set of common vulgar forms while keeping the existing public API unchanged.

## Migration from `@textguard/plugin-ar`

`@textguard/ar` is the canonical Arabic language package. Existing users of `@textguard/plugin-ar` should replace the dependency and import path; the exported Arabic APIs keep the same names.

## Current limitations

Arabic coverage is still smaller than the mature Persian and English packages. More dialect-specific coverage, spam/pattern resources, and bundle/preset inclusion remain later parity work.

## License

MIT
