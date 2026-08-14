import { createRegexRule } from "@textguard/core";
import { UUID_REGEX } from "../regex/uuidRegex";

export const UuidRule = createRegexRule({
  id: "uuid",
  name: "UUID Rule",
  category: "uuid",
  severity: "medium",
  priority: 50,
  regex: UUID_REGEX,
  word: "uuid",
});
