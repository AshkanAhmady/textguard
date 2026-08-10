# @textguard/all

The easiest way to get started with TextGuard.

`@textguard/all` bundles the core engine, official language packages, structured-data detectors, and ready-made presets into one package.

## Install

```bash
npm install @textguard/all
```

## Quick start

```ts
import { createFilter, strictPreset } from "@textguard/all";

const filter = createFilter(strictPreset);
const result = filter.filter("some text");

console.log(result.filteredText);
console.log(result.matches);
```

`strictPreset` combines the Persian, English, and Arabic dictionaries with the official Email, URL, Phone, IP, UUID, Credit Card, and IBAN detection plugins.

## Explain and debug

```ts
const explanation = filter.explain("some text");
console.log(explanation.matches);

const session = filter.debug("some text");
console.log(session.timeline());
console.log(session.performance());
```

## Included packages

Language packages:

- `@textguard/fa`
- `@textguard/en`
- `@textguard/ar`

Detection plugins:

- `@textguard/plugin-email`
- `@textguard/plugin-url`
- `@textguard/plugin-phone`
- `@textguard/plugin-ip`
- `@textguard/plugin-uuid`
- `@textguard/plugin-credit-card`
- `@textguard/plugin-iban`

The bundle also re-exports the public API from `@textguard/core`.

## Presets

### `strictPreset`

The recommended ready-made preset for broad detection. It includes Persian, English, and Arabic moderation dictionaries plus the current structured-data detection plugins.

### `enterprisePreset`

Currently has the same practical detector/dictionary composition as `strictPreset`, including Arabic moderation. Its future role remains tracked as technical debt.

### `socialMediaPreset`

Currently a placeholder. Prefer `strictPreset` or explicit options until it is implemented.

## Build your own configuration

```ts
import {
  createFilter,
  enDictionary,
  emailPlugin,
  urlPlugin,
} from "@textguard/all";

const filter = createFilter({
  dictionaries: [enDictionary],
  plugins: [emailPlugin(), urlPlugin()],
  mask: "*",
});
```

## When to use this package

Use `@textguard/all` when you want the simplest installation and do not mind installing the full official bundle. If bundle size or dependency control matters, install `@textguard/core` and only the language/detection packages you need.

PII commit/PR enforcement is provided separately by `@textguard/plugin-pii`.

## License

MIT
