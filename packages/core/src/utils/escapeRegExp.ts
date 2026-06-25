// تابع کمکی برای Escape کردن کاراکترهای خاص در Regex
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
