import type { FilterOptions } from "@textguard/core";

import { emailPlugin } from "@textguard/plugin-email";
import { phonePlugin } from "@textguard/plugin-phone";
import { creditCardPlugin } from "@textguard/plugin-credit-card";
import { ibanPlugin } from "@textguard/plugin-iban";

/**
 * v1 scope: email, phone, credit card, IBAN.
 *
 * UUID was intentionally excluded — a UUID match rarely has GDPR/PCI-DSS
 * compliance weight on its own. Add it later behind a flag if real usage
 * shows otherwise, rather than including it by default.
 *
 * Order matters here. The core engine's overlap resolution (`runRules.ts`)
 * keeps whichever overlapping match was registered first when two matches
 * have equal length and equal rule priority — it does not know which rule
 * carries a checksum validator. The `phone` rule has no validator and its
 * regex is broad enough to also match credit-card/IBAN-shaped digit runs,
 * so it's listed last: if `credit-card` or `iban` already matched that
 * span, `phone`'s equal-length match won't override it. This is a
 * workaround for a real core-engine limitation, not a proper fix — see
 * TEXTGUARD-PROJECT.md for a note on flagging this upstream.
 */
export const piiPreset: FilterOptions = {
  plugins: [emailPlugin(), creditCardPlugin(), ibanPlugin(), phonePlugin()],
};
