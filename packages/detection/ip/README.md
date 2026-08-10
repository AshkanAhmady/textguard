# @textguard/plugin-ip

IP-address detection plugin for TextGuard.

## Installation

```bash
pnpm add @textguard/core @textguard/plugin-ip
```

## Quick start

```ts
import { createFilter } from "@textguard/core";
import { ipPlugin } from "@textguard/plugin-ip";

const filter = createFilter({
  plugins: [ipPlugin()],
});

const ip = ["192", "0", "2", "10"].join(".");
const matches = filter.findBadWords(`Server address: ${ip}`);

console.log(matches.length > 0); // true
```

You can also register the plugin later with `filter.use(ipPlugin())`.

## What it detects

The plugin detects IP-address-like values supported by the current rule implementation. It is intended for text detection and masking, not network reachability or ownership verification.

## Filtering

```ts
const result = filter.filter(`Server address: ${ip}`);
console.log(result.filteredText);
```

## License

MIT
