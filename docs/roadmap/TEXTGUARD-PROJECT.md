# TextGuard — Project Documentation

> **Purpose of this document:** This is a ground-truth reference for AI assistants (or new contributors) working on TextGuard. Everything here was verified directly against the source code in this repository — not copied from planning docs. Where the code and the older planning docs (`AI_VISION.md`, `TextGuard-ROADMAP-Final.md`, etc.) disagree, this document follows the code.

---

## 1. What TextGuard Is

TextGuard is an extensible, plugin-based text-processing engine for JavaScript/TypeScript. Its core job: detect problematic or sensitive content in text (profanity, PII like emails/phones/credit cards, etc.), explain _why_ something matched, and optionally mask/replace it.

It is designed to be the first product of a planned "Guard Ecosystem" of developer tools (TextGuard, SchemaGuard, ApiGuard, ConfigGuard, FormGuard, GitGuard), all under the mission **"Catch problems before production."** Only TextGuard currently exists; the rest of the ecosystem is vision-stage, not started.

**Author's context:** solo developer, front-end lead engineer by day, building this evenings/weekends toward a self-funded product business — not chasing GitHub stars or freelancing.

---

## 2. Repository Structure

Monorepo managed with **pnpm workspaces + Turborepo**. Versioning/publishing via **Changesets**. Pre-commit hooks via **Husky + lint-staged**. Tests via **Vitest** (with `@vitest/coverage-v8`).

```
textguard/
├── packages/
│   ├── core/                     → @textguard/core   (the engine)
│   ├── all/                      → @textguard/all     (bundle + presets)
│   ├── plugins/
│   │   ├── languages/
│   │   │   ├── en/               → @textguard/plugin-en
│   │   │   ├── fa/               → @textguard/plugin-fa
│   │   │   └── ar/               → @textguard/plugin-ar
│   │   └── detection/
│   │       ├── email/            → @textguard/plugin-email
│   │       ├── url/               → @textguard/plugin-url
│   │       ├── phone/             → @textguard/plugin-phone
│   │       ├── ip/                → @textguard/plugin-ip
│   │       ├── uuid/              → @textguard/plugin-uuid
│   │       ├── creditCard/        → @textguard/plugin-credit-card
│   │       └── iban/              → @textguard/plugin-iban
│   ├── presets/                   → (early/incomplete package, see §7)
│   ├── eslint-config/              → shared eslint config
│   └── typescript-config/          → shared tsconfig bases
├── examples/basic/                → working usage example
├── docs/
│   ├── architecture/ADR-001-debug-engine.md   → design doc for the Debug Engine
│   ├── roadmap/textguard-roadmap.md            → the project's own roadmap doc
│   └── notes.md                                 → informal build-tooling notes (Persian)
└── (root config: turbo.json, pnpm-workspace.yaml, tsconfig.base.json, etc.)
```

All published packages are currently at **version 1.0.1**.

---

## 3. Core Architecture (`@textguard/core`)

### Design philosophy

Small core, everything else is a plugin. Core has zero required dependency on AI or any optional feature. This principle is followed correctly in the code.

### Key building blocks

- **`createFilter(options)`** — the one public factory function. Internally calls `createEngine()`.
- **`EnginePipeline`** — orchestrates normalization → plugin execution → rule matching for a given input text.
- **`PluginManager`** — registers plugins (built-in `DictionaryPlugin` plus anything passed via `options.plugins`).
- **`RuleCollection`** — holds all registered `Rule` instances.
- **`NormalizerCollection`** — holds normalizers (Unicode, Persian, Arabic are registered by default).
- **`DebugCollector`** — records structured events during a debug run (see §4).

### Domain interfaces (the extension points)

```ts
interface Plugin {
  readonly name: string;
  setup(context: PluginContext): void;
}

interface Rule {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly severity: "low" | "medium" | "high";
  readonly priority: number;
  supports(context: MatchContext): boolean;
  match(context: MatchContext): Match[];
}
```

Any new detection capability (language pack, PII type, secret type, etc.) is added by implementing `Plugin` + one or more `Rule`s — no core changes needed. This is a solid, genuinely extensible design.

