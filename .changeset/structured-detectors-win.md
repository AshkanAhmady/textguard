---
"@textguard/plugin-email": patch
"@textguard/plugin-url": patch
"@textguard/plugin-phone": patch
"@textguard/plugin-ip": patch
"@textguard/plugin-uuid": patch
"@textguard/plugin-credit-card": patch
"@textguard/plugin-iban": patch
---

Give official structured-data detectors higher rule precedence than generic dictionary patterns so overlapping exact-span matches retain specialist detector provenance in Debug and Explain.
