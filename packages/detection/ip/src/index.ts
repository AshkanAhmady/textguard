import { IpPlugin } from "./plugin";
export * from "./plugin";
export * from "./rules/ipRule";

export function ipPlugin() {
  return new IpPlugin();
}