### Public API — ground truth (verified against `types.ts` and `examples/basic/src/index.ts`)

```ts
import { createFilter } from "@textguard/core";

const filter = createFilter({
  dictionaries?: Dictionary[],
  customWords?: (string | RegExp)[],
  whitelist?: string[],
  mask?: string,                              // e.g. "***"
  leetspeakMapping?: Record<string, string[]>,
  faLookalikesMapping?: Record<string, string>,
  plugins?: Plugin[],
});

filter.hasBadWord(text: string): boolean
filter.findBadWords(text: string): Match[]
filter.filter(text: string): { originalText, filteredText, matches }
filter.debug(text: string): DebugSession
filter.use(plugin: Plugin): void
```

**⚠️ Important:** This is _not_ what the published READMEs on npm currently show. The README for `@textguard/core`, `@textguard/plugin-en`, and `@textguard/plugin-fa` document an older, different API (`languages: [...]`, `filter.hasProfanity()`, `filter.clean()`, `customBlacklist`, named exports like `faRules`/`enRules`). Copying the README example against the real published package will throw. This is a real, live discrepancy affecting anyone installing the package today — flagged here for your prioritization, not fixed unilaterally. See ROADMAP for tracking.

---

## 4. Debug Engine (Phase 7, Epic 1)

This is the most-developed part of Phase 7 and is genuinely implemented, not just designed. Full design rationale lives in `docs/architecture/ADR-001-debug-engine.md` — read that for the "why."

### What actually exists in code

- **Event-driven collection**: every pipeline step (`pipeline:started/finished`, `rule:started/finished`, `match:found`, etc.) emits a typed, immutable `DebugEvent`.
- **`DebugSession`** (the object returned by `filter.debug(text)`):
  - `.getEvents()` — raw event list
  - `.statistics()` — counts of events/plugins/rules/matches
  - `.performance()` — per-plugin/per-rule timing, via `PerformanceBuilder`
  - `.timeline()` — chronological visualization data, via `TimelineBuilder`
  - `.report()` — combined report object, via `DebugReportBuilder`
- **Renderers** (consume a `DebugReport`, produce output):
  - `JsonRenderer` ✅ implemented
  - `ConsoleRenderer` ✅ implemented
  - `MarkdownRenderer` ✅ implemented
  - **HTML renderer ❌ not implemented** — no file exists for it, despite being in ADR-001's plan and Milestone 2 of the roadmap doc.

### Known deviation from ADR-001

ADR-001 specifies the API as methods directly on the session object: `debug.toJSON()`, `debug.toConsole()`, `debug.toMarkdown()`, `debug.toHTML()`. The actual implementation instead exposes `session.report()` and separate renderer _classes_ that you instantiate and call `.render(report)` on. Functionally similar, but the public surface doesn't match the ADR. Worth deciding whether to update the ADR or adjust the code to match it — currently they disagree.

### Not started

- **Explain API** (Milestone 5) — no `explain()` method or dedicated Explain module exists anywhere in `core/src`.
- **Milestone 6 integrations** (VS Code, Chrome, CLI, Website Playground, AI) — none started, which is consistent with the plan (they're meant to consume the Debug Engine once it's finished).

---

## 5. Plugins Inventory

### Language plugins (profanity/insult detection)

