# TextGuard Playground

Browser playground for trying TextGuard without writing integration code.

## Current capability

- paste or type text to scan;
- switch between `strict`, `enterprise`, and `socialMedia` presets;
- inspect filtered output and match ranges;
- inspect structured Explain metadata for each match, including source plugin, rule id, reason, and range;
- inspect Debug Engine event order and the public timeline projection from the same scan;
- run entirely in the browser through the public `@textguard/all` package.

The Explain and Debug panels call the same public `filter.explain(text)` and `filter.debug(text)` APIs used by other TextGuard integrations, so the Playground does not duplicate engine logic.

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

The Playground remains intentionally incremental. Deployment, shareable examples, and richer detection controls remain later milestones.
