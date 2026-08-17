# TextGuard Playground

Browser playground for trying TextGuard without writing integration code.

## Capabilities

- paste or type text and scan it in the browser;
- switch between `default`, `enterprise`, and `socialMedia` presets;
- load built-in example scenarios;
- copy a shareable URL containing the current text and preset;
- toggle individual Enterprise detectors for email, URL, phone, IP, UUID, credit card, and IBAN;
- inspect filtered output and exact match ranges;
- inspect structured Explain metadata for each match;
- expand Debug Engine signal events and timeline projection when deeper diagnostics are needed.

`default` is the canonical newcomer-facing preset name. Legacy shared URLs containing `preset=strict` remain accepted and hydrate as `default` for backward compatibility.

The launch UI intentionally uses progressive disclosure: scanning, status, output, and matches are primary; Explain remains easy to inspect; Debug diagnostics are collapsed by default so the Playground stays approachable for first-time users without removing developer detail.

The Playground uses the same public TextGuard APIs and official detector packages used by application integrations. Detection, Explain, and Debug behavior is not reimplemented in the UI.

This integration is intentionally isolated from the root pnpm workspace so browser-tooling dependencies do not change the library release graph or root lockfile.

## Local development

From `integrations/playground`:

```bash
npm install
npm run check-types
npm run dev
```

For a production build:

```bash
npm run build
```

## Public deployment

The Playground is deployed through `.github/workflows/playground-pages.yml` using GitHub Pages. Production assets use relative URLs so the same build works from the repository Pages path.

GitHub Pages must use **GitHub Actions** as its build/deployment source. Changes under `integrations/playground` automatically rebuild and deploy from `main`.

## Integration status

The Playground is feature-complete for the current product milestone and has received launch-surface UX polish for external developer distribution. Future functional expansion should be driven by concrete adoption or developer-feedback needs rather than expanding it as a second application surface.
