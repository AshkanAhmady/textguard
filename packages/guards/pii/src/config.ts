import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { PiiPolicyConfig } from "./policy";

export const PII_CONFIG_PATH = "textguard-pii.config.json";

export function loadPiiConfig(cwd = process.cwd()): PiiPolicyConfig {
  const path = join(cwd, PII_CONFIG_PATH);

  if (!existsSync(path)) return {};

  const raw = readFileSync(path, "utf-8");
  const parsed = JSON.parse(raw) as PiiPolicyConfig;

  return parsed ?? {};
}
