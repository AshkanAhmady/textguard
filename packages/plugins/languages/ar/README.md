# @textguard/plugin-ar 🇸🇦

Official Arabic language plugin for TextGuard.

This plugin provides Arabic language resources for TextGuard, including profanity dictionaries, language-specific rules, and future Arabic normalization support.

> **Status:** Early development (Phase 6)

---

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-ar
```

---

## Usage

```ts
import { createFilter } from "@textguard/core";
import { arDictionary } from "@textguard/plugin-ar";

const filter = createFilter({
  dictionaries: [arDictionary],
});

const result = filter.filter("...");

console.log(result.filteredText);
```

---

## Exports

This package currently exports:

- `arDictionary`
- `arPack`
- `language`

Future releases may include:

- Arabic normalizers
- Arabic-specific rules
- Locale metadata
- Additional dictionaries

---

## Compatibility

| Package         | Version |
| --------------- | ------- |
| @textguard/core | ^1.x    |

---

## License

MIT
