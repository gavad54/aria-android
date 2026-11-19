# ARIA — ممیزی منابع تاریخی و ماتریس مالکیت اپلیکیشن‌ها
**تاریخ:** 2026-11-19  
**قاعده:** وضعیت سورس، وجود کد، ثبت در رجیستری و آمادگی عملیاتی چهار مفهوم جدا هستند.

## 1. مجموعه تاریخی ۱۱ محصول
ماتریس اجرای VAYRO در 2026-11-18 یازده محصول تاریخی را نام می‌برد: ARVAND، CHARSU، GANJINEH، NEGAH، SEPEHR، NAMA، PAYAM، LEADORA، ARIANA، ARIA و ARMIN MARKET. در همان ماتریس DANA به‌عنوان موتور داخلی VAYRO ثبت شده بود؛ تصمیم صریح جدید مالک، DANA را به اپ مستقل پنجم و مستقیم زیر VAYRO تبدیل می‌کند. بنابراین فهرست تاریخی ۱۱ محصول و ساختار جدید ۵ اپ مستقل با هم تعارض ندارند.

## 2. منبع و وضعیت هر محصول
| محصول | مقصد نهایی | شواهد منبع | وضعیت منبع/اجرا |
|---|---|---|---|
| ARIA | ARIA مستقل؛ تجمیع قابلیت‌های باقی‌مانده | آرشیو Android 32.0.0 در Library با SHA-256 9dcbb34ef98e4f11e661bd32bbd0573d4de7a3058743f45aa126322f44264f9f؛ مخزن aria-android شامل prototype وب | SOURCE_FOUND_IN_LIBRARY; canonical import pending |
| ARVAND | ماژول تجارت ARIA | در ماتریس تاریخی فقط تعریف/کاتالوگ؛ کد عملیاتی پیدا نشد | SOURCE_NOT_LOCATED; NOT_STARTED |
| CHARSU | ماژول کشف بازار/تجارت ARIA | فقط تعریف/کاتالوگ | SOURCE_NOT_LOCATED; NOT_STARTED |
| GANJINEH | ابزار فروشگاه دیجیتال ARIA | فقط تعریف/کاتالوگ | SOURCE_NOT_LOCATED; NOT_STARTED |
| NEGAH | استودیوی خلاقیت ARIA | در VAYRO مسیرها و Brief/APIهای جزئی ثبت شده؛ Provider زنده و ذخیره رسانه اثبات نشده | PARTIAL_SOURCE_IN_VAYRO; NOT_OPERATIONAL |
| SEPEHR | ابزار ابری/مدیریت منابع ARIA | فقط تعریف/کاتالوگ؛ Control Plane عملیاتی پیدا نشد | SOURCE_NOT_LOCATED; NOT_STARTED |
| NAMA | سایت‌ساز ARIA | سورس اختصاصی و چرخه Preview/Publish پیدا نشد | SOURCE_NOT_LOCATED; NOT_STARTED |
| PAYAM | بازاریابی/ارتباطات ARIA | صفحه Growth و نمای کلی در VAYRO؛ کمپین، OAuth و analytics انتهابه‌انتها اثبات نشده | PARTIAL_SOURCE_IN_VAYRO; INCOMPLETE |
| ARIANA | اپ مستقل حسابداری/ERP | آرشیوهای Library شامل ariaana_android_app_v37_hardened_integrated.zip، ARIYANA_v0.45_COMMERCIAL_HARDENED.zip و ARIANA_16.0.0_FINAL_REVENUE_FIRST.zip؛ audit قبلی v0.37 source و candidate v0.37.1 را ثبت کرده | SOURCE_FOUND_IN_LIBRARY; canonical repo not located |
| LEADORA | اپ مستقل عملیات توزیع | مخزن مستقل gavad54/LEADORA با سورس FastAPI/SQLite | SOURCE_FOUND_IN_GITHUB |
| ARMIN MARKET | اپ مستقل بازارگاه | مخزن مستقل gavad54/Armin_market با پروژه Android/Kotlin/Compose | SOURCE_FOUND_IN_GITHUB |
| DANA | اپ مستقل مرکز فرماندهی زیر VAYRO | بسته Library فعلی فقط Prompt، Audit Report و Backup Status دارد؛ سورس اجرایی مستقل در این بررسی پیدا نشد | DOCUMENTATION_FOUND; SOURCE_NOT_LOCATED |

