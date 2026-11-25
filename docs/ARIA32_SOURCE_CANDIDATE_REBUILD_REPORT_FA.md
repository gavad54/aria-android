# گزارش بازسازی candidate سورس ARIA 32.0.0
تاریخ: 2026-11-19
شاخه هدف: `engineering/aria-preserve-all-capabilities-2026-11-19`
وضعیت: candidate بازسازی‌شده و گیت‌های ایستا PASS؛ Android build و Production هنوز تأیید نشده‌اند.

## اصالت منبع
- فایل اصلی Library: `ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`
- SHA-256 منبع اصلی: `9dcbb34ef98e4f11e661bd32bbd0573d4de7a3058743f45aa126322f44264f9f`
- ورودی‌های ZIP اصلی: 503
- منبع اصلی بدون تغییر نگه داشته شد؛ اصلاحات روی نسخه استخراج‌شده و ایزوله انجام شد.

## اصلاحات اعمال‌شده
1. همسان‌سازی `version_code=320000` در رجیستری Android و Backend با Gradle و capability registry.
2. بازنویسی `verify_project.sh` برای کنترل نسخه 32.0.0، کد نسخه 320000، 639 شناسه یکتا، حفظ شکاف‌های تاریخی شناسه، برابری Android/Backend/Capabilities و وجود اجزای اصلی.
3. اصلاح گیت ترتیب migration تا آخرین migration یعنی `041_aria32_execution_os.sql`.
4. اصلاح verifier ماتریس قابلیت‌ها تا به‌جای سند قدیمی 232 رکوردی، سه رجیستری واقعی 639تایی را مقایسه کند.
5. جایگزینی صف نامحدود `Executors.newFixedThreadPool(4)` با `ThreadPoolExecutor` دارای 4 worker و `ArrayBlockingQueue(128)`؛ در اشباع صف، پاسخ `API_BUSY` بازگردانده می‌شود.
6. افزودن `aria_bounded_executor_gate.js` و افزودن اجرای آن به گیت‌های R9 و readiness.
7. افزودن `aria32_no_loss_gate.js` با digest ثابت شناسه‌ها و نگاشت ID/name برای جلوگیری از حذف یا جابه‌جایی بی‌ردپای 639 ماژول.
8. به‌روزرسانی READMEهای انگلیسی و فارسی به وضعیت نسخه 32.0.0 و محدودیت‌های واقعی.

## شواهد آزمون ایستا
| فرمان | نتیجه |
|---|---|
| `bash verify_project.sh` | PASS |
| `bash ENGINEERING_FINAL_GATE_R9.sh` | PASS |
| `bash scripts/verify_module_capability_matrix.sh` | PASS |
| `bash scripts/verify_schema.sh` | PASS ایستا؛ 201 جدول |
| `node scripts/aria32_release_readiness.js` | PASS |
| `node scripts/aria32_no_loss_gate.js` | PASS |
| `bash JAVA_SYNTAX_GATE.sh` | PASS |
| برابری سه رجیستری | 639 رکورد، 639 شناسه یکتا و مجموعه ID/name برابر |

## candidate بازسازی‌شده
- مسیر مورد انتظار در مخزن: `release-input/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`
- SHA-256: `9d1e40acdb197de22c69c64336f5e3e0f4951a227ab28de443d73fc111375284`
- ورودی‌های ZIP: 505
- آزمون صحت ZIP: PASS
- فایل candidate به‌صورت artifact جداگانه تحویل شده؛ هنوز داخل GitHub repository قرار نگرفته است.

## موانع باز انتشار
- `gradle-wrapper.jar` در بسته وجود ندارد و Gradle سیستمی نیز در محیط موجود نیست.
- Android SDK platform 36 و Build Tools 35.0.0 در محیط فعلی نصب نیستند.
- بنابراین APK/AAB ساخته یا امضا نشده و اجرای دستگاه واقعی اثبات نشده است.
- اتصال زنده PostgreSQL، PSP، Firebase، Object Storage، ایمیل/اعلان و APIهای بیرونی؛ migration زنده، tenant isolation و backup/restore واقعی همچنان گیت‌های جداگانه‌اند.

**نتیجه:** candidate از گیت‌های ایستای بالا عبور کرده است؛ Production-ready یا release-ready اعلام نمی‌شود. پس از قرارگرفتن فایل با checksum دقیق در مسیر release-input، workflow اندروید اجرا خواهد شد.
