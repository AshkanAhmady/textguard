import type { FilterOptions } from "@textguard/core";

import { faDictionary } from "@textguard/fa";
import { enDictionary, enLeetspeakMapping } from "@textguard/en";
import { arDictionary } from "@textguard/ar";

import { emailPlugin } from "@textguard/plugin-email";
import { urlPlugin } from "@textguard/plugin-url";
import { phonePlugin } from "@textguard/plugin-phone";
import { ipPlugin } from "@textguard/plugin-ip";
import { uuidPlugin } from "@textguard/plugin-uuid";
import { creditCardPlugin } from "@textguard/plugin-credit-card";
import { ibanPlugin } from "@textguard/plugin-iban";

/** Recommended ready-made TextGuard preset for general use. */
export const defaultPreset: FilterOptions = {
  dictionaries: [faDictionary, enDictionary, arDictionary],
  leetspeakMapping: enLeetspeakMapping,
  plugins: [
    emailPlugin(),
    urlPlugin(),
    phonePlugin(),
    ipPlugin(),
    uuidPlugin(),
    creditCardPlugin(),
    ibanPlugin(),
  ],
};
