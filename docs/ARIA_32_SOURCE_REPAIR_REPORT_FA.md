# گزارش اصلاح سورس ARIA 32.0.0 — 2026-11-19

## منبع و اصالت
- آرشیو مبنا در Library: /ARIA/Releases/ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip
- SHA-256 مبنا: 9dcbb34ef98e4f11e661bd32bbd0573d4de7a3058743f45aa126322f44264f9f
- ZIP integrity: PASS؛ 503 ورودی ZIP و 456 فایل استخراج‌شده.
- شناسه برنامه: com.aria.ermian
- نسخه: 32.0.0؛ versionCode: 320000
- آرشیو اصلی و Library دست‌نخورده باقی ماندند؛ اصلاحات فقط در candidate ایزوله اعمال شدند.

## یافته‌ها و اصلاحات
1. دو کپی رجیستری Android و Backend مقدار version_code=310000 داشتند؛ Gradle و capability registry مقدار 320000 داشتند. هر دو رجیستری اصلاح و parity check به readiness gate اضافه شد.
2. verify_project.sh هنوز نسخه 24.0.0 و 329 ماژول را انتظار داشت؛ به قرارداد 32.0.0 و 639 ماژول ارتقا یافت.
3. ENGINEERING_FINAL_GATE_R9.sh آخرین migration را اشتباهاً 015 فرض می‌کرد؛ اکنون زنجیره پیوسته 001 تا 041 را بررسی می‌کند.
4. verify_module_capability_matrix.sh به ماتریس قدیمی 232 ماژولی ارجاع می‌داد؛ اکنون Android، Backend و 639 capability contracts را تطبیق می‌دهد.
5. گیت thread، ThreadFactory یک fixed thread pool چهارتایی را به‌اشتباه thread نامحدود می‌شمرد؛ اکنون bounded executor را بررسی می‌کند.

## نتایج candidate
| فرمان | نتیجه |
|---|---|
| node scripts/aria32_release_readiness.js | PASS |
| bash verify_project.sh | PASS |
| bash ENGINEERING_FINAL_GATE_R9.sh | PASS |
| bash scripts/verify_module_capability_matrix.sh | PASS — 639 |
| bash scripts/verify_schema.sh | PASS ایستا — 201 جدول |
| bash scripts/release_preflight.sh | BLOCKED — Gradle در محیط محلی نصب نیست |

ماتریس بلوغ 639 ماژول:
- 569: CONTRACT_RUNTIME_ROUTABLE_NOT_E2E_VERIFIED
- 19: FOUNDATION_RUNTIME_IMPLEMENTED_STATIC_E2E_PENDING
- 12: SURFACE_RUNTIME_IMPLEMENTED_STATIC_E2E_PENDING
- 39: CONTRACT_AND_STATIC_RUNTIME_VERIFIED
- 160 ماژول به adapter خارجی اجباری نیاز دارند؛ 31 ماژول دیگر بسته به قابلیت ممکن است به adapter نیاز داشته باشند.

## محدودیت‌های انتشار
Gradle و Android SDK در محیط محلی موجود نیستند؛ APK/AAB امضاشده، نصب دستگاه، Firebase زنده، PSP، Object Storage، PostgreSQL/Redis عملیاتی، backup/restore و UAT هنوز اثبات نشده‌اند. این گزارش به معنی Production Release نیست.

## Candidate artifact
- Candidate SHA-256: 0c45fb175fa6d44456ce33af5c975a2d74576096fae37aa4993a213759a5dbe8
- Candidate ZIP: ARIA_32.0.0_SOURCE_CANDIDATE_REPAIRED_2026-11-19.zip
- Candidate is an isolated engineering artifact; not deployed or published.
