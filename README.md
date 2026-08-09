# TextGuard

TextGuard is a modular TypeScript toolkit for text filtering, profanity detection, structured-data detection, debugging, explanations, and PII protection in developer workflows.

Use the complete bundle for the simplest setup, or install only the core and plugins you need.

## Quick start

```bash
npm install @textguard/all
```

```ts
import { createFilter, strictPreset } from "@textguard/all";

const filter = createFilter(strictPreset);

const result = filter.filter("some input text");

console.log(result.filteredText);
console.log(result.matches);
```

`@textguard/all` includes the core package, language plugins, structured-data detectors, and built-in presets.

## Core API

```ts
const filter = createFilter(options);

filter.hasBadWord(text);
filter.findBadWords(text);
filter.filter(text);
filter.debug(text);
filter.explain(text);
filter.use(plugin);
```

### Explain why something matched

```ts
const explanation = filter.explain("some input text");

console.log(explanation.matches);
console.log(explanation.summary);
```

`explain()` is built on the same Debug Engine execution path used by TextGuard. It reports final accepted matches together with plugin and rule metadata instead of running a separate detection engine.

### Debug a filtering run

```ts
const session = filter.debug("some input text");
const report = session.report();

console.log(report);
```

The Debug Engine records normalization, rule execution, match lifecycle decisions, overlap resolution, and performance diagnostics.

## Packages

TextGuard is published as a set of focused packages:

| Package | Purpose |
| --- | --- |
| `@textguard/all` | Complete bundle and easiest starting point |
| `@textguard/core` | Core engine and plugin API |
| `@textguard/plugin-fa` | Persian language rules |
| `@textguard/plugin-en` | English language rules |
| `@textguard/plugin-ar` | Arabic language rules |
| `@textguard/plugin-email` | Email detection |
| `@textguard/plugin-url` | URL detection |
| `@textguard/plugin-phone` | Phone-number detection |
| `@textguard/plugin-ip` | IP-address detection |
| `@textguard/plugin-uuid` | UUID detection |
| `@textguard/plugin-credit-card` | Credit-card detection with Luhn validation |
| `@textguard/plugin-iban` | IBAN detection with mod-97 validation |
| `@textguard/plugin-pii` | PII scanning for commits and pull requests |

## PII guard for commits and pull requests

`@textguard/plugin-pii` can stop accidental PII from reaching a commit or pull request.

```bash
npm install -D @textguard/plugin-pii husky
npx husky init
npx textguard-pii init
```

The package supports detector-specific allowlists, ignored paths/globs, and narrowly scoped suppressions through `textguard-pii.config.json`.

See [`packages/plugins/pii/README.md`](packages/plugins/pii/README.md) for the full setup and [`examples/pii-consumer`](examples/pii-consumer) for a simple consumer example that is also exercised by CI.

## Examples

Examples live under [`examples/`](examples/). They are intended to stay small and understandable for ordinary package consumers.

- [`examples/basic`](examples/basic) — core filtering/debug usage
- [`examples/pii-consumer`](examples/pii-consumer) — real consumer setup for commit/PR PII protection

## Repository development

This repository is a pnpm/Turborepo monorepo.

```bash
pnpm install
pnpm build
pnpm check-types
pnpm vitest run
```

Architecture decisions and current delivery status live under [`docs/`](docs/):

- [`docs/TEXTGUARD-PROJECT.md`](docs/TEXTGUARD-PROJECT.md) — current product and architecture overview
- [`docs/textguard-roadmap.md`](docs/textguard-roadmap.md) — verified roadmap status
- [`docs/DEVELOPMENT-WORKFLOW.md`](docs/DEVELOPMENT-WORKFLOW.md) — contribution/change workflow
- [`docs/architecture/`](docs/architecture/) — architecture decision records

## License

MIT
