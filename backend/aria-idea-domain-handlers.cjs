"use strict";

function safeList(value, limit = 100) {
  return Array.isArray(value) ? value.slice(0, limit) : [];
}
function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function safeText(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 500) : fallback;
}
function summarize(value) {
  if (typeof value === "string") return value.slice(0, 500);
  if (value && typeof value === "object" && !Array.isArray(value)) return Object.keys(value).sort();
  return [];
}
function items(value, fallback) {
  const list = safeList(value);
  return list.length ? list : fallback;
}
function normalizedRecords(value, limit = 100) {
  return safeList(value, limit).filter(item => item && typeof item === "object" && !Array.isArray(item));
}

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
  10: { kind: "ACCESSIBILITY_TRANSFORMATION_PLAN", steps: ["شناسایی قالب ورودی", "انتخاب نیاز دسترس‌پذیری", "تبدیل ساختار بدون تغییر معنا", "بازبینی خوانایی و کیفیت"], build: (goal, context) => ({ accessibilityGoal: goal, sourceFormat: context.sourceFormat || "UNSPECIFIED", targetFormat: context.targetFormat || "PLAIN_LANGUAGE", accommodations: safeList(context.accommodations), transformation: "SOURCE_CONTENT_REQUIRED", humanReview: true }) },
  11: { kind: "PERSONAL_KNOWLEDGE_GRAPH", steps: ["استخراج گره‌های دانشی ارائه‌شده", "اعتبارسنجی پیوندها بین گره‌ها", "اتصال هر ادعا به منبع", "علامت‌گذاری گره‌ها و ادعاهای بدون منبع"], build: (goal, raw) => { const c = asObject(raw); const entities = normalizedRecords(c.entities); const ids = new Set(entities.map((x, i) => safeText(x.id, "node-" + (i + 1)))); return { knowledgeGraph: { nodes: entities.map((x, i) => ({ id: safeText(x.id, "node-" + (i + 1)), label: safeText(x.label || x.name, "Unnamed concept"), type: safeText(x.type, "CONCEPT") })), edges: normalizedRecords(c.relationships).filter(x => ids.has(String(x.from)) && ids.has(String(x.to))).map(x => ({ from: String(x.from), to: String(x.to), type: safeText(x.type, "RELATED_TO") })), sourceReferences: normalizedRecords(c.sources).map((x, i) => ({ id: safeText(x.id, "source-" + (i + 1)), title: safeText(x.title, "Untitled source") })), unlinkedRelationshipCount: normalizedRecords(c.relationships).filter(x => !ids.has(String(x.from)) || !ids.has(String(x.to))).length }, objective: goal, evidencePolicy: "USER_SUPPLIED_SOURCES_ONLY" }; } },
  12: { kind: "CURRICULUM_SEQUENCE", steps: ["تعیین مهارت‌ها و سطح شروع", "ترتیب پیش‌نیازها و اهداف", "تقسیم مسیر به مرحله‌های قابل سنجش", "تعریف نقاط بازبینی پیشرفت"], build: (goal, raw) => { const c = asObject(raw); const skills = items(c.targetSkills, [goal]); const stages = skills.map((skill, i) => ({ sequence: i + 1, skill: safeText(skill, "Skill " + (i + 1)), objective: "Demonstrate progress in " + safeText(skill, "the selected skill"), prerequisite: i ? skills[i - 1] : null, practice: ["guided introduction", "applied exercise", "reflection"] })); return { learningPath: { currentLevel: safeText(c.currentLevel, "UNASSESSED"), weeklyMinutes: Number.isFinite(c.weeklyMinutes) && c.weeklyMinutes >= 0 ? c.weeklyMinutes : null, stages, milestones: stages.map(s => ({ afterStage: s.sequence, evidence: "USER_REVIEWED_WORK_SAMPLE" })) }, objective: goal, assessmentState: "SELF_REVIEW_NOT_FORMAL_CERTIFICATION" }; } },
  13: { kind: "INTERACTIVE_PRACTICE_DESIGN", steps: ["تعیین مهارت و سطح تمرین", "ساخت تمرین از ورودی‌های ارائه‌شده", "تعریف معیار بازخورد", "ثبت نتیجه برای بازبینی یادگیرنده"], build: (goal, raw) => { const c = asObject(raw); const exercises = normalizedRecords(c.practiceItems).map((x, i) => ({ id: safeText(x.id, "exercise-" + (i + 1)), prompt: safeText(x.prompt, "Practice task " + (i + 1)), expectedEvidence: safeList(x.expectedEvidence), difficulty: safeText(x.difficulty || c.difficulty, "UNSET") })); return { practicePlan: { skill: safeText(c.skill, goal), exercises, scoringRubric: ["accuracy", "reasoning", "evidence", "clarity"].map((criterion, i) => ({ criterion, weight: 1, score: null, sequence: i + 1 })), feedbackMode: "FORMATIVE_NOT_HIGH_STAKES" }, objective: goal }; } },
  14: { kind: "SOURCE_PROVENANCE_REVIEW", steps: ["ثبت فراداده هر منبع", "شناسایی فیلدهای مفقود", "تفکیک کامل‌بودن فراداده از اعتبار علمی", "تولید فهرست موارد نیازمند بررسی"], build: (goal, raw) => { const c = asObject(raw); const required = ["title", "author", "publishedAt", "sourceType"]; const sourceCards = normalizedRecords(c.sources).map((x, i) => { const missingMetadata = required.filter(key => !safeText(x[key])); return { id: safeText(x.id, "source-" + (i + 1)), title: safeText(x.title, "Untitled source"), missingMetadata, metadataCompleteness: (required.length - missingMetadata.length) / required.length, reliability: "NOT_ASSESSED_WITHOUT_INDEPENDENT_REVIEW" }; }); return { sourceReview: { sourceCards, reviewQueue: sourceCards.filter(x => x.missingMetadata.length).map(x => x.id), sourceCount: sourceCards.length }, objective: goal, noFabricatedCredibilityScore: true }; } },
  15: { kind: "LITERATURE_EVIDENCE_SYNTHESIS", steps: ["استخراج کلیدواژه‌های مقاله‌های ارائه‌شده", "خوشه‌بندی بر اساس کلیدواژه مشترک", "ساخت ماتریس یافته و منبع", "علامت‌گذاری تعارض و خلأ شواهد"], build: (goal, raw) => { const c = asObject(raw); const papers = normalizedRecords(c.papers); const groups = new Map(); for (const p of papers) for (const keyword of safeList(p.keywords).map(x => safeText(x)).filter(Boolean)) { const key = keyword.toLowerCase(); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(safeText(p.id, safeText(p.title, "paper"))); } return { literatureSynthesis: { clusters: [...groups.entries()].map(([keyword, ids]) => ({ keyword, paperIds: [...new Set(ids)] })), evidenceMatrix: papers.map((p, i) => ({ paperId: safeText(p.id, "paper-" + (i + 1)), title: safeText(p.title, "Untitled paper"), finding: safeText(p.finding, "FINDING_NOT_PROVIDED"), limitations: safeList(p.limitations) })), synthesisState: "SOURCE_BOUNDED_NO_UNSUPPORTED_GENERALIZATION" }, objective: goal }; } },
  16: { kind: "COMPETENCY_RUBRIC_DESIGN", steps: ["تعریف شایستگی‌های قابل مشاهده", "تبدیل شاخص‌ها به معیار ارزیابی", "ترتیب سطح‌های رشد", "بازبینی عدالت و تناسب rubric"], build: (goal, raw) => { const c = asObject(raw); const levels = items(c.levels, ["emerging", "developing", "proficient"]); return { competencyRubric: { competencies: normalizedRecords(c.competencies).map((x, i) => ({ name: safeText(x.name, "Competency " + (i + 1)), observableIndicators: safeList(x.indicators), assessmentEvidence: "REQUIRES_REVIEWABLE_WORK_SAMPLE" })), levels: levels.map((level, i) => ({ sequence: i + 1, name: safeText(level, "Level " + (i + 1)), descriptor: "Descriptor requires subject-matter review" })), decisionUse: "FORMATIVE_ONLY_NOT_AUTOMATED_HIGH_STAKES_DECISION" }, objective: goal }; } },
  17: { kind: "ROLE_BASED_INTERVIEW_PRACTICE", steps: ["تعریف نقش و مهارت‌های هدف", "انتخاب پرسش‌های مرتبط", "ساخت تمرین پاسخ ساختاریافته", "ارائه معیار بازخورد بدون تصمیم استخدامی"], build: (goal, raw) => { const c = asObject(raw); return { interviewPlan: { role: safeText(c.role, goal), competencies: safeList(c.competencies), questionSets: normalizedRecords(c.questionBank).map((x, i) => ({ sequence: i + 1, question: safeText(x.question, "Question " + (i + 1)), competency: safeText(x.competency, "GENERAL"), practiceOnly: true })), feedbackDimensions: ["relevance", "structure", "clarity", "evidence", "reflection"], hiringDecision: "NOT_SUPPORTED" }, objective: goal }; } },
  18: { kind: "DIGITAL_TASK_GUIDE", steps: ["روشن‌کردن هدف و ابزار مجاز", "بررسی پیش‌نیازها و نسخه پشتیبان", "اجرای گام‌های کوچک و برگشت‌پذیر", "بازبینی خروجی و ذخیره نتیجه"], build: (goal, raw) => { const c = asObject(raw); return { digitalGuide: { task: safeText(c.task, goal), tool: safeText(c.tool, "USER_SELECTED_TOOL"), device: safeText(c.device, "UNSPECIFIED"), skillLevel: safeText(c.skillLevel, "UNASSESSED"), steps: items(c.steps, ["Confirm the intended outcome", "Open the authorized application", "Complete one reversible step", "Review and save the result"]), safetyChecks: ["Never share passwords or one-time codes", "Confirm before deleting or publishing", "Use official help for account or security changes"] }, objective: goal }; } },
  19: { kind: "GOVERNED_KNOWLEDGE_ARCHIVE", steps: ["ثبت شناسه و فراداده سند", "تعیین مالک و دامنه دسترسی", "بررسی نسخه و موارد تکراری", "آماده‌سازی نمایه بدون انتشار عمومی"], build: (goal, raw) => { const c = asObject(raw); const records = normalizedRecords(c.documents).map((x, i) => ({ id: safeText(x.id, "document-" + (i + 1)), title: safeText(x.title, "Untitled document"), version: safeText(x.version, "UNVERSIONED"), owner: safeText(x.owner, "OWNER_UNASSIGNED"), access: safeText(x.access, "PRIVATE"), indexState: "LOCAL_METADATA_ONLY" })); const ids = new Set(); const duplicates = records.filter(x => { const key = (x.title + "|" + x.version).toLowerCase(); if (ids.has(key)) return true; ids.add(key); return false; }).map(x => x.id); return { knowledgeArchive: { records, duplicateCandidates: duplicates, accessRules: ["tenant_scope_required", "owner_or_explicit_role_required", "private_by_default", "no_external_index_without_consent"] }, objective: goal, storageState: "NOT_CONNECTED" }; } },
  20: { kind: "SKILL_EVIDENCE_PASSPORT", steps: ["ثبت مهارت و شواهد ارائه‌شده", "تفکیک ادعای کاربر از تأیید مستقل", "تعیین وضعیت محرمانگی و رضایت اشتراک", "آماده‌سازی خروجی قابل بازبینی"], build: (goal, raw) => { const c = asObject(raw); return { skillPassport: { skill: safeText(c.skill, goal), evidenceRecords: normalizedRecords(c.evidenceItems).map((x, i) => ({ id: safeText(x.id, "evidence-" + (i + 1)), type: safeText(x.type, "UNSPECIFIED"), description: safeText(x.description, "No description supplied"), issuer: safeText(x.issuer, "UNVERIFIED"), date: safeText(x.date, "DATE_NOT_PROVIDED"), verification: "USER_SUPPLIED_NOT_INDEPENDENTLY_VERIFIED" })), sharing: { state: c.sharingConsent === true ? "CONSENT_RECORDED_NOT_SHARED" : "PRIVATE", shareAction: "NOT_PERFORMED" } }, objective: goal }; } }

  21: { kind: "MULTI_CHANNEL_EDITORIAL_CALENDAR", steps: ["ثبت کانال‌ها و اقلام محتوا", "اعتبارسنجی قالب و موعدهای ارائه‌شده", "ساخت تقویم مرتب‌شده و تشخیص تعارض", "بازبینی انسانی پیش از زمان‌بندی"], build: (goal, raw) => { const c = asObject(raw); const channels = [...new Set(safeList(c.channels).map(x => safeText(x)).filter(Boolean))]; const entries = normalizedRecords(c.contentItems).map((x, i) => ({ id: safeText(x.id, "content-" + (i + 1)), title: safeText(x.title, "Untitled content"), channel: safeText(x.channel, channels[0] || "UNASSIGNED"), format: safeText(x.format, "UNSPECIFIED"), publishAt: safeText(x.publishAt, "UNSCHEDULED"), status: "DRAFT_PENDING_REVIEW" })).sort((a,b) => a.publishAt.localeCompare(b.publishAt)); const keys = new Set(); const conflicts = entries.filter(x => { const k=x.channel+"|"+x.publishAt; if(x.publishAt==="UNSCHEDULED"||!keys.has(k)){keys.add(k);return false;} return true; }).map(x=>x.id); return { contentCalendar: { channels, entries, schedulingConflicts: conflicts, publishState: "NOT_SCHEDULED" }, objective: goal }; } },
  22: { kind: "SOURCE_BOUNDED_CONTENT_REPURPOSING", steps: ["ثبت محتوای مبنا و حقوق استفاده", "انتخاب قالب‌های مقصد", "تدوین brief اختصاصی هر قالب", "کنترل وفاداری به منبع و بازبینی"], build: (goal, raw) => { const c=asObject(raw); const source=safeText(c.sourceContent); const formats=[...new Set(safeList(c.targetFormats).map(x=>safeText(x)).filter(Boolean))]; return { repurposedAssets: { sourceSummary: source.slice(0,500), sourceReferenceRequired: true, variants: formats.map((format,i)=>({sequence:i+1,format,adaptationBrief:"Adapt the supplied source for "+format+" while preserving verified claims",requiredChecks:["source attribution","claim fidelity","format constraints"],state:source?"BRIEF_READY":"SOURCE_REQUIRED"})), unsupportedClaimsAllowed:false }, objective:goal }; } },
  23: { kind: "BRAND_VOICE_AND_TERMINOLOGY_AUDIT", steps: ["ثبت قواعد لحن و واژگان مصوب", "بررسی نمونه‌های ارائه‌شده", "شناسایی واژه‌های ممنوع یا ناسازگار", "تهیه گزارش اصلاح برای تأیید مالک برند"], build: (goal, raw) => { const c=asObject(raw); const approved=safeList(c.approvedTerms).map(x=>safeText(x)).filter(Boolean); const forbidden=safeList(c.forbiddenTerms).map(x=>safeText(x)).filter(Boolean); const samples=safeList(c.contentSamples).filter(x=>typeof x==="string").slice(0,100); const rules=[...safeList(c.brandVoice).map(x=>({type:"VOICE",rule:safeText(x)})),...approved.map(term=>({type:"APPROVED_TERM",term})),...forbidden.map(term=>({type:"FORBIDDEN_TERM",term}))]; const issues=[]; samples.forEach((sample,i)=>{for(const term of forbidden) if(sample.toLowerCase().includes(term.toLowerCase())) issues.push({sampleIndex:i+1,type:"FORBIDDEN_TERM_FOUND",term});}); return { brandAudit: { rules, samplesReviewed:samples.length, issues, approvedTerms:approved, forbiddenTerms:forbidden, approvalState:"OWNER_REVIEW_REQUIRED" }, objective:goal }; } },
  24: { kind: "CAMPAIGN_BRIEF_AND_KPI_BLUEPRINT", steps: ["تعریف مخاطب و هدف قابل سنجش", "ثبت کانال و بودجه پیشنهادی", "تعیین KPI و مبنای اندازه‌گیری", "تأیید مالک پیش از تخصیص بودجه یا انتشار"], build: (goal, raw) => { const c=asObject(raw); const budget=Number.isFinite(c.budget)&&c.budget>=0?c.budget:null; return { campaignBlueprint: { audience:safeText(c.audience,"AUDIENCE_UNDEFINED"), objective:safeText(c.objective,goal), channels:safeList(c.channels).map(x=>safeText(x)).filter(Boolean), proposedBudget:budget, budgetReview:"OWNER_CONFIRMATION_REQUIRED", kpis:[{name:"qualified_reach",definition:"Unique target audience reached",baseline:null},{name:"engagement_rate",definition:"Meaningful interactions divided by reach",baseline:null},{name:"conversion_rate",definition:"Completed target actions divided by eligible visits",baseline:null}], measurementWindow:"OWNER_TO_DEFINE", launchState:"DRAFT_NOT_PUBLISHED" }, objective:goal }; } },
  25: { kind: "AUDIENCE_FEEDBACK_THEME_ANALYSIS", steps: ["اعتبارسنجی بازخوردهای ارائه‌شده", "گروه‌بندی بر اساس برچسب‌های صریح", "استخراج موضوع‌های پرتکرار از متن", "نمایش محدودیت نمونه و نیاز به بازبینی"], build: (goal, raw) => { const c=asObject(raw); const feedback=normalizedRecords(c.feedback); const groups=new Map(); for(const item of feedback){const label=safeText(item.sentiment,"UNCLASSIFIED").toLowerCase();if(!groups.has(label))groups.set(label,[]);groups.get(label).push(safeText(item.id,"feedback-"+(groups.get(label).length+1)));} const terms=new Map(); for(const item of feedback){const words=safeText(item.text).toLowerCase().match(/[\p{L}\p{N}]{3,}/gu)||[];for(const word of words)terms.set(word,(terms.get(word)||0)+1);} return { feedbackInsights:{feedbackCount:feedback.length,themes:[...terms.entries()].sort((a,b)=>b[1]-a[1]).slice(0,12).map(([term,count])=>({term,count})), sentimentGroups:[...groups.entries()].map(([sentiment,ids])=>({sentiment,feedbackIds:ids})), sampleLimitations:"USER_SUPPLIED_SAMPLE_ONLY", sentimentInference:"EXPLICIT_LABELS_ONLY" }, objective:goal }; } },
  26: { kind: "MULTILINGUAL_SUBTITLE_ALIGNMENT_PLAN", steps: ["ثبت متن و زبان مبدأ", "ساخت کار برای هر زبان مقصد", "تعریف قطعه‌بندی و کنترل هم‌ترازی", "بازبینی انسانی پیش از خروجی نهایی"], build: (goal, raw) => { const c=asObject(raw); const targets=[...new Set(safeList(c.targetLanguages).map(x=>safeText(x)).filter(Boolean))]; const segments=normalizedRecords(c.sourceSegments).map((x,i)=>({sequence:i+1,start:x.start??null,end:x.end??null,text:safeText(x.text),translationState:"NOT_TRANSLATED"})); return { subtitlePlan:{sourceTextProvided:Boolean(safeText(c.sourceText)),sourceLanguage:safeText(c.sourceLanguage,"UNSPECIFIED"),languageJobs:targets.map(language=>({language,segments:segments.length,format:"SRT_OR_VTT_REQUIRES_SELECTION",state:"PREPARATION_ONLY"})),sourceSegments:segments,timingMode:safeText(c.timingMode,"MANUAL_REVIEW"),alignmentReviewRequired:true,voiceConsentRequired:true }, objective:goal }; } },
  27: { kind: "CREATIVE_ASSET_RIGHTS_AND_VERSION_REGISTER", steps: ["ثبت دارایی و فراداده نسخه", "بررسی مجوز و مالکیت اعلام‌شده", "شناسایی رکوردهای فاقد مدرک حق استفاده", "اعمال پیش‌فرض خصوصی و بازبینی مالک"], build: (goal, raw) => { const c=asObject(raw); const assets=normalizedRecords(c.assets).map((x,i)=>({id:safeText(x.id,"asset-"+(i+1)),name:safeText(x.name,"Unnamed asset"),license:safeText(x.license,"UNSPECIFIED"),version:safeText(x.version,"UNVERSIONED"),owner:safeText(x.owner,"UNASSIGNED"),visibility:"PRIVATE",rightsState:safeText(x.license)==="owned"||safeText(x.license)==="licensed"?"EVIDENCE_REQUIRED":"REVIEW_REQUIRED"})); return { assetRegister:{assets,rightsReviewQueue:assets.filter(x=>x.rightsState!=="EVIDENCE_REQUIRED").map(x=>x.id),releasePermission:"NOT_GRANTED_BY_REGISTRATION",duplicateCheck:"METADATA_ONLY" }, objective:goal }; } },
  28: { kind: "PUBLISHING_PRE_FLIGHT_QUALITY_GATE", steps: ["ثبت پیش‌نویس و مقصد انتشار", "اجرای کنترل‌های محتوایی و فنی", "ثبت موانع و موارد نیازمند تأیید", "مسدود نگه‌داشتن انتشار تا تأیید انسانی"], build: (goal, raw) => { const c=asObject(raw); const p=asObject(c.publication); const checks=safeList(c.checks).map(x=>({name:safeText(x),status:"PENDING_REVIEW"})); const missing=[]; if(!safeText(p.title))missing.push("title"); if(!safeText(p.channel))missing.push("channel"); if(!safeText(p.draft))missing.push("draft"); return { publishingQa:{title:safeText(p.title),channel:safeText(p.channel),checks,missingFields:missing,publishState:"BLOCKED_PENDING_APPROVAL",externalPublishPerformed:false,approvalRequired:true}, objective:goal }; } },
  29: { kind: "INTERACTIVE_STORY_STORYBOARD", steps: ["تعریف هدف و مخاطب داستان", "ترتیب صحنه‌ها و نقش هر صحنه", "تعیین نقاط تعامل و انتخاب", "بازبینی انسجام و دسترس‌پذیری"], build: (goal, raw) => { const c=asObject(raw); const scenes=normalizedRecords(c.scenes).map((x,i)=>({sequence:i+1,title:safeText(x.title,"Scene "+(i+1)),purpose:safeText(x.purpose,"ADVANCE_STORY"),interaction:safeText(x.interaction,"NONE"),accessibilityNotes:safeList(x.accessibilityNotes)})); return { storyboard:{storyGoal:safeText(c.storyGoal,goal),audience:safeText(c.audience,"UNSPECIFIED"),scenes,continuityReview:scenes.length>1?"REQUIRED":"INSUFFICIENT_SCENES",reviewRequired:true,publicationState:"DRAFT_ONLY"}, objective:goal }; } },
  30: { kind: "LEARNING_CONTENT_OUTCOME_MEASUREMENT", steps: ["ثبت اهداف یادگیری", "نگاشت فعالیت‌ها به اهداف", "تحلیل نتایج ارائه‌شده بدون تعمیم", "تعریف شکاف پوشش و بازبینی مربی"], build: (goal, raw) => { const c=asObject(raw); const objectives=safeList(c.learningObjectives).map(x=>safeText(x)).filter(Boolean); const activities=normalizedRecords(c.activities); const outcomes=normalizedRecords(c.outcomes); const coverage=objectives.map(objective=>({objective,activityCount:activities.filter(a=>safeText(a.objective)===objective).length,outcomeCount:outcomes.filter(o=>safeText(o.objective)===objective).length})); return { learningImpact:{objectiveCoverage:coverage,activitiesReviewed:activities.length,outcomesReviewed:outcomes.length,measurementState:"USER_DATA_ONLY",causalImpactClaim:"NOT_ESTABLISHED",instructorReviewRequired:true}, objective:goal }; } }

});

