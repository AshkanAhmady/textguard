# Guard Ecosystem — Master Document

> This is the stable product/business vision for the wider Guard Ecosystem.
>
> For TextGuard's actual technical state and delivery roadmap, see `TEXTGUARD-PROJECT.md` and `textguard-roadmap.md`. Those documents are intentionally separate because they change with implementation, while this document should remain stable for longer periods.

---

## 1. Who's Building This

Solo developer, front-end lead engineer by profession. Building this on evenings/weekends, not full-time. Long-term goal is financial independence through owned software products — not freelancing, not chasing GitHub stars. Every hour spent has to have a real reason behind it, because there isn't much of it to spare.

---

## 2. Mission & Vision

**Mission:** Catch problems before production.

**Vision:** Become the ecosystem developers install first in every new project — starting with text, expanding later into schemas, APIs, configs, forms, and git workflows, *if and only if* the first product proves itself.

## 3. Current Reality (Read This First)

**Only one product exists: TextGuard.** Everything else below — SchemaGuard, ApiGuard, ConfigGuard, FormGuard, GitGuard, the AI Platform, the multi-product website, and the SaaS dashboard — is vision-stage. There is no implementation or validated demand for those products yet.

**Deliberate current focus:** TextGuard's current Arabic parity work is complete for the existing architecture. The next focus is adoption validation and evidence-driven roadmap reassessment before expanding product scope. The wider ecosystem and AI-platform build-out is paused, not cancelled — it gets revisited once TextGuard has real users, paying users, or a validated path to them.

---

## 4. Product Principles

These principles apply to every future Guard product, not just TextGuard:

- Solve one painful, expensive problem — not "just another npm package."
- Be easy to adopt, work well in CI/CD, and be extensible.
- Prefer a small core and plugin-first architecture. Core must never depend on optional or AI features.
- Every product should feel like part of one ecosystem, but each must justify its own existence before being started.
- No half-built features; prefer small reviewable commits, stable public APIs, and backward compatibility whenever reasonably possible.

## 5. Decision Filter

Use this before starting any new feature or product:

1. Does it solve a real developer pain?
2. Does it increase product value?
3. Can it help acquire users?
4. Can it increase conversion to a paid plan?
5. Does it fit the Guard Ecosystem vision?

If most answers are "no," don't build it. Roadmap size should never grow without a strong business reason.

## 6. Success Metrics

Success is **not**: number of commits, number of packages, or GitHub stars.

Success **is**: real users, returning users, paying customers, reduced production bugs for the people using it, and developer trust.

---

## 7. Business Model

The business model is aspirational; only the open-source/free layer exists today.

| Tier | Contents |
| --- | --- |
| **Free** | Open-source core packages, docs, community |
| **Pro** | AI-assisted features such as rewrite, suggestions, tone/UX/translation review, prompt review, and speech moderation — deferred until demand is validated |
| **Team** | Shared rules, organization dictionaries, brand voice, dashboards, CI reports |
| **Enterprise** | Self-hosted AI, private models, audit logs, SSO, custom policies, compliance |

Never cripple the free version. Paid tiers should save teams time and add organization-level capability rather than gatekeeping basic functionality.

AI features, if and when they are built, should use pluggable provider adapters so developers can choose providers such as OpenAI, Gemini, Claude, or local models. Core itself must not depend on any AI provider.

## 8. Product Family

### Current

- **TextGuard** — text moderation, detection, validation, diagnostics, and CI-oriented quality tooling.

### Vision-stage

- **SchemaGuard** — schema validation and quality checks before production.
- **ApiGuard** — API contract and integration safeguards.
- **ConfigGuard** — configuration validation and risky-setting detection.
- **FormGuard** — form/data-entry validation and quality safeguards.
- **GitGuard** — repository/workflow quality gates.

These are not commitments to build. Each future Guard must pass the Decision Filter and have evidence of a meaningful developer problem before implementation starts.

## 9. Website

Long-term intent: one Guard Ecosystem site hosting all products under one authentication system, documentation system, design system, blog, billing setup, and analytics layer. Each future product becomes a product area such as `/textguard` or `/schemaguard`, rather than requiring a separate website.

This is deferred. Revisit once there is a second real product or TextGuard has enough adoption to justify a dedicated marketing/product site.

---

## 10. How AI Assistants Should Work With This Project

AI assistants should act as long-term product and engineering partners, not only coding assistants. Optimize for long-term product value over short-term coding convenience.

**Always:**

- Think like a CTO + Product Manager, not just an engineer.
- Prefer business value and maintainability over clever engineering.
- Prefer small, iterative, reviewable commits.
- Apply the Decision Filter before recommending new features.
- Protect against scope creep and push back on roadmap inflation.
- Finish current work before starting something new.
- Be willing to disagree with weak product ideas.

**Never:**

- Suggest features only because they are technically interesting.
- Recommend framework-specific integrations unless explicitly requested.
- Expand Guard Ecosystem scope beyond TextGuard without evidence or an explicit decision to do so.

**Every commit should be able to answer:** *"Does this make it more likely someone will pay for this product?"*
