# گزارش تکمیل ممیزی آرشیو و Crosswalk جامع ARIA
تاریخ: 2026-11-19  
وضعیت: **تطبیق آرشیوی و طراحی تکمیل شد؛ پیاده‌سازی تخصصی و Production همچنان نیازمند شواهد مستقل است.**

## 1. نتیجه شمارش قطعی

| نوع موجودی | تعداد | معنی |
|---|---:|---|
| قراردادهای canonical در ARIA 32.0 | **639** | شناسه‌های یکتای 1 تا 650، به‌جز 42 و 216 تا 225 |
| ورودی‌های کاتالوگ تجاری/وب | 72 | شناسه‌های کاتالوگ 651 تا 722؛ قرارداد اجرایی جدید نیستند |
| مقصدهای canonical یکتای Bridge | 47 | ارجاع به 47 قرارداد از همان 639 مورد |
| کل شناسه‌ها در دو namespace | 711 | 639 شناسه قرارداد + 72 شناسه کاتالوگ؛ **نه 711 ماژول اجرایی مستقل** |
| جمع خام 639+72+47 | 758 | شامل 47 ارجاع تکراری؛ تعداد ماژول مستقل نیست |

بنابراین عدد قابل دفاع برای قراردادهای ماژولی canonical، **639** است. تعداد قابلیت‌های کاملاً عملیاتی، عدد جداگانه‌ای است و از روی شمارش رجیستری تعیین نمی‌شود. هدف 758 به‌تنهایی مجوز ساخت 47 نام یا ماژول فرضی نیست.

## 2. ممیزی واقعی رجیستری 639تایی

منبع اصلی: `ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip`  
SHA-256: `9dcbb34ef98e4f11e661bd32bbd0573d4de7a3058743f45aa126322f44264f9f`

- 639 رکورد و 639 شناسه یکتا تأیید شد.
- شناسه‌ها در بازه 1 تا 650 هستند؛ شناسه‌های 42 و 216 تا 225 در رجیستری 32 وجود ندارند.
- 569 مورد: `CONTRACT_RUNTIME_ROUTABLE_NOT_E2E_VERIFIED`
- 39 مورد: `CONTRACT_AND_STATIC_RUNTIME_VERIFIED`
- 19 مورد: `FOUNDATION_RUNTIME_IMPLEMENTED_STATIC_E2E_PENDING`
- 12 مورد: `SURFACE_RUNTIME_IMPLEMENTED_STATIC_E2E_PENDING`
- 160 مورد به adapter خارجی اجباری نیاز دارند؛ 31 مورد بسته به قابلیت ممکن است نیاز داشته باشند؛ 448 مورد adapter اختیاری دارند.

این بلوغ‌ها به معنی Production Live نیستند. حتی وضعیت `CONTRACT_AND_STATIC_RUNTIME_VERIFIED` نیز فقط شواهد قرارداد/اجرای ایستا را نشان می‌دهد، نه اتصال واقعی provider یا اجرای E2E در محیط تولید.

## 3. تطبیق کامل رجیستری تاریخی 26.0

رجیستری 26.0 دارای 109 کلید ماژول است. پس از نرمال‌سازی نام و پسوند نسخه:

- 90 مورد تطبیق دقیق با نام canonical دارند.
- 15 مورد به‌صورت معنایی به قابلیت‌های موجود وصل شده‌اند؛ این‌ها ماژول جدید نیستند.
- 4 مورد همچنان unresolved هستند و نباید به شمار ماژول‌ها اضافه شوند.

### 19 کلید فاقد تطبیق دقیق اسمی

15 مورد با نگاشت معنایی پیشنهادی به شناسه‌های موجود:
- COMMAND_CANVAS_24
- PERSONAL_AI_CORE_24
- AGENT_IDENTITY_HUB
- PERSONAL_DATA_VAULT
- MEMORY_FIREWALL
- TRUST_SAFETY_CENTER
- SECURITY_AUTOPILOT
- COMPLIANCE_CENTER
- SELF_HEAL_CENTER
- ECONOMIC_LEDGER
- DEVELOPER_PLATFORM_24
- INTEROPERABILITY_HUB
- DIGITAL_TWIN_24
- DEVICE_CONTINUITY_24
- SERVICE_BOOKING_HUB_24

4 مورد unresolved:
- INTENT_MARKETPLACE_24
- AUTONOMY_CONTROL_CENTER
- SCENARIO_SIMULATOR
- OWNER_CONTROL_CENTER

برای این چهار مورد هنوز شکاف مستقل و قرارداد تخصصی اثبات نشده است؛ پس شناسه جدید ساخته نمی‌شود.

## 4. 81 موتور نسخه 26.0

تمام 81 کلید موتور حفظ شده‌اند. فایل نگاشت، میزبان‌های پیشنهادی هر موتور را بر اساس نام/دامنه و شواهد موجود ثبت می‌کند. این نگاشت **پیشنهاد معماری برای بررسی** است، نه اثبات اتصال runtime. برای تأیید نهایی هر موتور باید handler، داده/persistence، API/UI، authorization، تست و evidence به همان موتور متصل شود.

موتورهای نسخه‌دار یا تکراری مانند OUTCOME_ENGINE و OUTCOME_ENGINE_25، VALUE_ATTRIBUTION_ENGINE و VALUE_ATTRIBUTION_ENGINE_26، SELF_HEAL_ENGINE و SELF_HEAL_ENGINE_25 و DEVICE_CONTINUITY_ENGINE و DEVICE_CONTINUITY_ENGINE_25 حفظ شده‌اند؛ lineage آن‌ها باید روشن بماند.

## 5. حفظ snapshotهای تاریخی

منابع زیر جداگانه ثبت شده‌اند و با هم جمع نمی‌شوند:
- نسخه 15.4: 120 ماژول مادر.
- نسخه 15.6: 25 مورد benchmark با شناسه‌های 121 تا 145.
- نسخه 15.18.4: 231 رکورد رجیستری.
- نسخه 15.19.0: 232 قرارداد بازبینی مهندسی ماژول‌به‌ماژول.
- نسخه 32.0: 639 قرارداد canonical.

فایل 232 قرارداد مهندسی 15.19.0 برای هر مورد اولویت P0/P1/P2، موج پیاده‌سازی، قرارداد، ورودی، خروجی، مرز داده، مدل درآمد، معیار ارزش و گیت مهندسی را نگه می‌دارد. وضعیت تخصصی در آن سند برای ماژول‌ها `ARCHITECTURE_DEFINED_NOT_FULL_DOMAIN_ENGINE` است؛ یعنی طراحی تخصصی به‌تنهایی اثبات موتور کامل نیست.

## 6. بازیابی سوابق 25.1 و 11 مسیر ارزش

### 20 ماژول توسعه 25.1
این 20 مورد در رجیستری 639تایی با شناسه‌های 381 تا 400 موجودند؛ پس دوباره شمرده نمی‌شوند:
381 Agent Store، 382 Agent Builder Studio، 383 Skill Builder Studio، 384 Creator Earnings Hub، 385 Usage Meter، 386 Subscription Entitlement Center، 387 API Developer Hub، 388 API Billing Center، 389 Outcome Contract Hub، 390 Referral Growth Center، 391 Enterprise Workspace، 392 Enterprise Governance Center، 393 Cost Guardian Center، 394 Promotion Transparency Center، 395 Provider Payout Center، 396 Dispute Resolution Center، 397 Revenue Experiment Lab، 398 Regional Commerce Adapter، 399 Trusted Recommendation Center، 400 Customer Success Autopilot.

### 12 موتور درآمدی توسعه 25.1
این 12 موتور در مجموعه 81 موتور نسخه 26.0 حضور دارند:
Hybrid Subscription، Usage Metering، Marketplace Take-Rate، Service Commission، Creator Payout، API Billing، Partner RevShare، Promotion Disclosure، Outcome Pricing، Referral Reward، Enterprise Seat و Cost Guardian.

### 11 مسیر ارزش
CREATE، SOLVE، IMPROVE، LEARN، SELL، BUY، BOOK، AUTOMATE، BUILD، INVESTIGATE و CONNECT.  
این‌ها مسیرهای تبدیل نیاز/ایده به ارزش‌اند، نه ماژول مستقل. مدل مادر: **IDEA → VALUE → WEALTH**.

## 7. رفع ابهام «50 GREEN X»

در فهرست مادر، «50. ARIA GREEN X» یعنی ماژول شماره 50 در فهرست 120/231تایی؛ این عبارت به معنی وجود یک کاتالوگ مستقل 50 ایده نیست. یک فایل مستقل 50 ایده در منابع قابل دسترس پیدا نشد. این شکاف با عنوان `SOURCE_GAP` حفظ شده و هیچ ایده‌ای برای پرکردن مصنوعی آن ساخته نشده است.

## 8. مرز حسابداری و ERP

شناسه‌های تاریخی 42 و 216 تا 225 در snapshotها حفظ می‌شوند، اما در رجیستری canonical نسخه 32 وجود ندارند و نباید به runtime آریا برگردند. هر محتوای آموزشی تاریخی نیز فقط به‌عنوان سابقه آرشیوی نگهداری می‌شود؛ حسابداری و ERP اجرایی متعلق به ARIANA است.

## 9. معماری درآمدی 12 موتور

برای هر موتور، فایل عملیاتی جداگانه شامل workflow، واحد metering، معیار موفقیت و کنترل‌های اجباری ساخته شده است. جریان عمومی باید چنین باشد:

`Offer → Entitlement → Metering → Rating → Quote → Checkout → Payment Authorization → Fulfillment → Verification → Receipt → Settlement → Refund/Dispute → Reconciliation → Audit`

قواعد ثابت:
- قیمت و مصرف پیش از اجرا شفاف باشند.
- رویداد مصرف و اعتبار idempotent و قابل حسابرسی باشد.
- هزینه مدل/provider قبل از اجرا برآورد و سقف مصرف اعمال شود.
- درآمد ARIA فقط درآمد شفاف و مجاز پلتفرم/خدمت باشد؛ اصل پول معامله خریدار و فروشنده درآمد ARIA نیست.
- هیچ پرداخت واقعی بدون PSP adapter رسمی، webhook امضاشده، reconciliation و تست sandbox/live تأیید نمی‌شود.
- تمدید پنهان، پرداخت اجباری، وعده درآمد تضمینی یا فروش داده شخصی ممنوع است.

## 10. شواهد فنی و محدودیت عملیاتی

