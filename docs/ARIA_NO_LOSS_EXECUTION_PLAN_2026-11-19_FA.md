# ARIA — برنامه اجرایی حفظ همه قابلیت‌ها و فعال‌سازی مبتنی بر شواهد
**تاریخ:** 2026-11-19  
**وضعیت:** برنامه اجرایی نسخه‌دار؛ اجرای مرحله‌ای در شاخه توسعه  
**شاخه:** `engineering/aria-preserve-all-capabilities-2026-11-19`  
**مبنای شروع:** PR #2 head `24b3f0c8080853944ebac7f79d9f53c3d9982765`

## 1. فرمان‌های غیرقابل‌نقض
1. هیچ قابلیت، موتور، ماژول، شناسه، داده، migration، سند یا سابقه‌ای صرفاً برای ساده‌سازی حذف نمی‌شود.
2. ادغام فقط پس از مقایسه ورودی/خروجی، قواعد کسب‌وکار، نقش‌ها، داده‌ها، وابستگی‌ها و آزمون‌ها مجاز است. قابلیت‌های یکتا باید در مقصد باقی بمانند.
3. شناسه‌های قدیمی به‌عنوان alias/mapping پایدار نگهداری می‌شوند؛ حذف یا reuse شناسه ممنوع است.
4. وضعیت `ACTIVE` فقط وقتی معتبر است که مسیر اجرایی واقعی، کنترل دسترسی، مدیریت خطا، observability و آزمون‌های مربوطه وجود داشته باشد.
5. هیچ داده واقعی، راز، کلید، فایل اصلی یا محیط Production در آزمون یا تغییرات توسعه دست‌کاری نمی‌شود.
6. هیچ deploy، migration مخرب، حذف فایل، ادغام PR یا انتشار عمومی بدون مجوز مستقل انجام نمی‌شود.
7. هر بلوکر باید با علت، اثر، مدرک و اقدام رفع ثبت شود؛ به‌جای جعل وضعیت سبز، وضعیت دقیق حفظ می‌شود.

## 2. مبنای شواهد و حدود آن
- کاتالوگ وب در PR #2 شامل 72 رکورد است؛ 2 foundation، 5 prototype و 65 planned.
- رجیستری Android 32.0.0 در منبع candidate شامل 639 قرارداد است. این فهرست با کاتالوگ وب متفاوت است؛ شمارش آن‌ها با هم ممنوع است.
- ماتریس بلوغ گزارش‌شده برای 639 مورد: 569 مورد E2E تأییدنشده، 19 مورد نیازمند تکمیل آزمون بنیادین، 12 مورد نیازمند آزمون سطح، 39 مورد static verified.
- بررسی handlerهای قبلی: 639 مورد PLANNED و صفر COMPLETED؛ پنج adapter بیرونی INTERFACE_ONLY.
- CI وب قبلی فقط syntax و API smoke را پوشش می‌دهد؛ موفقیت آن اثبات اجرای Android یا providerهای زنده نیست.
- هر عدد و وضعیت باید در هر اجرای جدید با SHA و run ID تازه بازبینی شود.

## 3. معماری هدف
### 3.1 Capability Registry مرجع
یک registry نسخه‌دار و قابل تولید برای وب و Android با فیلدهای حداقل:
`capability_id`, `legacy_ids[]`, `display_name_fa`, `display_name_en`, `domain`, `product_owner`, `description`, `inputs_schema`, `outputs_schema`, `handler`, `engine_dependencies[]`, `adapter_dependencies[]`, `permissions[]`, `data_classification`, `commercial_entitlements[]`, `execution_state`, `source_refs[]`, `tests[]`, `created_at`, `updated_at`, `version`.
قواعد: شناسه پایدار؛ عدم حذف رکورد؛ تغییرات schema نسخه‌دار؛ aliasها قابل resolve؛ هر capability دقیقاً یک مالک اصلی و حداقل یک domain دارد؛ منبع و آزمون الزامی است.

### 3.2 چرخه بلوغ
`DISCOVERED → MAPPED → DESIGNED → IMPLEMENTED → TESTED → PILOT → PRODUCTION`
انتقال به هر مرحله نیازمند evidence است. `ACTIVE` فقط برای مواردی استفاده می‌شود که اجرای عملیاتی‌شان در محیط هدف اثبات شده؛ `PLANNED` و `INTERFACE_ONLY` نباید به‌عنوان فعال نمایش داده شوند.

### 3.3 موتورهای مشترک
- AI Gateway: انتخاب مدل/provider، سیاست‌ها، هزینه، timeout، retry محدود و fallback.
- Workflow Runtime: state machine، صف، idempotency، approval، retry و dead-letter.
- Identity & Authorization: حساب، نشست، MFA در صورت نیاز، نقش و مجوز، tenant isolation.
- Knowledge & Document: ذخیره، استخراج، indexing، جست‌وجو، ارجاع و retention.
- Media Runtime: تصویر، صوت، ویدئو، تبدیل، پردازش async و حقوق/رضایت.
- Integration Gateway: adapterهای provider با secrets خارج از سورس، least privilege و rate limits.
- Entitlement & Usage: طرح، اشتراک، quota، اعتبار، ledger مصرف و کنترل هزینه.
- Data & Analytics: اعتبارسنجی، lineage، گزارش و export.
- Notification & Consent: ترجیحات، رضایت، unsubscribe و ثبت اثبات.
- Observability & Audit: log ساختاریافته، trace، metrics، audit trail و هشدار.
- Backup & Recovery: سیاست نگهداری، رمزنگاری، restore drill و شواهد بازیابی.

