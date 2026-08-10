# @textguard/plugin-uuid

UUID detection plugin for TextGuard.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-uuid
```

## Quick start

```ts
import { createFilter } from "@textguard/core";
import { uuidPlugin } from "@textguard/plugin-uuid";

const filter = createFilter({
  plugins: [uuidPlugin()],
});

const tail = ["4466", "5544", "0000"].join("");
const uuid = ["550e8400", "e29b", "41d4", "a716", tail].join("-");
const matches = filter.findBadWords(`Request id: ${uuid}`);

console.log(matches.length > 0); // true
```

You can also register the plugin later with `filter.use(uuidPlugin())`.

## What it detects

The plugin detects UUID-shaped values supported by the current rule implementation. Detection is based on the identifier format; it does not verify that an identifier exists in another system.

## Filtering

```ts
const result = filter.filter(`Request id: ${uuid}`);
console.log(result.filteredText);
```

## License

MIT
