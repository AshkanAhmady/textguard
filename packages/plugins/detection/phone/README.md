# @textguard/plugin-phone

Official phone Detection Plugin for TextGuard.

This plugin detects phones in text using a built-in regular expression and integrates seamlessly with the TextGuard plugin system.

> **Status:** Stable

---

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-phone
```

---

## Usage

```ts
import { createFilter } from "@textguard/core";
import { phonePlugin } from "@textguard/plugin-phone";

const filter = createFilter();

filter.use(phonePlugin());

const result = filter.findBadWords("Visit https://textguard.dev");

console.log(result);
```

---

## Features

- HTTP phone detection
- HTTPS phone detection
- Plugin architecture
- TypeScript support

---

## Example

```ts
const filter = createFilter();

filter.use(phonePlugin());

const result = filter.filter("Visit https://google.com");

console.log(result.filteredText);
```

---

## Compatibility

| Package         | Version |
| --------------- | ------- |
| @textguard/core | ^1.x    |

---

## License

MIT
