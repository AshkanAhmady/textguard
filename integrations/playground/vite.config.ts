import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

const workspaceSource = (path: string) =>
  fileURLToPath(new URL(`../../${path}`, import.meta.url));

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@textguard/core": workspaceSource("packages/core/src/index.ts"),
      "@textguard/fa": workspaceSource("packages/languages/fa/src/index.ts"),
      "@textguard/en": workspaceSource("packages/languages/en/src/index.ts"),
      "@textguard/ar": workspaceSource("packages/languages/ar/src/index.ts"),
      "@textguard/plugin-email": workspaceSource("packages/detection/email/src/index.ts"),
      "@textguard/plugin-url": workspaceSource("packages/detection/url/src/index.ts"),
      "@textguard/plugin-phone": workspaceSource("packages/detection/phone/src/index.ts"),
      "@textguard/plugin-ip": workspaceSource("packages/detection/ip/src/index.ts"),
      "@textguard/plugin-uuid": workspaceSource("packages/detection/uuid/src/index.ts"),
      "@textguard/plugin-credit-card": workspaceSource(
        "packages/detection/credit-card/src/index.ts",
      ),
      "@textguard/plugin-iban": workspaceSource("packages/detection/iban/src/index.ts"),
      "@textguard/all": workspaceSource("packages/all/src/index.ts"),
    },
  },
});
