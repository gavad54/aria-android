# ARIA — برنامه تبدیل ۴ نامزد و ۵۰ ایده به ماژول/موتور اجرایی
تاریخ: 2026-11-19
شاخه: engineering/aria-preserve-all-capabilities-2026-11-19

## وضعیت و اصل حفاظت
این سند مکمل طراحی قبلی است. رجیستری canonical موجود با 639 شناسه حفظ می‌شود. این 54 مورد در این مرحله با شناسه‌های موقت ثبت می‌شوند و تا عبور از ممیزی عدم‌همپوشانی، canonical شمرده نمی‌شوند. این سند مشخصات اجرایی/بک‌لاگ مهندسی است؛ ثبت آن به معنی وجود کد، اجرای تست، استقرار یا فعال بودن در تولید نیست.

## چهار مورد تاریخی — ماژول/موتور و مرز اجرایی
| ID موقت | ماژول دامنه | موتور اختصاصی | سرویس/قرارداد اصلی | کنترل حیاتی |
|---|---|---|---|---|
| CAND-001 | Intent Marketplace | Intent Matching & Explainability Engine | Intent CRUD، Match query، Response، Outcome | رضایت تماس، ضداسپم، عدم تکرار با Demand/Lead Market |
| CAND-002 | Autonomy Control Center | Policy Decision & Capability Grant Engine | Policy، Authorize، Approval، Revoke، Audit | deny-by-default، least privilege، تأیید انسانی |
| CAND-003 | Scenario Simulator | Scenario Orchestration & Sensitivity Engine | Scenario، Version، Run، Compare، Evidence | نسخه مدل، بازتولیدپذیری، نمایش عدم‌قطعیت |
| CAND-004 | Owner Control Center | Owner Operations & Release-Gate Engine | Overview، Health، Release Gates، Access Review، Audit | MFA، تأیید دوگانه، عدم افشای secrets |

