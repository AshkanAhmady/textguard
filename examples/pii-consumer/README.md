# TextGuard PII Example

A simple example of using `@textguard/plugin-pii` in a normal project.

The main idea is simple: TextGuard checks your staged files before a commit. If it finds PII such as an email, phone number, credit card, or IBAN, the commit is stopped.

## 1. Install

```bash
npm install -D @textguard/plugin-pii husky
npx husky init
npx textguard-pii init
```

That's it for the basic setup. `textguard-pii init` connects TextGuard to your pre-commit hook and adds the GitHub Actions workflow used for pull requests. If Husky created its default `npm test` placeholder hook, TextGuard replaces only that placeholder; any real custom hook commands are preserved.

## 2. Try it

Create or edit a file and put an email address in it. Then stage and commit the file:

```bash
git add .
git commit -m "test pii guard"
```

TextGuard should detect the email and stop the commit.

## 3. Allow test data

Sometimes a test or fixture intentionally contains something that looks like PII. Create `textguard-pii.config.json` in your project root and allow only that known value:

```json
{
  "allowlist": {
    "email": ["your-test-email"]
  }
}
```

There is also a ready-to-copy `textguard-pii.config.example.json` in this folder.

If an entire fixture folder should be ignored, you can use:

```json
{
  "ignorePaths": ["tests/fixtures/**"]
}
```

Start with `allowlist` when possible. Ignore a whole path only when that is really what you want.

## 4. Use it in code

You can also scan text directly:

```ts
import { scanText } from "@textguard/plugin-pii";

const email = ["hello", "example.com"].join("@");
const result = scanText(`Contact: ${email}`);

console.log(result.clean); // false
console.log(result.findings);
```

## What this example tests

TextGuard's own CI runs `e2e.mjs` from this folder to make sure the real consumer flow keeps working: installation, `init`, blocked commits, allowed test data, ignored fixture paths, and pull-request scanning.

You do not need to understand `e2e.mjs` to use the package. It exists so this simple documented setup cannot silently break.