ممیزی 15.19.0 مسیر UI → AriaEngine → AriaModuleWorkflowEngine → ثبت module_runs و engine_events را برای 232 ماژول در سطح workflow محلی گزارش کرده است. همان ممیزی تصریح می‌کند این امر اتصال 232 موتور تخصصی یا provider خارجی مستقل را ثابت نمی‌کند؛ بسیاری از مسیرهای قدیمی از workflow عمومی استفاده می‌کنند و سرویس خارجی بدون adapter باید fail-closed بماند.

بسته 32.0 candidate گیت‌های ایستا را PASS گزارش می‌کند، اما موانع زیر همچنان پابرجا هستند:
- Gradle/Android SDK و build واقعی APK/AAB در محیط ممیزی موجود نبوده است.
- AAB امضاشده و نصب/اجرای دستگاه اثبات نشده است.
- Firebase هنوز placeholder/نیازمند secrets واقعی است.
- PSP واقعی، Object Storage و providerهای خارجی به‌صورت production متصل و آزموده نشده‌اند.
- 201 جدول فقط از نظر ساختار ایستا بررسی شده‌اند؛ migration زنده و restore واقعی اثبات نشده است.
- Backup/Restore production، تست E2E سفارش/رزرو، sync واقعی و انتشار عمومی اثبات نشده‌اند.

## 11. فایل‌های تحویل‌شده

- `docs/aria/ARIA_639_CANONICAL_MODULES_COMPACT_2026-11-19.csv` — 639 رکورد canonical.
- `docs/aria/ARIA_UNIFIED_CROSSWALK_COMPLETE_2026-11-19.csv` — 986 ردیف lineage و رابطه، شامل 842 رکورد تاریخی/مهندسی و 144 رکورد تجاری/Bridge.
- `docs/aria/ARIA_232_MODULE_ENGINEERING_CONTRACTS_2026-11-19.csv` — 232 قرارداد مهندسی.
- `docs/aria/ARIA_81_ENGINE_HOST_MAPPING_2026-11-19.csv` — 81 موتور و میزبان‌های پیشنهادی.
- `docs/aria/ARIA_12_REVENUE_ENGINE_OPERATING_MODEL_2026-11-19.csv` — 12 موتور درآمدی و کنترل‌های عملیاتی.

نسخه کامل‌تر فایل‌های CSV نیز در Library در مسیر `/ARIA/Engineering/` نگهداری شده‌اند.

## 12. تصمیم نهایی

- هیچ منبع یا شناسه تاریخی حذف نشده است.
- 639 قرارداد canonical، 72 ورودی کاتالوگ، 47 رابطه canonical، 109 کلید ماژول تاریخی، 81 موتور، 120/145/231/232 snapshot و 20 ماژول توسعه 25.1 در Crosswalk ثبت شده‌اند.
- تعداد قراردادهای canonical همچنان 639 است؛ 72 ورودی کاتالوگ قرارداد اجرایی جدید نیستند و 47 ارجاع نیز ماژول جدید نیست.
- 4 کلید unresolved و منبع مستقل 50 ایده همچنان در صف بررسی هستند؛ هیچ‌کدام با حدس به ماژول تبدیل نشده‌اند.
- طراحی و ثبت اسناد انجام شده؛ فعال‌سازی واقعی، درآمد زنده و Production فقط پس از کد تخصصی، provider، تست E2E و evidence ارتقا می‌یابد.


---

# ARIA — سند یکپارچه حفظ آرشیو، طراحی ماژول‌ها و معماری درآمدی
تاریخ: 2026-11-19  
وضعیت: **طرح مهندسی و مبنای توسعه؛ نه ادعای پیاده‌سازی یا بهره‌برداری زنده**

## 1) دستور غیرقابل‌تغییر: حفظ کامل
این سند مکمل دو سند ممیزی موجود است و جایگزین آن‌ها نیست:
- `docs/ARIA_ARCHIVE_FORENSIC_REVIEW_2026-11-19_FA.md`
- `docs/ARIA_758_MASTER_INVENTORY_AUDIT_FA.md`

هیچ شناسه، نام تاریخی، قابلیت، پیشنهاد، قرارداد، موتور، ورودی کاتالوگ، نسخه، مسیر درآمدی، گزارش یا رابطه‌ای حذف نمی‌شود. رکوردهای مشابه با وضعیت `ALIAS`، `SEMANTIC_MATCH` یا `HISTORICAL_SNAPSHOT` حفظ و به شناسه canonical پیوند می‌خورند؛ رکورد منبع هرگز پاک یا بازنویسیِ بی‌ردپا نمی‌شود. هر ادغام معنایی باید دارای دلیل، شواهد، شناسه مقصد و تاریخچه باشد.

ARIA یک محصول مستقل و زیرمجموعه VAYRO است. ARIA حسابداری، ERP، دفترکل عملیاتی شرکت‌ها یا قابلیت‌های حسابداری آریانا را در خود ادغام نمی‌کند. هر اشاره تاریخی به «Accounting & Finance Academy» فقط به‌عنوان محتوای آموزشی/دانشی قابل نگهداری است؛ قابلیت حسابداری یا ERP اجرایی باید در ARIANA بماند.

## 2) خط مبنای شمارش و قواعد جلوگیری از دوباره‌شماری
| مجموعه | تعداد ثبت‌شده | تفسیر |
|---|---:|---|
| ماتریس ARIA 32.0 | 639 | شناسه‌های پایه یکتا |
| کاتالوگ تجاری/وب | 72 | رکوردهای مستقل 651 تا 722 |
| مقصدهای canonical یکتا در Bridge | 47 | ارجاع به شناسه‌های موجود؛ نه ماژول تازه |
| شناسه مستقل ثبت‌شده فعلی | 711 | 639 + 72 |
| جمع خام سه نوع رکورد | 758 | شامل 47 ارجاع تکراری؛ تعداد ماژول مستقل نیست |

۷۱۱ تعداد شناسه‌های مستقلِ ثبت‌شده است، نه تعداد قابلیت‌های کامل و عملیاتی. هیچ ماژولی فقط به‌خاطر `ACTIVE`، `enabled`، `registry` یا `runtime-routable` بودن، Production-ready تلقی نمی‌شود.

### Snapshotهای تاریخی
تعدادهای 115، 120، 145، 231، 232، 259، 369، 389، 469، 569، 600 و 639 متعلق به snapshotهای نسخه‌ای هستند و با هم جمع نمی‌شوند. منابعی که جزئیاتشان هنوز بازیابی نشده، با برچسب `SOURCE_PENDING` باقی می‌مانند. عدد 50 ایده در سوابق مکالمه ذکر شده، اما در جست‌وجوی فعلی یک فایل مستقل و فهرست کامل 50تایی پیدا نشد؛ بنابراین هیچ عنوانی برای پرکردن مصنوعی آن ساخته نمی‌شود.

## 3) دارایی‌های تاریخی که باید صریحاً حفظ شوند
### 3.1 خانواده مادر 120تایی و توسعه 145تایی
نام‌ها و دامنه‌های نسخه‌های 15.4/15.5 و 15.6 همچنان مرجع محصولی‌اند: NEXUS، GOVERNOR، SECURITY & CONTINUITY، TRUST/GUARD، RISK BRAIN، HUMAN SAFETY، SUPPORT & CONTINUITY، MONEY ENGINE/REVENUE OS، AI GUARD، MARKET/B2B، DIRECT MARKET، PRODUCER HUB، CONSUMER DIRECT، DEMAND EXCHANGE، OPPORTUNITY، IDEA MARKET، CAPACITY، FLOW، LEAD، DEAL ROOM، FAIR DEAL، RETURN & DISPUTE، REPEAT، VALUE BRAIN، RETENTION & GROWTH، SERVICES، FIX & LEARN، APPOINTMENT & TRUST، LOGISTICS، DELIVERY، DISTRIBUTION، PROCUREMENT، SUPPLY، SALES MASTER، MARKETING & SALES، REELS FACTORY، YOUTUBE MONEY ENGINE، GROWTH EXCHANGE، CUSTOMER PULSE، ADS، BUSINESS SUPER OS، TALENT & WORKFORCE، WORK، PROPERTY، AUTO، FARM، SCRAP، GREEN، ACADEMY، LANGUAGE، AI ENGINEERING، BUILDER، AGENT MARKET، CREATOR، STUDIO/DESIGN، BRAND & LOGO STUDIO، 3D WEB STUDIO، ANIMATION LAB، ENTERTAINMENT، HUMANITARIAN، COMMUNITY، KNOWLEDGE، CONSULTANT، TEACHER، PROFESSOR، SUPERVISOR، COMPANION & HELP، SOS/SAFETY، IDEA→PROJECT GUARD، DISCOVERY & MODULE FACTORY و FEEDBACK→PRODUCT FACTORY؛ همچنین همه موارد شماره‌دار 1 تا 120 در سندهای منبع حفظ می‌شوند.
توسعه نسخه 15.6 شامل 25 مورد 121 تا 145 است و به‌جای 120 مورد قبلی نمی‌نشیند؛ فهرست کامل عیناً حفظ می‌شود:
121. ARIA SMART LISTING ENGINE
122. ARIA LISTING BOOST ENGINE
123. ARIA PROFESSIONAL BUSINESS HUB
124. ARIA SMART SEARCH & DISCOVERY
125. ARIA SAFE CHAT & CONTACT
126. ARIA TRUSTED TRANSACTION GUIDE
127. ARIA SHOP / STALL BUILDER
128. ARIA SOCIAL COMMERCE ENGINE
129. ARIA COUPON & PROMOTION ENGINE
130. ARIA SELLER ANALYTICS BRAIN
131. ARIA CUSTOMER LOYALTY ENGINE
132. ARIA SMART ORDER ROUTER
133. ARIA SERVICE DISPATCH ENGINE
134. ARIA LIVE STATUS & ETA ENGINE
135. ARIA ROUTE & CAPACITY OPTIMIZER
136. ARIA BUSINESS SUBSCRIPTION HUB
137. ARIA AD MARKETPLACE
138. ARIA LEAD MARKET
139. ARIA QUOTE COMPETITION ENGINE
140. ARIA SERVICE BUNDLE ENGINE
141. ARIA LOCAL DISCOVERY ENGINE
142. ARIA CUSTOMER CARE AUTOMATION
143. ARIA PROVIDER PERFORMANCE ENGINE
144. ARIA CROSS-SERVICE UPSELL BRAIN
145. ARIA PLATFORM REVENUE OPTIMIZER

