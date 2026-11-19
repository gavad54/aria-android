# گزارش بازسازی candidate اندروید ARIA 32.0.0
تاریخ: 2026-11-19

## اصالت منبع و candidate
- آرشیو منبع اصلی: `ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`
- SHA-256 منبع اصلی: `9dcbb34ef98e4f11e661bd32bbd0573d4de7a3058743f45aa126322f44264f9f`
- منبع اصلی بدون تغییر نگهداری شد.
- آرشیو candidate بازسازی‌شده: 505 ورودی ZIP
- SHA-256 candidate: `6ebe65d8058ef83c9b8a0845054dd4fd01068cf249cdf29492d8fa6d451e0be9`

## اصلاحات
1. همسان‌سازی `version_code=320000` در رجیستری Android و Backend با Gradle و capability registry.
2. بازنویسی `verify_project.sh` برای کنترل نسخه 32.0.0، کد نسخه 320000، تعداد 639 ماژول، شناسه‌های یکتا، شکاف‌های تاریخی و parity سه رجیستری.
3. بازنویسی verifier ماتریس قابلیت‌ها برای مقایسه سه رجیستری 639تایی به‌جای ماتریس قدیمی 232 رکوردی.
4. افزودن `aria32_no_loss_gate.js` با digest ثابت مجموعه 639 شناسه/نام.
5. جایگزینی `Executors.newFixedThreadPool(4)` در API Client با `ThreadPoolExecutor` چهارکارگره و `ArrayBlockingQueue(128)`; در اشباع صف، callback با `API_BUSY` برمی‌گردد.
6. افزودن `aria_bounded_executor_gate.js` و اتصال آن به R9 و release readiness.
7. به‌روزرسانی گیت ترتیب migration تا `041_aria32_execution_os.sql`.
8. به‌روزرسانی READMEهای فارسی و انگلیسی با نسخه و محدودیت‌های واقعی.

## شواهد آزمون ایستا
- `bash verify_project.sh` — PASS
- `bash scripts/verify_module_capability_matrix.sh` — PASS؛ 639 رکورد در سه رجیستری
- `node scripts/aria32_no_loss_gate.js` — PASS؛ digest ثابت
- `node scripts/aria_bounded_executor_gate.js` — PASS؛ 4 worker / queue 128
- `bash ENGINEERING_FINAL_GATE_R9.sh` — PASS
- `bash scripts/verify_schema.sh` — PASS ایستا؛ 201 جدول
- `node scripts/aria32_release_readiness.js` — PASS
- `bash JAVA_SYNTAX_GATE.sh` — PASS

## موانع باز انتشار
- `gradle-wrapper.jar` در آرشیو نیست، اما workflow اندروید آن را با SHA-256 مورد انتظار از منبع رسمی Gradle دریافت و راستی‌آزمایی می‌کند.
- workflow اندروید، Android SDK platform 36 و Build Tools 35.0.0/36.0.0 را روی runner نصب می‌کند؛ نبود آن‌ها در محیط محلی مانع CI نیست.
- APK/AAB هنوز ساخته نشده، چون candidate ZIP هنوز به مسیر ورودی مخزن نرسیده است؛ امضای Release و اجرای دستگاه واقعی نیز هنوز اثبات نشده‌اند.
- آزمون schema فوق ایستا است؛ PostgreSQL زنده، migration زنده، tenant isolation و backup/restore واقعی هنوز نیازمند محیط مستقل‌اند.
- اتصال زنده PSP، Firebase، Object Storage، ایمیل/اعلان و APIهای بیرونی نیز اثبات نشده است.
- candidate در این commit به مسیر `release-input/` مخزن بارگذاری نشده؛ workflow اندروید تا ورود فایل با checksum دقیق قابل اجرا نیست.

**نتیجه:** candidate از گیت‌های ایستای بالا عبور کرده است؛ این نتیجه به معنی build اندروید، release-ready یا Production-ready نیست.
