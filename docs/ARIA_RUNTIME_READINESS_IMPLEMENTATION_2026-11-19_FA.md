# گزارش اصلاح آمادگی اجرا و اتصال‌های ARIA — 2026-11-19

## تغییرات ثبت‌شده در شاخه مهندسی

- افزودن `backend/runtime-readiness.cjs` برای ارزیابی fail-closed پایگاه داده و ارائه‌دهندگان الزامی.
- افزودن `GET /api/ready`؛ در محیط Production نبود `DATABASE_URL` یا شکست اتصال، پاسخ HTTP 503 می‌دهد.
- حفظ `GET /api/health` به‌عنوان liveness؛ زنده‌بودن process دیگر به‌اشتباه معادل آماده‌بودن پایگاه داده نیست.
- بررسی PostgreSQL با اجرای `initDb()` و سپس `SELECT 1`.
- افزودن probe احراز‌شده OpenAI از مسیر `/v1/models`؛ فقط زمانی الزامی است که `ARIA_REQUIRE_OPENAI=true` تنظیم شده باشد.
- خطاهای driver/provider به کدهای عمومی تبدیل می‌شوند؛ متن خطا و اطلاعات اتصال در پاسخ readiness افشا نمی‌شوند.
- افزودن آزمون‌های رفتاری برای DB مفقود، DB موفق، DB ناموفق، provider الزامی و provider اختیاری.

## شواهد CI

- آزمون جدید ابتدا در commit `8917fc2f29d8d21be4c686675f512bc412f13ab9` شکست مورد انتظار داشت: endpoint آمادگی وجود نداشت و 404 برمی‌گشت.
- پیاده‌سازی در commit `2a51e4c9ab84f1e7f0c7a001ef413d625f748a7f` انجام شد.
- اجرای `ARIA CI` روی همین commit: PASS؛ job آزمون‌ها موفق.
- اجرای `ARIA web catalog CI` روی همین commit: PASS؛ اعتبارسنجی manifest، رجیستری و API موفق.
- commit بعدی `59df4c3315f2448618a425ea5dfb08b8d17cc444` فایل checksum candidate را به `release-input/` افزود.

## وضعیت واقعی اتصال‌ها

- کد backend از `DATABASE_URL` برای PostgreSQL استفاده می‌کند؛ مقدار اتصال در Railway فعلی برای این سرویس ثبت نشده است.
- پروژه Supabase با نام VAYRO-CORE موجود است، اما این repository به‌صورت اثبات‌شده به آن متصل نیست. جدول‌های فعلی آن متعلق به هسته VAYRO هستند؛ تا زمان تطبیق مدل هویت/tenant و schema، نباید آن را با اتصال خام به ARIA متصل کرد.
- مسیر OpenAI در کد موجود است، اما اجرای زنده آن به `OPENAI_API_KEY` معتبر در محیط اجرا نیاز دارد. probe جدید فقط سلامت provider را می‌سنجد؛ کلید را تولید یا جایگزین نمی‌کند.
- PSP، ایمیل، Firebase، Object Storage و سایر providerها هنوز قرارداد اجرایی و credentials تأییدشده ندارند. پرداخت و انتشار خارجی فعال نشده‌اند.
- آزمون‌های CI فعلی از fake probe برای منطق readiness استفاده می‌کنند؛ این آزمون‌ها جایگزین آزمون اتصال زنده به provider یا DB نیستند.

## بسته Android 32.0.0

- candidate صحیح در Library پیدا و در محیط کاری با SHA-256 زیر تأیید شد:
  `6ebe65d8058ef83c9b8a0845054dd4fd01068cf249cdf29492d8fa6d451e0be9`
- ZIP سالم است و 505 ورودی دارد.
- گیت‌های ایستای `verify_project.sh`، R9، ماتریس 639تایی، no-loss، bounded-executor، schema-static، release-readiness و Java syntax در محیط ایزوله PASS شدند.
- ZIP هنوز در مخزن GitHub در مسیر `release-input/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip` قرار نگرفته است؛ بنابراین workflow ساخت APK/AAB اجرا نشده است.
- فایل checksum و دستور دقیق بارگذاری در `release-input/README.md` ثبت شده‌اند.

## محدودیت صریح

این تغییرات readiness را قابل‌اندازه‌گیری و fail-closed می‌کنند؛ اما به‌تنهایی DB زنده، provider واقعی، پرداخت، امضای release، نصب دستگاه یا Production را فعال نمی‌کنند. هیچ‌یک از این وضعیت‌ها بدون credential، اتصال و آزمون واقعی PASS اعلام نمی‌شود.
