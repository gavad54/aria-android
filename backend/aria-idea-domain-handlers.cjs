"use strict";

const STRATEGIES = Object.freeze({
  1: { kind: "WORK_MEMORY_RECORD", steps: ["ثبت هدف و زمینه با رضایت", "تعیین برچسب و سطح محرمانگی", "ثبت نسخه و مالکیت tenant", "ارائه امکان بازبینی و اصلاح"], build: (goal, context) => ({ memoryTitle: goal, contextSummary: summarize(context), version: 1, retention: "USER_CONTROLLED", reviewControls: ["view", "correct", "delete"] }) },
  2: { kind: "GOAL_ACTION_PLAN", steps: ["تعریف نتیجه قابل مشاهده", "شکستن هدف به گام‌های کوچک", "تعیین وابستگی و اولویت", "بازبینی برنامه پیش از زمان‌بندی"], build: (goal, context) => ({ outcome: goal, tasks: items(context.tasks, ["شفاف‌سازی نتیجه", "تهیه گام نخست", "بازبینی پیشرفت"]), priority: "UNSET_UNTIL_USER_CONFIRMS", schedule: "PROPOSED_ONLY" }) },
  3: { kind: "MEETING_BRIEF", steps: ["استخراج هدف جلسه", "ساخت دستورجلسه", "ثبت تصمیم‌ها و مسئول‌ها", "تأیید انسانی پیش از دعوت"], build: (goal, context) => ({ meetingObjective: goal, agenda: items(context.agenda, ["هدف و خروجی مورد انتظار", "موضوعات اصلی", "تصمیم‌ها و اقدامات بعدی"]), participants: safeList(context.participants), calendarAction: "NOT_SENT" }) },
  4: { kind: "INBOX_TRIAGE", steps: ["دسته‌بندی پیام‌ها", "برآورد فوریت بر اساس نشانه‌های صریح", "پیشنهاد پیش‌نویس پاسخ", "تأیید انسانی پیش از ارسال"], build: (goal, context) => ({ triageGoal: goal, categories: ["نیازمند اقدام", "جهت اطلاع", "در انتظار پاسخ", "قابل بایگانی"], priority: "REQUIRES_MESSAGE_CONTENT", draft: context.message ? "DRAFT_REQUIRES_REVIEW" : "MESSAGE_NOT_PROVIDED", sendAction: "NEVER_AUTOMATIC" }) },
  5: { kind: "COMMITMENT_REGISTER", steps: ["استخراج تعهدهای صریح", "تعیین مسئول و موعد فقط در صورت ارائه", "ثبت وضعیت اولیه", "پیشنهاد پیگیری با تأیید کاربر"], build: (goal, context) => ({ commitmentObjective: goal, commitments: safeList(context.commitments), owner: context.owner || null, dueDate: context.dueDate || null, reminder: "NOT_SCHEDULED" }) },
  6: { kind: "PERMISSION_AWARE_SEARCH_PLAN", steps: ["تبدیل درخواست به عبارت جست‌وجو", "فیلتر منابع مجاز tenant", "ثبت provenance هر نتیجه", "حذف منابع فاقد مجوز"], build: (goal, context) => ({ query: goal, authorizedSources: safeList(context.authorizedSources), excludedSources: "ALL_UNAUTHORIZED", connectorExecution: "NOT_CONFIGURED", citationsRequired: true }) },
  7: { kind: "CONTEXT_TRANSLATION_BRIEF", steps: ["شناسایی زبان مبدأ و مقصد", "اعمال واژه‌نامه تأییدشده", "حفظ نام‌ها و اصطلاحات", "علامت‌گذاری ابهام برای بازبینی"], build: (goal, context) => ({ translationGoal: goal, sourceLanguage: context.sourceLanguage || "UNSPECIFIED", targetLanguage: context.targetLanguage || "UNSPECIFIED", glossary: safeList(context.glossary), translation: "SOURCE_TEXT_REQUIRED", terminologyReview: true }) },
  8: { kind: "SKILL_DEVELOPMENT_PATH", steps: ["تعیین مهارت هدف", "تخمین سطح اولیه با خودارزیابی", "چینش تمرین تدریجی", "بازخورد و بازبینی مسیر"], build: (goal, context) => ({ targetSkill: goal, currentLevel: context.currentLevel || "UNASSESSED", practiceTasks: items(context.practiceTasks, ["خودارزیابی کوتاه", "تمرین پایه", "تمرین کاربردی", "مرور و بازخورد"]), assessment: "NOT_FORMALLY_VALIDATED" }) },
  9: { kind: "DOCUMENT_CONTROL_PLAN", steps: ["فهرست‌کردن اسناد ارائه‌شده", "طبقه‌بندی و تعیین نسخه", "ثبت مالک و سطح دسترسی", "بررسی تاریخ انقضا در صورت وجود"], build: (goal, context) => ({ documentGoal: goal, documents: safeList(context.documents), classification: "PENDING_DOCUMENT_REVIEW", versioning: "PROPOSED", expiryChecks: "ONLY_WHEN_DATE_PROVIDED", fileStorage: "NOT_CONNECTED" }) },
  10: { kind: "ACCESSIBILITY_TRANSFORMATION_PLAN", steps: ["شناسایی قالب ورودی", "انتخاب نیاز دسترس‌پذیری", "تبدیل ساختار بدون تغییر معنا", "بازبینی خوانایی و کیفیت"], build: (goal, context) => ({ accessibilityGoal: goal, sourceFormat: context.sourceFormat || "UNSPECIFIED", targetFormat: context.targetFormat || "PLAIN_LANGUAGE", accommodations: safeList(context.accommodations), transformation: "SOURCE_CONTENT_REQUIRED", humanReview: true }) }
});

function summarize(value) {
  if (typeof value === "string") return value.slice(0, 500);
  if (value && typeof value === "object" && !Array.isArray(value)) return Object.keys(value).sort();
  return [];
}
function safeList(value) { return Array.isArray(value) ? value.slice(0, 100) : []; }
function items(value, fallback) { return safeList(value).length ? safeList(value) : fallback; }

function createIdeaDomainHandler(sequence) {
  const strategy = STRATEGIES[sequence];
  if (!strategy) throw new Error("ARIA_IDEA_STRATEGY_NOT_FOUND");
  return async function ideaDomainHandler(input, context) {
    if (typeof input.goal !== "string" || !input.goal.trim()) throw new Error("ARIA_IDEA_GOAL_INVALID");
    if (!input.context || (typeof input.context !== "object" && typeof input.context !== "string")) throw new Error("ARIA_IDEA_CONTEXT_INVALID");
    return Object.freeze({
      artifactType: strategy.kind,
      moduleSequence: sequence,
      goal: input.goal.trim().slice(0, 500),
      domainOutput: strategy.build(input.goal.trim(), input.context),
      workflow: strategy.steps.map((label, index) => ({ sequence: index + 1, label, state: "PROPOSED" })),
      tenantScope: String(context.tenantId),
      requiresHumanReview: true,
      externalSideEffect: false
    });
  };
}
module.exports = { createIdeaDomainHandler };