نام، شناسه و شرح کامل هر مورد از فایل منبع باید در Crosswalk ثبت شود؛ این فهرست، 25 مورد تاریخی را بدون حذف نام می‌برد و به‌تنهایی ادعای پیاده‌سازی یا Production نیست.

### 3.2 خانواده 15.18.x و بنچمارک‌های بازار
تمام 231 رکورد و رکوردهای بنچمارک بعدی حفظ می‌شوند؛ از جمله Smart Listing، Listing Boost، Professional Business Hub، Smart Search & Discovery، Safe Chat & Contact، Trusted Transaction Guide، Shop/Stall Builder، Social Commerce، Coupon & Promotion، Seller Analytics، Customer Loyalty، Smart Order Router، Service Dispatch و ETA. همچنین خانواده Marketplace شامل Listing Lifecycle، Seller Mini CRM، Safe Contact Gate، Listing Insight، Smart Repost، Listing Packs، Store Home، Product Card، Story-to-Listing، Follow & Save Graph، Promotion Center، Platform Fee Gate، Optional Boost Revenue، Professional Plan، Lead Pricing، Ad Inventory، Digital Delivery Revenue، Service Commission Gate و Business Tools Market است.
خانواده Creator شامل Creator Studio، Video Timeline، AI Edit، Social Repurpose، YouTube/Instagram Publish Assistant، Thumbnail، Caption & Voice، Audio Clean، Media Rights Guard، Content Calendar، Creator Analytics، Monetization Safe Gate، Brand Kit، Export & Delivery و سایر رکوردهای ثبت‌شده در منبع است. فهرست کامل 231+ رکورد باید با شناسه‌های منبع، نه با بازنویسی خلاصه‌ای، در Crosswalk وارد شود.

### 3.3 خانواده درآمد، محتوا و خدمات
مواردی مانند Revenue Recovery، Subscription Commerce، Fair Commission، Payment Orchestration، Market Intelligence، Global Expansion، Voice-to-Book، Image Gallery، Story-to-Animation، Music Lab، Pro Editor، Media Rights & Asset Guard، Expert Consulting، Identity، Private Phonebook & Consent، Voice-first، Memory-to-Story، Social/Instagram Assistant، Content Rights & Paid Export، Idea Forge & Human Approval، Ad Revenue & Verified Publishing، Owner Tariff & Billing Governor، Access Tier & Owner Free Grant، Referral & Spendable Points، Content Archive & Money Engine، Voice Studio، Creator Download و Payment Verify باید حفظ شوند. وضعیت تاریخی ACTIVE/LOCAL_WORKFLOW صرفاً وضعیت ثبت‌شده همان سند است و شاهد زنده‌بودن امروز نیست.

## 4) رجیستری 26.0: 24 کلید نیازمند تطبیق معنایی
این 24 کلید در رجیستری تاریخی دیده شده‌اند و تطبیق نام دقیق برایشان پیدا نشده است. هیچ‌کدام فعلاً به‌طور خودکار ماژول جدید اعلام نمی‌شوند:
1. COMMAND_CANVAS_24
2. PERSONAL_AI_CORE_24
3. AGENT_IDENTITY_HUB
4. AGENT_MARKETPLACE_24
5. INTENT_MARKETPLACE_24
6. OUTCOME_MARKET_24
7. PERSONAL_DATA_VAULT
8. MEMORY_FIREWALL
9. TRUST_SAFETY_CENTER
10. SECURITY_AUTOPILOT
11. COMPLIANCE_CENTER
12. AUTONOMY_CONTROL_CENTER
13. SCENARIO_SIMULATOR
14. SELF_HEAL_CENTER
15. OWNER_CONTROL_CENTER
16. OWNER_OPPORTUNITY_RADAR
17. ECONOMIC_LEDGER
18. DEVELOPER_PLATFORM_24
19. INTEROPERABILITY_HUB
20. DIGITAL_TWIN_24
21. KNOWLEDGE_GRAPH_24
22. DEVICE_CONTINUITY_24
23. SERVICE_BOOKING_HUB_24
24. CREATOR_ECONOMY_24

برای هر کلید باید نام/شرح، ورودی و خروجی، مصرف‌کننده، وابستگی، UI، API/handler، مدل داده، آزمون و ارزش مستقل با 639 ماژول تطبیق داده شود. نتیجه مجاز فقط یکی از این حالات است: `EXACT_MATCH`, `SEMANTIC_MATCH`, `ALIAS`, `ENGINE_COMPONENT`, `NEW_DISTINCT_CANDIDATE`, `HISTORICAL_SNAPSHOT`, `UNRESOLVED`. مورد `NEW_DISTINCT_CANDIDATE` تا زمان اثبات شکاف قابلیت و تأیید انسانی، به شمار ماژول‌ها افزوده نمی‌شود.

## 5) رجیستری 81 موتور
81 موتور ثبت‌شده در رجیستری 26.0 باید به‌عنوان دارایی مستقل تاریخی حفظ شوند، اما موتور مشترک بین چند ماژول، خودبه‌خود ماژول تجاری مستقل نیست. برای هر موتور ثبت شود:
- `engine_key` و نسخه/نام‌های قبلی
- مسئولیت و منطق دامنه
- ماژول‌های میزبان و مصرف‌کننده
- ورودی/خروجی و رویدادهای صادرشده
- داده و persistence
- handler/API و UI یا صفحه کنترل
- سطح دسترسی، tenant scope و human approval
- مصرف محاسباتی و هزینه تمام‌شده
- روش درآمدزایی مستقیم/غیرمستقیم
- تست واحد، یکپارچه، E2E، امنیت و شواهد Production
- وضعیت تطبیق: موتور مستقل، سرویس مشترک، alias نسخه‌ای یا unresolved

نام‌های نسخه‌ای مانند OUTCOME_ENGINE و OUTCOME_ENGINE_25، VALUE_ATTRIBUTION_ENGINE و VALUE_ATTRIBUTION_ENGINE_26، SELF_HEAL_ENGINE و SELF_HEAL_ENGINE_25، DEVICE_CONTINUITY_ENGINE و DEVICE_CONTINUITY_ENGINE_25 باید هر دو نام را حفظ کنند و رابطه lineage آن‌ها روشن شود؛ هیچ نسخه‌ای بی‌ردپا حذف نشود.

## 6) معماری درآمدی یکپارچه ARIA
تمام مسیرهای درآمد باید به یک زنجیره کنترل‌شده متصل شوند:
`Module/Offer → Entitlement → Metering → Rating → Quote → Checkout → Payment Authorization → Fulfillment → Verification → Invoice/Receipt → Settlement/Payout → Refund/Dispute → Reconciliation → Analytics/Audit`

### 6.1 جریان‌های درآمدی قابل طراحی
1. اشتراک سطحی: Free، Plus، Pro، Creator، Business و Enterprise با entitlement و سقف شفاف.
2. مصرف‌محور: AI usage، ذخیره‌سازی، پردازش رسانه، تولید محتوا، API، automation run و عملیات سنگین؛ با نمایش هزینه پیش از اجرا و سقف بودجه.
3. کارمزد تراکنش/کمیسیون: فقط برای معامله یا خدمت واقعی و تکمیل‌شده؛ با شفافیت نرخ، لغو، استرداد و حل اختلاف.
4. تبلیغات و ارتقای اختیاری: آگهی تأییدشده، جایگاه ویژه، boost و کمپین با برچسب روشن و کنترل مزاحمت.
5. ابزار حرفه‌ای و SaaS: فروشگاه/صفحه‌ساز، CRM سبک، تحلیل‌گر، اتوماسیون، مدیریت محتوا و ابزار کسب‌وکار.
6. اقتصاد سازندگان: تولید، ویرایش، بسته محتوا، خروجی پولی، مجوز استفاده و خدمات حرفه‌ای با کنترل حقوق اثر.
7. بازار خدمات و متخصصان: رزرو/سفارش، تطبیق عرضه و تقاضا، پیشنهاد قیمت، dispatch و کارمزد خدمت.
8. API و توسعه‌دهندگان: پلن API، سهمیه، کلید دسترسی، صورتحساب مصرف و بازار اتصال‌ها.
9. سازمانی و White-label: قرارداد سازمانی، تعداد صندلی، محیط مجزا، پشتیبانی و SLA.
10. قیمت‌گذاری مبتنی بر نتیجه: فقط با معیار قابل اندازه‌گیری، رضایت/تأیید کاربر، روش محاسبه روشن و سازوکار اعتراض؛ نه وعده نتیجه تضمینی.
11. خدمات انسانی/مشاوره‌ای: سفارش شفاف، محدوده کار، تحویل، تأیید و پرداخت مرحله‌ای.
12. ارجاع و وفاداری: اعتبار و امتیاز فقط با قواعد ضدتقلب، سقف، تاریخ انقضا و عدم تبدیل گمراه‌کننده به پول نقد.

### 6.2 موتورهای اقتصادی مشترک
- Owner Economic Command Center: درآمد ناخالص/خالص، هزینه AI و provider، حاشیه مشارکت، بدهی/استرداد، درآمد وصول‌نشده، نرخ تبدیل و سود هر ماژول.
- LTV & Retention Center: cohort، churn، تمدید، استفاده واقعی، سلامت اشتراک و هشدار لغو.
- Contribution Margin Center: درآمد منهای هزینه مدل، ذخیره‌سازی، پردازش، پشتیبانی، پرداخت و استرداد.
- Usage Metering & Entitlement: ثبت رویداد idempotent، واحد مصرف نسخه‌دار، سقف، overage، سهمیه رایگان و جلوگیری از صورتحساب تکراری.
- Revenue Recovery: کشف پرداخت ناموفق، تمدید ناموفق و بدهی واقعی؛ بدون برداشت یا تمدید ناخواسته.
- Fair Commission & Settlement: نرخ شفاف، سهم پلتفرم/ارائه‌دهنده، زمان تسویه و اختلاف.
- Cost/Margin Guardian: جلوگیری از اجرای زیان‌ده، budget cap، هشدار پیش از مصرف و توقف ایمن.
- Payment Orchestration & Verify: adapterهای مجاز، webhook امضاشده، idempotency، تطبیق پرداخت و ثبت رسید.
- Promotion/Ads Governance: تعرفه، موجودی، هدف‌گیری مجاز، برچسب تبلیغ، محدودیت فرکانس و گزارش اثر.
- Referral/Loyalty: attribution، ضدتقلب، سقف پاداش، برگشت پاداش در refund و دفتر رویداد.
- API Economy: کلیدها، quota، rate limit، usage ledger، قیمت نسخه‌دار و لغو کلید.
- Outcome Settlement: تعریف KPI، baseline، attribution، approval و dispute قبل از هر پرداخت.

