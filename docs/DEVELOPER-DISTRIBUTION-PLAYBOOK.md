# TextGuard Developer Distribution Playbook

> Execution guide for the current growth phase. `PRODUCT-GROWTH-PLAN.md` defines strategy; this document defines the first distribution wave and how to evaluate it.

## Goal

Get TextGuard in front of real TypeScript/Node developers who have text-safety, moderation, PII, or structured-data detection needs, then collect enough evidence to decide what deserves product work next.

This is not a broad awareness campaign. The goal is qualified developer usage and feedback.

## Positioning

Primary position:

**TextGuard is an open-source TypeScript safety layer for text entering developer applications and workflows.**

It helps developers detect or filter unwanted language and sensitive/structured data locally, with Explain and Debug surfaces for understanding why a match happened.

Lead with concrete problems rather than a feature inventory:

- multilingual profanity/moderation without sending text to a third-party moderation provider;
- catching PII before it reaches commits and pull requests;
- detecting email, phone, card, IBAN, URL, IP, and UUID values with structured provenance;
- explaining and debugging why text matched;
- using the same engine from Node/TypeScript, CLI, VS Code, CI, and the browser Playground.

Do not position TextGuard as an AI moderation service, enterprise policy platform, or SaaS product. Those are not the current product.

## Canonical launch links

Use these consistently in distribution material:

- GitHub: `https://github.com/AshkanAhmady/textguard`
- Playground: `https://ashkanahmady.github.io/textguard/`
- npm starting package: `@textguard/all`
- feedback: GitHub issue forms in the main repository
- adoption evidence log: issue #65

For newcomer examples use `defaultPreset`. `strictPreset` is compatibility-only terminology.

## Primary calls to action

Prefer one primary CTA per post:

1. **Try it in the Playground** for posts demonstrating moderation, Explain, Debug, or structured detection.
2. **Install `@textguard/all`** for implementation-focused technical content.
3. **Try the PII guard** for Git/pre-commit security content.
4. **Share a real failure/use case** for feedback-oriented posts.

Do not ask for stars as the main CTA. Stars are secondary to use and feedback.

## First distribution wave

### Wave 1 — owned surfaces

Before community posting, keep GitHub README, npm package metadata/readme, Playground, VS Code listing, and feedback links aligned. No new runtime feature is required for this wave.

### Wave 2 — technical story

Publish one substantial technical article first. Recommended first topic:

**How we hardened a multilingual TypeScript text filter against real bypasses and false positives**

The article should show the actual engineering journey:

- initial Playground findings;
- sentence-context misses in Persian and English;
- obfuscation/leetspeak handling;
- range mapping through normalization;
- false-positive pressure;
- Explain provenance and Debug signal-to-noise;
- external consumer validation and benchmark discipline.

This establishes credibility before direct launch posts and gives later community posts something useful to link to.

Alternative problem-first article:

**How to stop PII from reaching Git commits with a local TypeScript guard**

This is narrower and may produce more qualified adoption for `@textguard/plugin-pii`.

### Wave 3 — community distribution

After the technical article is live, distribute selectively:

- relevant Reddit programming/TypeScript/Node/security communities where self-promotion rules allow it;
- Show HN with a concise technical launch framing;
- DEV Community with an adapted version of the technical article;
- LinkedIn/X as short demo/problem posts pointing to Playground or article;
- Product Hunt only as a secondary discovery surface after the technical channels are active.

Do not copy-paste identical promotional text across communities. Adapt framing to the audience and community rules.

## Recommended launch framing

The strongest launch narrative is not “a profanity filter”. It is:

**A local, inspectable text-safety toolkit for TypeScript that combines multilingual moderation, structured-data/PII detection, and developer diagnostics.**

Proof points to use when relevant:

- open source and local execution;
- public browser Playground;
- official Node/TypeScript, CLI, VS Code, and CI workflows;
- Explain and Debug APIs;
- published-artifact consumer validation on Node 20/22 and supported surfaces;
- benchmark harness exists, while shared CI numbers are not presented as a performance SLA.

Avoid unsupported claims such as “perfect”, “zero false positives”, “production-proof for every language”, or performance superiority over competitors.

## Feedback questions

When a developer engages, learn workflow before proposing features. Useful questions:

- What are you trying to protect or moderate?
- Where in your stack would TextGuard run?
- Which language(s) or detector types matter?
- What false positive or false negative would make the tool unusable for you?
- Do you need runtime filtering, CI/commit protection, editor feedback, or all of them?
- What integration is missing from your real workflow?

Record repeated/high-impact answers in issue #65.

## Adoption signals

Review signals together; do not optimize for one vanity metric:

- npm usage trends across the package family;
- VS Code Marketplace installs/ratings;
- GitHub issues, discussions, and external references;
- Playground examples/shared links when observable;
- direct developer feedback and conversations;
- repeated requests for one integration, detector, language, policy, or API surface.

The first meaningful checkpoint is **10 real users/workflows**, not a star count. For each credible user, try to understand the workflow and whether usage is likely to repeat.

## Decision rule after the first wave

Do not immediately return to feature development after launch.

After enough distribution to generate real signals:

1. summarize evidence in issue #65;
2. group repeated problems by workflow;
3. distinguish detection-quality bugs from new-feature requests;
4. fix credible regressions with fixtures immediately when necessary;
5. choose a new product feature only if repeated or high-impact evidence justifies it;
6. define success criteria before implementation;
7. preserve Core/plugin boundaries and compatibility.

## Launch readiness checklist

Before the first community post:

- published packages install successfully from npm;
- `@textguard/all` exposes `defaultPreset` from the published artifact;
- consumer validation is green on Node 20/22, CLI, browser/Vite, PII, benchmark, and real VS Code host;
- live Playground loads and uses `default` terminology;
- README points directly to the live Playground and feedback path;
- no known launch-blocking issue is open;
- issue #65 remains open as the adoption signal log.

## Current execution order

1. Merge this playbook/documentation checkpoint.
2. Draft the first technical article and its concrete examples/screenshots.
3. Prepare a concise Show HN / Reddit launch version derived from the article, not generic advertising copy.
4. Publish the technical article.
5. Run the first community distribution wave.
6. Record qualitative evidence in issue #65 and review early adoption signals.
7. Reassess the roadmap only after evidence exists.
