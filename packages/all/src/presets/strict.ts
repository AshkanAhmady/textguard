import type { FilterOptions } from "@textguard/core";

import { faDictionary } from "@textguard/plugin-fa";
import { enDictionary } from "@textguard/plugin-en";
// TODO(v1.1):
// Add arDictionary when Arabic language package is implemented.
// import { arDictionary } from "@textguard/plugin-ar";

import { emailPlugin } from "@textguard/plugin-email";
import { urlPlugin } from "@textguard/plugin-url";
import { phonePlugin } from "@textguard/plugin-phone";
import { ipPlugin } from "@textguard/plugin-ip";
import { uuidPlugin } from "@textguard/plugin-uuid";
import { creditCardPlugin } from "@textguard/plugin-credit-card";
import { ibanPlugin } from "@textguard/plugin-iban";

export const strictPreset: FilterOptions = {
  dictionaries: [
    faDictionary,
    enDictionary,
    // arDictionary,
  ],
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
