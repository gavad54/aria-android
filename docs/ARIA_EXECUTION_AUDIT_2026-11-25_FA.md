# ممیزی اجرایی ARIA — 2026-11-25

## دامنه و SHA

- مخزن: `gavad54/aria-android`
- PR: #3، باز و Draft؛ ادغام نشده.
- SHA مبنای آخرین تغییرات CI: `05ee7bd257f0dbfb74736b768ef9f0efeb623e5c`.
- این مخزن در وضعیت فعلی یک برنامه وب Node.js با رابط فارسی RTL و API است؛ نام مخزن به‌تنهایی وجود اپ Android native را اثبات نمی‌کند.

## شواهد آزمون

روی SHA قبلی همان شاخه، `387c6ad78100a5a187d50b423c49c0b6cadfe799`:
- اجرای Node test: **984 passed, 0 failed**.
- Syntax checks: PASS.
- npm production dependency audit: PASS.
- CodeQL JavaScript/TypeScript: PASS.
- آزمون‌ها شامل کاتالوگ/registry، handlerهای دامنه‌ای، کنترل tenant/actor، TLS config، runtime readiness و API smoke tests هستند.
- هشدار Node: ماژول قدیمی `punycode` و هشدار deprecation برای GitHub Actions مبتنی بر Node 20 مشاهده شد.

برای حذف هشدار runner، workflowهای `aria-ci.yml` و `aria-web-catalog-ci.yml` به `actions/checkout@v5` و `actions/setup-node@v5` ارتقا یافتند. روی SHA جدید بالا، CI و CodeQL دوباره اجرا شده‌اند و در زمان ثبت این سند هنوز `in_progress` هستند؛ نتیجه نهایی تا تکمیل runها تأیید نمی‌شود.

## یافته‌های معماری و محصول

1. `package.json` پروژه را `aria-super-app-web` و نسخه `0.2.0` معرفی می‌کند؛ اسکریپت‌ها `node server.js`، `node --test` و syntax check هستند.
2. در درخت GitHub روی SHA ممیزی، فایل‌های `gradlew`، `build.gradle`، `settings.gradle` یا `AndroidManifest.xml` وجود ندارند. بنابراین build، امضای release و نصب Android از این مخزن قابل اثبات نیست.
3. README صریحاً 639 را baseline کاتالوگ/شناسه‌ها می‌داند، نه 639 ماژول عملیاتی. عدد 191 ردیف adapter در ماتریس نیازمندی، نیازمندی است نه integration تکمیل‌شده. ادعای «183 adapter فعال» مجاز نیست.
4. runtime readiness برای Production در نبود `DATABASE_URL` fail-closed است؛ این رفتار صحیح است. اما database connectivity، provider health، migrations و live E2E باید در محیط مجاز واقعی آزموده شوند.
5. README وابستگی PostgreSQL، `ARIA_JWT_SECRET` و تنظیم TLS را مشخص می‌کند. فعال بودن مقدار واقعی secretها یا اتصال DB از سورس اثبات نمی‌شود.
6. README تصریح می‌کند پرداخت، providerهای زنده، backup/restore و انتشار اندروید هنوز گیت‌های جدا هستند.
7. مالکیت حسابداری/ERP خارج از ARIA و در ARIANA باقی می‌ماند؛ این مرز باید در تمام APIها و registryها حفظ شود.

## موانع و اقدام لازم

| اولویت | مانع | اقدام لازم | وضعیت |
|---|---|---|---|
| P0 | CI پس از ارتقای runner هنوز در حال اجرا در زمان ثبت سند | بررسی runها روی SHA دقیق و رفع شکست احتمالی | IN_PROGRESS |
| P0 | Android native source در مخزن موجود نیست | مقایسه کامل آرشیو ARIA 32 با شاخه فعلی، سپس import افزایشی بدون حذف شناسه/قابلیت و اجرای Gradle build | BLOCKED |
| P0 | Production DB و migration/restore اثبات نشده | migration replay و RLS/tenant isolation روی DB ایزوله، سپس backup/restore drill | BLOCKED |
| P0 | Providerهای بیرونی و adapterها بدون sandbox/E2E اثبات نشده‌اند | برای هر provider قرارداد، credential امن، sandbox، idempotency و E2E مستقل | BLOCKED |
| P0 | پرداخت و تسویه واقعی اثبات نشده | sandbox payment، webhook signature/replay, idempotency, reconciliation و approval | BLOCKED |
| P1 | runtime و user journey روی سرویس عمومی و موبایل واقعی کامل اثبات نشده | health/readiness، register/login، API، RTL، شبکه ضعیف، session expiry و tenant boundary | UNVERIFIED |
| P1 | انتشار اندروید | build، release keystore امن، امضای رسمی، install/launch و UAT دستگاه واقعی | BLOCKED |

## تصمیم

**ARIA هنوز Production-ready یا Android-release-ready نیست.** شواهد خودکار 984 تست موفق روی SHA قبلی و CodeQL موفق مثبت‌اند؛ اما این شواهد به معنی عملیاتی بودن تمام 639 شناسه، adapterها، providerهای تجاری، پرداخت، دیتابیس Production یا اپ Android نیستند. نتیجه CI/CodeQL روی SHA جدید باید جداگانه PASS شود و سپس موانع بالا با مدرک مستقل بسته شوند.

هیچ تغییر Production، داده زنده، secret، DNS یا انتشار در این ممیزی انجام نشده است.
