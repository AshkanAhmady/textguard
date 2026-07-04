# @textguard/plugin-uuid

Official uuid Detection Plugin for TextGuard.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-uuid
```

## Usage

```ts
import { createFilter } from "@textguard/core";
import { uuidPlugin } from "@textguard/plugin-uuid";

const guard = createFilter();

guard.use(uuidPlugin());

const result = guard.findBadWords("contact me at hello@example.com");
```

## Features

- uuid detection
- Regex based
- Plugin architecture
- TypeScript support

## License

MIT