### 6.3 قواعد مالی و حقوق مصرف‌کننده
قیمت قبل از اجرا، رضایت روشن، رسید قابل دانلود، امکان لغو/استرداد طبق قواعد، جلوگیری از پرداخت تکراری، تفکیک موجودی/درآمد/اعتبار، و ثبت audit اجباری است. کلیدهای پرداخت، اطلاعات بانکی یا اسرار در کد یا log قرار نمی‌گیرند. هیچ موتور درآمدی اجازه ندارد با dark pattern، تمدید پنهان یا فروش اجباری رشد کند.

## 7) قرارداد عملیاتی اجباری برای هر ماژول
هر رکورد باید این مشخصات را داشته باشد:
1. شناسه canonical و همه شناسه‌ها/نام‌های منبع
2. شرح ارزش کاربر و persona
3. مسئله، ورودی، خروجی و workflow
4. UI route و حالت‌های loading/empty/error/success
5. API/handler واقعی و نسخه قرارداد
6. schema، persistence، migration و data retention
7. authN/authZ، tenant isolation، consent و audit
8. adapter/provider و وضعیت sandbox/live
9. quota، metering، cost cap و rate limit
10. مدل قیمت، revenue event، refund/dispute و settlement
11. dependency و failure mode
12. تست unit/integration/E2E/security/performance
13. health metric، log/trace، alert و rollback
14. evidence URL/commit/test run و تاریخ آخرین تأیید
15. maturity و blocker با مالک اقدام

### وضعیت‌های بلوغ استاندارد
- `DISCOVERED`: فقط در آرشیو پیدا شده
- `MAPPED`: به شناسه canonical یا شکاف مشخص متصل شده
- `DESIGNED`: قرارداد و طراحی کامل است
- `IMPLEMENTED_STATIC`: کد/ساختار موجود، بدون اثبات E2E
- `INTEGRATED`: وابستگی‌ها متصل و تست یکپارچه شده
- `E2E_VERIFIED`: سناریوی واقعی با داده آزمایشی و شواهد موفق
- `PRODUCTION_CANARY`: فعال محدود و قابل پایش
- `PRODUCTION_LIVE`: سرویس زنده با شواهد، مانیتورینگ و rollback
- `BLOCKED` / `DEPRECATED_WITH_LINEAGE`: مانع یا جایگزینی مستند؛ رکورد تاریخی حفظ می‌شود.

## 8) تبدیل طراحی به ماژول واقعی: موج‌های اجرایی
### P0 — اقتصاد، امنیت و حاکمیت
NEXUS/GOVERNOR، هویت و دسترسی، consent، tenant isolation، audit، AI guard، trust/safety، owner economic، entitlement، metering، billing، payment verify، refund/dispute، cost/margin guard و observability. بدون این لایه، فروش و فعال‌سازی گسترده ممنوع است.

### P1 — حلقه کامل بازار و خدمات
Listing/Store، Search/Discovery، Seller/Business Hub، Quote/Deal، Order Router، Dispatch، Capacity/ETA، Delivery، Trust/Chat، Commission، Settlement، Returns، Loyalty و Customer Care. معیار تحویل: جست‌وجو تا پرداخت آزمایشی، انجام سفارش، تأیید، تسویه و استرداد در E2E.

### P2 — سازندگان و بازاریابی
Creator Studio، Reels/Video timeline، AI edit، captions/voice، thumbnail، content calendar، social repurpose، analytics، rights guard، export/delivery، publishing assistant و monetization safe gate. انتشار خودکار فقط با دسترسی مجاز پلتفرم و تأیید صاحب حساب.

### P3 — ابزارهای تخصصی و بازارهای عمودی
آموزش، زبان، مشاوره، خدمات محلی، املاک، خودرو، کشاورزی، بازیافت، محیط‌زیست، هنر/دست‌سازه، غذا، خدمات زیبایی و سایر verticalهای ثبت‌شده. هر vertical باید مدل داده، ایمنی، ارائه‌دهنده و workflow خودش را داشته باشد؛ صرفاً یک نام یا فیلتر در بازار عمومی، ماژول مستقل محسوب نمی‌شود.

### P4 — توسعه‌دهندگان و گسترش
Developer Platform، API Economy، Interoperability، Agent Marketplace، Knowledge Graph، Digital Twin، Device Continuity، Global Expansion و White-label؛ پس از تکمیل سیاست امنیت، هزینه، مجوز و پشتیبانی.

ترتیب فوق اولویت توسعه است، نه مجوز حذف یا کنارگذاشتن سایر موارد. همه رکوردها در backlog با اولویت، وابستگی و موج ثبت می‌مانند.

## 9) Crosswalk واحد — خروجی الزامی ممیزی
فایل‌های آینده باید به‌صورت ماشین‌خوان و قابل ممیزی نگهداری شوند:
- `docs/aria/ARIA_UNIFIED_CROSSWALK.csv`
- `backend/data/aria_unified_capability_registry.json`
- `backend/data/aria_revenue_engine_registry.json`
- `docs/aria/ARIA_MODULE_MATURITY_AND_EVIDENCE.csv`

ستون‌های Crosswalk:
`source_file, source_version, source_id, source_name, canonical_id, canonical_name, aliases, disposition, domain, purpose, inputs, outputs, dependencies, engine_keys, data_model, ui_route, api_handler, provider, revenue_surface, metering_unit, entitlement, test_evidence, maturity, blocker, reviewed_at`.

قواعد:
- یک ردیف برای هر رکورد منبع؛ حتی اگر alias یا snapshot باشد.
- canonical_id فقط پس از تطبیق شواهدی تخصیص یابد.
- هر مورد unresolved در صف بررسی بماند.
- هر نگاشت قابل بازگشت به فایل و نسخه منبع باشد.
- آمارها جداگانه گزارش شوند: source records، canonical modules، shared engines، aliases، historical snapshots، unresolved و production-live.
- هیچ رکوردی برای رسیدن به عدد 758 ساخته یا حذف نشود.

## 10) معیار پذیرش و شواهد
برای هر ماژول:
- تست unit و contract
- تست integration با adapter آزمایشی
- E2E مسیر اصلی و مسیر خطا
- کنترل authorization و tenant isolation
- تست idempotency، retry و duplicate events
- تست هزینه و سقف مصرف
- تست refund/dispute و reconciliation برای مسیرهای پولی
- آزمون accessibility و RTL فارسی
- لاگ و audit بدون اسرار
- health check و rollback
- evidence commit + CI run + گزارش تست + تاریخ

برای `PRODUCTION_LIVE` علاوه بر موارد بالا، استقرار واقعی، پایگاه‌داده واقعی، secrets محافظت‌شده، provider فعال، مانیتورینگ و شواهد اجرای واقعی لازم است.

## 11) محدودیت‌های فعلی و کارهای باز
1. 24 کلید ماژول نسخه 26.0 باید با تمام 639 رکورد و توضیحاتشان تطبیق داده شوند.
2. 81 موتور باید با ماژول‌های میزبان، handler، persistence، API/UI و شواهد تست Crosswalk شوند.
3. 72 ورودی تجاری باید از نظر محصول واقعی، خروجی، قیمت، پرداخت و تحویل بررسی شوند؛ وضعیت ثبت‌شده فعلی آن‌ها `DESIGNED_NOT_MONETIZED / NOT_LIVE / NOT_CONNECTED` است.
4. 47 مقصد Bridge حفظ و به‌عنوان رابطه ثبت شوند، نه ماژول تازه.
5. فهرست مستقل 50 ایده هنوز پیدا نشده؛ باید در جست‌وجوی تکمیلی آرشیو و خلاصه مکالمات بازیابی شود. تا آن زمان به‌صورت `SOURCE_PENDING` ثبت شود.
6. snapshotهای 25.1، 28، 30.1 و 31 در بخشی از سوابق مکالمه گزارش شده‌اند و برای جزئیات کامل باید فایل یا commit منبع بازیابی شود.
7. مکاتبات ایمیل/پیام‌رسان خارج از Library و کانکتورهای مجاز، در این محیط قابل مشاهده فرض نمی‌شوند.
8. این سند و PR به‌تنهایی کد اجرایی را فعال نمی‌کنند؛ هیچ ادعای build، E2E، انتشار، درآمد واقعی یا Production Live مطرح نیست.

## 12) تصمیم نهایی
- هیچ قابلیت ARIA حذف نمی‌شود.
- هیچ قابلیت حسابداری/ERP به ARIA منتقل نمی‌شود؛ مرز ARIANA حفظ است.
- تمام دارایی‌های تاریخی 639 + 72، 47 ارجاع، 24 کلید unresolved و 81 موتور باید در رجیستری واحد دیده شوند.
- 50 ایده تاریخی تا زمان بازیابی منبع، باز و unresolved می‌ماند.
- شمار مستقل فعلی همان 711 شناسه ثبت‌شده است؛ هدف 758 فقط پس از کشف 47 قابلیت واقعاً متمایز و اثبات‌نشده در مجموعه فعلی می‌تواند به‌عنوان تعداد مستقل تأیید شود.
- طراحی درآمدی و قرارداد عملیاتی این سند مبنای پیاده‌سازی موجی است؛ وضعیت عملیاتی هر قابلیت فقط با شواهد واقعی ارتقا می‌یابد.


## 13. اصلاح شمارش 888 و موجودی جامع 1625 ردیفی — 2026-11-19

### 13.1 عدد 888 دقیقاً از کجا آمده بود؟
فایل اولیه 888 ردیفی از این اجزا تشکیل شده بود:
- 639 ردیف ماژول canonical
- 72 ورودی کاتالوگ تجاری
- 72 رابطه Bridge
- 24 کلید تاریخیِ اولیه و نامنطبق
- 81 موتور مشترک

جمع این پنج گروه 888 است؛ بنابراین عدد ردیف‌های همان فایل درست بود، اما آن فایل **موجودی کامل آرشیو نبود**. فهرست 24 کلید، فهرست اولیه و ناقص بود؛ رجیستری اصلی 26.0 دارای 109 کلید ماژول است. تطبیق کامل آن رجیستری: 90 EXACT_MATCH، 15 SEMANTIC_MATCH و 4 UNRESOLVED. اصلاحیه در سند ممیزی آرشیو نیز همین موضوع را ثبت کرده است.

