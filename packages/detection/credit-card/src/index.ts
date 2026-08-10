import { CreditCardPlugin } from "./plugin";
export * from "./plugin";
export * from "./rules/creditCardRule";

export function creditCardPlugin() {
  return new CreditCardPlugin();
}
