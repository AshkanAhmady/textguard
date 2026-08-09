# @textguard/all

The easiest way to get started with TextGuard.

`@textguard/all` bundles the core engine, official language plugins, structured-data detectors, and ready-made presets into one package.

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

`strictPreset` currently combines the Persian and English dictionaries with the official Email, URL, Phone, IP, UUID, Credit Card, and IBAN detection plugins.

Arabic is exported by this package, but it is not yet included in `strictPreset` while Arabic parity work is still pending.

## Explain a match

```ts
const explanation = filter.explain("some text");

console.log(explanation.matched);
console.log(explanation.matches);
```

Use `explain()` when you want to understand which final rule/plugin matched and why TextGuard accepted that match.

For deeper execution diagnostics, use:

```ts
const session = filter.debug("some text");

console.log(session.timeline());
console.log(session.performance());
```

## Included packages

`@textguard/all` re-exports the public API from `@textguard/core` plus these official plugins:

- `@textguard/plugin-fa`
- `@textguard/plugin-en`
- `@textguard/plugin-ar`
- `@textguard/plugin-email`
- `@textguard/plugin-url`
- `@textguard/plugin-phone`
- `@textguard/plugin-ip`
- `@textguard/plugin-uuid`
- `@textguard/plugin-credit-card`
- `@textguard/plugin-iban`

## Presets

### `strictPreset`

The recommended ready-made preset for broad detection. It includes Persian and English dictionaries plus all current structured-data detection plugins.

```ts
import { createFilter, strictPreset } from "@textguard/all";

const filter = createFilter(strictPreset);
```

### `enterprisePreset`

Currently has the same practical detector/dictionary composition as `strictPreset`. Its naming and future role are tracked as technical debt, so do not depend on it having distinct enterprise-only behavior yet.

### `socialMediaPreset`

This preset is currently only a placeholder and does not configure detection behavior yet. Prefer `strictPreset` or explicit options until it is implemented.

## Build your own configuration

You can also use the bundled plugins directly:

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

The regular core API is available too:

```ts
filter.hasBadWord(text);
filter.findBadWords(text);
filter.filter(text);
filter.debug(text);
filter.explain(text);
filter.use(plugin);
```

## When to use this package

Use `@textguard/all` when you want the simplest installation and do not mind installing the full official bundle.

If bundle size or dependency control matters, install `@textguard/core` and only the plugins you need.

PII commit/PR enforcement is provided separately by `@textguard/plugin-pii`; it is not part of this bundle's runtime preset behavior.

## License

MIT
