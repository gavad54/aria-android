# گزارش پیاده‌سازی موج اول عملیات خدمات ARIA
تاریخ: 2026-11-19

## هدف و مرز
این تغییر یک لایه عملیاتی افزایشی برای چرخه تحویل خدمات عمومی ARIA اضافه می‌کند. هیچ‌یک از 639 شناسه canonical تغییر نکرده یا حذف نشده است. هشت شناسه این گزارش با پیشوند `ARIA-SVC-` شناسه‌های افزایشی و موقت‌اند؛ تا پایان crosswalk معنایی با 639 قرارداد canonical، 50 ایده و 81 موتور موجود، نباید به شمار canonical یا جمع موجودی 893 اضافه شوند. در صورت تطبیق، نتیجه باید `EXTENSION_OF_HOST` یا `SHARED_ENGINE_FEATURE` باشد، مگر اینکه استقلال دامنه و قرارداد جداگانه اثبات شود.

ARIA همچنان فاقد حسابداری/ERP است. بازارگاه، تجارت بین‌الملل و بازاریابی تخصصی در مالکیت محصولات خواهر باقی می‌مانند. این لایه صرفاً گردش‌کار عمومی تحویل خدمت و فضای کار است.

## هشت ماژول و موتور افزایشی

| شناسه موقت | ماژول | موتور | خروجی قابل تحویل |
|---|---|---|---|
| ARIA-SVC-INTAKE | پذیرش و ارزیابی درخواست | Service Intake & Qualification Engine | پرونده درخواست، دامنه و معیار پذیرش |
| ARIA-SVC-PROPOSAL | پیشنهاد و برآورد خدمت | Scope & Quote Composition Engine | پیشنهاد ریزاقلام با ارز مشخص |
| ARIA-SVC-DELIVERY | تحویل و مدیریت مراحل | Milestone & Deliverable Orchestration Engine | مسیر مراحل و وضعیت تحویل |
| ARIA-SVC-QUALITY | تضمین کیفیت و پذیرش | Evidence-based Quality Gate Engine | چک‌لیست و شواهد پذیرش |
| ARIA-SVC-SUPPORT | پشتیبانی و تعهد خدمت | Service Obligation & Support Engine | پرونده پشتیبانی |
| ARIA-SVC-SUCCESS | موفقیت و تمدید مشتری | Customer Outcome & Renewal Engine | گزارش نتیجه و موعد تمدید |
| ARIA-SVC-PACKAGES | بسته‌های خدمت و گردش‌کار | Reusable Service Package Engine | قالب خدمت نسخه‌دار |
| ARIA-SVC-UNIT-ECONOMICS | هزینه و سودآوری خدمت | Service Unit Economics Engine | گزارش هزینه و حاشیه مشارکت |

## تغییرات کد

- `backend/aria-service-delivery.cjs`: کاتالوگ هشت ماژول، ایجاد پرونده، ماشین وضعیت، محاسبه برآورد و ارزیابی کیفیت مستند.
- `backend/aria_expansion_runtime.cjs`: جدول `aria_service_cases` و APIهای کاتالوگ، پرونده، پیشنهاد، کنترل کیفیت و تغییر وضعیت.
- `test/aria-service-delivery.test.js`: آزمون قرارداد ماژول، ورودی نامعتبر، انتقال وضعیت، تأیید مالک، محاسبه برآورد و شواهد کیفیت.
- `test/aria-service-delivery-api.test.js`: آزمون کاتالوگ و الزام احراز هویت برای مشاهده/ایجاد پرونده.

## APIهای افزوده‌شده

- `GET /api/aria-expansion/service-delivery/catalog`
- `GET /api/aria-expansion/service-cases`
- `POST /api/aria-expansion/service-cases`
- `POST /api/aria-expansion/service-cases/{uuid}/quote`
- `POST /api/aria-expansion/service-cases/{uuid}/quality`
- `POST /api/aria-expansion/service-cases/{uuid}/transitions`

تمام مسیرهای پرونده به احراز هویت نیاز دارند. خواندن و نوشتن با `user_id` و `tenant_id` محدود شده است. در این نسخه، `tenant_id` برابر شناسه حساب کاربر است؛ این فقط جداسازی شخصی است و جایگزین عضویت سازمانی، tenantهای چندکاربره یا RLS نیست. نباید قابلیت چندسازمانی Production اعلام شود.

## ماشین وضعیت و گیت‌های مالی/کیفی

`INTAKE_PENDING → QUALIFIED → QUOTE_PENDING_APPROVAL → QUOTE_ACCEPTED → IN_PROGRESS → QA_PENDING → READY_FOR_DELIVERY → DELIVERED`

- تأیید پیشنهاد فقط با `ARIA_OWNER_USER_ID` مجاز است.
- مسیرهای نامعتبر و پرش از گیت تأیید رد می‌شوند.
- برآورد، ارز سه‌حرفی، تعداد، مبلغ و تخفیف را اعتبارسنجی می‌کند.
- ساخت برآورد به معنی صدور صورتحساب یا پرداخت نیست؛ `paymentExecuted=false`.
- تحویل فقط پس از عبور همه چک‌لیست‌ها با شواهد ثبت‌شده مجاز می‌شود.
- اجرای بیرونی، انتشار، ارسال پیام، ارائه سرویس خارجی و درآمد واقعی در این تغییر فعال نشده‌اند.

## وضعیت آزمون و انتشار

- آزمون‌های واحد و API به مخزن افزوده شده‌اند.
- در آخرین بررسی این تغییر، GitHub Combined Status هیچ status check بازنگرداند و ابزار workflow نیز اجرای قابل مشاهده‌ای برای commit ارائه نکرد. بنابراین PASS بودن CI یا اجرای واقعی آزمون‌ها ادعا نمی‌شود.
- مشاهده فایل‌های ثبت‌شده در branch، وجود تغییرات منبع را ثابت می‌کند؛ نه صحت اجرای تست، نه استقرار.
- اتصال پایگاه داده زنده، آزمون migration روی PostgreSQL، tenant isolation سازمانی، MFA، providerها، پرداخت، backup/restore، E2E و device proof همچنان گیت‌های باز هستند.
- Production verified برای این هشت ماژول: صفر.

## گام‌های بعدی الزامی

1. اجرای `npm test` و `npm run check` در CI و رفع هر شکست.
2. crosswalk شناسه‌ها و موتورهای هشت‌گانه با 639 canonical، 50 ایده و 81 موتور؛ ثبت host و lineage بدون دوباره‌شماری.
3. آزمون PostgreSQL واقعی برای ساخت جدول، ذخیره/بازیابی، rollback، رقابت هم‌زمان و جداسازی حساب‌ها.
4. طراحی tenant سازمانی، نقش‌ها و RLS قبل از استفاده چندکاربره.
5. تکمیل APIهای تخصصی بسته خدمت، پشتیبانی، موفقیت مشتری و سودآوری؛ در این موج فقط قراردادهای پایه و گردش‌کار مشترک ایجاد شده‌اند.
6. اتصال provider و PSP فقط پس از انتخاب رسمی، secrets امن، webhook امضاشده، بازپرداخت و تطبیق مالی.
7. عبور از release gate، staging، backup/restore و E2E قبل از هر ادعای Production.

**نتیجه:** هشت ماژول افزایشی با موتورهای پایه، مسیرهای API و ذخیره‌سازی حساب‌محور به کد افزوده شده‌اند؛ اما هنوز از نظر CI، پایگاه داده زنده و E2E تأیید نشده‌اند و نباید به‌عنوان هشت محصول مستقل درآمدزا یا Production فعال شمرده شوند.
