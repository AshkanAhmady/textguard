import { createFilter, strictPreset } from "@textguard/all";

const filter = createFilter(strictPreset);

const result = filter.filter(`
سلام

ایمیل من:
hello@example.com

شماره من:
+989121234567

تو احمقی!
`);

console.log(result);
