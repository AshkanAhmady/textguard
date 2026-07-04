import { UrlPlugin } from "./plugin";
export * from "./plugin";
export * from "./rules/UrlRule";

export function urlPlugin() {
  return new UrlPlugin();
}
