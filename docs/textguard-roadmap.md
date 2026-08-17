# TextGuard Roadmap — Verified Status

> Source-of-truth delivery status. Read with `TEXTGUARD-PROJECT.md`, `PRODUCT-GROWTH-PLAN.md`, and `ADOPTION-VALIDATION.md`.

Legend: ✅ Done · 🟡 Current / in progress · ⏸️ Evidence-gated

## Current position

TextGuard has completed its current quality-hardening checkpoint and published the corrected npm release set. External consumer validation now exercises the published packages on Node 20/22, CLI, PII workflows, browser/Vite, benchmark workloads, and the real VS Code extension host. The public Playground remains deployed at `https://ashkanahmady.github.io/textguard/`.

The major Playground findings that triggered hardening—normalization/range correctness, structured Explain provenance, Debug signal projection, multilingual sentence-context detection, bounded leetspeak/compatibility behavior, boundary false positives, and preset-label DX—have been addressed with regression coverage and a published checkpoint.

The active product phase is now **Launch Surface → Developer Distribution → Adoption Validation**. The operating rule is unchanged: **make the existing product easy to understand and try → promote it to relevant developers → collect real usage and feedback → build only the next repeated/high-impact pain**.

## Near-term execution order

1. **Release and architecture foundation — ✅ complete.** Changesets/release safety, package taxonomy, Core/plugin boundaries, CLI, VS Code, Playground, PII guard, Explain and Debug are shipped for the current milestone.
2. **External consumer validation — ✅ complete for the published quality checkpoint.** Published npm artifacts are exercised outside workspace assumptions across the supported developer surfaces.
3. **Quality Hardening / adversarial validation — ✅ checkpoint accepted.** Reproduced high-impact Playground defects received regression tests and compatible fixes. The adversarial matrix remains a standing regression gate rather than a finished one-time test suite.
4. **Benchmark baseline — ✅ active engineering gate.** `filter()`, `explain()`, and `debug().report()` are benchmarked at representative sizes. Shared CI timing remains directional rather than a public SLA.
5. **Preset naming / newcomer DX — 🟡 current release polish.** `defaultPreset` becomes the canonical recommended API. `strictPreset` remains a deprecated backward-compatible alias so existing consumers do not break. Playground/UI/share URLs use `default` terminology while accepting legacy `strict` links.
6. **Launch surface — 🟡 current.** Keep README/npm/Playground/VS Code/feedback entry points concise, consistent, and easy to try. No SaaS/dashboard/auth work.
7. **Developer distribution — 🟡 next.** Start organic technical distribution through GitHub/npm, technical articles, relevant Reddit communities, Show HN, DEV, Product Hunt secondarily, and demo-driven LinkedIn/X posts.
8. **Adoption validation — 🟡 active.** Issue #65 remains the canonical signal log. Review npm trends, Marketplace signals, GitHub feedback, Playground examples, and direct developer conversations together.
9. **Evidence-driven roadmap reassessment — ⏸️ evidence-gated.** New detectors, languages, framework adapters, Chrome, AI/provider integrations, richer CI surfaces, or other integrations require repeated/high-impact evidence.
10. **Monetization / team capability — ⏸️ evidence-gated.** Billing, SaaS, shared policies, centralized reports, organization administration, and paid capabilities wait for repeated commercial/team pain.
11. **Guard Ecosystem expansion — ⏸️ evidence-gated.** Additional Guard products remain vision-stage until TextGuard demonstrates durable adoption or a validated revenue path.

## Quality checkpoint contract

The external `textguard-consumer-validation` repository remains the executable release-quality gate. It must continue to validate published artifacts directly and cover:

- Unicode/normalization and original-input range mapping;
- English/Persian/Arabic obfuscation and realistic sentence-context detection;
- false positives and multilingual boundaries;
- Email, URL, Phone, IP, UUID, Credit Card and IBAN validity/boundaries;
- Explain/filter parity and truthful detector attribution;
- Debug signal-to-noise while retaining raw diagnostics;
- overlap determinism and plugin registration behavior;
- CLI/browser/Playground/VS Code/PII parity where applicable;
- stress workloads and benchmark comparisons.

Quality hardening is a standing discipline: new credible user findings become regression fixtures before fixes.

## Preset naming decision

`defaultPreset` is the canonical newcomer-facing preset name because it communicates product intent better than `strictPreset`.

Backward compatibility is mandatory:

- new docs/examples/Playground code use `defaultPreset`;
- `strictPreset` remains exported as a deprecated alias referencing the same configuration;
- no breaking removal is scheduled without future adoption evidence and a deliberate major-version migration plan;
- legacy Playground `preset=strict` URLs continue to hydrate as `default`.

## Launch / distribution plan

Distribution now resumes in this order:

1. GitHub repository and npm package pages: clear positioning, quick start, Playground and feedback entry points.
2. Technical articles around concrete developer pain: PII in commits, multilingual moderation, Explain/Debug, structured-data detection, and lessons from adversarial hardening.
3. Relevant Reddit communities with technical/value-first posts rather than promotion-only posts.
4. Hacker News / Show HN once the launch surface is polished and easy to try.
5. DEV Community and similar developer publishing channels.
6. Product Hunt as a secondary discovery channel.
7. LinkedIn/X with short demos, benchmark stories, real bug/hardening stories, and developer workflows.

Paid advertising remains low priority until organic positioning and repeat use cases are understood.

## Adoption measurement and feature rule

Issue #65 is the canonical qualitative signal log and `docs/ADOPTION-VALIDATION.md` defines the decision rule. Track signals together rather than optimizing for one vanity metric.

Before implementing the next product feature:

1. link repeated/high-impact evidence;
2. state the developer problem and workflow;
3. define a measurable success criterion;
4. choose the smallest maintainable compatible change;
5. update roadmap/docs with implementation;
6. release coherently and revalidate published artifacts.

Do not add invasive runtime telemetry to Core. Monetization follows validated team/organization demand, not speculation.

## Current focus

**Finish `defaultPreset` launch naming → keep published-artifact validation green → polish launch surfaces → distribute to real developers → collect adoption evidence → identify repeated pain → build only the smallest justified next improvement.**
