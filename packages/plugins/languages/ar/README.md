# @textguard/plugin-ar 🇸🇦

Arabic language moderation resources for TextGuard.

> **Current status:** usable baseline. Arabic parity is still in progress.

The package now ships a small built-in profanity and insult baseline that works through the normal TextGuard dictionary API. Coverage is intentionally conservative and is not yet equivalent to the Persian or English packages.

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
- `arProfanity` — baseline profanity dictionary.
- `arInsults` — baseline insults dictionary.
- `arPack` — grouped Arabic resources (`profanity` and `insults`).
- `arLanguage` — Arabic locale metadata.

## Current limitations

This release is the first useful Arabic moderation slice, not full language parity yet.

- coverage is intentionally small and should be expanded conservatively;
- Arabic normalization is not included yet;
- diacritics and letter variants such as `أ` / `إ` / `آ` are not normalized automatically by this package yet;
- spam/pattern resources are not part of the current Arabic pack.

Those concerns are tracked as separate follow-up work so normalization and broader vocabulary can be reviewed independently from the initial dictionary baseline.

## License

MIT