## 3. نسخه‌ها و شمارش ماژول‌ها — هرکدام مستقل
| منبع/نسخه | شمارش | تفسیر مجاز |
|---|---:|---|
| ARIA 15.5 UX Master | 120 | طرح و دسته‌بندی محصول تاریخی |
| ARIA 15.18.4 deep audit | 231 | رجیستری نسخه 15.18.4؛ ACTIVE بودن رجیستری به معنی engine مستقل/E2E نیست |
| ARIA 25 release status | 369 | رجیستری نسخه 25؛ APK/AAB و device UAT اثبات نشده |
| ARIA 32.0.0 source archive | 639 | رجیستری 32.0.0 و capability contracts |
| aria-android web prototype | 65 | کاتالوگ وب فعلی؛ 2 foundation، 5 prototype، 58 planned |

این اعداد نسخه‌های متفاوت‌اند و هرگز با هم جمع نمی‌شوند. در ARIA 32.0.0 از 639 رکورد: 569 مورد E2E تأیید نشده، 19 foundation، 12 surface و 39 contract/static verified هستند. 160 مورد adapter خارجی اجباری دارند و 31 مورد دیگر ممکن است بر اساس قابلیت به adapter نیاز داشته باشند.

## 4. وضعیت آرشیو ARIA 32.0.0
- آرشیو اصلی Library با SHA-256 فوق بازیابی و ZIP integrity آن تأیید شد.
- در دو رجیستری Android/Backend ناسازگاری versionCode=310000 در برابر Gradle/capability=320000 پیدا و در candidate جداگانه اصلاح شد.
- verify_project، R9 final gate، capability matrix verifier و schema static verifier پس از اصلاح PASS شدند.
- Candidate SHA-256: e787e02991fbc7044a312cdb071e8484dfb0db6e341c9116be54c1f4978eafdb.
- این candidate هنوز به مخزن canonical وارد، در CI اندروید ساخته، امضا، روی دستگاه نصب یا در Production مستقر نشده است.

## 5. مرزهای معماری قطعی
- پنج اپ مستقل مستقیم زیر VAYRO: DANA، ARIA، ARIANA، LEADORA و ARMIN MARKET.
- ARVAND، CHARSU، GANJINEH، NEGAH، SEPEHR، NAMA و PAYAM قابلیت/ماژول مقصد ARIA هستند.
- حسابداری و ERP فقط متعلق به ARIANA است.
- DANA مرکز فرماندهی مستقل است، نه والد سایر اپ‌ها.
- LEADORA و ARMIN MARKET مستقل می‌مانند و در ARIA ادغام نمی‌شوند.
- انتقال قابلیت و داده فقط پس از inventory، mapping، backup، dry run، integrity check، test و rollback plan مجاز است.

## 6. گام‌های لازم برای تکمیل عملیاتی
1. واردکردن candidate تأییدشده ARIA 32 به شاخه canonical و اجرای Android CI روی همان SHA.
2. ساخت APK/AAB، signing از CI secrets محافظت‌شده و نصب/اجرای واقعی روی دستگاه.
3. بستن Firebase، PSP، Object Storage، DB/Redis، notification و backup/restore gates.
4. ساخت ماتریس 639 capability به ازای source path، input/output، API، permission، provider، cost، persistence، E2E test و owner.
5. دریافت سورس واقعی ARVAND، CHARSU، GANJINEH، SEPEHR و NAMA؛ تکمیل سورس NEGAH و PAYAM.
6. تعیین canonical source و repo برای ARIANA و DANA؛ هیچ نسخه قدیمی یا archive جدید بدون مقایسه و تأیید جایگزین نشود.
7. انتقال هر قابلیت به ARIA به‌صورت مرحله‌ای و با حفظ قابلیت‌های قبلی.
