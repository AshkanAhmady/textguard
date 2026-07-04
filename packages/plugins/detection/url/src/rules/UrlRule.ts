import { createRegexRule } from "@textguard/core";
import { URL_REGEX } from "../regex/urlRegex";

export const UrlRule = createRegexRule({
  id: "url",
  name: "URL Rule",
  category: "url",
  severity: "low",
  priority: 200,
  regex: URL_REGEX,
  word: "url",
});
