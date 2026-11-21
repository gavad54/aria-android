# Crosswalk افزایشی ۸ قابلیت عملیات خدمات ARIA
تاریخ: 2026-11-19

## قاعده تصمیم
این نگاشت، بررسی معنایی اولیه است و نه تطبیق قطعی شناسه‌ها. فهرست 81 موتور مرجع، خودش صریحاً وضعیت hostها را `PROPOSED_HOST_CANDIDATES_NOT_RUNTIME_VERIFIED` اعلام می‌کند؛ بنابراین هیچ host در این سند «متصل/تأییدشده» محسوب نمی‌شود. تا زمان بررسی قرارداد ورودی/خروجی، مدل داده، مالک دامنه، عملیات، مجوزها و آزمون‌ها، هر 8 مورد با شناسه موقت می‌مانند و به 639 canonical یا شمار 893 اضافه نمی‌شوند.

| شناسه موقت | همپوشانی ایده‌های 50گانه | موتورهای موجودِ نامزد برای reuse | تصمیم فعلی |
|---|---|---|---|
| ARIA-SVC-INTAKE | IDEA-037 Community Issue Tracker؛ IDEA-031 Service Selection Guide | INTENT_ENGINE، PLANNING_ENGINE، POLICY_ENGINE | EXTENSION_OF_HOST محتمل؛ ثبت intake عمومی فقط در صورت نبود قرارداد هم‌ارز |
| ARIA-SVC-PROPOSAL | IDEA-041 Business Proposal Builder | REASONING_ENGINE، PLANNING_ENGINE، PRICING_OPTIMIZATION_ENGINE_26 | EXTENSION_OF_HOST؛ موتور مستقل پیشنهاد نسازیم مگر قرارداد قیمت/دامنه متمایز باشد |
| ARIA-SVC-DELIVERY | IDEA-005 Commitment Tracker؛ IDEA-047 Team Capacity Planner | PLANNING_ENGINE، AGENT_ORCHESTRATOR، ENTERPRISE_COMMITMENT_ENGINE_26 | SHARED_ENGINE_FEATURE؛ گردش‌کار و تعهدها روی میزبان موجود |
| ARIA-SVC-QUALITY | IDEA-028 Publishing QA؛ IDEA-014 Source Quality Reviewer | VERIFICATION_ENGINE، TRUST_ENGINE، POLICY_ENGINE، PROVENANCE_ENGINE | SHARED_ENGINE_FEATURE؛ گیت کیفیت و شواهد باید reuse شوند |
| ARIA-SVC-SUPPORT | IDEA-049 Customer Help Center Builder؛ IDEA-042 Customer Knowledge Hub | CONTEXT_ENGINE، AGENT_ORCHESTRATOR، VERIFICATION_ENGINE | EXTENSION_OF_HOST؛ مرکز پشتیبانی اختصاصی هنوز پیاده‌سازی کامل نشده |
| ARIA-SVC-SUCCESS | IDEA-044 Customer Experience Monitor؛ IDEA-050 Service Value Measurement | OUTCOME_ENGINE، CHURN_PREVENTION_ENGINE_26، VALUE_ATTRIBUTION_ENGINE_26، VALUE_TO_REVENUE_ENGINE_26 | SHARED_ENGINE_FEATURE؛ شاخص‌های نتیجه/ماندگاری باید به میزبان متصل شوند |
| ARIA-SVC-PACKAGES | IDEA-024 Campaign Pack Builder؛ IDEA-022 Content Repurposer | PACKAGING_ENGINE_26، PLANNING_ENGINE | EXTENSION_OF_HOST؛ کاتالوگ بسته و entitlement هنوز نیازمند اتصال |
| ARIA-SVC-UNIT-ECONOMICS | IDEA-050 Service Value Measurement | BUDGET_ENGINE، MARGIN_ENGINE، COST_TO_VALUE_ENGINE_26، MARGIN_GUARDIAN_ENGINE_26، ECONOMIC_FORECAST_ENGINE_26 | SHARED_ENGINE_FEATURE؛ محاسبه سود باید از ledger و metering تأییدشده تغذیه شود |

## هم‌ترازی با 12 مدل درآمدی
- پیشنهاد/بسته خدمت: Hybrid Subscription و Usage Metering.
- هزینه هر اجرا و حاشیه: Usage Metering و Cost Guardian.
- ارزش/نتیجه: Outcome Pricing فقط با KPI از پیش توافق‌شده و شواهد مستقل.
- کارمزد خدمات، سهم شریک و پرداخت ارائه‌دهنده به‌صورت پیش‌فرض در ARIA فعال نمی‌شوند؛ این موارد نیازمند مالکیت محصولی، قرارداد، PSP، احراز و حل اختلاف‌اند و باید در محصول مالک مناسب اجرا شوند.
- وجوه اصلی مشتری/فروشنده درآمد ARIA نیست؛ فقط کارمزد پلتفرمی افشاشده یا اشتراک قابل شناسایی به‌عنوان درآمد پلتفرم است.

## یافته مهم اجرایی
در کد فعلی، چهار قابلیت پایه واقعاً دارای منطق دامنه‌ای هستند: پذیرش پرونده، ماشین وضعیت، محاسبه برآورد و کنترل کیفیت مبتنی بر شواهد. چهار حوزه پشتیبانی، موفقیت مشتری، بسته‌بندی و اقتصاد واحد در این موج فعلاً کاتالوگ و نقطه اتصال گردش‌کار مشترک دارند؛ موتور تخصصی مستقل، داشبورد تحلیلی، entitlement و محاسبه ledger-backed آن‌ها هنوز ساخته و آزموده نشده است.

## گام قطعی قبل از canonicalization
برای هر ردیف باید candidate hostهای 639 و 81 موتور در سطح کد و schema واکشی شوند، سپس مقایسه قرارداد و تست انجام شود. اگر host برابر پیدا شد، شناسه موقت به آن host متصل می‌شود و موتور تکراری حذف نمی‌شود بلکه به‌عنوان alias/extension حفظ می‌شود. فقط در صورت اثبات تفاوت دامنه و قرارداد و تأیید مالک، شناسه canonical جدید پیشنهاد می‌شود.
