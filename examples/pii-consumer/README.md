# TextGuard PII Consumer Example

This example shows how a normal application repository can install and use `@textguard/plugin-pii` for local commit protection and pull-request scanning.

## Install

```bash
npm install -D @textguard/plugin-pii husky
npx husky init
npx textguard-pii init
```

`textguard-pii init` adds the TextGuard command to the existing Husky pre-commit hook and creates a PII GitHub Actions workflow when one does not already exist.

## Policy configuration

Create `textguard-pii.config.json` in the repository root when intentional test/demo values need an exception.

```json
{
  "allowlist": {
    "email": ["fixture-email"]
  },
  "ignorePaths": ["fixtures/**"],
  "suppressions": [
    {
      "path": "docs/**",
      "type": "email",
      "matchedText": "fixture-email"
    }
  ]
}
```

Use the narrowest exception possible. Prefer an exact detector-specific allowlist entry before ignoring an entire directory.

## Library usage

```ts
import { scanFile, scanText } from "@textguard/plugin-pii";

const demoEmail = ["developer", "example.com"].join("@");

const strictResult = scanText(`Contact: ${demoEmail}`);
const policyAwareResult = scanFile(
  "fixtures/example.txt",
  `Contact: ${demoEmail}`,
  {
    ignorePaths: ["fixtures/**"],
  },
);

console.log(strictResult.clean); // false
console.log(policyAwareResult.clean); // true
```

`scanText()` stays detection-only and strict. `scanFile()` applies repository policy after detection.

## What CI validates

The `e2e.mjs` script in this folder is also executed by TextGuard's own CI. It packs the real npm package into a clean temporary repository and verifies that:

- `npx textguard-pii init` prepares the consumer setup;
- non-allowlisted PII blocks a real Git commit;
- allowlisted values are permitted;
- ignored paths are permitted;
- `textguard-pii-ci` passes policy-approved changes;
- `textguard-pii-ci` fails when a new non-allowed PII value is committed.

That means this example doubles as executable documentation: if the documented consumer flow stops working, CI fails.
