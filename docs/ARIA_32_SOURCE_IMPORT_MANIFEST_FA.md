# مانیفست منبع ARIA 32.0.0 و شواهد ورود

**تاریخ بررسی:** 2026-11-19  
**فایل اصلی:** `ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`  
**مسیر Library:** `/ARIA/Releases/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`  
**SHA-256 اصلی تأییدشده:** `9dcbb34ef98e4f11e661bd32bbd0573d4de7a3058743f45aa126322f44264f9f`  
**حجم فایل اصلی:** 3,393,494 bytes

## نتیجه ممیزی اولیه
- ZIP اصلی سالم و قابل استخراج است.
- نسخه رجیستری‌ها: 32.0.0.
- تعداد رکورد Android، Backend و Capability: هرکدام 639.
- شناسه‌ها در سه رجیستری قابل تطبیق‌اند.
- همه رکوردهای رجیستری دارای status=ACTIVE، enabled=true و engine_enabled=true هستند؛ این‌ها صرفاً metadata هستند و اجرای عملیاتی را ثابت نمی‌کنند.
- بلوغ گزارش‌شده: 569 DEDICATED_WORKFLOW_RUNTIME، 19 FOUNDATION_RUNTIME، 12 GLOBAL_SURFACE_RUNTIME و 39 EXECUTION_RUNTIME.
- 160 قابلیت adapter اجباری و 31 قابلیت adapter شرطی دارند.
- handler پایه executionStatus=PLANNED برمی‌گرداند؛ بنابراین ACTIVE در رجیستری به معنی اجرای کامل نیست.

## Candidate اصلاح‌شده و غیرمخرب
- نام artifact: `ARIA_32.0.0_SOURCE_CANDIDATE_NO_LOSS_2026-11-19.zip`
- SHA-256 نهایی: `270c7abbee1e96ec466d7a2a906aab98943ebe3c015b4abb4e0b6b3ab8e5b8bf`
- حجم: 3,403,250 bytes؛ 503 فایل داخل ZIP.
- آرشیو اصلی Library دست‌نخورده مانده است.
- اصلاحات: versionCode parity برابر 320000؛ verifier نسخه 32.0.0 و شمار 639؛ migration gate تا 041؛ بررسی executor محدود؛ و no-loss gate با digest ثابت مجموعه شناسه‌ها.
- digest مجموعه مرتب 639 شناسه: `f3be35b08164d22dc7ca99c875be340efc03021d8296edf05b4eb47b6565cf0b`.

## آزمون‌های اجراشده روی Candidate
- `node scripts/aria32_release_readiness.js`: PASS؛ شامل unit/contract/static gates و no-loss gate.
- `bash verify_project.sh`: PASS.
- `bash ENGINEERING_FINAL_GATE_R9.sh`: PASS.
- `bash scripts/verify_module_capability_matrix.sh`: PASS.
- `bash scripts/verify_schema.sh`: PASS ایستا؛ 201 جدول در migrationها شناسایی شد.
- `unzip -t`: PASS.
- Android Gradle build در محیط فعلی اجرا نشد: فایل `gradle-wrapper.jar` در آرشیو موجود نیست و باید در runner شبکه‌دار از طریق اسکریپت تأمین و checksum آن بررسی شود.

## بلوکرهای واقعی
APK/AAB، امضای انتشار، نصب و اجرای دستگاه، PostgreSQL زنده، providerهای بیرونی، پرداخت زنده، Object Storage، backup/restore عملیاتی و UAT هنوز اثبات نشده‌اند. هیچ‌کدام از PASSهای ایستا جایگزین این شواهد نیستند.

## مرز ورود به مخزن
GitHub Contents API در این گردش‌کار برای بارگذاری ZIP باینری بزرگ استفاده نشده است. Candidate باید با همان SHA-256 در مسیر `release-input/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip` قرار گیرد تا workflow Android اجرا شود. تا پیش از آن، سورس Android هنوز وارد مخزن canonical نشده و Production تغییر نکرده است.
