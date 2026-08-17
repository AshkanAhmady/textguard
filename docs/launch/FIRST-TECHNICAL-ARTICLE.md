# How We Hardened a Multilingual TypeScript Text Filter Against Real Bypasses and False Positives

> Publication-ready launch article. Recommended primary surface: DEV or another developer-first publication. Use the three approved Playground screenshots at the marked proof points before publishing.

Text filtering looks deceptively simple when the first version works on isolated examples.

Give a filter one blocked word, run it against the same word, and the result is satisfying. Add a few regular expressions for email addresses and phone numbers, maybe normalize some Unicode, and it starts to feel like the hard part is finished.

That impression did not survive contact with a real Playground.

While building TextGuard—an open-source TypeScript toolkit for local text safety—we put the public APIs behind a browser Playground and started testing them the way a user would: mixed-language sentences, obfuscated profanity, structured data, Unicode variants, Explain output, and Debug traces. That exposed a class of bugs that unit tests built around clean tokens had not made obvious.

The useful lesson was not that one regex needed to be improved. It was that text-safety systems have several correctness layers, and improving one layer can easily damage another.

This article walks through the engineering changes that followed: sentence-context detection, bounded obfuscation handling, original-range preservation through normalization, truthful detector provenance, lower-noise debugging, adversarial regression tests, and validation against the actual packages published to npm.

TextGuard is not presented here as a perfect moderation system. The point is the opposite: the project became more credible only after we stopped treating passing happy-path tests as proof of robustness.

<!-- SCREENSHOT 1: textguard-overview.png
Place the approved Playground overview here.
Caption: TextGuard scanning one realistic English, Persian, and Arabic input through the default preset, with accepted detections and filtered output visible in the same run.
Alt text: TextGuard Playground showing multilingual input, five profanity detections, and masked output.
-->

## The starting point: a filter that looked stronger than it was

TextGuard already had a modular architecture: a Core engine, language packages, structured detectors, presets, CLI and VS Code surfaces, Explain and Debug APIs, and a browser Playground.

The basic integration is intentionally small:

```ts
import { createFilter, defaultPreset } from "@textguard/all";

const filter = createFilter(defaultPreset);
const result = filter.filter("some input text");

console.log(result.filteredText);
console.log(result.matches);
```

The interesting problems appeared when we stopped feeding the engine isolated words.

A profanity token that could be detected by itself could fail when embedded in realistic Persian or English sentence context. Obfuscation using symbols, repeated characters, spacing, or lookalike characters could bypass naive matching. At the same time, broad compatibility matching risked creating false positives in innocent words.

Those are competing pressures:

- normalize too little and users bypass the filter;
- normalize too aggressively and unrelated text collapses into the same representation;
- allow flexible boundaries and false positives increase;
- enforce naive word boundaries and multilingual sentence context breaks.

The hardening work became an exercise in preserving those tradeoffs explicitly instead of hiding them inside larger and larger regular expressions.

## Lesson 1: token tests are not sentence tests

One of the most important findings was straightforward: a detector can pass tests for a standalone token and still fail the actual user workflow.

Real text contains punctuation, neighboring Unicode letters, mixed scripts, whitespace variants, and language-specific boundaries. ASCII-centric assumptions such as `\b` do not model every language correctly, and matching logic that behaves well on one token may behave differently once it is surrounded by real sentence content.

We added regression fixtures around realistic English and Persian sentence context rather than only asserting that an isolated dictionary entry matched. We also kept multi-match sentence cases so fixing one match could not silently hide or merge another.

The important change in testing philosophy was this:

**a previously observed user failure became a permanent fixture before the implementation was considered fixed.**

That rule now matters more than any single regex pattern.

## Lesson 2: obfuscation support needs a budget

Leetspeak and visual obfuscation are obvious bypass techniques: digits for letters, symbols, separators, repeated characters, Kashida, zero-width characters, and lookalike forms.

