export function isValidIban(iban: string): boolean {
  const normalized = iban.replace(/\s+/g, "").toUpperCase();

  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(normalized)) {
    return false;
  }

  const rearranged = normalized.slice(4) + normalized.slice(0, 4);

  let numeric = "";

  for (const char of rearranged) {
    if (/[A-Z]/.test(char)) {
      numeric += (char.charCodeAt(0) - 55).toString();
    } else {
      numeric += char;
    }
  }

  let remainder = 0;

  for (const digit of numeric) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }

  return remainder === 1;
}
