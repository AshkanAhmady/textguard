# @textguard/plugin-email

Official Email Detection Plugin for TextGuard.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-email
```

## Usage

```ts
import { createFilter } from "@textguard/core";
import { emailPlugin } from "@textguard/plugin-email";

const guard = createFilter();

guard.use(emailPlugin());

const result = guard.findBadWords("contact me at hello@example.com");
```

## Features

- Email detection
- Regex based
- Plugin architecture
- TypeScript support

## License

MIT
