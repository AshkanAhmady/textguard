# @textguard/plugin-iban

Official iban Detection Plugin for TextGuard.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-iban
```

## Usage

```ts
import { createFilter } from "@textguard/core";
import { ibanPlugin } from "@textguard/plugin-iban";

const guard = createFilter();

guard.use(ibanPlugin());

const result = guard.findBadWords("contact me at hello@example.com");
```

## Features

- iban detection
- Regex based
- Plugin architecture
- TypeScript support

## License

MIT
