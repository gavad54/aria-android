# گزارش ممیزی و ادغام قراردادهای ARIA — مدل قرارداد یکتا و نام‌های مستعار

تاریخ: ۲۰۲۶-۱۱-۱۹  
شاخه: `engineering/aria-preserve-all-capabilities-2026-11-19`  
وضعیت: اصلاح معماری کاتالوگ و آزمون وب در شاخه مهندسی ثبت شده؛ ادغام PR و انتشار Production انجام نشده است.

## ۱. تصمیم معماری اصلاح‌شده

ممیزی فایل نگاشت نشان داد هر ۷۲ رکورد کاتالوگ وب به یکی از ۴۷ قرارداد موجود ارجاع دارد. بنابراین این رکوردها قرارداد اجرایی مستقل جدید نیستند. اضافه‌کردن آن‌ها با شناسه‌های ۶۵۱ تا ۷۲۲ به رجیستری، ۷۲ هویت اجرایی تکراری می‌ساخت.

مدل نهایی:
- ۶۳۹ قرارداد canonical قبلی بدون حذف یا تغییر شناسه حفظ می‌شوند.
- ۷۲ قابلیت کاتالوگ با شناسه‌های نمایشی/کاتالوگی ۶۵۱ تا ۷۲۲ باقی می‌مانند.
- هر قابلیت کاتالوگ به یکی از ۴۷ قرارداد canonical با فیلد `capabilityContractId` ارجاع می‌دهد.
- هر قرارداد canonical می‌تواند چند `catalog_aliases` داشته باشد.
- شناسه کاتالوگ با شناسه قرارداد اجرایی متفاوت است؛ مسیر API از `catalogEntryId` استفاده می‌کند و اجرای واقعی از `capabilityContractId`.
- تعداد قراردادهای اجرایی ۶۳۹ می‌ماند؛ تعداد ورودی‌های کاتالوگ ۷۲ است؛ قرارداد اجرایی تکراری جدید ایجاد نمی‌شود.

## ۲. تغییرات ثبت‌شده

- `backend/data/aria_web_catalog_bridge.json`: schema نسخه ۱.۱.۰؛ تغییر نام فیلدها به `catalogEntryId` و `capabilityContractId`؛ تعداد قرارداد افزوده‌شده صفر؛ ۷۲ ورودی و ۴۷ هدف یکتا.
- `server.js`: نگاشت کاتالوگ از manifest خوانده می‌شود؛ هر ورودی به قرارداد canonical واقعی متصل است؛ مسیر `/api/modules/:catalogEntryId/plan` شناسه کاتالوگ را می‌پذیرد و در خروجی شناسه قرارداد canonical را برمی‌گرداند.
- `test/server.test.js`: آزمون نگاشت شناسه کاتالوگ، شناسه قرارداد پایه، یکتایی شناسه‌ها، تعداد ۶۳۹ قرارداد و ۴۷ هدف alias اضافه شد.
- `scripts/aria_web_catalog_manifest_test.js`: آزمون سازگاری ۷۲ ورودی و نگاشت آن‌ها به ۴۷ قرارداد.
- `scripts/aria32_apply_web_catalog_bridge.js`: بازنویسی شد تا به‌جای افزودن ۷۲ ماژول، آرایه `catalog_aliases` را به همان ۴۷ قرارداد canonical در سه رجیستری backend، Android و capabilities اضافه کند. تعداد و digest شناسه‌های پایه باید بدون تغییر بماند.
- `scripts/aria32_alias_consolidation_gate.cjs`: گیت مستقل حفظ ۶۳۹ شناسه، parity سه رجیستری، ۷۲ alias و ۴۷ هدف.
- `scripts/aria32_web_catalog_runtime_check.cjs`: بررسی می‌کند هر ۷۲ alias از طریق قرارداد canonical و handler موجود قابل resolve باشد؛ handler فقط برنامه محلی می‌دهد و اجرای بیرونی را ادعا نمی‌کند.
- `.github/workflows/aria-android-build.yml`: اجرای گیت ادغام alias و آزمون runtime را قبل از مراحل ساخت Android الزامی می‌کند.
- `.github/workflows/aria-web-catalog-ci.yml`: بررسی syntax اسکریپت‌های جدید و آزمون manifest/API را اجرا می‌کند.

