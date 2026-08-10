# @textguard/plugin-credit-card

Credit-card number detection plugin for TextGuard.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-credit-card
```

## Quick start

```ts
import { createFilter } from "@textguard/core";
import { creditCardPlugin } from "@textguard/plugin-credit-card";

const filter = createFilter({
  plugins: [creditCardPlugin()],
});

const card = ["4242", "4242", "4242", "4242"].join(" ");
const matches = filter.findBadWords(`Card: ${card}`);

console.log(matches.length > 0); // true
```

You can also register the plugin later with `filter.use(creditCardPlugin())`.

## Validation behavior

The detector does not accept every number-shaped value. Candidate card numbers are checked with the Luhn checksum before being returned as matches.

Luhn validation reduces obvious false positives, but it does not prove that a card exists, is active, or belongs to a particular person.

## Filtering

```ts
const result = filter.filter(`Card: ${card}`);
console.log(result.filteredText);
```

## License

MIT
