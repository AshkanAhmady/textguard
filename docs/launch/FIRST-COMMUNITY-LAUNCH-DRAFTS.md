# First Community Launch Drafts

> Derived from `FIRST-TECHNICAL-ARTICLE.md` and `DEVELOPER-DISTRIBUTION-PLAYBOOK.md`. Adapt to each community's current rules before posting. Do not paste the same copy everywhere.

## Show HN

### Title

Show HN: TextGuard – a local TypeScript toolkit for multilingual text safety, PII detection, Explain and Debug

### Body

I built TextGuard, an open-source TypeScript toolkit for text entering applications and developer workflows.

It started closer to a profanity/filtering library, but testing it through a public Playground exposed problems that simple token tests did not: Persian and English matches that failed inside realistic sentences, obfuscation/leetspeak tradeoffs, Unicode normalization corrupting original match ranges, generic rules winning Explain provenance over specialist email/phone detectors, and Debug timelines with too much lifecycle noise.

We hardened those areas with regression fixtures, range-aware normalization, explicit specialist detector precedence, signal-projected Debug output, false-positive coverage, and a separate consumer-validation repo that tests the actual npm artifacts on Node 20/22, CLI, browser/Vite, PII workflows, benchmarks, and a real VS Code extension host.

The current package can be tried without installing anything:

https://ashkanahmady.github.io/textguard/

GitHub: https://github.com/AshkanAhmady/textguard

I am especially interested in real failure cases: what text-safety problem do you have, which language/detector matters, and what false positive or false negative would make a local tool like this unusable for you?

## Reddit — TypeScript / Node framing

### Suggested title

I hardened an open-source TypeScript text filter after the browser Playground exposed real Unicode, sentence-context and Explain bugs

### Body

I have been building TextGuard, an open-source TypeScript text-safety toolkit that runs locally and covers multilingual moderation, structured-data detection, PII workflows, Explain/Debug, CLI, VS Code and a browser Playground.

The useful part of the project recently was not adding another feature. It was discovering how misleading happy-path tests can be.

The Playground exposed cases where a profanity token matched alone but not inside realistic Persian/English sentences, obfuscation bypasses, original match ranges drifting after length-changing normalization, and email/phone matches being explained as generic dictionary rules instead of their specialist detectors.

We ended up changing both implementation and validation: range-aware normalization in Core, bounded compatibility/leetspeak behavior with false-positive regression tests, specialist detector precedence through the existing rule-priority contract, a lower-noise Debug signal projection, and an external repo that installs exact published npm versions instead of relying on monorepo workspace resolution.

I wrote up the engineering story here: [ARTICLE_URL]

If you want to break it yourself, the Playground is here:
https://ashkanahmady.github.io/textguard/

I would value concrete cases more than general feedback—especially multilingual sentence context, false positives, or structured detector edge cases.

### Posting note

Before posting, choose the specific subreddit and read its current self-promotion/link rules. If links in the body are discouraged, make the post primarily educational and put the Playground/repo link in the permitted location.

## Reddit — security / PII framing

### Suggested title

A local TypeScript guard for catching PII before it reaches Git commits and PRs

### Body

One part of TextGuard that may be useful outside moderation is `@textguard/plugin-pii`, a local commit/PR guard built on the same structured detectors used by the runtime engine.

It can detect things like email, phone, credit-card and IBAN candidates before they leave the developer workflow, with allowlists/ignored paths/narrow suppressions for cases that are intentional.

During release hardening we also moved validation outside the monorepo so the PII consumer flow installs actual packed/published dependencies rather than accidentally succeeding because workspace packages are available locally.

The broader project is here:
https://github.com/AshkanAhmady/textguard

If your team has had PII leak into source control, I would be interested in which detector types and suppression workflow would make a local guard practical or impractical for you.

## LinkedIn

I spent the latest TextGuard milestone removing reasons *not* to trust a text filter rather than adding more features.

A browser Playground exposed issues that isolated unit tests hid:

- profanity detected alone but missed inside realistic Persian/English sentences;
- obfuscation and leetspeak that improved recall but could also create false positives;
- Unicode normalization that could make match ranges point at the wrong original text;
- email/phone matches with misleading Explain provenance;
- Debug traces that were technically complete but too noisy to use.

The fixes ended up touching architecture, not just regexes: range-aware normalization, bounded compatibility behavior, specialist detector precedence, signal-projected debugging, adversarial regression fixtures, and external validation against the actual npm artifacts.

TextGuard is now an open-source, local TypeScript safety layer for multilingual moderation, structured-data/PII detection, and developer diagnostics.

Try the Playground: https://ashkanahmady.github.io/textguard/

The feedback I want most is a real workflow or failure case—not a star. What would you need to trust a local text-safety toolkit in your stack?

## X / short-form post

A Playground taught me more about TextGuard than the happy-path unit tests did.

We found sentence-context misses, Unicode range bugs, misleading Explain provenance, noisy Debug traces, and obfuscation/false-positive tradeoffs.

After hardening + published-artifact validation, it is ready for real developer feedback:
https://ashkanahmady.github.io/textguard/

## DEV article metadata

### Candidate title

How We Hardened a Multilingual TypeScript Text Filter Against Real Bypasses and False Positives

### Candidate description

What a public Playground exposed about sentence-context detection, Unicode range mapping, leetspeak tradeoffs, Explain provenance, Debug signal-to-noise, and validating real npm artifacts.

### Candidate tags

`typescript`, `opensource`, `security`, `webdev`

Use only tags that are valid/current on the publishing platform at publication time.

## Primary CTA rules

- Technical hardening story → **Try the Playground**.
- Installation tutorial → **Install `@textguard/all`**.
- Security/PII story → **Try `@textguard/plugin-pii`**.
- Feedback post → **Share a concrete workflow/failure case**.

Do not make “star the repo” the primary call to action.

## Publication checklist

Before any post goes live:

- replace `[ARTICLE_URL]` with the final canonical article URL;
- recheck community self-promotion and formatting rules that day;
- verify the Playground and GitHub links;
- use `defaultPreset` in any code example;
- avoid claims of perfect detection, zero false positives, universal language coverage, or benchmark superiority;
- capture the post URL and meaningful responses in issue #65;
- do not treat likes/upvotes alone as adoption evidence.