### 3.4 مرزهای محصول
- ARIA: دستیار چندمنظوره، خلاقیت، دانش، بهره‌وری، اتوماسیون و ابزارهای کسب‌وکار؛ بدون حسابداری/ERP.
- ARIANA: حسابداری و ERP.
- LEADORA: عملیات توزیع و گردش‌کارهای تخصصی توزیع.
- ARMIN MARKET: بازارگاه مستقل.
- DANA: محصول مستقل فرماندهی/مدیریت کلان؛ ARIA والد DANA نیست.
قابلیت‌های اشتراکی فقط از طریق قرارداد API و مالکیت داده مشخص متصل می‌شوند.

## 4. بسته‌های اجرایی و معیار پذیرش
### بسته A — Baseline و inventory
- تثبیت commit، branch، PR، CI، source ZIP و checksum.
- استخراج فهرست کامل منابع وب/Android/اسناد/گزارش‌ها.
- تطبیق ID، legacy ID، نسخه و منشأ؛ ثبت تکراری/متعارض/نامشخص.
- تولید ماتریس traceability: منبع → قابلیت → domain → handler → engine → API/UI → tests → evidence.
**پذیرش:** هیچ منبعی بدون ثبت در inventory نماند؛ شمارش‌ها با منبع و نسخه مشخص باشند؛ موارد نامعلوم صریحاً UNKNOWN باشند.

### بسته B — Registry و عدم حذف
- تعریف JSON Schema و registry version.
- ساخت migration mapping فقط افزایشی.
- آزمون یکتایی شناسه‌ها، resolve همه aliasها، جلوگیری از حذف و کاهش تعداد قابلیت‌ها.
- snapshot/diff خودکار قبل و بعد از هر تغییر.
**پذیرش:** آزمون regression ثابت کند همه قابلیت‌های ورودی در خروجی حضور دارند یا با mapping مستند و قابل resolve در مقصد پوشش یافته‌اند؛ هیچ alias شکسته نباشد.

### بسته C — Runtime contract
- تعریف قرارداد استاندارد handler شامل validate, authorize, execute, result, error, audit.
- جایگزینی پاسخ‌های generic `PLANNED` با handler تخصصی فقط برای قابلیت‌های واقعاً پیاده‌سازی‌شده.
- timeout، idempotency، cancellation، retry محدود، quota و trace.
- تست واحد و contract برای هر handler.
**پذیرش:** هیچ handler بدون آزمون contract ثبت نشود؛ خطای provider به‌عنوان موفقیت گزارش نشود.

### بسته D — موتورهای مشترک
- تکمیل موتورهای بخش 3.3 با interface پایدار و adapterهای آزمایشی.
- providerهای واقعی فقط پس از اتصال credential امن و آزمون محیط غیرتولیدی.
- جداسازی tenant و دسترسی به داده با آزمون منفی.
**پذیرش:** unit/integration/security tests؛ اثبات عدم دسترسی متقاطع؛ عدم وجود secret در کد و log.

### بسته E — Vertical slices
فعال‌سازی دامنه‌ای در برش‌های کوچک و مستقل:
1. فضای کار و فرماندهی
2. دانش و اسناد
3. محتوا و متن
4. خلاقیت و تصویر
5. صوت و ویدئو
6. داده و گزارش
7. ساخت وب
8. اتوماسیون و اتصال‌ها
9. کسب‌وکار و رشد
10. دستیارهای شخصی و خدمات
هر برش شامل API، UI، ذخیره‌سازی، مجوز، مدیریت خطا، هزینه/سهمیه، telemetry، تست و راهنمای کاربر است.
**پذیرش:** E2E با داده آزمایشی، آزمون مجوز و tenant، و شواهد قابل تکرار.

### بسته F — درآمد و تجاری‌سازی
- catalog طرح‌ها، feature entitlements، quota و metering.
- ثبت usage و محاسبه هزینه/صورتحساب با قابلیت reconciliation.
- checkout و PSP فقط در محیط sandbox و سپس تأیید جداگانه برای live.
- لغو اشتراک، refund، invoice و dispute workflow.
**پذیرش:** محاسبات قابل تطبیق، عدم double charge، ثبت audit و تست failure/retry.

### بسته G — امنیت و انتشار
- threat model، dependency/security scan، secret scan، SAST/DAST متناسب.
- backup encrypted و restore drill؛ Android build/signing/device UAT.
- staging، canary، rollback و release notes.
**پذیرش:** تمام release gates PASS با artifact و run ID؛ موارد BLOCKED مانع انتشار می‌مانند.

