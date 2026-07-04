# @textguard/plugin-url

Official URL Detection Plugin for TextGuard.

This plugin detects URLs in text using a built-in regular expression and integrates seamlessly with the TextGuard plugin system.

> **Status:** Stable

---

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-url
```

---

## Usage

```ts
import { createFilter } from "@textguard/core";
import { urlPlugin } from "@textguard/plugin-url";

const filter = createFilter();

filter.use(urlPlugin());

const result = filter.findBadWords("Visit https://textguard.dev");

console.log(result);
```

---

## Features

- HTTP URL detection
- HTTPS URL detection
- Plugin architecture
- TypeScript support

---

## Example

```ts
const filter = createFilter();

filter.use(urlPlugin());

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
