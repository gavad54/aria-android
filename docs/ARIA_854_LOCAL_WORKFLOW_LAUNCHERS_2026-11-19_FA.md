# گزارش توسعه مسیرهای اجرای محلی ۸۹۳ واحد ARIA — 2026-11-19

## شمارش و معنای آن
- 639 قرارداد canonical پایه، با حفظ شناسه‌ها و بدون تغییر رجیستری مرجع.
- 111 رکورد overlay تاریخی؛ 72 مورد در مالکیت ARIA و 39 مورد lineage-only (36 انتقال‌یافته به محصولات خواهر + 3 بایگانی).
- 72 ماژول کاتالوگ تجاری، نگاشت‌شده به قراردادهای canonical موجود.
- 71 زیرماژول موتور، با شناسه مستقل و parentModuleIds معتبر.
- جمع موجودی سلسله‌مراتبی: 639 + 111 + 72 + 71 = 893.
- مسیرهای شروع گردش‌کار محلی: 639 canonical + 72 overlay عمومی ARIA + 72 commercial + 71 engine = 854.
- 39 رکورد انتقال‌یافته/بایگانی‌شده برای ARIA قابل اجرا نیستند؛ مالکیت و lineage آنها حفظ می‌شود.

## پیاده‌سازی این تغییر
1. رجیستری immutable برای هر 639 قرارداد canonical از CSV مرجع تولید شد.
2. رجیستری اجرای تجاری 72تایی ساخته شد؛ هر رکورد دارای handlerKey، عملیات دامنه‌ای، ورودی هدف/زمینه، شکل خروجی، مرز provider و وضعیت آزمون است.
3. 13 handler محلی دامنه‌ای برای workspace، learning، trust، creative، media، content، knowledge، data، web-builder، automation، business، personal و community اضافه شد.
4. 15 handler خانواده canonical برای CORE، MARKETPLACE، GOVERNANCE، COMMUNICATION، DISCOVERY، PLATFORM، COMMERCE، ECONOMY، TRUST، RUNTIME، ANALYTICS، SUPPORT، AUDIT، GLOBAL_SUPER_APP و GLOBAL_AI_SUPER_APP اضافه شد.
5. چهار handler خانواده موتور برای مسئله، کنترل، ایده و دامنه داخلی تعریف شد.
6. APIهای GET فهرست canonical و تجاری و POSTهای شروع گردش‌کار برای canonical، overlay عمومی ARIA، commercial و engine اضافه شدند.
7. تمام POSTها احراز هویت و اتصال DB لازم دارند؛ کاربر فقط کار محلی ثبت می‌کند. هیچ پرداخت، انتشار، ارسال پیام، رندر رسانه، اتصال provider یا اقدام بیرونی انجام نمی‌شود.
8. رابط کاربری جست‌وجو و فیلتر 854 مسیر را در فهرست قابل استفاده نمایش می‌دهد و ثبت کار محلی را به حساب کاربر متصل می‌کند.
9. کنترل startup، یکتایی 639 شناسه، پوشش 15 خانواده canonical، 72 رکورد تجاری، 13 handler دامنه‌ای، نگاشت hostهای canonical و اتصال 71 موتور به ماژول والد را بررسی می‌کند.

## APIهای جدید
- GET /api/aria-expansion/canonical-modules
- GET /api/aria-expansion/commercial-modules
- POST /api/aria-expansion/canonical-modules/:canonicalId/run
- POST /api/aria-expansion/commercial-modules/:commercialModuleId/run
- POST /api/aria-expansion/engines/:engineId/run
- POST /api/aria-expansion/modules/:moduleId/run

## آزمون و محدودیت شواهد
- تست‌های API برای شمارش 639/72/71، پوشش 15/13 خانواده، صحت host mapping و پاسخ 401 برای درخواست‌های بدون احراز هویت اضافه شده‌اند.
- به دلیل نبود DB/credentials کاربر در محیط آزمون connector، ثبت موفق یک work item با کاربر واقعی و DB زنده از این محیط قابل اثبات نیست.
- CI برای commitهای تازه هنوز نتیجه قابل مشاهده ارائه نکرده؛ بنابراین PASS اعلام نمی‌شود.
- آزمون E2E هر قابلیت، اتصال provider، تفکیک tenant در محیط زنده، entitlement، پرداخت، backup/restore، Android build/signing و device proof هنوز باقی است.
- «handler محلی» در این مرحله خروجی ساختاریافته/برنامه و work item تولید می‌کند؛ جایگزین موتور AI تخصصی، رندر واقعی، اتصال بیرونی یا تأیید Production نیست.

## وضعیت انتشار
PR #3 همچنان Draft و Unmerged باقی می‌ماند. هیچ انتشار Production یا فعال‌سازی پرداخت انجام نشده است.
