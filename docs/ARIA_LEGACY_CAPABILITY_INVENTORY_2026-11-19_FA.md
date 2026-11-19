# ARIA — ممیزی اولیه منابع و ماتریس مالکیت اپلیکیشن‌های قدیمی
**تاریخ ممیزی:** 2026-11-19  
**دامنه:** مخازن قابل دسترس GitHub کاربر و اسناد قابل بازیابی  
**قاعده:** عدم مشاهده منبع در این بررسی به معنی عدم وجود تاریخی نیست؛ وضعیت باید SOURCE_NOT_LOCATED بماند.

## 1. مخازن مشاهده‌شده
| مخزن | یافته قابل مشاهده | نقش در معماری | وضعیت منبع |
|---|---|---|---|
| gavad54/aria-android | Node.js web prototype، server.js، index.html، app.js، test/server.test.js و docs | مخزن فعال ARIA | SOURCE_FOUND |
| gavad54/aria-app | metadata مخزن قابل مشاهده؛ README و package.json در main پیدا نشدند | نامزد قدیمی ARIA | SOURCE_NOT_LOCATED |
| gavad54/aria-app-1293 | GitHub پاسخ داده مخزن خالی است | نامزد قدیمی ARIA | EMPTY_REPOSITORY |
| gavad54/zelmira-one- | کد و مستندات VAYRO | مادر اکوسیستم | SOURCE_FOUND |
| gavad54/LEADORA | README و محصول وب FastAPI/SQLite با قابلیت‌های توزیع و عملیات | اپ مستقل LEADORA | SOURCE_FOUND |
| gavad54/Armin_market | README و پروژه Android/Kotlin/Compose؛ کاتالوگ اولیه | اپ مستقل ARMIN MARKET | SOURCE_FOUND |
| ARIANA | در فهرست مخازن مالک و جست‌وجوی نام، مخزن قابل انتساب به کاربر پیدا نشد | اپ مستقل حسابداری/ERP | SOURCE_NOT_LOCATED |
| DANA | در فهرست مخازن مالک، سورس مستقل قابل انتساب شناسایی نشد | اپ مستقل مرکز فرماندهی | SOURCE_NOT_LOCATED |

## 2. ماتریس انتقال/حفظ
| اپ قدیمی | مقصد | مرز | وضعیت |
|---|---|---|---|
| ARIA قبلی | ARIA | هسته محصول حفظ شود | SOURCE_FOUND; feature audit partial |
| ARVAND | ماژول تجارت ARIA | خارج از LEADORA و ARIANA؛ مرز دقیق باید از سورس تعیین شود | SOURCE_NOT_LOCATED |
| CHARSU | ماژول کشف بازار/تجارت ARIA | ARMIN MARKET مستقل بماند | SOURCE_NOT_LOCATED |
| GANJINEH | ماژول فروشگاه دیجیتال ARIA | از بازارگاه مستقل تفکیک شود | SOURCE_NOT_LOCATED |
| NEGAH | استودیوی خلاقیت ARIA | ابزار/گردش‌کار خلاق | SOURCE_NOT_LOCATED |
| SEPEHR | ابزارهای ابری ARIA | کنترل privileged و دسترسی زیرساختی مستقل/محدود | SOURCE_NOT_LOCATED |
| NAMA | سایت‌ساز ARIA | حفظ پیش‌نویس/ویرایش/انتشار | SOURCE_NOT_LOCATED |
| PAYAM | بازاریابی ARIA | رضایت و API رسمی کانال‌ها | SOURCE_NOT_LOCATED |
| DANA | DANA مستقل زیر VAYRO | خارج از ARIA | SOURCE_NOT_LOCATED |
| ARIANA | ARIANA مستقل زیر VAYRO | مالک یگانه حسابداری و ERP | SOURCE_NOT_LOCATED |
| LEADORA | LEADORA مستقل زیر VAYRO | هیچ ادغام در ARIA | SOURCE_FOUND |
| ARMIN MARKET | ARMIN MARKET مستقل زیر VAYRO | هیچ ادغام در ARIA | SOURCE_FOUND |

## 3. اعداد و ادعاهایی که نباید با هم جمع شوند
- README فعلی ARIA می‌گوید رجیستری ARIA 25 برابر ۳۶۹ و ARIA 32 برابر ۶۳۹ گزارش شده‌اند؛ این دو نسخه متفاوت‌اند.
- فهرست ۵۰ ایده یک مجموعه ایده است، نه ۵۰ ماژول تأییدشده جدید.
- کاتالوگ وب فعلی در main، SHA `350a05a7e80189df4b24359d03ed1c0fc7e7f178`، شامل ۶۰ رکورد است.
- ۶۰ رکورد وب را نباید با ۳۶۹، ۶۳۹ یا ۵۰ جمع زد.
- منبع کامل Android هنوز در مخزن GitHub وارد نشده است. README گزارش می‌دهد آرشیوهای Library و checksumهای متفاوت وجود داشته‌اند؛ تا تطبیق checksum و provenance، آن‌ها منبع قطعی برای import نیستند.

## 4. اقدامات لازم برای تکمیل ممیزی
1. دریافت نسخه اصلی archive از منبع مورد تأیید مالک؛ محاسبه SHA-256 مستقل و تطبیق با release manifest.
2. استخراج فهرست فایل‌ها، manifest، Gradle config، registry Android و backend؛ ذخیره گزارش checksum و provenance.
3. مقایسه رکوردها بر اساس ID، نام، هدف، ورودی/خروجی و engine؛ duplicate detection فقط با نام انجام نشود.
4. یافتن repo/source مستقل ARIANA و DANA و سایر اپ‌های تاریخی؛ در صورت نبود، دریافت فایل/مخزن از مالک.
5. ساخت جدول مهاجرت شامل source path، target module، schema, API, owner, test, data disposition, rollback.
6. فقط پس از review، انتقال قابلیت‌ها به branch؛ بدون تغییر production یا حذف داده.
