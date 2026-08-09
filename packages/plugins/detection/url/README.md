# @textguard/plugin-url

URL detection plugin for TextGuard.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-url
```

## Quick start

```ts
import { createFilter } from "@textguard/core";
import { urlPlugin } from "@textguard/plugin-url";

const filter = createFilter({
  plugins: [urlPlugin()],
});

const url = ["https://", "textguard.dev"].join("");
const matches = filter.findBadWords(`Visit ${url}`);

console.log(matches.length > 0); // true
```

You can also register the plugin later with `filter.use(urlPlugin())`.

## What it detects

The plugin detects URL-shaped values supported by the current rule implementation, including HTTP and HTTPS URLs. It performs text detection only; it does not check whether a destination exists, is reachable, or is safe.

## Filtering

```ts
const result = filter.filter(`Visit ${url}`);
console.log(result.filteredText);
```

## License

MIT
