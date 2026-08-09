export { piiPreset } from "./preset";
export { scanText, scanFile, scanMany } from "./scan";
export type { PiiFinding, PiiType, ScanResult } from "./scan";
export { applyPolicy, isFindingAllowed, isPathIgnored, pathMatches } from "./policy";
export type { PiiPolicyConfig, PiiSuppression } from "./policy";
export { loadPiiConfig, PII_CONFIG_PATH } from "./config";
export {
  toFileResult,
  formatConsoleReport,
  formatMarkdownReport,
} from "./report";
export type { FileFinding, FileResult } from "./report";