const COMMERCIAL = Object.freeze({
  1: ["SUBSCRIPTION_PLUS_STORAGE_METERING", "ACTIVE_MEMORY_ITEMS", "aria.idea.work-memory"],
  2: ["FREEMIUM_PLUS_PRO_SUBSCRIPTION", "PLANS_CREATED", "aria.idea.goal-planner"],
  3: ["PER_SEAT_SUBSCRIPTION", "MEETING_BRIEFS", "aria.idea.meeting-coordinator"],
  4: ["PER_SEAT_PLUS_USAGE", "MESSAGES_TRIAGED", "aria.idea.smart-inbox"],
  5: ["SUBSCRIPTION_PLUS_ACTIVE_RECORDS", "ACTIVE_COMMITMENTS", "aria.idea.commitment-tracker"],
  6: ["SUBSCRIPTION_PLUS_QUERY_METERING", "AUTHORIZED_SEARCH_QUERIES", "aria.idea.federated-search"],
  7: ["USAGE_METERING", "CHARACTERS_PROCESSED", "aria.idea.context-translator"],
  8: ["SUBSCRIPTION_PLUS_PRACTICE_CREDITS", "PRACTICE_SESSIONS", "aria.idea.skill-coach"],
  9: ["SUBSCRIPTION_PLUS_STORAGE_METERING", "DOCUMENT_STORAGE_UNITS", "aria.idea.document-manager"],
  10: ["FREEMIUM_PLUS_TRANSFORMATION_USAGE", "ACCESSIBLE_TRANSFORMATIONS", "aria.idea.accessibility-assistant"],
  11: ["SUBSCRIPTION_PLUS_KNOWLEDGE_ITEMS", "KNOWLEDGE_GRAPH_RECORDS", "aria.idea.knowledge-map"],
  12: ["SUBSCRIPTION_PLUS_LEARNING_PATHS", "LEARNING_PATHS_CREATED", "aria.idea.learning-path"],
  13: ["USAGE_METERING", "PRACTICE_SESSIONS", "aria.idea.practice-lab"],
  14: ["USAGE_METERING", "SOURCE_REVIEWS", "aria.idea.source-reviewer"],
  15: ["SUBSCRIPTION_PLUS_EVIDENCE_ITEMS", "PAPERS_INDEXED", "aria.idea.literature-review"],
  16: ["PER_SEAT_SUBSCRIPTION", "RUBRICS_CREATED", "aria.idea.competency-assessment"],
  17: ["SUBSCRIPTION_PLUS_PRACTICE_CREDITS", "INTERVIEW_PRACTICE_SESSIONS", "aria.idea.interview-simulator"],
  18: ["FREEMIUM_PLUS_GUIDE_USAGE", "GUIDE_COMPLETIONS", "aria.idea.digital-literacy"],
  19: ["SUBSCRIPTION_PLUS_STORAGE_METERING", "ARCHIVE_RECORDS", "aria.idea.knowledge-archive"],
  20: ["SUBSCRIPTION_PLUS_EVIDENCE_ITEMS", "PASSPORT_EVIDENCE_RECORDS", "aria.idea.skill-passport"]

  21: ["TEAM_SUBSCRIPTION_PLUS_CHANNELS", "SCHEDULED_CONTENT_ITEMS", "aria.idea.content-calendar"],
  22: ["USAGE_METERING_BY_VARIANT", "CONTENT_VARIANTS_CREATED", "aria.idea.content-repurposer"],
  23: ["BRAND_WORKSPACE_SUBSCRIPTION", "BRAND_SAMPLES_REVIEWED", "aria.idea.brand-audit"],
  24: ["CAMPAIGN_WORKSPACE_SUBSCRIPTION", "CAMPAIGN_BLUEPRINTS", "aria.idea.campaign-pack"],
  25: ["FEEDBACK_VOLUME_METERING", "FEEDBACK_RECORDS_ANALYZED", "aria.idea.feedback-analyzer"],
  26: ["AUDIO_MINUTE_AND_LANGUAGE_METERING", "SUBTITLE_LANGUAGE_JOBS", "aria.idea.subtitle-studio"],
  27: ["ASSET_LIBRARY_STORAGE_SUBSCRIPTION", "REGISTERED_ASSETS", "aria.idea.asset-library"],
  28: ["PUBLISHING_QA_CREDITS", "PUBLICATION_PREFLIGHTS", "aria.idea.publishing-qa"],
  29: ["STORY_CREATION_CREDITS", "STORYBOARDS_CREATED", "aria.idea.interactive-story"],
  30: ["LEARNING_ANALYTICS_SUBSCRIPTION", "LEARNING_OUTCOME_RECORDS", "aria.idea.learning-impact"]

});

