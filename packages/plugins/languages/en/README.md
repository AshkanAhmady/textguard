# @textguard/plugin-en 🇺🇸🇬🇧

Official English language package for TextGuard.

It provides an English dictionary, profanity/insult/spam entries, pattern data, and an optional leetspeak mapping for `@textguard/core`.

## Install

```bash
npm install @textguard/core @textguard/plugin-en
```

## Quick start

```ts
import { createFilter } from "@textguard/core";
import {
  enDictionary,
  enLeetspeakMapping,
} from "@textguard/plugin-en";

const filter = createFilter({
  dictionaries: [enDictionary],
  leetspeakMapping: enLeetspeakMapping,
});

console.log(filter.hasBadWord("Don't act like an idiot"));

const result = filter.filter("Don't act like an idiot");
console.log(result.filteredText);
console.log(result.matches);
```

## What this package exports

- `enDictionary` — ready-to-use dictionary for `createFilter`.
- `enProfanity` — profanity entries.
- `enInsults` — insult entries.
- `enSpam` — spam-related entries.
- `enPatterns` — additional English patterns.
- `enLeetspeakMapping` — optional leetspeak mapping.
- `enPack` — grouped English resources.
- `enLanguage` — English language metadata.

## Leetspeak support

`enLeetspeakMapping` is exported by this package, but it is not enabled automatically. Pass it explicitly when you want TextGuard normalization to account for configured leetspeak substitutions:

```ts
const filter = createFilter({
  dictionaries: [enDictionary],
  leetspeakMapping: enLeetspeakMapping,
});
```

## Current TextGuard API

Once the filter is created, use the current core methods:

```ts
filter.hasBadWord(text);
filter.findBadWords(text);
filter.filter(text);
filter.debug(text);
filter.explain(text);
```

Older examples using `languages`, `hasProfanity()`, or `clean()` do not represent the current TextGuard API.

## License

MIT
