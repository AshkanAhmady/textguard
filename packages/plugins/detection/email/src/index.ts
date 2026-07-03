import { EmailPlugin } from "./plugin";
export * from "./plugin";
export * from "./rules/emailRule";

export function emailPlugin() {
  return new EmailPlugin();
}
