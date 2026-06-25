import { escapeRegExp } from "../utils/escapeRegExp";

export interface BuildWordRegexOptions {
  leetspeakMapping: Record<string, string[]>;
  faLookalikesMapping: Record<string, string>;
}

export function buildWordRegex(
  word: string,
  options: BuildWordRegexOptions,
): RegExp {
  const separator = "[\\s\\._\\-*\\u200c\\u0640]*";

  const parts = Array.from(word).map((char) => {
    const lowerChar = char.toLowerCase();

    if (options.faLookalikesMapping[lowerChar]) {
      return `${options.faLookalikesMapping[lowerChar]}+`;
    }

    if (options.leetspeakMapping[lowerChar]) {
      const alternatives = [
        escapeRegExp(lowerChar),
        ...options.leetspeakMapping[lowerChar].map(escapeRegExp),
      ];

      return `(${alternatives.join("|")})+`;
    }

    return `${escapeRegExp(char)}+`;
  });

  return new RegExp(parts.join(separator), "gi");
}