The naive response is to make every character increasingly optional and interchangeable. That improves recall quickly—and destroys precision just as quickly.

TextGuard moved toward bounded compatibility behavior instead. Compatibility mappings are enabled where the preset intends them, but they are constrained by boundary and false-positive regression tests. We do not treat every vaguely similar string as equivalent to a blocked term.

This matters because moderation quality is not simply “how many bad strings can we catch?” It is closer to:

```text
useful detection = recall under realistic bypasses - unacceptable false positives
```

There is no universal threshold. A social product, source-code scanner, chat application, and CI guard can reasonably want different tradeoffs. That is one reason TextGuard keeps detection logic modular and exposes presets rather than pretending one policy is correct for every workflow.

## Lesson 3: normalization can corrupt public match ranges

A more subtle bug appeared below the detection layer.

Rules execute against normalized text, but consumers need match coordinates that refer to the original input. If normalization changes string length, a match range from the normalized representation cannot safely be reused against the source string.

Consider transformations such as:

- Unicode NFC composition;
- Arabic diacritic removal;
- script-specific normalization;
- future compatibility transformations that remove or combine characters.

If normalized coordinates leak into the public result, `start`, `end`, `matchedText`, masking, Explain output, and Debug events can all disagree with what the developer actually passed in.

We fixed this in Core by making range mapping an explicit part of normalization without breaking the existing normalizer contract. Built-in normalizers can produce boundary mappings, mappings are composed across the normalization pipeline, overlap resolution remains in normalized coordinates, and accepted matches are projected back to the original input before leaving Core.

The same mapping is also used for Debug match events, so Explain and filtering no longer operate in subtly different coordinate systems.

This was an architectural fix rather than a detector-specific patch. That distinction matters: once coordinates are wrong, every higher-level feature can become misleading even when the detector itself found the correct semantic text.

## Lesson 4: “matched” is not enough—provenance must be truthful

The Playground exposed another problem through Explain.

A valid email address or phone number could be detected, yet Explain attributed the match to a generic dictionary/privacy rule instead of the dedicated structured detector that also recognized the same span.

The final boolean result was technically correct. The explanation was not useful.

The root cause was overlap priority. Core already had generic deterministic priority semantics, and the structured detector rules happened to lose equal-span conflicts to a more generic rule.

We deliberately did **not** solve that by teaching Core about official TextGuard package names. That would have coupled the generic engine to product-specific detectors and made third-party extension behavior harder to reason about.

Instead, specialist detector packages now express their own precedence through the existing Rule priority contract. Email, URL, phone, IP, UUID, credit-card, and IBAN detectors can win the overlap they semantically own while Core remains generic.

That gives Explain a stronger contract:

**when a specialist detector owns the accepted match, the explanation should identify that specialist detector rather than a coincidental generic rule.**

For developer tooling, provenance is part of correctness.

<!-- SCREENSHOT 2: textguard-explain.png
Place the approved Explain-focused Playground screenshot here.
Caption: Explain keeps accepted matches inspectable instead of reducing the result to a boolean. The same multilingual scan can be traced back to the rule that produced each match.
Alt text: TextGuard Playground with the Explain panel open beneath multilingual detections.
-->

## Lesson 5: raw debugging and useful debugging are different products

A full execution trace is valuable when diagnosing the engine itself. It is painful when a developer only wants to know what mattered.

In early Playground testing, Debug timelines contained large numbers of repetitive lifecycle events—rules starting and ending even when they produced no useful signal. The raw trace was technically rich but difficult to inspect.

The fix was not to throw away diagnostics. TextGuard keeps the raw events and adds a signal projection for normal developer use. The projected timeline can omit empty rule activity while retaining lifecycle context for rules/plugins that actually produced match activity.

This gives two valid views of the same run:

- **raw trace** for engine-level diagnosis;
- **signal projection** for understanding the path that mattered to the result.

That pattern generalizes beyond text filtering: observability becomes more useful when high-fidelity data and human-oriented projection are separate concepts.

