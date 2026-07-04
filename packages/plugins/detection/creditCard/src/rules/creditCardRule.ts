import { createRegexRule } from "@textguard/core";
import { CREDIT_CARD_REGEX } from "../regex/creditCardRegex";

export const CreditCardRule = createRegexRule({
  id: "credit-card",
  name: "Credit Card Rule",
  category: "credit-card",
  severity: "high",
  priority: 200,
  regex: CREDIT_CARD_REGEX,
  word: "credit-card",
});
