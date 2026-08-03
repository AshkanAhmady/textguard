import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    minify: true,
    splitting: true,
  },
  {
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    dts: false,
    clean: false,
    minify: true,
    banner: { js: "#!/usr/bin/env node" },
  },
  {
    entry: { ci: "src/ci.ts" },
    format: ["esm"],
    dts: false,
    clean: false,
    minify: true,
  },
]);
