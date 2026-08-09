# @textguard/plugin-ar 🇸🇦

Arabic language package for TextGuard.

> **Current status:** published foundation / early development.

The package currently exposes Arabic language metadata and placeholder dictionary/pack exports. It does **not yet provide Persian/English-level Arabic moderation coverage**: the current `arDictionary` has no words and `arPack` is empty. Arabic parity is tracked as the next implementation phase after the README cleanup.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-ar
```

## Current usage

```ts
import { createFilter } from "@textguard/core";
import { arDictionary } from "@textguard/plugin-ar";

const filter = createFilter({
  dictionaries: [arDictionary],
});
```

This API is valid today, but because the shipped Arabic dictionary is currently empty, it does not add useful Arabic word detection yet.

## Current exports

```ts
import {
  arDictionary,
  arPack,
  arLanguage,
} from "@textguard/plugin-ar";
```

- `arDictionary` — valid TextGuard dictionary object; currently contains no words.
- `arPack` — currently an empty object reserved for the future Arabic language pack.
- `arLanguage` — Arabic locale metadata (`code`, native name, English name).

## Planned parity work

Arabic implementation work will be handled separately from this documentation pass. The parity phase is expected to add real Arabic dictionaries/resources and then update this README with practical moderation examples.

Until that work lands, use this package only if you specifically need the current Arabic metadata/foundation exports.

## License

MIT
