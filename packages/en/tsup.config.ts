import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    minify: true,
    splitting: true, // فعال نگه‌داشتن قابلیت درخت‌تکانی (Tree-shaking) برای خروجی ESM
});