## پنجاه ایده — تبدیل به ماژول پیشنهادی و موتور تخصصی
| IDEA ID | ماژول پیشنهادی | موتور تخصصی | قابلیت عملیاتی/خروجی |
|---|---|---|---|
| 001 | Work Memory | Consent Memory & Retrieval Engine | حافظه کاری نسخه‌دار، کنترل مشاهده/اصلاح/حذف |
| 002 | Goal-to-Action Planner | Goal Decomposition & Scheduling Engine | شکستن هدف، برنامه، موعد و پیگیری |
| 003 | Meeting Coordinator | Calendar Constraint & Agenda Engine | تطبیق زمان، دستورجلسه و جمع‌بندی |
| 004 | Smart Inbox | Message Triage & Draft Engine | دسته‌بندی، اولویت و پیش‌نویس با تأیید |
| 005 | Commitment Tracker | Commitment Extraction & Follow-up Engine | استخراج تعهد، مالک، موعد و یادآوری |
| 006 | Personal Federated Search | Permission-aware Retrieval Engine | جست‌وجوی متصل‌ها با ارجاع منبع |
| 007 | Context Translator | Terminology-preserving Translation Engine | ترجمه با واژه‌نامه پروژه |
| 008 | Skill Coach | Adaptive Learning Path Engine | مسیر تمرین و بازخورد مهارتی |
| 009 | Personal Document Manager | Document Classification & Expiry Engine | طبقه‌بندی، نسخه و هشدار انقضا |
| 010 | Accessibility Assistant | Accessible Format Transformation Engine | متن ساده، زیرنویس و خروجی دسترس‌پذیر |
| 011 | Personal Knowledge Map | Knowledge Graph & Citation Engine | نقشه مفاهیم و پیوند منبع |
| 012 | Learning Path Builder | Curriculum Sequencing Engine | سرفصل و مسیر آموزشی |
| 013 | Interactive Practice Lab | Exercise Generation & Feedback Engine | تمرین و ارزیابی |
| 014 | Source Quality Reviewer | Source Provenance & Quality Engine | کارت اعتبار، تاریخ و محدودیت منبع |
| 015 | Literature Review Assistant | Paper Clustering & Evidence Synthesis Engine | خوشه‌بندی مقاله و ماتریس شواهد |
| 016 | Competency Assessment Builder | Rubric & Assessment Engine | آزمون مبتنی بر شایستگی |
| 017 | Interview Simulator | Role-based Interview Feedback Engine | تمرین مصاحبه و گزارش مهارت |
| 018 | Digital Literacy Guide | Guided Task Instruction Engine | راهنمای گام‌به‌گام ابزار |
| 019 | Organizational Knowledge Archive | Governed Knowledge Index Engine | دانش‌نامه نسخه‌دار و جست‌وجو |
| 020 | Skill Evidence Passport | Skill Evidence & Credential Engine | پروفایل شواهد مهارت با رضایت |
| 021 | Multi-channel Content Calendar | Editorial Scheduling Engine | تقویم و brief محتوا |
| 022 | Content Repurposer | Format Adaptation Engine | تبدیل محتوای مالک به قالب‌های مختلف |
| 023 | Brand Consistency Checker | Brand Voice & Terminology Engine | کنترل لحن و واژگان برند |
| 024 | Campaign Pack Builder | Campaign Brief & KPI Engine | brief، پیام و سنجه کمپین |
| 025 | Audience Feedback Analyzer | Feedback Clustering & Trend Engine | خوشه‌بندی و روند بازخورد |
| 026 | Multilingual Subtitle Studio | Speech Alignment & Subtitle Engine | زیرنویس/صوت چندزبانه |
| 027 | Creative Asset Library | Asset Rights & Version Engine | کاتالوگ رسانه، مجوز و نسخه |
| 028 | Publishing QA | Channel Policy & Content QA Engine | کنترل کیفیت پیش از انتشار |
| 029 | Interactive Story Studio | Branching Narrative Engine | سناریوی روایت شاخه‌ای |
| 030 | Learning Content Impact | Learning Outcome Measurement Engine | سنجش فهم و تکمیل |
| 031 | Service Selection Guide | Explainable Provider Ranking Engine | مقایسه عرضه‌کننده با معیار شفاف |
| 032 | Appointment & Queue Manager | Capacity & Queue Scheduling Engine | نوبت، صف و اطلاع‌رسانی |
| 033 | Asset Maintenance Logbook | Maintenance Forecast & Reminder Engine | تاریخچه و یادآوری نگهداری |
| 034 | Local Event Planner | Event Coordination Engine | برنامه رویداد و وظایف |
| 035 | Accessibility Places Map | Verified Accessibility Attribute Engine | مشخصات دسترسی مکان با تأیید |
| 036 | Volunteer Coordinator | Skill-to-Mission Matching Engine | تطبیق مهارت داوطلب و مأموریت |
| 037 | Community Issue Tracker | Issue Intake & Resolution Workflow Engine | ثبت، مسئول و وضعیت درخواست |
| 038 | Responsible Trip Planner | Constraint-aware Itinerary Engine | برنامه سفر با منابع و برآورد |
| 039 | Non-medical Care Coordinator | Consent-based Task Coordination Engine | تقسیم وظایف روزمره، بدون تشخیص پزشکی |
| 040 | Local Skill Exchange | Time/Skill Matching & Agreement Engine | تطبیق مهارت و توافق شفاف |
| 041 | Business Proposal Builder | Scope & Proposal Composer Engine | پیشنهاد و محدوده کار |
| 042 | Customer Knowledge Hub | Customer Interaction Context Engine | پرونده تعامل مشتری |
| 043 | Sales Readiness Assessor | Sales Asset Gap Analysis Engine | ارزیابی صفحه و پیشنهاد فروش |
| 044 | Customer Experience Monitor | Feedback-to-Action Engine | رضایت‌سنجی و اقدام اصلاحی |
| 045 | Smart Catalog Builder | Product Data Normalization Engine | کاتالوگ چندزبانه از داده محصول |
| 046 | Supplier Match & Compare | Supplier Offer Normalization Engine | مقایسه پیشنهاد تأمین‌کننده |
| 047 | Team Capacity Planner | Skills-based Workload Engine | تخصیص کار بر پایه ظرفیت |
| 048 | Market Opportunity Radar | Source-grounded Trend Signal Engine | سیگنال فرصت با ارجاع منبع |
| 049 | Customer Help Center Builder | Knowledge-to-Helpcenter Engine | FAQ و راهنمای نسخه‌دار |
| 050 | Service Value Measurement | Outcome & Impact Measurement Engine | گزارش اثر قبل/بعد با محدودیت روش |

## معماری مشترک لازم برای همه ماژول‌ها
ماژول‌ها نباید 50 موتور زیرساختی موازی و ناسازگار بسازند. موتورهای مشترک زیر به‌صورت سرویس‌های پلتفرمی استفاده می‌شوند و مالکیت هرکدام باید با 81 موتور موجود تطبیق داده شود:
1. Identity & Tenant Context — هویت، tenant، عضویت و جداسازی داده.
2. Entitlement & Plan Resolver — حق دسترسی بر اساس طرح و مجوز.
3. Usage Metering & Cost Guard — اندازه‌گیری مصرف، سقف و کنترل هزینه.
4. Workflow & Human Approval — گردش‌کار و تأیید انسانی.
5. Event Bus & Idempotency — رویداد نسخه‌دار، جلوگیری از اجرای تکراری.
6. Search & Retrieval — جست‌وجوی مجاز و ارجاع به منبع.
7. Consent & Privacy — رضایت، هدف استفاده، نگهداری و حذف.
8. Audit & Observability — رخداد حسابرسی، trace، metric و alert.
9. Notification & Scheduling — اعلان، زمان‌بندی و retry.
10. Billing Adapter & Revenue Ledger — اتصال پرداخت/صورتحساب و ثبت درآمد پلتفرمی؛ بدون نگهداری وجوه مشتریان.
11. Content/File Pipeline — فایل، اسکن، تبدیل و نگهداری امن.
12. Feature Flag & Rollback — انتشار مرحله‌ای و بازگشت‌پذیر.

