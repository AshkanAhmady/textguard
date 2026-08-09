# @textguard/plugin-email

Email-address detection plugin for TextGuard.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-email
```

## Quick start

```ts
import { createFilter } from "@textguard/core";
import { emailPlugin } from "@textguard/plugin-email";

const filter = createFilter({
  plugins: [emailPlugin()],
});

const email = ["hello", "example.com"].join("@");
const matches = filter.findBadWords(`Contact: ${email}`);

console.log(matches.length > 0); // true
```

You can also register the plugin later with `filter.use(emailPlugin())`.

## What it detects

The plugin detects email-address-shaped values in text. Detection is intended for text filtering and PII discovery; it does not verify that an address exists or can receive mail.

## Filtering

```ts
const result = filter.filter(`Contact: ${email}`);
console.log(result.filteredText);
```

## License

MIT
