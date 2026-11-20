# ARIA — اجرای یکپارچه لایه Adapter برای ۱۹۱ نیاز ماژولی

تاریخ: 2026-11-20

## تغییرات کد
- `backend/data/aria_191_adapter_family_manifest.json`: نگاشت ۱۹۱ شناسه ماژولی به ۱۴ خانواده Adapter؛ شناسه‌ها از ممیزی منبع 32.0.0 استخراج شده‌اند.
- `backend/integrations/adapter-runtime.cjs`: runtime مشترک با قرارداد عملیات مجاز، tenant/actor/request scope، احراز مجوز، رضایت صریح، idempotency برای عملیات تغییردهنده، timeout و abort، audit events و fail-closed.
- `test/adapter-runtime.test.js`: آزمون پوشش رجیستری، عدم اتصال پیش‌فرض، مالکیت خانواده، allowlist عملیات، رضایت، مجوز، idempotency، حساسیت پرداخت/هویت/ذخیره‌سازی، شواهد sandbox، منع Production و timeout.

## پوشش ثبت‌شده
| خانواده | تعداد نیاز |
|---|---:|
| AI_MODEL_AND_AGENT_RUNTIME | 42 |
| COMMERCE_AND_CATALOG | 33 |
| PAYMENT_AND_FINANCIAL_RAILS | 27 |
| MEDIA_AND_CREATIVE | 19 |
| TRUST_SAFETY_AND_COMPLIANCE | 18 |
| GENERAL_DOMAIN_API | 15 |
| LOGISTICS_AND_DELIVERY | 9 |
| ANALYTICS_AND_OBSERVABILITY | 7 |
| IDENTITY_AND_ACCESS | 7 |
| VOICE_AND_MESSAGING | 5 |
| SEARCH_AND_DISCOVERY | 3 |
| LOCALIZATION_AND_ACCESSIBILITY | 3 |
| STORAGE_AND_FILE | 2 |
| CLOUD_AND_INFRASTRUCTURE | 1 |
| **جمع** | **191** |

## کنترل‌های اجرایی
- هر شناسه فقط به یک خانواده نگاشت می‌شود؛ runtime هنگام بارگذاری، تعداد، یکتایی و وجود قرارداد خانواده را کنترل می‌کند.
- هیچ Provider به‌صورت پیش‌فرض ثبت نشده است؛ درخواست بدون Provider با خطای fail-closed متوقف می‌شود.
- اجرای sandbox فقط با شناسه شواهد ثبت می‌شود. ثبت Provider با وضعیت Production عمداً ممنوع است.
- خانواده‌های حساس در حالت MOCK_ONLY اجرا نمی‌شوند.
- عملیات تغییردهنده به کلید idempotency نیاز دارند؛ عملیات تکراری خودکار انجام نمی‌شود.
- رویدادهای درخواست/موفقیت/شکست به callback ممیزی تحویل می‌شوند؛ payload و credential در audit event قرار نمی‌گیرند.
- همه پاسخ‌ها `productionVerified=false` دارند.

## محدودیت‌ها و وضعیت واقعی
این تغییر، لایه اجرایی مشترک و قراردادهای قابل آزمون را ایجاد می‌کند؛ به معنی ۱۹۱ اتصال مستقل یا ۱۴ Provider زنده نیست. ارائه‌دهنده، منطقه سرویس، مجوز، endpoint و sandbox واقعی هنوز انتخاب/تأیید نشده‌اند. پرداخت، پیام‌رسانی بیرونی، رسانه، هویت و سایر Providerها به همین دلیل fail-closed باقی می‌مانند. شمار تاریخی ۱۸۳ آداپتر نیز همچنان فهرست مستقل قابل تطبیق ندارد؛ این نگاشت ۱۹۱ نیاز ماژولی است و نباید به‌عنوان ۱۸۳ آداپتر یکتا معرفی شود.

## گیت تأیید
CI باید روی commit نهایی اجرا شود. تا پیش از PASS شدن CI و تکمیل آزمون sandbox/E2E و تأیید مالک، این تغییرات در شاخه مهندسی و PR باقی می‌مانند؛ هیچ انتشار یا تغییر Production انجام نشده است.
