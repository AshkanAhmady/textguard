# @textguard/plugin-ip

Official ip Detection Plugin for TextGuard.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-ip
```

## Usage

```ts
import { createFilter } from "@textguard/core";
import { ipPlugin } from "@textguard/plugin-ip";

const guard = createFilter();

guard.use(ipPlugin());

const result = guard.findBadWords("contact me at hello@example.com");
```

## Features

- ip detection
- Regex based
- Plugin architecture
- TypeScript support

## License

MIT