function createIdeaDomainHandler(sequence) {
  const strategy = STRATEGIES[sequence];
  if (!strategy) throw new Error("ARIA_IDEA_STRATEGY_NOT_FOUND");
  return async function ideaDomainHandler(input, context) {
    if (typeof input.goal !== "string" || !input.goal.trim()) throw new Error("ARIA_IDEA_GOAL_INVALID");
    if (!input.context || (typeof input.context !== "object" && typeof input.context !== "string")) throw new Error("ARIA_IDEA_CONTEXT_INVALID");
    const domainOutput = strategy.build(input.goal.trim(), asObject(input.context));
    const commercial = COMMERCIAL[sequence];
    return Object.freeze({
      artifactType: strategy.kind,
      moduleId: "ARIA-IDEA-BACKLOG-" + String(sequence).padStart(3, "0"),
      moduleSequence: sequence,
      goal: input.goal.trim().slice(0, 500),
      domainOutput,
      domainArtifact: { artifactType: strategy.kind, payload: domainOutput },
      moduleSpecificProfile: {
        profileId: "PROFILE:ARIA-IDEA-BACKLOG-" + String(sequence).padStart(3, "0"),
        moduleId: "ARIA-IDEA-BACKLOG-" + String(sequence).padStart(3, "0"),
        moduleName: strategy.kind,
        specialization: strategy.kind,
        inputSchema: ["goal", "context", "consent"].map(name => ({ name, required: true })),
        operationPlan: strategy.steps.map((operation, index) => ({ sequence: index + 1, operation, state: "LOCAL_EXECUTABLE_STEP" })),
        decisionRules: ["TENANT_BOUNDARY", "HUMAN_REVIEW", "NO_EXTERNAL_SIDE_EFFECT"],
        executionBoundary: "TENANT_SCOPED_LOCAL_ONLY",
        externalExecution: false,
        productionVerified: false
      },
      workflow: strategy.steps.map((label, index) => ({ sequence: index + 1, label, state: "PROPOSED" })),
      commercialization: {
        model: commercial[0],
        meteringUnit: commercial[1],
        entitlementKey: commercial[2],
        state: "DESIGNED_NOT_MONETIZED",
        price: null,
        currency: null,
        billingEnabled: false,
        paymentExecuted: false
      },
      tenantScope: String(context.tenantId),
      requiresHumanReview: true,
      externalSideEffect: false
    });
  };
}
module.exports = { createIdeaDomainHandler };