## 5. راهبرد آزمون
- Unit: منطق دامنه و قواعد.
- Contract: schema و سازگاری handler/adapter.
- Integration: DB، queue، object storage و providerهای sandbox.
- Security: authz، tenant isolation، IDOR، secret handling، rate limit، upload validation.
- E2E: سناریوی کامل کاربر از ورودی تا خروجی و مشاهده وضعیت.
- Regression: حفاظت از همه شناسه‌ها و قابلیت‌های قدیمی.
- Performance: latency، concurrency، queue saturation و هزینه.
- Recovery: backup restore و بازگشت نسخه.
هر test باید command، environment، timestamp، commit SHA و نتیجه را ثبت کند.

## 6. سیاست مشابهت و ادغام
دو قابلیت فقط وقتی candidate ادغام‌اند که هدف، semantics، ورودی/خروجی، مجوز، داده، کیفیت، هزینه و وابستگی‌ها مقایسه شده باشد. شباهت نام یا توضیح کافی نیست. ادغام با facade/alias سازگار به عقب انجام می‌شود؛ شناسه قدیمی حذف نمی‌شود. قابلیت‌های مختص هر دو حفظ و در handler مقصد قابل دسترسی می‌مانند. موارد مبهم جداگانه باقی می‌مانند.

## 7. وضعیت‌های مجاز گزارش
- VERIFIED: شواهد مستقیم در commit/run مشخص.
- IMPLEMENTED_NOT_TESTED: کد وجود دارد اما آزمون کافی نیست.
- TESTED_NOT_PRODUCTION: آزمون محیط غیرتولیدی موفق.
- BLOCKED: وابستگی یا مجوز/فایل/secret/زیرساخت موجود نیست.
- UNKNOWN: منبع یا شواهد ناکافی.
هیچ درصد پیشرفت بدون تعریف denominator و evidence گزارش نمی‌شود.

## 8. موانع شناخته‌شده برای پیگیری
- candidate ZIP Android باید به‌صورت فایل باینری دقیق با SHA-256 تأییدشده وارد مسیر workflow شود؛ GitHub contents API برای فایل باینری بزرگ مناسب نیست.
- Gradle/Android SDK و signing/device UAT ممکن است در runner یا محیط مناسب نیازمند بررسی جدا باشند.
- providerهای خارجی، PSP، object storage، Firebase، DB/Redis و دامنه/ایمیل نیازمند اتصال و secretهای مجازند.
- دسترسی به این منابع از طریق مستندات یا interface به معنی اتصال زنده نیست.

## 9. ترتیب commitها
1. `docs: add no-loss ARIA execution plan`
2. `test: add capability preservation and registry schema guards`
3. `feat: introduce versioned canonical capability registry`
4. `feat: add runtime handler contracts and lifecycle states`
5. `feat: implement shared engines in independently testable slices`
6. `feat: activate verified domain vertical slices`
7. `feat: add entitlement and usage metering`
8. `test: add security, E2E, recovery and release evidence`

هر commit کوچک، قابل بازبینی و برگشت‌پذیر است. ترتیب اجرا با یافته‌های inventory اصلاح می‌شود، اما هیچ بسته‌ای با جعل وضعیت یا حذف قابلیت دور زده نمی‌شود.

## 10. خارج از اختیار این شاخه
ادغام PR، deploy، انتشار عمومی، اتصال پرداخت زنده، اجرای migration روی داده واقعی، چرخش/انتشار secrets و حذف فایل/داده/شناسه خارج از اختیار این برنامه هستند و نیازمند مجوز و release gate مستقل‌اند.


## 11. وضعیت تکمیلی پس از ساخت Crosswalk v2 — 2026-11-19
موجودی و طراحی محصول‌سازی کامل‌تر در سه بخش ثبت شد: 639 canonical، 842 lineage آرشیوی/مهندسی و 144 تجاری/Bridge؛ جمع 1625 ردیف. رجیستری 109 کلید ماژول 26.0 به 90 exact، 15 semantic و 4 unresolved تعیین تکلیف شد. هر 81 موتور نیز میزبان پیشنهادی و نقش درآمدی/هزینه‌ای دارد. فایل‌های مرجع و قواعد بدون حذف در نمایه زیر ثبت شده‌اند:
[ARIA Master Productization Crosswalk v2](https://github.com/gavad54/aria-android/blob/engineering/aria-preserve-all-capabilities-2026-11-19/docs/aria/ARIA_MASTER_PRODUCTIZATION_CROSSWALK_V2_INDEX_2026-11-19.md).

این اقدام طراحی/تطبیق است؛ برای فعال‌سازی واقعی 639 handler تخصصی و 81 موتور هنوز باید پیاده‌سازی، اتصال داده، authorization، provider، E2E، امنیت و release evidence به‌صورت مرحله‌ای اثبات شود. 72 کاتالوگ در API وب local-workflow قابل مشاهده/برنامه‌ریزی‌اند، اما پرداخت واقعی و اجرای بیرونی فعال نیست.
