import type { Plugin } from "@textguard/core";
import { creditCardPlugin } from "@textguard/plugin-credit-card";
import { emailPlugin } from "@textguard/plugin-email";
import { ibanPlugin } from "@textguard/plugin-iban";
import { ipPlugin } from "@textguard/plugin-ip";
import { phonePlugin } from "@textguard/plugin-phone";
import { urlPlugin } from "@textguard/plugin-url";
import { uuidPlugin } from "@textguard/plugin-uuid";

export const strictPreset: Plugin[] = [
  emailPlugin(),
  urlPlugin(),
  phonePlugin(),
  ipPlugin(),
  uuidPlugin(),
  creditCardPlugin(),
  ibanPlugin(),
];
