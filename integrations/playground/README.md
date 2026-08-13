# TextGuard Playground

Browser playground for trying TextGuard without writing integration code.

## Current capability

- paste or type text to scan;
- switch between `strict`, `enterprise`, and `socialMedia` presets;
- inspect filtered output and match ranges;
- run entirely in the browser through the public `@textguard/all` package.

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

The initial slice is deliberately small. Explain/debug visualization, shareable examples, deployment, and richer detection controls should be added only as subsequent playground milestones.
