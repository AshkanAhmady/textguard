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

Valid debug formats are `console`, `json`, `markdown`, and `html`. Successful debug commands exit with `0`; invalid usage exits with `2`.

The CLI remains an adapter over `@textguard/core`; detection and debug behavior stay in Core and configured packs.
