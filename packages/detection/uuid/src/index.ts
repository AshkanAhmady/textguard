import { UuidPlugin } from "./plugin";
export * from "./plugin";
export * from "./rules/uuidRule";

export function uuidPlugin() {
  return new UuidPlugin();
}
