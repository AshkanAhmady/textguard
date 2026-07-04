import { PhonePlugin } from "./plugin";
export * from "./plugin";
export * from "./rules/PhoneRule";

export function phonePlugin() {
  return new PhonePlugin();
}
