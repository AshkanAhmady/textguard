# @textguard/presets

Official preset collections for TextGuard.

## Available Presets

### strictPreset

Includes all official sensitive data detection plugins.

```ts
import { createFilter } from "@textguard/core";
import { strictPreset } from "@textguard/presets";

const filter = createFilter({
  plugins: strictPreset,
});
```
