# @textguard/plugin-credit-card

Official credit-card Detection Plugin for TextGuard.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-credit-card
```

## Usage

```ts
import { createFilter } from "@textguard/core";
import { credit-cardPlugin } from "@textguard/plugin-credit-card";

const guard = createFilter();

guard.use(credit-cardPlugin());

const result = guard.findBadWords("contact me at hello@example.com");
```

## Features

- credit-card detection
- Regex based
- Plugin architecture
- TypeScript support

## License

MIT