<!-- SCREENSHOT 3: textguard-debug.png
Place the approved Debug-focused Playground screenshot here.
Caption: Debug exposes signal events and the projected execution timeline without forcing the normal result view to carry the entire raw trace.
Alt text: TextGuard Playground with Debug open, showing signal events and timeline projection.
-->

## Lesson 6: benchmark after correctness, not instead of it

We also added a benchmark harness covering `filter()`, `explain()`, and `debug().report()` at representative input sizes.

The benchmark exists to catch engineering regressions and make expensive code paths visible. We intentionally do not publish shared CI runner timings as a performance SLA: noisy infrastructure is useful for directional comparison, not for claiming universal latency numbers.

More importantly, benchmark work followed correctness hardening rather than replacing it.

A filter that is 20% faster but returns the wrong original range, misses a realistic sentence, or misattributes a match is not an improvement.

## The validation change that mattered most: test the published artifacts

Monorepos can make packages look healthier than they are.

Workspace resolution can hide missing exports, stale declaration files, dependency/version mistakes, CLI metadata problems, and packaging assumptions that appear only after `npm publish`.

We created a separate `textguard-consumer-validation` repository that installs exact published npm versions and exercises TextGuard as an external consumer would. The current launch checkpoint is validated across:

- Node 20 and Node 22;
- CLI behavior;
- browser/Vite bundling;
- PII workflows;
- published-artifact benchmarks;
- a real VS Code extension host.

That validation repo also caught failures in the validation harness itself—for example stale pinned versions and release-candidate dependency ordering. Those findings were useful because the test system is part of the release system. A green monorepo CI run is not the same thing as a usable npm package.

## Compatibility mattered during hardening

Several fixes could have been simpler if we were willing to break consumers.

We avoided that where possible.

For example, the newcomer-facing preset is now `defaultPreset`, which communicates intent better than the old `strictPreset` name. But existing imports are not removed: `strictPreset` remains a deprecated backward-compatible alias pointing to the same configuration.

The same principle guided normalization changes: the range-aware hook is additive so existing custom normalizers remain source-compatible.

Hardening a library is not only about finding better internal logic. It also means changing the logic without turning every correction into a migration project for users.

## What TextGuard is now

The result is broader than the original “profanity filter” framing.

TextGuard is an open-source, local TypeScript safety layer for text entering applications and developer workflows. It combines multilingual moderation, structured-data detection, PII protection, and developer diagnostics, with the same engine exposed through Node/TypeScript, CLI, VS Code, CI workflows, and a browser Playground.

It still has limits. Language coverage is finite. Compatibility heuristics are deliberately bounded. Benchmarks are engineering signals, not universal guarantees. New detectors and integrations are not being added just to increase the feature count.

The next phase is adoption: putting the current product in front of developers and learning which workflows actually repeat.

## Try the hardened behavior yourself

The fastest way to evaluate TextGuard is the public Playground:

https://ashkanahmady.github.io/textguard/

For a project:

```bash
npm install @textguard/all
```

```ts
import { createFilter, defaultPreset } from "@textguard/all";

const filter = createFilter(defaultPreset);
const result = filter.filter("your text here");

console.log(result.matches);
```

GitHub:

https://github.com/AshkanAhmady/textguard

If you try it, the most useful feedback is not a star. It is a real failure or workflow: what are you trying to protect, which language or detector matters, and what false positive or false negative would make the library unusable for you?

That is the evidence we want to use for the next engineering decision.

## Publication checklist

Before pressing Publish:

- upload the three approved Playground screenshots using the placements, captions, and alt text above;
- verify the Playground and GitHub links from the publication preview;
- keep the code samples formatted as TypeScript/Bash;
- do not add benchmark latency claims from shared CI runners;
- do not include private data, npm tokens, local paths, or unrelated desktop content;
- use the published article URL as the canonical technical story in the first community launch wave.
