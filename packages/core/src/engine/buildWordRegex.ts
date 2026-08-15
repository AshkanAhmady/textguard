import { escapeRegExp } from "../utils/escapeRegExp";

export interface BuildWordRegexOptions {
  leetspeakMapping: Record<string, string[]>;
  faLookalikesMapping: Record<string, string>;
}

const latinLetter = /\p{Script=Latin}/u;
const lexicalChar = /[\p{L}\p{N}\p{M}]/u;
const whitespaceChar = /\s/u;
const MAX_GENERAL_SEPARATOR_LENGTH = 3;
const MAX_KASHIDA_SEPARATOR_LENGTH = 8;

function buildLexicalPart(
  char: string,
  options: BuildWordRegexOptions,
): string {
  const lowerChar = char.toLowerCase();

  if (options.faLookalikesMapping[lowerChar]) {
    return `${options.faLookalikesMapping[lowerChar]}+`;
  }

  if (options.leetspeakMapping[lowerChar]) {
    const alternatives = [
      escapeRegExp(lowerChar),
      ...options.leetspeakMapping[lowerChar].map(escapeRegExp),
    ];

    return `(?:${alternatives.join("|")})+`;
  }

  return `${escapeRegExp(char)}+`;
}

export function buildWordRegex(
  word: string,
  options: BuildWordRegexOptions,
): RegExp {
  const obfuscationGap = `(?:[\\s\\p{P}\\p{S}\\u200c\\u200d]{0,${MAX_GENERAL_SEPARATOR_LENGTH}}|\\u0640{0,${MAX_KASHIDA_SEPARATOR_LENGTH}})`;
  const chars = Array.from(word);
  const parts: string[] = [];

  chars.forEach((char, index) => {
    if (whitespaceChar.test(char)) {
      parts.push(`\\s{1,${MAX_GENERAL_SEPARATOR_LENGTH}}`);
    } else if (lexicalChar.test(char)) {
      parts.push(buildLexicalPart(char, options));
    } else {
      parts.push(`${escapeRegExp(char)}+`);
    }

    const next = chars[index + 1];
    if (next && lexicalChar.test(char) && lexicalChar.test(next)) {
      parts.push(obfuscationGap);
    }
  });

  const body = parts.join("");
  const usesLatinBoundary = chars.some((char) => latinLetter.test(char));

  if (!usesLatinBoundary) {
    return new RegExp(body, "giu");
  }

  const latinContinuation = "[\\p{Script=Latin}\\p{N}\\p{M}\\u200c\\u200d]";

  return new RegExp(
    `(?<!${latinContinuation})${body}(?!${latinContinuation})`,
    "giu",
  );
}
