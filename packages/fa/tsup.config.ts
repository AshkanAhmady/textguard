import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    minify: true,
    splitting: true, // این گزینه خودش قابلیت درخت‌تکانی یا همان Tree-shaking را برای خروجی ESM فعال نگه‌می‌دارد
});