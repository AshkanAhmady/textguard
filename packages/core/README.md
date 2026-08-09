# @textguard/core

Core text detection, filtering, debugging, and explanation engine for TextGuard.

`@textguard/core` is intentionally plugin-based: the core owns execution, normalization, filtering, Debug, and Explain infrastructure, while language and structured-data detection live in separate plugins.

## Installation

```bash
pnpm add @textguard/core
```

## Basic usage

```ts
import { createFilter } from "@textguard/core";

const filter = createFilter({
  customWords: ["blocked-token"],
  mask: "*",
});

filter.hasBadWord("contains blocked-token"); // true

const matches = filter.findBadWords("contains blocked-token");
const filtered = filter.filter("contains blocked-token");
```

## Using plugins

```ts
import { createFilter } from "@textguard/core";
import { emailPlugin } from "@textguard/plugin-email";

const filter = createFilter({
  plugins: [emailPlugin],
});
```

Plugins can also be registered later with `filter.use(plugin)`.

## Explain API

Use `filter.explain(text)` when you need to know which final detection matched and where it came from.

```ts
const explanation = filter.explain("some input");

console.log(explanation.matched);
console.log(explanation.matches);
```

The result contains:

- the original input;
- the normalized input used by the engine;
- only final accepted matches after overlap resolution;
- plugin identity;
- rule id, name, category, severity, and priority;
- a structured explanation reason;
- summary information such as matched plugins and categories.

Explain is built from the same debug-capable execution path as detection. It does not run a separate detection engine.

## Debug API

Use `filter.debug(text)` for low-level execution diagnostics:

```ts
const session = filter.debug("some input");

session.getInput();
session.getNormalizedInput();
session.getMatches();
session.getEvents();
session.statistics();
session.timeline();
session.performance();
session.report();
```

Debug events include rule execution and explicit match lifecycle events (`match:found`, `match:accepted`, and `match:rejected`).

## Public filter API

```ts
filter.hasBadWord(text: string): boolean;
filter.findBadWords(text: string): Match[];
filter.filter(text: string): FilterResult;
filter.debug(text: string): DebugSession;
filter.explain(text: string): ExplainResult;
filter.use(plugin: Plugin): void;
```

## Filter options

```ts
createFilter({
  dictionaries,
  customWords,
  whitelist,
  mask,
  leetspeakMapping,
  faLookalikesMapping,
  plugins,
});
```

## Design notes

- Core does not depend on specific language or PII plugins.
- Detection behavior belongs to `Rule` implementations.
- Explain projects structured facts from `DebugSession`; it does not guess detector-specific reasons that rules do not expose.
- The existing `Match` contract remains backward-compatible.

## Related packages

Official TextGuard packages include language plugins, structured-data detection plugins, `@textguard/plugin-pii`, and `@textguard/all`.

## License

MIT