## ۳. آزمون‌های تأییدشده

CI وب/API روی commit `3c7c2d7f9ff36185caf54f76f18d2da31954dd29` موفق شد:
- Run [44534868579](https://github.com/gavad54/aria-android/actions/runs/44534868579) — success
- Run [44534856066](https://github.com/gavad54/aria-android/actions/runs/44534856066) — success

تمام مراحل اصلی CI، از نصب وابستگی‌ها و بررسی syntax تا manifest و آزمون API، موفق بوده‌اند.

فایل ZIP نسخه ۳۲ در محیط کاری موجود بود و checksum آن با مقدار مورد انتظار تطبیق داشت:
`270c7abbee1e96ec466d7a2a906aab98943ebe3c015b4abb4e0b6b3ab8e5b8bf`

روی candidate خام و پیش از overlay، این آزمون‌ها محلی اجرا و موفق شدند:
- `node scripts/aria32_no_loss_gate.js` — حفظ ۶۳۹ شناسه و digest تأیید شد.
- `bash scripts/verify_module_capability_matrix.sh` — parity اولیه رجیستری‌ها تأیید شد.
- `node scripts/aria32_release_readiness.js` — تمام آزمون‌های داخلی فراخوانی‌شده موفق شدند؛ خروجی صریحاً اتصال DB زنده، پرداخت، API بیرونی و Android امضاشده را تأییدنشده اعلام کرد.

## ۴. وضعیت واقعی و محدودیت‌های باقی‌مانده

- آزمون CI وب/API موفق است.
- baseline خام Android با ۶۳۹ شناسه و digest اصلی PASS است.
- overlay جدید و گیت ۷۲ alias هنوز روی candidate ZIP اجرا نشده‌اند؛ چون ZIP هنوز در مسیر مخزن `release-input/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip` قرار نگرفته است.
- بنابراین parity پس از overlay و runtime alias check هنوز PASS اعلام نمی‌شود.
- ساخت APK/AAB، نصب و اجرای واقعی روی دستگاه، امضای release، اتصال providerهای بیرونی، پرداخت و انتشار Production هنوز اثبات نشده‌اند.
- `ACTIVE_LOCAL_WORKFLOW` فقط برنامه‌ریزی محلی ساختاریافته است، نه انتشار محتوا، رندر رسانه، پرداخت، رزرو یا تغییر سرویس بیرونی.

## ۵. اقدام بعدی برای تکمیل Android

فایل ZIP با SHA-256 بالا باید در مسیر زیر روی همان شاخه بارگذاری شود:

`release-input/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`

سپس workflow اندروید:
1. checksum فایل را بررسی می‌کند؛
2. ۷۲ alias را به ۴۷ قرارداد canonical اضافه می‌کند؛
3. گیت حفظ ۶۳۹ شناسه و parity سه رجیستری را اجرا می‌کند؛
4. resolve شدن ۷۲ alias از طریق runtime را می‌سنجد؛
5. release readiness، schema و تست‌های پروژه را اجرا می‌کند؛
6. در صورت عبور از همه گیت‌ها، APK debug و AAB release را می‌سازد.

هیچ مرحله‌ای نباید با صرف وجود `status=ACTIVE` یا `enabled=true` تکمیل‌شده محسوب شود.

## ۶. PR

- PR #3: https://github.com/gavad54/aria-android/pull/3
- وضعیت: باز، Draft، ادغام‌نشده.
- هیچ merge به شاخه مقصد یا انتشار Production انجام نشده است.

**نتیجه:** ادغام منطقی کاتالوگ به قراردادهای یکتا در API و manifest پیاده‌سازی شده و آزمون وب/API موفق است. تکمیل اتصال این aliasها به رجیستری و runtime واقعی Android منوط به اجرای workflow روی ZIP است.

## ۴. ثبت ۷۲ ماژول تجاری و موتورهای درآمدی

در ادامه، ۷۲ ورودی کاتالوگ به‌عنوان ۷۲ ماژول تجاری مستقل و قابل آدرس‌دهی ثبت شدند؛ هر ماژول شناسه کاتالوگ، حوزه، توضیح، قرارداد اجرایی والد و موتور درآمدی خودش را دارد. رجیستری جدید:

- `backend/data/aria_commercial_module_registry.json`
- ۶۳۹ قرارداد canonical اجرایی قبلی حفظ شده‌اند.
- ۷۲ ماژول تجاری جدید به لایه محصول اضافه شده‌اند؛ بنابراین تعداد ماژول‌های قابل عرضه/نمایش محصولی ۷۱۱ است.
- هر ۷۲ ماژول به یکی از ۴۷ قرارداد اجرایی موجود متصل‌اند؛ handler تکراری یا قرارداد اجرایی جدید ساخته نشده است.
- روش‌های درآمدی شامل اشتراک، اعتبار پیش‌پرداخت، مصرف‌محور، پرداخت به‌ازای خروجی/راه‌اندازی، کارمزد بازارگاه، فروش محصولات دیجیتال و خدمات ممتاز است.
- برای هر ماژول entitlement key، واحد سنجش مصرف، سیاست سهمیه، قیمت‌گذاری مالک‌محور، الزامات افشای هزینه و کنترل ضدسوءاستفاده تعریف شده است.
- APIهای `/api/revenue/catalog` و `/api/revenue/summary` رجیستری تجاری و وضعیت موتور درآمدی را ارائه می‌کنند.

**مرز واقعی فعال‌سازی:** موتورهای درآمدی در این تغییر از نظر مدل داده، کاتالوگ و API طراحی و ثبت شده‌اند، اما درآمد واقعی فعال نیست: قیمت و ارز عمداً خالی است، درگاه پرداخت متصل نیست و وضعیت همه ماژول‌ها `NOT_LIVE` است. همچنین providerهای بیرونی تا اتصال رسمی و آزمون‌شده اجرا نمی‌شوند. بنابراین عدد ۷۱۱، تعداد ماژول‌های محصولی/تجاری است، نه ۷۱۱ handler مستقل یا ۷۱۱ سرویس عملیاتی تأییدشده.


## ۷. بازبینی مجدد CI روی شاخه PR — 2026-11-19
- PR #3 head در زمان ممیزی نهایی: `7ad26d5264df6c691bb18f4166c232f2c4181a8d`؛ PR باز، Draft و ادغام‌نشده است.
- آخرین اجرای workflow وب/API روی commit کد قبل از تغییرات مستنداتی: [Run 44544436103](https://github.com/gavad54/aria-android/actions/runs/44544436103) — **success**.
- Job `web-catalog` و مراحل Install dependencies، Validate engineering scripts، Validate catalog-to-contract manifest و Run web API tests همگی success هستند.
- commitهای بعدی فقط اسناد Crosswalk و ممیزی را به‌صورت افزایشی تغییر داده‌اند؛ برای head مستنداتی جدید workflow جداگانه‌ای ثبت نشده است.
- workflow ساخت Android در این اجرا نشده است؛ فایل ZIP منبع باید در `release-input/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip` قرار گیرد و checksum آن تأیید شود.
- آزمون‌های وب، وجود 72 ورودی کاتالوگ و برنامه‌ریزی محلی را بررسی می‌کنند؛ اجرای بیرونی provider، پرداخت، درآمد زنده یا E2E تولیدی را ثابت نمی‌کنند.