### 13.2 موجودی جامع پس از بازیابی همه lineageها
برای جلوگیری از حذف تاریخچه و حفظ ساختار قبلی، موجودی جامع به‌صورت سه بخش مستقل و قابل‌ردیابی ثبت شد:
- 639 ماژول canonical نسخه 32.0
- 842 ردیف lineage آرشیوی/مهندسی
- 144 ردیف تجاری و Bridge (72 کاتالوگ + 72 رابطه)
- **جمع کل overlay: 1625 ردیف**

842 ردیف lineage به این صورت است:
- 120 snapshot نسخه 15.4
- 25 مورد benchmark نسخه 15.6
- 231 snapshot نسخه 15.18.4
- 232 قرارداد مهندسی نسخه 15.19
- 109 کلید ماژول نسخه 26
- 81 موتور مشترک نسخه 26
- 20 توسعه تاریخی نسخه 25.1
- 12 موتور درآمدی تاریخی نسخه 25.1
- 11 مسیر ارزش
- 1 شکاف منبع کاتالوگ 50تایی

144 ردیف تجاری/Bridge نیز شامل 72 پیشنهاد تجاری با شناسه‌های 651 تا 722 و 72 رابطه Bridge است. این 72 رابطه فقط به 47 مقصد canonical یکتا اشاره می‌کنند و به معنی 72 ماژول اجرایی تازه یا 72 صورتحساب مستقل نیستند.

