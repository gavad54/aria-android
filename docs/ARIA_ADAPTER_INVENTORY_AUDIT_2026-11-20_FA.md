# ممیزی موجودی Adapterهای ARIA — ۲۰۲۶-۱۱-۲۰

## نتیجه اجرایی

این گزارش از آرشیو ARIA 32.0.0 و رجیستری canonical نسخه 32.0.0 استخراج شده است. ادعای تاریخی «۱۸۳ Adapter» در منابع فعلی به یک فهرست مستقل ۱۸۳تایی با شناسه، قرارداد و وضعیت قابل ردیابی وصل نشد؛ بنابراین ۱۸۳ به‌عنوان تعداد قطعی تأیید نمی‌شود.

## شمارش قابل استناد

| شاخص | تعداد | تفسیر |
|---|---:|---|
| رکوردهای رجیستری canonical | 639 | ماژول‌ها، نه Adapterها |
| نیاز قطعی به Adapter خارجی | 160 | ماژول‌هایی که اتصال خارجی برای قابلیت‌شان لازم است |
| نیاز مشروط به Adapter | 31 | وابسته به مسیر/قابلیت انتخاب‌شده |
| بدون نیاز الزامی به Adapter خارجی | 448 | می‌توانند در مسیر محلی/داخلی اجرا شوند |
| مجموع ماژول‌های دارای نیاز قطعی یا مشروط | 191 | نیازهای ماژول‌محور؛ نه تعداد Provider Adapter یکتا |
| تعریف در `moduleAdapters.js` | 5 | پنج تعریف، همگی `INTERFACE_ONLY` |
| اتصال‌های `moduleAdapters.js` با E2E/Production تأییدشده | ۰ | هیچ‌کدام |

## پنج تعریف Adapter موجود

| کلید | حوزه | وضعیت | منبع |
|---|---|---|---|
| `HEALTH_PROVIDER_V1` | HEALTH | `INTERFACE_ONLY` | `backend/src/services/moduleAdapters.js` |
| `MOBILITY_PROVIDER_V1` | MOBILITY | `INTERFACE_ONLY` | `backend/src/services/moduleAdapters.js` |
| `SMART_CITY_PROVIDER_V1` | SMART_CITY | `INTERFACE_ONLY` | `backend/src/services/moduleAdapters.js` |
| `AGRICULTURE_PROVIDER_V1` | AGRICULTURE | `INTERFACE_ONLY` | `backend/src/services/moduleAdapters.js` |
| `INDUSTRY_PROVIDER_V1` | INDUSTRY | `INTERFACE_ONLY` | `backend/src/services/moduleAdapters.js` |

## اتصال‌های Provider جدا از رجیستری پنج‌تایی

- `backend/src/services/creativeProviderAdapter.js`: دو عملیات OpenAI برای تولید تصویر و گفتار دارد؛ وجود کد به معنی فعال بودن Provider نیست. متغیرهای محیطی لازم در زمان اجرا و آزمون زنده Provider در این ممیزی بررسی/نمایش داده نشده‌اند.
- `backend/src/services/payments.js`: مسیر REST برای PSP دارد و فقط در صورت تنظیم امن پیکربندی لازم کار می‌کند؛ اتصال واقعی، sandbox و reconciliation از این فایل به‌تنهایی اثبات نمی‌شود.
- `app/src/main/java/com/aria/ermian/firebase/AriaFirebase.java`: آداپتر Firebase اندروید در سورس وجود دارد؛ اتصال Firebase زنده و پذیرش دستگاه اثبات نشده است.
- این سه مورد با پنج تعریف `moduleAdapters.js` جمع زده نشده‌اند؛ دسته‌های متفاوت اتصال‌اند و نباید برای ساخت عدد مصنوعی به هم اضافه شوند.

## وضعیت بلوغ ۶۳۹ ماژول

| وضعیت | تعداد |
|---|---:|
| `CONTRACT_RUNTIME_ROUTABLE_NOT_E2E_VERIFIED` | 569 |
| `CONTRACT_AND_STATIC_RUNTIME_VERIFIED` | 39 |
| `FOUNDATION_RUNTIME_IMPLEMENTED_STATIC_E2E_PENDING` | 19 |
| `SURFACE_RUNTIME_IMPLEMENTED_STATIC_E2E_PENDING` | 12 |

این وضعیت‌ها به معنی اتصال Provider، تکمیل E2E یا Production نیستند.

## فایل‌های خروجی ممیزی

فایل CSV همراه این ممیزی در خروجی اجرای همین نوبت تهیه شده است:
- `ARIA_MODULE_ADAPTER_REQUIREMENTS_191_2026-11-20.csv`: تمام ۱۹۱ ردیف ماژول‌محور دارای نیاز قطعی/مشروط به Adapter.
- `ARIA_CODE_ADAPTERS_5_2026-11-20.csv`: پنج تعریف موجود در رجیستری Adapter.
- `ARIA_ADAPTER_AUDIT_SUMMARY_2026-11-20.json`: شمارش و provenance ماشینی.

## تصمیم مهندسی و گام‌های بعدی

1. عدد ۱۸۳ تا زمان یافتن منبع اصلی، `UNVERIFIED_HISTORICAL_TARGET` باقی می‌ماند؛ هیچ رکوردی برای پرکردن عدد جعل نمی‌شود.
2. هر ۱۹۱ نیاز ماژول‌محور باید با Provider واقعی، API رسمی، دامنه دسترسی، مالک داده، محدودیت نرخ، هزینه، timeout/retry، idempotency، webhook و آزمون sandbox نگاشت شود.
3. نیازهای هم‌نوع باید در Adapterهای Provider مشترک ادغام شوند؛ تعداد Adapterهای یکتا پس از این نگاشت مشخص می‌شود و ممکن است کمتر یا بیشتر از ۱۸۳ باشد.
4. برای هر اتصال وضعیت‌های `DISCOVERED`, `CONTRACTED`, `IMPLEMENTED`, `SANDBOX_TESTED`, `E2E_VERIFIED`, `PRODUCTION_APPROVED` جدا ثبت شود.
5. تا زمان وجود مجوز و Provider واقعی، مسیرهای حساس fail-closed بمانند. هیچ Secret یا متغیر محرمانه‌ای در این گزارش ثبت نشده است.

## منشأ و محدودیت

- آرشیو: `ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`، SHA-256: `9dcbb34ef98e4f11e661bd32bbd0573d4de7a3058743f45aa126322f44264f9f`.
- رجیستری canonical: `backend/data/aria_module_capabilities.json` و خروجی ممیزی `ARIA_639_CANONICAL_MODULES_FULL_2026-11-19.csv`.
- کد Adapter: `backend/src/services/moduleAdapters.js`, `backend/src/services/creativeProviderAdapter.js`, `backend/src/services/payments.js`, `app/src/main/java/com/aria/ermian/firebase/AriaFirebase.java`.
- این گزارش، موجودی و شواهد سورس را مستند می‌کند؛ هیچ Provider خارجی، پرداخت، Production یا عملیات زنده‌ای فعال نشده است.