| Plugin                           | Status        | Notes                                                                                                                                                                                                                  |
| -------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@textguard/plugin-fa` (Persian) | Full          | Dictionaries (insults, patterns, profanity), lookalike-character handling, custom normalizers, custom rules, spam detection                                                                                            |
| `@textguard/plugin-en` (English) | Full          | Dictionaries (insults, patterns, profanity), leetspeak handling, spam detection                                                                                                                                        |
| `@textguard/plugin-ar` (Arabic)  | **Thin/stub** | Only a single `index.ts` — no dictionaries, rules, or tests directory found. Far behind `en`/`fa`. Referenced as "coming soon" in the current published `core` README, which is at least consistent with reality here. |

### Detection plugins (PII / structured data)

Email, URL, Phone, IP, UUID, Credit Card (Luhn-validated), IBAN (mod-97 validated) — all seven follow the same clean pattern: `plugin.ts` + `regex/` + `rules/` + a test file. These are solid, complete, and well-tested individually.

### What does **not** exist yet

No plugin detects secrets, API keys, JWTs, private keys, SSH keys, or connection strings. This matters because:

**Naming collision to be aware of:** `@textguard/all` already exports an `enterprisePreset` — but it's just a bundle of the language dictionaries + the seven PII detection plugins above. It is **not** the "Enterprise Preset" described in the roadmap docs (secrets/JWT/API-key detection). If you build the secrets-detection feature later, the current `enterprisePreset` name is already taken and would need renaming or the new feature needs a different name.

### `@textguard/all`

Bundles core + all language and detection plugins, and exports three presets:

- `strictPreset` — fa + en dictionaries + all detection plugins (Arabic explicitly commented out with a `TODO(v1.1)`)
- `enterprisePreset` — same plugin set as strict, no dictionary/plugin difference of substance found
- `socialMediaPreset` — (exists, not inspected in detail here)

### `packages/presets/`

A separate, mostly-empty package (`src/` exists but wasn't populated with meaningful content at inspection time) — appears to be an earlier or parallel attempt at presets, now largely superseded by `packages/all/src/presets/`. Worth deciding whether to remove it or clarify its purpose.

---

## 6. Testing

13 test files found across the monorepo (one per plugin roughly, plus core and preset-level tests in `@textguard/all`). Vitest is configured with coverage tooling. Tests weren't executed during this review (no `node_modules` present in the environment used to inspect the code), so pass/fail status is unverified — recommend running `pnpm test` yourself to confirm current green/red state before relying on this doc for confidence claims.

---

## 7. Known Technical Debt / Cleanup Items

These aren't roadmap features — they're loose ends found while reading the code. Listed factually; prioritization is yours.

1. **Published README mismatch** (see §3) — `@textguard/core`, `@textguard/plugin-en`, `@textguard/plugin-fa` READMEs on npm describe an API that no longer exists in the code.
2. **`packages/all/README.md` is empty** — the bundle package currently ships no documentation at all.
3. **Leftover debug `console.log()` calls in production code** — `packages/core/src/engine/createEngine.ts` logs dictionary counts, plugin lists, and rule counts unconditionally on every `createFilter()` call. This runs in every consuming application, not just during development.
4. **Dead code: `packages/core/src/future/`** — contains `normalizer.ts` and `pipeline.ts`, two interface files that are not imported anywhere in the codebase. Likely early scaffolding for a future refactor; currently unused.
5. **`enterprisePreset` naming collision** — see §5.
6. **`packages/presets/`** — unclear whether this package is still needed alongside `packages/all/src/presets/`.
7. **ADR-001 vs. actual Debug API surface** — see §4.
8. **Overlap resolution in `runRules.ts` doesn't account for validator confidence.** When two rules match the same span with equal length and equal priority, `matches[overlappedIndex]` keeps whichever rule registered first — it has no concept of "this rule has a checksum validator, that one doesn't." Discovered while building `@textguard/plugin-pii`: the unvalidated `phone` rule can win over the Luhn-validated `credit-card` rule on identical-length spans purely by registration order. Worked around in `plugin-pii` by controlling plugin registration order, but the underlying engine behavior is still order-dependent for any future plugin combination — worth a proper fix (e.g. prefer a match from a rule with a `validator` when lengths tie) if more overlapping detection plugins get added later.

---

## 8. How to Extend TextGuard (for future AI-assisted work)

To add a new detection capability (e.g. a new PII type, a new language, or eventually secrets/JWT detection):

1. Create a new package under `packages/plugins/detection/<name>/` or `packages/plugins/languages/<code>/`, following the existing plugins as a template (each has `plugin.ts`, `regex/` or dictionary files, `rules/`, and a `tests/` file).
2. Implement the `Plugin` interface; implement one or more `Rule`s.
3. Register it in `@textguard/all` if it should be part of a bundle/preset.
4. Add a test file mirroring the existing plugin test structure.
5. Do **not** add dependencies to `@textguard/core` — core must stay dependency-free of any specific plugin.

This pattern is consistent across every existing plugin, so any AI assistant can follow it mechanically without needing architectural guidance each time.
