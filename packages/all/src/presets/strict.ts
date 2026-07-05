import type { FilterOptions } from "@textguard/core";

// import { faPlugin } from "@textguard/plugin-fa";
// import { enPlugin } from "@textguard/plugin-en";
// import { arPlugin } from "@textguard/plugin-ar";

import { emailPlugin } from "@textguard/plugin-email";
import { urlPlugin } from "@textguard/plugin-url";
import { phonePlugin } from "@textguard/plugin-phone";
import { ipPlugin } from "@textguard/plugin-ip";
import { uuidPlugin } from "@textguard/plugin-uuid";
import { creditCardPlugin } from "@textguard/plugin-credit-card";
import { ibanPlugin } from "@textguard/plugin-iban";

export const strictPreset: FilterOptions = {
  plugins: [
    // faPlugin(),
    // enPlugin(),
    // arPlugin(),

    emailPlugin(),
    urlPlugin(),
    phonePlugin(),
    ipPlugin(),
    uuidPlugin(),
    creditCardPlugin(),
    ibanPlugin(),
  ],
};