این فهرست موتورهای مشترک، 12 موتور جدید canonical محسوب نمی‌شود؛ ابتدا با 81 موتور موجود تطبیق داده شود. در صورت وجود میزبان، از آن استفاده شود.

## قرارداد استاندارد هر ماژول
هر ماژول باید دارای manifest شامل:
- module_id موقت و canonical_id فقط پس از تصویب
- owner_domain، description، source_lineage، host_module و dependency_ids
- input_schema/output_schema با نسخه‌بندی و validation
- API/handler واقعی، event names و error contract
- data entities، migration، tenant key، retention و export/delete policy
- authentication/authorization scopes و consent requirements
- UI فارسی RTL و انگلیسی، loading/empty/error states و دسترس‌پذیری
- entitlement، metering، قیمت شفاف، هزینه اجرا و margin guard
- unit/contract/integration/security/E2E tests
- telemetry، SLO، alert، backup/restore، rollback و runbook
- evidence: commit SHA، CI run، test report و محیط آزمون

## API الگوی پایه
- POST /api/v1/{module}/resources — ایجاد با schema validation و idempotency key
- GET /api/v1/{module}/resources/{id} — دریافت با مالکیت/tenant check
- POST /api/v1/{module}/resources/{id}/actions — اجرای اقدام مجاز
- GET /api/v1/{module}/resources/{id}/events — تاریخچه مجاز
- POST /api/v1/{module}/resources/{id}/feedback — بازخورد و نتیجه
این مسیرها الگو هستند؛ هر دامنه باید API اختصاصی و schema واقعی خود را تعریف کند و نباید به‌عنوان endpointهای پیاده‌سازی‌شده تلقی شوند.

## درآمد و حفاظت مالی
برای هر ماژول فقط پس از اثبات ارزش و هزینه:
- رایگان پایه/اشتراک حرفه‌ای/مصرف‌محور/مجوز سازمانی/کارمزد شفاف در صورت وجود معامله.
- تفکیک درآمد پلتفرم از اصل پول خریدار و فروشنده.
- قیمت و تمدید شفاف، رسید، لغو، بازپرداخت و اعتراض.
- محاسبه contribution margin پس از هزینه مدل، ذخیره‌سازی، پیام و پشتیبانی.
- هیچ درآمدی تا ثبت پرداخت موفق و تسویه قابل‌اثبات، درآمد واقعی گزارش نمی‌شود.

## اولویت‌بندی و تحویل
- P0: Autonomy Control Center، Owner Control Center، Work Memory، Identity/Consent integrations، Audit/Cost Guard؛ زیرا کنترل و امنیت بقیه را ممکن می‌کنند.
- P1: Intent Marketplace، Goal Planner، Smart Inbox، Knowledge Archive، Customer Hub، Appointment/Queue، Help Center، Publishing QA.
- P2: سایر ایده‌ها بر اساس ارزش کاربر، تقاضای قابل‌سنجش، هزینه و ریسک.
اولویت صرفاً ترتیب بررسی/ساخت است و به معنی شروع یا اتمام توسعه نیست.

## معیار عبور از طراحی به پیاده‌سازی
1. تطبیق معنایی با تمام 639 ماژول، 81 موتور، 72 offer، 72 bridge و 842 lineage.
2. انتخاب یکی از نتایج: NEW_MODULE، EXTENSION_OF_HOST، SHARED_ENGINE_FEATURE، ARCHIVE_ONLY، DUPLICATE.
3. تأیید مالک دامنه و قرارداد API/داده.
4. پیاده‌سازی vertical slice شامل UI + API + DB + auth + tests.
5. اجرای تست‌های مثبت و منفی، جداسازی tenant و آزمون هزینه/سهمیه.
6. staging، telemetry، rollback و شواهد backup/restore.
7. گزارش commit، CI، artifact و نتیجه E2E.
8. فعال‌سازی تولیدی فقط پس از عبور از release gate و تأیید مستقل.

## مرزهای محصول
- ARIA فاقد حسابداری/ERP است؛ این حوزه در ARIANA باقی می‌ماند.
- LEADORA، ARMIN MARKET، DANAA و ARIANA محصولات مستقل‌اند؛ اتصال فقط با API و قرارداد محصولی.
- هیچ‌یک از 639 شناسه حذف یا بازنویسی نمی‌شود.
- 50 ایده این سند فهرست توسعه‌ای تازه‌اند و جایگزین فهرست تاریخی مفقود نیستند.
