# TextGuard

TextGuard is a modular TypeScript toolkit for text filtering, profanity detection, structured-data detection, debugging, explanations, and PII protection in developer workflows.

Use the complete bundle for the simplest setup, or install only the core and packages you need.

## Try TextGuard

- [Open the live Playground](https://ashkanahmady.github.io/textguard/) — test multilingual moderation, structured detectors, Explain, and Debug without installing anything
- [`integrations/vscode`](integrations/vscode) — VS Code integration
- [`packages/cli`](packages/cli) — command-line integration
- [Open a structured feedback issue](https://github.com/AshkanAhmady/textguard/issues/new/choose) — bugs, detection quality, DX friction, or feature requests

The next integration milestone is selected from real consumer evidence rather than added speculatively. See [`docs/ADOPTION-VALIDATION.md`](docs/ADOPTION-VALIDATION.md) for the validation loop and decision rule.

## Quick start

```bash
npm install @textguard/all
```

```ts
import { createFilter, defaultPreset } from "@textguard/all";

const filter = createFilter(defaultPreset);
const result = filter.filter("some input text");

console.log(result.filteredText);
console.log(result.matches);
```

`defaultPreset` is the recommended ready-made preset. The older `strictPreset` export remains available as a backward-compatible deprecated alias.

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

### Debug a filtering run

```ts
const session = filter.debug("some input text");
console.log(session.report());
```

## Packages

TextGuard uses a deliberate package taxonomy: language packs have short locale names, detector packages use `plugin-*`, and composite guards keep their explicit guard/plugin identity.

| Category | Package | Purpose |
| --- | --- | --- |
| Foundation | `@textguard/core` | Core engine and extension API |
| Bundle | `@textguard/all` | Complete bundle and easiest starting point |
| Language | `@textguard/fa` | Persian language rules |
| Language | `@textguard/en` | English language rules |
| Language | `@textguard/ar` | Arabic language rules |
| Detection | `@textguard/plugin-email` | Email detection |
| Detection | `@textguard/plugin-url` | URL detection |
| Detection | `@textguard/plugin-phone` | Phone-number detection |
| Detection | `@textguard/plugin-ip` | IP-address detection |
| Detection | `@textguard/plugin-uuid` | UUID detection |
| Detection | `@textguard/plugin-credit-card` | Credit-card detection with Luhn validation |
| Detection | `@textguard/plugin-iban` | IBAN detection with mod-97 validation |
| Guard | `@textguard/plugin-pii` | PII scanning for commits and pull requests |

Repository folders follow the same taxonomy: `packages/languages`, `packages/detection`, and `packages/guards`.

## PII guard for commits and pull requests

`@textguard/plugin-pii` can stop accidental PII from reaching a commit or pull request.

```bash
npm install -D @textguard/plugin-pii husky
npx husky init
npx textguard-pii init
```

The package supports detector-specific allowlists, ignored paths/globs, and narrowly scoped suppressions through `textguard-pii.config.json`.

See [`packages/guards/pii/README.md`](packages/guards/pii/README.md) for the full setup and [`examples/pii-consumer`](examples/pii-consumer) for the consumer example exercised by CI.

## Examples

- [`examples/basic`](examples/basic) — core filtering/debug usage
- [`examples/pii-consumer`](examples/pii-consumer) — commit/PR PII protection

## Repository development

```bash
pnpm install
pnpm build
pnpm check-types
pnpm vitest run
```

Project memory and architecture live under [`docs/`](docs/):

- [`docs/TEXTGUARD-PROJECT.md`](docs/TEXTGUARD-PROJECT.md)
- [`docs/textguard-roadmap.md`](docs/textguard-roadmap.md)
- [`docs/ADOPTION-VALIDATION.md`](docs/ADOPTION-VALIDATION.md)
- [`docs/DEVELOPMENT-WORKFLOW.md`](docs/DEVELOPMENT-WORKFLOW.md)
- [`docs/RELEASING.md`](docs/RELEASING.md)
- [`docs/architecture/`](docs/architecture/)

## License

MIT
