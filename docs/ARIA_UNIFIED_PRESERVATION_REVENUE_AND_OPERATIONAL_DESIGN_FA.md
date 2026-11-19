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
