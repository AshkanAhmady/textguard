# @textguard/plugin-iban

IBAN detection plugin for TextGuard.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-iban
```

## Quick start

```ts
import { createFilter } from "@textguard/core";
import { ibanPlugin } from "@textguard/plugin-iban";

const filter = createFilter({
  plugins: [ibanPlugin()],
});

const iban = ["GB82", "WEST", "1234", "5698", "7654", "32"].join("");
const matches = filter.findBadWords(`IBAN: ${iban}`);

console.log(matches.length > 0); // true
```

You can also register the plugin later with `filter.use(ibanPlugin())`.

## Validation behavior

The detector validates IBAN candidates with the standard mod-97 checksum instead of relying only on shape matching.

A valid checksum means the text is structurally consistent with an IBAN. It does not verify that the bank account exists, is active, or belongs to a particular person.

## Filtering

```ts
const result = filter.filter(`IBAN: ${iban}`);
console.log(result.filteredText);
```

## License

MIT
