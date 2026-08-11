# @textguard/cli

Command line interface for TextGuard.

## Scan

```bash
textguard scan "text to scan"
```

Use `--word=<word>` to add one or more custom words for the scan:

```bash
textguard scan "hello secret" --word=secret
```

Use `--json` for machine-readable output:

```bash
textguard scan "hello secret" --word=secret --json
```

Read text from stdin by passing `-` as the text argument:

```bash
cat message.txt | textguard scan - --word=secret
```

Scan exit codes are `0` for a clean scan, `1` when matches are found, and `2` for invalid CLI usage.

## Debug

Use the Core debug engine directly from the CLI:

```bash
textguard debug "hello secret" --word=secret
```

The default output is console-friendly. Structured renderers are also available:

```bash
textguard debug "hello secret" --word=secret --format=json
textguard debug "hello secret" --word=secret --format=markdown
textguard debug "hello secret" --word=secret --format=html
```

Debug also accepts stdin:

```bash
cat message.txt | textguard debug - --format=json
```

Valid debug formats are `console`, `json`, `markdown`, and `html`. Successful debug commands exit with `0`; invalid usage exits with `2`.

## Explain

Use the Core Explain API to see why text matched and which source produced each match:

```bash
textguard explain "hello secret" --word=secret
```

Use `--json` for a stable machine-readable Explain result:

```bash
textguard explain "hello secret" --word=secret --json
```

Explain can consume piped text too:

```bash
cat message.txt | textguard explain - --json
```

Explain exit codes are `0` for clean text, `1` when matches are explained, and `2` for invalid CLI usage.

The CLI remains an adapter over `@textguard/core`; detection, debug, and explain behavior stay in Core and configured packs.
