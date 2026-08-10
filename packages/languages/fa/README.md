# @textguard/fa 🇮🇷

پکیج رسمی زبان فارسی برای TextGuard.

این پکیج دیکشنری فارسی، الگوهای رایج توهین/اسپم و mapping مربوط به حروف مشابه فارسی و عربی را در اختیار `@textguard/core` قرار می‌دهد.

## نصب

```bash
npm install @textguard/core @textguard/fa
```

## شروع سریع

```ts
import { createFilter } from "@textguard/core";
import { faDictionary, faLookalikesMapping } from "@textguard/fa";

const filter = createFilter({
  dictionaries: [faDictionary],
  faLookalikesMapping,
});

console.log(filter.hasBadWord("این رفتار احمقانه است"));

const result = filter.filter("این رفتار احمقانه است");
console.log(result.filteredText);
console.log(result.matches);
```

## چه چیزهایی داخل این پکیج است؟

- `faDictionary` — دیکشنری آماده برای استفاده مستقیم با `createFilter`.
- `faProfanity` — واژگان مرتبط با profanity.
- `faInsults` — واژگان مرتبط با توهین.
- `faSpam` — الگوها و واژگان مرتبط با spam.
- `faPatterns` — الگوهای تکمیلی فارسی.
- `faLookalikesMapping` — mapping حروف مشابه برای نرمال‌سازی بهتر متن فارسی.
- `faPack` — مجموعه‌ی exportهای اصلی فارسی در یک object.
- `faLanguage` — metadata زبان فارسی.

## نکته درباره حروف مشابه

`faLookalikesMapping` به‌صورت خودکار فعال نمی‌شود. اگر می‌خواهید تفاوت‌هایی مثل فرم‌های فارسی/عربی بعضی حروف در normalization لحاظ شوند، آن را صریحاً به `createFilter` بدهید:

```ts
const filter = createFilter({
  dictionaries: [faDictionary],
  faLookalikesMapping,
});
```

## API اصلی TextGuard

بعد از ساخت filter می‌توانید از APIهای فعلی core استفاده کنید:

```ts
filter.hasBadWord(text);
filter.findBadWords(text);
filter.filter(text);
filter.debug(text);
filter.explain(text);
```

APIهای قدیمی مثل `languages`, `hasProfanity()` و `clean()` دیگر API فعلی TextGuard نیستند.

## License

MIT
