import type { Match, MatchContext, Rule } from "@textguard/core";

import { CREDIT_CARD_REGEX } from "../regex/creditCardRegex";
import { isValidCreditCard } from "../utils/luhn";

export const CreditCardRule: Rule = {
  id: "credit-card",
  name: "Credit Card Rule",
  category: "credit-card",
  severity: "high",
  priority: 200,

  supports() {
    return true;
  },

  match(context: MatchContext): Match[] {
    const matches: Match[] = [];

    CREDIT_CARD_REGEX.lastIndex = 0;

    let match: RegExpExecArray | null;

    while ((match = CREDIT_CARD_REGEX.exec(context.text)) !== null) {
      if (!isValidCreditCard(match[0])) {
        continue;
      }

      matches.push({
        word: "credit-card",
        matchedText: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    return matches;
  },
};
