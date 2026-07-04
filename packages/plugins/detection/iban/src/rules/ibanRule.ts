import { createRegexRule } from "@textguard/core";

import { IBAN_REGEX } from "../regex/ibanRegex";
import { isValidIban } from "../utils/mod97";

export const IbanRule = createRegexRule({
  id: "iban",
  name: "IBAN Rule",
  category: "iban",
  severity: "high",
  priority: 200,
  regex: IBAN_REGEX,
  word: "iban",
  validator: isValidIban,
});