### 13.3 فایل‌های تکمیلی بدون تغییر فایل‌های اصلی
- [نمایه و توضیح شمارش 888 و 1625](https://github.com/gavad54/aria-android/blob/engineering/aria-preserve-all-capabilities-2026-11-19/docs/aria/ARIA_MASTER_PRODUCTIZATION_CROSSWALK_V2_INDEX_2026-11-19.md)
- [Overlay ماژول‌های canonical — 639 ردیف](https://github.com/gavad54/aria-android/blob/engineering/aria-preserve-all-capabilities-2026-11-19/docs/aria/ARIA_MASTER_PRODUCTIZATION_CANONICAL_639_V2_2026-11-19.csv)
- [Overlay تاریخچه و قراردادهای مهندسی — 842 ردیف](https://github.com/gavad54/aria-android/blob/engineering/aria-preserve-all-capabilities-2026-11-19/docs/aria/ARIA_MASTER_PRODUCTIZATION_ARCHIVE_LINEAGE_842_V2_2026-11-19.csv)
- [Overlay کاتالوگ و Bridge — 144 ردیف](https://github.com/gavad54/aria-android/blob/engineering/aria-preserve-all-capabilities-2026-11-19/docs/aria/ARIA_MASTER_PRODUCTIZATION_COMMERCIAL_BRIDGE_144_V2_2026-11-19.csv)
- [گزارش ممیزی شمارش و وضعیت](https://github.com/gavad54/aria-android/blob/engineering/aria-preserve-all-capabilities-2026-11-19/docs/aria/ARIA_MASTER_PRODUCTIZATION_CROSSWALK_V2_AUDIT_2026-11-19.json)

### 13.4 قواعد عملیاتی و درآمدی
- 639 ماژول canonical، واحدهای اصلی اجرای محصول هستند؛ اما وضعیت ثبت‌شده آن‌ها به‌تنهایی اثبات E2E یا Production نیست.
- 72 ورودی تجاری، پیشنهادهای محصولی با entitlement و metering خود هستند؛ وضعیت رجیستری آن‌ها NOT_LIVE و DESIGNED_NOT_MONETIZED است.
- 72 Bridge باید به همان offer و قرارداد canonical متصل بمانند و صورتحساب جداگانه نسازند.
- 90 کلید دقیق و 15 کلید معنایی، lineage نام‌های تاریخی را به ماژول‌های موجود متصل می‌کنند؛ 4 مورد unresolved تا اثبات قرارداد مستقل، ماژول و تعرفه تازه نمی‌گیرند.
- 81 موتور باید به‌صورت سرویس‌های مشترک نسخه‌دار با میزبان، handler/API، داده، authorization، telemetry، تست و metering هزینه تکمیل شوند؛ 12 موتور درآمدی، مدل‌های عملیاتی درآمد هستند و نباید دوباره به شمار ماژول‌ها اضافه شوند.
- 232 قرارداد مهندسی، ورودی/خروجی، مرز داده و معیار پذیرش را حفظ می‌کنند؛ خود آن‌ها پیاده‌سازی کامل موتور تخصصی نیستند.
- 11 مسیر ارزش، journey بین ماژول‌ها هستند، نه ماژول یا تعرفه مستقل.
- شکاف منبع «50 ایده» باز می‌ماند؛ هیچ فهرست ساختگی جایگزین نمی‌شود.
- حسابداری و ERP اجرایی همچنان خارج از ARIA و متعلق به ARIANA است.

**وضعیت این مرحله: تکمیل تطبیق و طراحی درآمدی/عملیاتی در سطح اسناد و Crosswalk؛ نه ادعای پیاده‌سازی، پرداخت زنده، E2E یا Production.**


### 13.5 تخصیص درآمدی 639 ماژول و 81 موتور
در رجیستری canonical نسخه 32، برچسب‌های درآمدی موجود این توزیع را دارند:
- 557 ماژول: طرح اشتراک/مصرف و metering بر اساس قرارداد موجود
- 70 ماژول: درآمد پلتفرمی شفاف و افشاشده
- 12 ماژول: کارمزد پلتفرمی فقط در محدوده و شرایط افشاشده

در overlay موتورهای 81گانه، نقش‌ها چنین طبقه‌بندی شده‌اند:
- 12 موتور درآمدی مستقیم (اشتراک، مصرف، take-rate، کمیسیون، پرداخت سازنده، API billing، سهم شریک، تبلیغ افشاشده، قیمت‌گذاری نتیجه، ارجاع، seat سازمانی و کنترل هزینه)
- 13 موتور که از طریق اشتراک طرح یا metering مصرفی ارزش‌گذاری می‌شوند
- 46 موتور مشترک پلتفرم که ارزش غیرمستقیم و هزینه محاسباتی آن‌ها به میزبان‌ها تخصیص می‌یابد
- 10 موتور ایمنی/امنیت/حریم خصوصی/انطباق که کنترل پایه پلتفرم‌اند و نباید برای حفاظت پایه کاربر به‌صورت جداگانه فروخته شوند

این طبقه‌بندی، مدل محصول و درآمد است؛ هیچ‌یک به‌تنهایی اثبات فروش، اتصال PSP یا درآمد واقعی نیست.


---

# ضمیمه بازطراحی کلان و نقشه ادغام محصولات ARIA — 2026-11-19

> این ضمیمه به سند مادر افزوده شده و جایگزین هیچ نسخه، ماژول، قرارداد یا سابقه قبلی نیست. این یک بازطراحی معماری/محصولی مبتنی بر منابع قابل بازیابی است؛ مواردی که کد و آزمون مستقل ندارند، عمداً «طراحی‌شده/نیازمند اجرا» باقی می‌مانند.

## A. تصمیم‌های قطعی محصول و مرزبندی

### A-1. جایگاه ARIA
- ARIA یک محصول مستقل در خانواده VAYRO و زیرمجموعه مستقیم VAYRO است.
- DANA والد ARIA نیست و نقش آن محصول/مرکز فرماندهی مستقل خانواده VAYRO است.
- ARIA یک Global AI Super App برای گفتگو، جست‌وجو، یادگیری، خلق، بازار، خدمات، رزرو، کار، فرصت، محتوا و اجرای امن و قابل‌ردیابی درخواست‌هاست.
- نام، هویت و تجربه ARIA حفظ می‌شود؛ هیچ محصول ادغام‌شونده‌ای مجوز تغییر مأموریت ARIA یا حذف قابلیت‌های پیشین آن را ایجاد نمی‌کند.

### A-2. محصولات مستقل که در ARIA ادغام نمی‌شوند
طبق آخرین تصمیم بازیابی‌شده در 2026-11-19، این چهار محصول مستقل و مستقیم زیر VAYRO باقی می‌مانند:
1. DANA — مرکز فرماندهی مستقل خانواده محصولات؛ نه والد ARIA.
2. ARIANA — حسابداری، مالی، خزانه، انبار، تولید، مالیات، حقوق، دارایی و ERP.
3. LEADORA — عملیات توزیع و کسب‌وکار مستقل.
4. ARMIN MARKET — بازارگاه مستقل.

قابلیت‌های این محصولات فقط از طریق API/اتصال مجاز و قرارداد روشن قابل تعامل‌اند؛ کد، پایگاه داده، مجوزها، چرخه انتشار یا مالکیت داده آن‌ها به ARIA منتقل نمی‌شود. به‌ویژه حسابداری و ERP اجرایی در ARIA ممنوع است. سوابق قدیمی حسابداری/مالی ARIA صرفاً به‌عنوان lineage آرشیوی حفظ می‌شوند و نباید به runtime بازگردند.

### A-3. محصولات/اپ‌های تعیین‌شده برای ادغام قابلیت‌ها در ARIA
هفت نامی که در سوابق اخیر برای ردیابی و ادغام قابلیت‌ها شناسایی شده‌اند:
- ARVAND — تجارت بین‌الملل
- CHARSU — بازارگاه
- GANJINEH — فروشگاه و غرفه
- NEGAH — استودیو خلاق و تولید محتوا
- SEPEHR — زیرساخت و خدمات ابری
- NAMA — سایت‌ساز و صفحه‌ساز
- PAYAM — بازاریابی و ارتباطات

**قاعده ادغام:** این هفت مورد به‌عنوان اپ مستقل جداگانه در خروجی نهایی خانواده VAYRO عرضه نمی‌شوند؛ قابلیت‌ها، گردش‌کارها، قراردادها، تجربه‌های کاربری و موتورهای درآمدی آن‌ها به‌صورت دامنه‌های داخلی ARIA بازطراحی می‌شوند. نام‌های قدیمی در crosswalk و alias حفظ می‌شوند تا لینک‌ها، سوابق، داده‌ها و شناسه‌های قدیمی از بین نروند. این ادغام تا وقتی migration، handler، API/UI، authorization و آزمون هر دامنه تکمیل نشده، «طراحی و نگاشت‌شده» است، نه ادغام اجرایی کامل.

## B. ماتریس ادغام هفت محصول در ARIA

| منبع قدیمی | دامنه مقصد در ARIA | قابلیت‌هایی که باید بدون کاستن حفظ شوند | مرز و گیت اجباری |
|---|---|---|---|
| ARVAND | تجارت بین‌الملل و B2B | کشف بازار و تأمین‌کننده، درخواست خرید/فروش، RFQ و مقایسه پیشنهاد، اسناد تجاری، مدیریت سفارش، حمل و رهگیری، تطبیق عرضه/تقاضا، چندارزی و چندزبانه، اطلاعات گمرکی/استاندارد در قالب محتوای مجاز | عدم ارائه مشاوره حقوقی/گمرکی قطعی بدون متخصص؛ کنترل کشور/مجوز/تحریم و طرف معامله؛ عدم نگهداری وجه اصل معامله توسط ARIA |
| CHARSU | بازارگاه و کشف | آگهی، کالا/خدمت، جست‌وجو و فیلتر، فروشنده/خریدار، دسته‌بندی، چت امن، پیشنهاد قیمت، درخواست، سفارش، نظر، گزارش تخلف، اختلاف و پیگیری | خریدار و فروشنده طرفین معامله‌اند؛ consent، ضدتقلب، حریم خصوصی، state machine و audit |
| GANJINEH | فروشگاه و غرفه | ساخت فروشگاه، صفحه فروشنده، کاتالوگ، دسته‌بندی/قفسه، موجودی نمایشی، قیمت و تخفیف، کوپن، سفارش، مدیریت محتوا، آمار و وفاداری | مالکیت داده فروشنده، tenant isolation، صحت موجودی و قیمت، عدم ادعای پرداخت/ارسال واقعی بدون اتصال |
| NEGAH | استودیو خلاق | متن، تصویر، طراحی، برند، لوگو، ویدئو، ریلز، انیمیشن، صوت، موسیقی مجاز، قالب، پروژه، نسخه‌بندی و خروجی | حقوق محتوا و رضایت، provenance، پیش‌نمایش، watermark/protected preview، entitlement دانلود؛ عدم تقلید صدای اشخاص بدون مجوز |
| SEPEHR | لایه خدمات ابری ARIA | فایل و رسانه، ذخیره‌سازی، آرشیو، پردازش صفی، اجرای job، فضای پروژه، backup/restore، CDN/object storage adapter و سلامت سرویس | این دامنه لایه زیرساختی است نه اختیار دسترسی به همه داده‌ها؛ رمزنگاری، tenant isolation، region/data residency، retention، restore drill و least privilege |
| NAMA | سایت‌ساز و صفحه‌ساز | قالب، صفحه، دامنه، فرم، فروشگاه سبک، وبلاگ، SEO، انتشار نسخه، پیش‌نمایش، فرم سرنخ، تحلیل و اتصال API | انتشار فقط با کنترل مالکیت دامنه، محتوای مجاز، secrets امن، sandbox، rollback و تأیید انتشار |
| PAYAM | بازاریابی و ارتباطات | کمپین، بخش‌بندی رضایت‌محور، ایمیل/پیامک/اعلان، زمان‌بندی، قالب، اتوماسیون، CRM سبک، قیف، تحلیل تحویل/تعامل و شبکه‌های اجتماعی | رضایت قابل اثبات، لغو دریافت، سقف ارسال، ضداسپم، تأیید محتوا، credential vault و adapter رسمی؛ بدون وعده رشد/فروش تضمینی |

### B-1. قاعده حفظ قابلیت‌های مشترک
قابلیت مشترک مانند مشتری، سفارش، فروشنده، محتوا، پرداخت پلتفرمی، اعلان، فایل و گزارش به یک سرویس مشترک با مالکیت دامنه روشن متصل می‌شود؛ اما هر محصول قدیمی از طریق alias/adapter و crosswalk قابل ردیابی باقی می‌ماند. ادغام UI به معنی ادغام بی‌قیدوشرط دیتابیس نیست.

## C. بازطراحی معماری هدف ARIA

### C-1. لایه تجربه کاربر
- Persian-first و RTL، پشتیبانی انگلیسی و زبان‌های لازم در دامنه تجارت بین‌الملل.
- موبایل‌محور و قابل استفاده برای کاربر کم‌تجربه؛ Voice-first همراه با متن قابل بازبینی و کنترل لمسی.
- صفحه خانه مرجع خانه و خودرو، لوگو/شعار/پیام اصلی و جایگاه «درآمدساز شو» حفظ شود؛ قابلیت‌های جدید به‌صورت تدریجی و بدون شلوغ‌کردن خانه عرضه شوند.
- ناوبری ساده پیشنهادی: خانه، کشف، خدمات، بازار، درآمد، حساب؛ مسیرهای تخصصی در جست‌وجو/دستیار و بخش بیشتر.
- هر اقدام مهم دارای وضعیت، قیمت/تعرفه، مسئول، شرایط لغو و مسیر پشتیبانی باشد.

### C-2. NEXUS و لایه هوشمندی
NEXUS هسته مسیریابی و orchestration است؛ نه مالک همه داده‌ها و نه مجوز اجرای خودکار نامحدود. مسیر استاندارد:
`Intent → Context → Plan → Safety/Legal/Risk → Authorize → Execute → Verify → Outcome → Audit`
- Intent Engine با confidence، تشخیص ابهام و درخواست سؤال تکمیلی.
- Planner و agent orchestrator برای شکستن کار به مراحل.
- Model routing بر اساس کیفیت، latency، privacy، هزینه و سقف بودجه.
- Memory با رضایت، scope و امکان کنترل/پاک‌سازی؛ حافظه یک دامنه نباید به دامنه دیگر نشت کند.
- Human approval برای عملیات حساس، مالی، عمومی، برگشت‌ناپذیر یا دارای اثر بر اشخاص ثالث.
- در نبود مجوز، provider یا سیاست روشن، اجرای بیرونی fail-closed می‌شود.

### C-3. لایه دامنه‌ها
دامنه‌های هدف محصولی:
1. بازار و تجارت (CHARSU lineage + بازار فعلی ARIA + B2B/ARVAND)
2. فروشگاه و تجارت اجتماعی (GANJINEH lineage)
3. خدمات، رزرو، سفارش و dispatch
4. کار، فرصت، مهارت، یادگیری و بهره‌وری
5. تولید محتوا و استودیو (NEGAH lineage)
6. سایت‌ساز و حضور دیجیتال (NAMA lineage)
7. بازاریابی، ارتباطات و رشد (PAYAM lineage)
8. فایل، پروژه و زیرساخت ابری (SEPEHR lineage)
9. خانه، خانواده، سفر، خودرو، ملک، کشاورزی و عمودی‌های تخصصی
10. هسته اعتماد، امنیت، حریم خصوصی، حقوق محتوا، پشتیبانی و ایمنی
11. اقتصاد پلتفرم، تعرفه، اشتراک، entitlement، metering و تحلیل
12. دستیار شخصی، Voice، Knowledge و اتوماسیون

این‌ها طبقه‌بندی دامنه‌ای‌اند؛ تعداد ماژول‌ها را تغییر نمی‌دهند و جایگزین شناسه‌های canonical نیستند.

### C-4. معماری سرویس و داده
- Modular monolith با مرز دامنه صریح در فاز نخست؛ جداسازی سرویس‌ها فقط بر اساس نیاز مقیاس/امنیت و شواهد، نه صرفاً نام ماژول.
- هر دامنه مالک schema/table و قواعد دسترسی خودش است.
- ارتباط بین دامنه‌ها از API versioned، event contract و adapter عبور می‌کند؛ cross-domain direct write ممنوع.
- Outbox/inbox، idempotency، transactional audit و retry محدود برای رویدادهای حیاتی.
- tenant_id، owner_id، user_id، resource_id و correlation_id در تمام مسیرهای چندمستاجری.
- فایل‌ها در object storage با asset ID غیرقابل حدس، presigned URL کوتاه‌عمر، MIME/size/hash validation و اسکن محتوا.
- cache/queue/search/analytics از داده مرجع جدا و قابل بازسازی باشند.
- Backup رمزنگاری‌شده، نسخه‌بندی، retention، آزمون restore و ثبت نتیجه؛ «وجود فایل پشتیبان» به‌تنهایی اثبات بازیابی نیست.

### C-5. قرارداد استاندارد هر قابلیت
هر یک از 639 شناسه و هر قابلیت ورودی از آرشیو باید این مشخصات را داشته باشد:
- canonical_id و تمام legacy_id/aliasها؛ source_version و source_file.
- هدف کاربر، actorها، سناریوها، ورودی/خروجی و خطاها.
- data owner، tenant boundary، classification و retention.
- permission، consent، policy، human gate و threat/risk model.
- handler/runtime، API schema، UI entry point و adapter dependencies.
- entitlement، metering، cost ceiling، pricing/revenue eligibility.
- unit/contract/integration/security/E2E tests و evidence link.
- maturity state و owner/next action.

هیچ قابلیت صرفاً به‌دلیل وجود در registry با برچسب Production/Active عملیاتی معرفی نمی‌شود.

## D. اصلاحات معماری الزام‌آور نسبت به سوابق تاریخی

1. **حسابداری/ERP:** هر قابلیت اجرایی دفترکل، خزانه، حسابداری، مالیات، حقوق، انبار/تولید ERP و گزارش مالی شرکتی از runtime آریا خارج می‌ماند و در ARIANA است. آموزش عمومی مالی فقط در صورت غیرعملیاتی‌بودن و با مرز روشن قابل نگهداری است.
2. **مسئولیت معامله:** ARIA واسطه نرم‌افزاری و ارائه‌دهنده خدمات پلتفرمی است؛ خریدار و فروشنده طرفین معامله اصلی‌اند. وجه اصلی معامله درآمد ARIA نیست و ARIA نباید آن را نگهداری/تقسیم/تسویه کند، مگر یک سرویس مجاز جداگانه با قرارداد و مجوز مستقل تصویب شود.
3. **پرداخت پلتفرم:** فقط تعرفه خدمات خود ARIA از PSP رسمی؛ پرداخت معتبر، webhook امضاشده، idempotency، reconciliation، refund/dispute و audit لازم است. تصویر فیش به‌تنهایی تأیید پرداخت نیست.
4. **تبلیغات:** تبلیغ از نتیجه عادی جدا و برچسب‌دار؛ رضایت و لغو دریافت؛ اطلاعات شخصی کاربران به تبلیغ‌دهنده فروخته نمی‌شود.
5. **محتوا و رسانه:** حقوق مالکیت فکری، رضایت صدا/تصویر، provenance، مجوز موسیقی و entitlement خروجی اجباری است.
6. **هوش مصنوعی:** هیچ agent حق عبور از policy، consent، quota، tenant boundary یا human approval را ندارد؛ هزینه و سطح اختیار هر agent محدود و قابل حسابرسی است.
7. **اپ‌های مستقل VAYRO:** DANA، ARIANA، LEADORA و ARMIN MARKET با دیتابیس/انتشار/مالکیت مستقل می‌مانند؛ یکپارچگی فقط از طریق قراردادهای بین‌محصولی.
8. **هویت و UX:** نسخه‌های قدیمی UX و تصمیم‌های تأییدشده حفظ می‌شوند؛ هر تغییر تازه با نسخه‌بندی، migration و مقایسه قبل/بعد انجام می‌شود.

## E. نقشه تطبیق آرشیو و منابع تاریخی

| منبع | موجودی گزارش‌شده | نحوه برخورد |
|---|---:|---|
| 15.2.1 | 115 | snapshot تاریخی |
| 15.3–15.4 | 120 | snapshot مادر؛ 5 افزوده حفظ‌شده |
| 15.6.0–15.6.1 | 145 | 25 قابلیت benchmark به 120 افزوده شده؛ حفظ lineage |
| 15.18.x | 231 | snapshot اجرایی/رجیستری تاریخی؛ نه جمع با 145 |
| 15.19–15.23 | 232 | قراردادهای مهندسی و lineage |
| 18.0 | 259 | snapshot مستقل؛ نیازمند crosswalk |
| 25.0 | 369 | 329 پایه + 40 لایه پلتفرم طبق گزارش نسخه |
| 25.1 | 389 تاریخی | 20 توسعه با نگاشت به canonical 381–400؛ دوباره‌شماری ممنوع |
| 28 | 469 تاریخی | حفظ سوابق نسخه و رجیستری |
| 30.1 | 569 تاریخی | حفظ تفکیک مسئولیت معامله |
| 31 | 600 تاریخی | snapshot lineage |
| 32.0 | 639 | baseline canonical فعلی؛ شناسه‌ها immutable |

**قاعده:** این تعدادها snapshotهای نسخه‌ای‌اند و با هم جمع نمی‌شوند. عدد 639 خط مبنای فعلی است. هیچ عدد جدیدی فقط از ادغام نام‌ها یا جمع‌کردن ارجاع‌ها ساخته نمی‌شود.

## F. مواردی که هنوز بسته نشده‌اند

- چهار کلید تاریخی unresolved: `INTENT_MARKETPLACE_24`، `AUTONOMY_CONTROL_CENTER`، `SCENARIO_SIMULATOR`، `OWNER_CONTROL_CENTER`. باید به‌عنوان قابلیت/مرکز کنترل بررسی شوند؛ بدون اثبات استقلال دامنه، شناسه canonical جدید نمی‌گیرند.
- منبع مستقل فهرست 50 ایده در منابع قابل دسترس بازیابی نشده است. 50 مسئله استخراج‌شده از تصاویر و 53 موتور ثبت‌شده در توسعه اخیر، جایگزین آن فهرست گمشده نیستند.
- 58 ردیف از جزئیات ماتریس منبع اولیه در نمای خلاصه قبلی قابل مشاهده نبودند؛ باید از ZIP/رجیستری کامل استخراج و crosswalk شوند. هیچ نامی نباید حدس زده شود.
- نام/فهرست کامل 11 یا 12 اپ قدیمی در تمام تاریخچه قابل بازیابی، هنوز به‌صورت یک سند واحد با منبع اصلی تطبیق نهایی نشده است. هفت محصول بالا و چهار محصول مستقل مشخص‌اند؛ هر نام اضافی باید با سند اصلی بازیابی شود، نه حدس.
- PRهای قبلی و معماری‌های متعارض باید فقط پس از بررسی diff/commit و مالکیت قابلیت‌ها حل شوند؛ حذف یا overwrite مستقیم ممنوع.

## G. نقشه اجرای مهندسی و معیار پذیرش

### موج 0 — تثبیت و حفاظت
- snapshot و checksum همه فایل‌های مرجع، ZIPها، registryها و داده‌ها.
- قفل شناسه‌های 639 و ساخت تست no-loss برای هر merge.
- تولید inventory واحد شامل source → legacy capability → canonical target → code → API/UI → tests → evidence.
**قبولی:** هیچ ردیف ورودی گم نشود؛ تمام موارد یا مقصد معتبر داشته باشند یا صریحاً SOURCE_GAP/UNRESOLVED بمانند.

### موج 1 — دامنه‌های ادغام هفت محصول
- استخراج قابلیت‌های هر هفت محصول از آرشیو اصلی.
- crosswalk با قابلیت‌های فعلی ARIA و بررسی duplicate بر اساس semantics.
- حفظ alias و مسیر دسترسی legacy.
- ساخت contract و UI/API برای هر قابلیت متمایز.
**قبولی:** تست برابری قابلیت‌ها و مسیر کاربر؛ هیچ قابلیت قدیمی بی‌مقصد نماند.

### موج 2 — هسته مشترک
- NEXUS/Intent/Policy/Identity/Consent/Trust/Audit/Memory/AI Gateway.
- API Gateway، event bus/outbox، provider registry و adapter contracts.
- tenant isolation، authorization و data classification.
**قبولی:** تست منفی cross-tenant، fail-closed، idempotency و audit atomicity.

### موج 3 — برش‌های قابل استفاده محصول
- بازار/فروشگاه/تجارت بین‌الملل.
- خدمات/رزرو/سفارش/dispatch.
- استودیو/محتوا/دانلود.
- سایت‌ساز/انتشار.
- بازاریابی/کمپین/ارتباطات.
- فضای ابری/فایل/آرشیو.
**قبولی:** برای هر برش API + UI + persistence + authz + monitoring + tests + help docs؛ staging E2E با داده آزمایشی.

### موج 4 — اقتصاد و درآمد
- offer catalog، plan/entitlement، usage metering، quote، PSP رسمی، receipt، refund/dispute، reconciliation و owner analytics.
- مدل درآمد فقط برای خدمات پلتفرم و بدون تصاحب وجه اصل معامله.
**قبولی:** محاسبات قابل تطبیق، تست تکرار/timeout/refund و شواهد sandbox؛ هیچ ادعای درآمد زنده بدون تراکنش معتبر.

### موج 5 — سخت‌سازی و انتشار
- SAST/dependency/security scans، DAST مناسب، تست بار، backup/restore drill، signed Android artifact، device matrix، UAT، rollout/rollback.
**قبولی:** صفر blocker انتشار، signed AAB/APK، E2E، restore proof، owner approval و release evidence.

## H. وضعیت واقعی در لحظه ثبت این ضمیمه

- 639 canonical module contracts حفظ شده‌اند؛ این تعداد برابر با قابلیت‌های Production Live نیست.
- آخرین گزارش رجیستری: 569 مورد runtime-routable ولی E2E-تأییدنشده، 39 مورد static-contract verified، 19 مورد foundation runtime با E2E pending و 12 مورد surface runtime با E2E pending.
- 50 مسئله تاریخی، 49 قابلیت مسئله‌ای یکتا، 4 نامزد کنترلی و 20 مدل درآمدی در registry توسعه ثبت شده‌اند؛ 48 alias مورد 29 است.
- 53 موتور تخصصی در توسعه اخیر: 49 موتور مسئله‌ای یکتا + 4 موتور کنترلی تاریخی؛ قراردادهای محلی آن‌ها اتصال provider بیرونی یا اجرای production را اثبات نمی‌کند.
- شبیه‌سازهای مدل درآمد و سناریو، محاسبه فرضی‌اند و پول جابه‌جا نمی‌کنند.
- provider directory، consent-gated matching، work items و owner overview دارای API هستند؛ persistence و استفاده واقعی وابسته به DB/auth/owner configuration است.
- در PR شماره 3، اجرای CI شماره 44549386125 روی commit `06d0728060e446803ea151aa1ccdc3e124453645` در 2026-11-19 با نتیجه SUCCESS تمام شده است. PR هنوز Open و Draft و Unmerged است.
- موفقیت این CI فقط workflow وب‌کاتالوگ و تست‌های آن را پوشش می‌دهد؛ Android build/signing، production DB، providerها، پرداخت واقعی، deployment، backup/restore و device E2E را اثبات نمی‌کند.

## I. معیار نهایی تکمیل بدون کاستی

بازطراحی زمانی کامل محسوب می‌شود که:
1. تمام فایل‌ها و مکالمات قابل دسترس در inventory ثبت شده باشند و محدودیت منابع غیرقابل دسترس آشکار باشد.
2. تمام شناسه‌ها و قابلیت‌ها از قدیمی‌ترین snapshot تا نسخه 32 crosswalk شوند.
3. هر قابلیت ادغام‌شونده در هفت محصول مقصد مشخص و قابل آزمون داشته باشد.
4. هیچ‌یک از چهار محصول مستقل وارد runtime یا مالکیت داده ARIA نشده باشند.
5. حسابداری/ERP اجرایی خارج از ARIA بماند.
6. همه handlerها و adapterها با authorization، tenant isolation، consent، audit و تست واقعی اثبات شوند.
7. تمام گیت‌های امنیت، پرداخت، داده، پشتیبان‌گیری، دستگاه و انتشار شواهد PASS داشته باشند.
8. تمام SOURCE_GAP و UNRESOLVEDها بسته یا با دلیل و مالک/اقدام بعدی ثبت شوند.

**وضعیت این ضمیمه:** طراحی و تصمیم‌های معماری مستند شد؛ استخراج کامل محتوای هفت آرشیو محصول، پیاده‌سازی همه دامنه‌ها، آزمون E2E و انتشار تولیدی هنوز در موج‌های بعدی است. این سند هیچ‌یک از آن مراحل را به‌اشتباه تکمیل‌شده اعلام نمی‌کند.


## J. تطبیق با ماتریس شواهد 11 محصول VAYRO — منبع 2026-11-18

این بخش بر اساس فایل Library با نام `VAYRO_11_Product_Execution_Matrix_2026-11-18.xlsx` افزوده شده است. اعداد زیر snapshot تاریخ 2026-11-18 هستند و وضعیت زنده امروز محسوب نمی‌شوند.

| محصول ادغام‌شونده | پیاده‌سازی ثبت‌شده | آزمون | بلوغ پذیرش | شاهد و شکاف اصلی |
|---|---:|---:|---:|---|
| ARVAND | 0.9% | 0% | 0.5% | فقط دامنه/کاتالوگ؛ onboarding خریدار/تأمین‌کننده، RFQ، مقایسه پیشنهاد، اسناد تجاری و مراحل حمل E2E یافت نشد |
| CHARSU | 0.9% | 0% | 0.5% | فقط کاتالوگ؛ onboarding فروشنده، listing، cart/order، commission/settlement، moderation و dispute عملیاتی یافت نشد |
| GANJINEH | 0.9% | 0% | 0.5% | فقط کاتالوگ؛ store/catalog/variants، inventory تراکنشی، checkout/fulfillment، refund و reconciliation اثبات نشد |
| NEGAH | 45.5% | 55% | 38.8% | brief UI/routes و تست اختصاصی وجود دارد؛ اجرای provider زنده، ذخیره خصوصی رسانه، دانلود امن و usage/cost ledger اثبات نشده |
| SEPEHR | 0.4% | 0% | 0.2% | control plane provisioning، quota، secrets/logs، backup و metering ابری پیدا نشد |
| NAMA | 0.9% | 0% | 0.5% | editor و کتابخانه قالب اختصاصی، preview/publish/domain/SSL، versioning و rollback پیدا نشد |
| PAYAM | 5.5% | 0% | 3.0% | نمای کلی Growth و بخشی از UI موجود است؛ campaign/calendar/approval E2E و OAuth رسمی شبکه‌های اجتماعی و provenance متریک‌ها اثبات نشد |

### J-1. اقدام مهندسی بر اساس شواهد
- NEGAH و PAYAM باید از کد جزئی موجود شروع شوند؛ بازنویسی کور یا حذف routeها ممنوع است. ابتدا source inventory، API contract و تست فعلی استخراج شود.
- ARVAND، CHARSU، GANJINEH، SEPEHR و NAMA در ماتریس مبنا عملاً کاتالوگ/تعریف‌اند؛ برای آن‌ها باید source archive/repository اصلی بازیابی شود یا قابلیت‌ها از روی قراردادهای تأییدشده در ARIA از ابتدا ساخته شوند. نام محصول به‌تنهایی منبع کد محسوب نمی‌شود.
- برای هر هفت دامنه، import/merge واقعی باید با commitهای کوچک و قابل برگشت انجام شود. پیش از هر migration، snapshot داده، schema diff و تست عدم حذف الزامی است.
- هیچ‌یک از درصدهای فوق به‌عنوان درصد فعلی یا اثبات ادغام در ARIA گزارش نمی‌شود.

### J-2. اولویت بر اساس ریسک و قابلیت استفاده مجدد
1. NEGAH: حفظ کد موجود، تکمیل private media storage، provider lifecycle، consent/rights، metering و E2E.
2. PAYAM: تبدیل Growth overview به campaign workflow با approval، schedule، delivery receipts، opt-out و connector رسمی.
3. CHARSU + GANJINEH: یکپارچه‌سازی domainهای listing/store/order به‌صورت قراردادهای مشترک، اما با تجربه‌های فروشگاه و بازار مجزا و قابل ردیابی.
4. NAMA: ساخت page/template editor، preview، publish، domain/SSL، versioning و rollback.
5. ARVAND: افزودن تجارت بین‌الملل روی هسته بازار/B2B با چندزبانه/چندارزی، RFQ، اسناد و shipment milestones.
6. SEPEHR: ساخت control plane محدود و امن برای storage/jobs/backups/quotas؛ نه دسترسی مدیریتی آزاد به داده تمام دامنه‌ها.

**نتیجه این تطبیق:** تصمیم ادغام هفت محصول در ARIA قطعی است؛ اما بر اساس ماتریس شواهد 2026-11-18، شش محصول عمدتاً کاتالوگی/تعریف‌شده و دو مورد NEGAH/PAYAM نیز فقط جزئی‌اند. بنابراین اعلام «ادغام کامل اجرایی» در این مرحله خلاف شواهد خواهد بود.


## K. راستی‌آزمایی مستقیم بسته‌های ZIP و رجیستری 32

در ممیزی تکمیلی باینری، بسته `ARIA_32_RUNTIME_FIXES_RELEASE_READINESS_SOURCE.zip` از Library استخراج و checksum آن محاسبه شد:

- SHA-256 محاسبه‌شده: `9dcbb34ef98e4f11e661bd32bbd0573d4de7a3058743f45aa126322f44264f9f`
- نتیجه: دقیقاً با checksum ثبت‌شده در گزارش Crosswalk و فایل release مطابقت دارد.
- تعداد فایل‌های بسته 32: 456 فایل.
- رجیستری Backend، رجیستری Android assets و رجیستری capability هرکدام 639 رکورد دارند.
- شناسه‌ها 639 عدد یکتا هستند؛ بازه شناسه 1 تا 650 است و 42 و 216 تا 225 در baseline نسخه 32 وجود ندارند. این شناسه‌های غایب حذف تاریخی تلقی نمی‌شوند؛ lineage آن‌ها در اسناد قدیمی حفظ می‌شود.
- سه نام تکراری با شناسه‌های جداگانه در رجیستری 639 مشاهده شد: `ARIA UNIVERSAL INBOX`، `ARIA KNOWLEDGE GRAPH` و `ARIA MULTIMODAL WORKSPACE`. هیچ ID حذف نمی‌شود؛ باید تفاوت semantics و دامنه این رکوردها مستند و در صورت نیاز نام نمایشی آن‌ها با alias سازگار اصلاح شود.

### K-1. بلوغ واقعی 639 رکورد در خود رجیستری

| معیار | تعداد | تفسیر |
|---|---:|---|
| LOCAL_WORKFLOW | 383 | مسیر workflow محلی |
| BACKEND_WORKFLOW | 152 | مسیر workflow بک‌اند |
| PLATFORM_WORKFLOW | 65 | مسیر پلتفرمی |
| CONTROLLED_RUNTIME | 39 | مسیر runtime کنترل‌شده |
| قرارداد runtime-routable ولی E2E-تأییدنشده | 569 | مسیر قابل مسیریابی؛ نه اثبات تکمیل انتهابه‌انتها |
| قرارداد و runtime ایستا تأییدشده | 39 | شواهد static/runtime محدود |
| foundation runtime با E2E معلق | 19 | زیرساخت/سطح پایه؛ E2E باز |
| global surface runtime با E2E معلق | 12 | سطح یکپارچه؛ E2E باز |
| adapter اجباری | 160 | وابسته به provider/اتصال بیرونی |
| adapter اختیاری یا مشروط | 31 | وابسته به نوع قابلیت |
| adapter اختیاری | 448 | بدون adapter اجباری در قرارداد فعلی |

تمام 639 رکورد ACTIVE هستند؛ این فیلد فقط وضعیت رجیستری را نشان می‌دهد. ACTIVE بودن یا وجود workflow entry نباید به‌عنوان سرویس تخصصی زنده گزارش شود.

### K-2. تطبیق با ممیزی‌های اجرایی قدیمی‌تر
- ممیزی 15.19.0 تصریح می‌کند 232 رکورد آن نسخه از مسیر عمومی `ARIA_LOCAL_WORKFLOW_V1` عبور می‌کردند؛ این مسیر، اتصال 232 موتور تخصصی مستقل را ثابت نمی‌کرد.
- گزارش 15.18.4 پنج blocker مهم داشت: PSP واقعی، Firebase واقعی، signing، image/deployment version، و یکسان‌سازی preflight/env. همچنین شکاف‌های authorization چت، اعتبارسنجی media، R8، reproducible build، Booking/Order E2E و sync واقعی ثبت شده بود.
- بسته‌های 15.18.5 و 15.18.6 هر دو بررسی شدند؛ در فایل‌های کلیدی رجیستری Android، کلاس registry، server و payment adapter، hash فایل‌ها یکسان بود؛ 15.18.6 فایل‌ها/ابزارهای بیشتری اضافه کرده، اما این مشاهده به‌تنهایی اثبات تکمیل blockerهای PSP/Firebase/device نیست.
- گزارش 32 Release Readiness، تست‌های ایستا و واحد منتخب را PASS می‌داند، اما APK/AAB امضاشده، اجرای زنده DB/Redis/PSP، اعلان‌ها، providerهای خارجی و Production را تأیید نمی‌کند.

### K-3. قواعدی که از ممیزی تاریخی باید به runtime جدید منتقل شوند
1. سفارش بازارگاه تا قبل از پذیرش مسئولیت توسط هر دو طرف نباید به `PAID` برود.
2. `platform_is_transaction_party=false` و `transaction_funds_held_by_platform=false` باید در مسیر معامله اصلی enforce و تست شوند.
3. مسئولیت صحت کالا/خدمت، قیمت، موجودی و تحویل بر عهده فروشنده؛ پرداخت و پذیرش شرایط بر عهده خریدار؛ مسئولیت ARIA محدود به نقش پلتفرمی و تعهدات اجباری قانونی خودش است.
4. Voice-first باید متن تشخیص‌داده‌شده را برای بازبینی نشان دهد و ورودی متنی جایگزین داشته باشد؛ عملیات حساس از فرمان صوتی خام و بدون تأیید اجرا نمی‌شود.
5. در creative/media، حقوق محتوا و رضایت، آرشیو نسخه‌ها، پیش‌نمایش محافظت‌شده و entitlement خروجی باید به‌عنوان gate واقعی اجرا شوند.
6. Revenue OS از حسابداری/ERP جداست؛ metering و entitlement محصول ARIA است، اما دفترکل و حسابداری سازمانی فقط در ARIANA باقی می‌ماند.

**حد ممیزی:** فایل‌های ZIP نسخه‌های 15.1.7 تا 15.2.1، 15.7.0، 15.18.4، 15.18.5، 15.18.6 و 32.0 به‌صورت باینری/ساختاری بررسی شدند؛ اسناد مادر 15.3 تا 15.6 و Crosswalkهای 639/842/144 نیز بررسی متنی شدند. این کار جایگزین خواندن کامل تمام پیام‌های تاریخی یا هر فایل/آرشیو خارج از Library قابل دسترس نیست. هر منبع خارج از دسترس باید در inventory به‌عنوان SOURCE_NOT_AVAILABLE ثبت شود، نه اینکه بررسی‌شده فرض شود.
