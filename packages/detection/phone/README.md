# @textguard/plugin-phone

Phone-number detection plugin for TextGuard.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-phone
```

## Quick start

```ts
import { createFilter } from "@textguard/core";
import { phonePlugin } from "@textguard/plugin-phone";

const filter = createFilter({
  plugins: [phonePlugin()],
});

const phone = ["+1", "202", "555", "0147"].join(" ");
const matches = filter.findBadWords(`Call me at ${phone}`);

console.log(matches.length > 0); // true
```

You can also register the plugin later with `filter.use(phonePlugin())`.

## What it detects

The current detector recognizes phone-like numeric patterns with optional country codes, spaces, dots, dashes, and parentheses.

This is format detection rather than carrier/ownership verification. A match means the text looks like a phone number; TextGuard does not verify that the number is assigned or reachable.

## Filtering

```ts
const result = filter.filter(`Call me at ${phone}`);
console.log(result.filteredText);
```

## License

MIT
