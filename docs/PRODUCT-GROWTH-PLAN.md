# TextGuard Product Growth Plan

This document records the product path after the current engineering foundation. It is intentionally separate from implementation detail: `textguard-roadmap.md` tracks delivery status, `TEXTGUARD-PROJECT.md` tracks technical truth, and this document tracks the product-growth sequence we should follow unless real adoption evidence justifies a change.

## Product position

TextGuard should be positioned as a TypeScript safety layer for text entering developer applications and workflows: detect unsafe, sensitive, or unwanted text before it reaches production.

The current product already covers moderation/language rules, structured-data detection, PII protection, Debug/Explain diagnostics, CLI usage, a public VS Code extension, and a browser Playground. The next bottleneck is not feature count; it is proving which developers need TextGuard, which workflows create repeat usage, and which problems are important enough to justify future product investment.

## Non-goals until adoption evidence exists

Do not start these merely because they are technically possible:

- Chrome/browser extension beyond the existing Playground;
- AI-assisted features or provider integrations;
- billing, subscriptions, SaaS dashboard, authentication, or team administration;
- SchemaGuard, ApiGuard, ConfigGuard, FormGuard, GitGuard, or other Guard products;
- framework-specific integrations without repeated consumer demand.

## Phase A — Pre-launch hardening

Goal: make the current product safe to put in front of developers without adding speculative features.

1. Keep repository/documentation truth aligned with implementation.
2. Build a consumer-style validation project outside the internal package assumptions and exercise every public capability end to end.
3. Verify published-package installation and the intended consumer workflows, not only workspace source imports.
4. Test CLI, VS Code packaging/install flow, Playground, PII pre-commit/CI flow, presets, detectors, Debug, Explain, and language behavior.
5. Record any product-blocking defects found by this validation and fix them before active promotion.
6. Define a small release checkpoint after the validation project is green.

Exit criterion: a fresh developer project can install and exercise the documented TextGuard surfaces successfully, and no known launch-blocking defect remains.

## Phase B — Launch surface

Goal: give a developer one clear place to understand and try TextGuard.

Start with a lightweight static landing surface rather than a SaaS product site. It should communicate the problem, provide install instructions, link GitHub/npm/VS Code, and embed or link the Playground.

Recommended landing-page content:

- one-sentence value proposition;
- install command and minimal example;
- capabilities: moderation, PII, email/phone/card/IBAN/URL/IP/UUID detection, Debug and Explain;
- supported developer surfaces: Node/TypeScript, CLI, VS Code, CI, Playground;
- links to docs, GitHub, npm, Marketplace, feedback, and Playground;
- no authentication, billing, dashboard, or CMS at this stage.

A larger Guard Ecosystem website remains deferred until TextGuard adoption justifies it or a second validated product exists.

## Phase C — Distribution and user acquisition

Goal: find real developers who have the problem TextGuard solves.

Prioritize technical, community-driven distribution over paid advertising:

1. GitHub repository/readme and npm package pages;
2. technical articles showing real problems and implementations;
3. relevant Reddit communities where the post provides technical value rather than promotion-only content;
4. Hacker News / Show HN when the launch surface and validation project are ready;
5. DEV Community and similar developer publishing channels;
6. Product Hunt as a secondary launch/discovery channel;
7. LinkedIn/X build-in-public posts based on concrete demos, benchmarks, bug stories, or developer workflows.

Position posts around the problem and proof, not a feature list. Examples include preventing PII from reaching a commit, explaining why a text rule matched, or building multilingual moderation without a provider dependency.

## Phase D — Adoption measurement

Goal: learn who is using TextGuard, why they installed it, where they get value, and where they fail.

Issue #65 remains the canonical qualitative signal log. Review signals together:

- npm package download trends;
- VS Code Marketplace installs/ratings;
- GitHub issues and discussions;
- Playground usage when measurable;
- repeated requests for detectors, languages, integrations, policies, or APIs;
- direct developer interviews/messages where available.

Package downloads alone cannot tell us why a developer installed TextGuard. To learn motivation, prefer explicit and privacy-respecting mechanisms such as:

- a short optional "What are you using TextGuard for?" feedback link from docs/Playground;
- structured issue forms with workflow/use-case fields;
- optional launch/user survey linked from the landing page;
- direct conversations with early adopters.

Do not add invasive runtime telemetry to the core library. If anonymous product analytics are later used on a website or Playground, document them clearly and keep them separate from library runtime behavior.

Suggested adoption checkpoints are directional rather than contractual: first 10 real users, then 50, then 100 recurring users, then broader monthly usage. Optimize for retained/returning users and credible workflows rather than GitHub stars alone.

## Phase E — Evidence-driven iteration

Goal: build only the next capability that solves a repeated or high-impact real problem.

For each candidate milestone:

1. collect supporting evidence in issue #65;
2. state the user problem;
3. define a success criterion;
4. choose the smallest maintainable change that solves it;
5. preserve Core/plugin boundaries and backward compatibility;
6. update roadmap and docs in the same PR;
7. release in a coherent batch when justified.

Chrome, AI, framework adapters, new detectors, new language coverage, CI improvements, or team features are all candidates, not promises.

## Phase F — Monetization

Goal: monetize repeated organizational pain only after free usage demonstrates demand.

Commercial signals include multiple teams independently asking for capabilities such as shared policies, organization dictionaries, centralized reports, audit history, organization-level repository controls, or managed workflows.

Only then consider a paid TextGuard Team/Pro layer. Billing and SaaS infrastructure should follow a validated paid capability, not precede it.

The free/open-source product should remain useful; paid tiers should primarily add team/organization leverage rather than remove baseline functionality.

## Phase G — Guard Ecosystem

Goal: expand beyond TextGuard only after TextGuard demonstrates durable adoption or a validated path to revenue.

A future Guard Ecosystem may include SchemaGuard, ApiGuard, ConfigGuard, FormGuard, GitGuard, shared authentication/docs/design/billing, and optional AI services. None of these are current commitments.

## Product-complete definition for the current TextGuard roadmap

TextGuard reaches the current roadmap's product-complete checkpoint when:

- current technical/documentation drift is reconciled;
- the consumer validation project passes all major public workflows;
- launch-blocking defects discovered by that project are fixed;
- a stable release checkpoint is published when justified;
- the landing/Playground/readme surfaces are ready for external developers;
- adoption measurement and feedback collection are operating;
- the next feature is selected from real evidence rather than standing speculative scope.

After this point, TextGuard should be treated as a product in growth mode rather than an endless feature-build project.

## Operating loop

```text
Validate current product
        ↓
Make it easy to try
        ↓
Promote to developers
        ↓
Measure real usage
        ↓
Talk to users / collect feedback
        ↓
Identify repeated pain
        ↓
Build the smallest justified improvement
        ↓
Release
        ↓
Repeat

Only after strong commercial signal:
        ↓
Team/paid capability
        ↓
Billing/SaaS
        ↓
Potential Guard Ecosystem expansion
```
