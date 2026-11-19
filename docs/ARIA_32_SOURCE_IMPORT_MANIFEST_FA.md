# مانیفست منبع ARIA 32.0.0 و شواهد ورود

**تاریخ بررسی:** 2026-11-19  
**فایل اصلی:** `ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`  
**مسیر Library:** `/ARIA/Releases/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`  
**SHA-256 اصلی تأییدشده:** `9dcbb34ef98e4f11e661bd32bbd0573d4de7a3058743f45aa126322f44264f9f`  
**حجم:** 3,393,494 bytes

## نتیجه ممیزی اولیه
- ZIP integrity: قابل استخراج و خواندن.
- نسخه اعلام‌شده در رجیستری‌ها: 32.0.0.
- تعداد رکورد رجیستری Android و Backend: 639 در هرکدام.
- تعداد capability contracts: 639.
- شناسه‌ها بین سه رجیستری قابل تطبیق‌اند.
- همه رکوردهای رجیستری دارای status=ACTIVE، enabled=true و engine_enabled=true هستند؛ این‌ها صرفاً metadata هستند و اجرای عملیاتی را ثابت نمی‌کنند.
- دسته بلوغ ثبت‌شده در capability registry: 569 DEDICATED_WORKFLOW_RUNTIME، 19 FOUNDATION_RUNTIME، 12 GLOBAL_SURFACE_RUNTIME و 39 EXECUTION_RUNTIME.
- 160 قابلیت adapter اجباری دارند و 31 قابلیت ممکن است برحسب مورد به adapter نیاز داشته باشند.
- در بررسی handlerها، پاسخ پایه executionStatus=PLANNED است؛ پس ACTIVE بودن رجیستری نباید با تکمیل handler اشتباه شود.

## اصلاحات ایزوله لازم
در فایل اصلی دو رجیستری Android و Backend مقدار version_code برابر 310000 بود، در حالی که Gradle روی 320000 تنظیم شده بود. در candidate ایزوله مقدار version_code به 320000 تغییر داده شد. همچنین verifier قدیمی هنوز 329 ماژول و نسخه 24.0.0 را انتظار داشت و گیت migration آخر را 015 فرض می‌کرد؛ این گیت‌ها با قرارداد فعلی 639/32.0.0 و migration شماره 041 هم‌راستا شدند. ماتریس verifier قدیمی به‌جای فایل ماتریس غایب 15.24، parity مستقیم سه رجیستری را بررسی می‌کند.

## نتایج candidate اصلاح‌شده
- readiness static suite: PASS
- verify_project.sh: PASS
- ENGINEERING_FINAL_GATE_R9.sh: PASS
- verify_module_capability_matrix.sh: PASS
- verify_schema.sh: PASS ایستا؛ 201 جدول شناسایی شد، نه آزمون زنده PostgreSQL
- CI Android build، APK/AAB، signing، نصب دستگاه، providerهای خارجی، پرداخت زنده، backup/restore و UAT: هنوز اثبات نشده‌اند.

## مرز ورود به مخزن
فایل اصلی Library دست‌نخورده مانده است. Candidate اصلاح‌شده یک artifact مستقل است. GitHub Contents API در این گردش‌کار برای بارگذاری ZIP باینری بزرگ استفاده نشده؛ بنابراین تا بارگذاری candidate دقیق در مسیر `release-input/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip` با checksum مورد انتظار، workflow Android نمی‌تواند روی آن اجرا شود. این مانیفست به معنی واردشدن سورس Android به شاخه canonical یا انتشار Production نیست.
