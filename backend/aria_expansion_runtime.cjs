"use strict";
const fs = require("node:fs");
const path = require("node:path");
const serviceDelivery = require("./aria-service-delivery.cjs");
const moduleRegistryRuntime = require("./modules");
const replacementModuleRuntime = require("./aria-039-replacement-runtime.cjs");
if (moduleRegistryRuntime.MODULES.length !== 201) throw new Error("ARIA_INDEPENDENT_MODULE_COUNT_INVALID");
const registry = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "aria_expansion_registry.json"), "utf8"));
const moduleRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "aria_111_module_expansion_registry.json"), "utf8"));
const commercialRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "aria_commercial_module_registry.json"), "utf8"));
const canonicalRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "aria_639_canonical_execution_registry.json"), "utf8"));
const commercialExecutionManifest = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "aria_commercial_execution_manifest.json"), "utf8"));
const unifiedExecutionRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "aria_893_module_execution_registry.json"), "utf8"));
const unifiedExecutionById = new Map(unifiedExecutionRegistry.records.map(x => [x.unitId, x]));
const unifiedExecutionByLaunchId = new Map(unifiedExecutionRegistry.records.map(x => [x.launchId, x]));
const canonicalModules = canonicalRegistry.records;
const canonicalModuleById = new Map(canonicalModules.map(x => [x.canonicalId, x]));
const commercialExecutionById = new Map(commercialExecutionManifest.records.map(x => [x.commercialModuleId, x]));
const ownership = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "aria_product_ownership_migration.json"), "utf8"));
const allModuleCatalog = moduleRegistry.moduleCatalog;
const transferredIds = new Set(Object.values(ownership.products).flatMap(x => x.ownedModuleIds));
const archivedDomainIds = new Set(ownership.archivedDomainModuleIds);
const moduleCatalog = allModuleCatalog.filter(x => !transferredIds.has(x.moduleId) && !archivedDomainIds.has(x.moduleId));
const moduleCatalogById = new Map(moduleCatalog.map(x => [x.moduleId, x]));
const publicProblemIds = new Set(moduleCatalog.filter(x => x.sourceProblemId).map(x => x.sourceProblemId));
const publicProblemRecords = registry.problems.filter(x => publicProblemIds.has(x.id));
const problemById = new Map(publicProblemRecords.map(x => [x.id, x]));
const candidateById = new Map(registry.candidates.map(x => [x.moduleId, x]));
const problemEngines = [...new Map(publicProblemRecords.map(x => [x.engine.id, { ...x.engine, moduleIds: publicProblemRecords.filter(p => p.engine.id === x.engine.id).map(p => moduleCatalog.find(m => m.sourceProblemId === p.id)?.moduleId).filter(Boolean), engineType: "PROBLEM_DOMAIN_ENGINE" }])).values()];
const candidateEngines = registry.candidates.map(x => ({ ...x.engine, moduleId: moduleCatalog.find(m => m.sourceCandidateId === x.id)?.moduleId || null, engineType: "HISTORICAL_CONTROL_ENGINE" }));
const ideaEngines = moduleCatalog.filter(x => x.moduleType === "NEW_IDEA_PRODUCT_MODULE").map(x => ({ id: x.engineId, name: x.name + " — موتور تخصصی", moduleId: x.moduleId, engineType: "NEW_IDEA_ENGINE", contract: { input: x.inputContract, output: x.outputContract, operations: x.workflow, metrics: x.kpis, runtimeMode: "DESIGN_ONLY", externalAdapterState: "NOT_CONNECTED" } }));
const legacyDomainEngines = moduleCatalog.filter(x => x.moduleType === "MERGED_LEGACY_APP_DOMAIN_MODULE").map(x => ({ id: x.engineId || x.moduleId, name: x.name + " — موتور دامنه", moduleId: x.moduleId, engineType: "ARIA_DOMAIN_ENGINE", contract: { input: x.inputContract, output: x.outputContract, operations: x.workflow, metrics: x.kpis, runtimeMode: "DESIGN_ONLY", externalAdapterState: "NOT_CONNECTED" } }));
const publicDomainPacks = moduleRegistry.mergedDomainPacks.filter(x => ownership.publicAriaDomainPackIds.includes(x.id)).map(x => ({ ...x, moduleIds: x.moduleIds.filter(id => moduleCatalogById.has(id)) }));
const publicFamilyArchitecture = { parent: "VAYRO", product: "ARIA", directProduct: true, accountingErpOwner: "ARIANA", role: "General AI assistant and digital work environment" };
const engineCatalog = [...problemEngines, ...candidateEngines, ...ideaEngines, ...legacyDomainEngines];
const engineSubmodules = engineCatalog.map((engine, index) => ({
  moduleId: "ARIA-ENGINE-MODULE-" + String(index + 1).padStart(3, "0"),
  engineId: engine.id,
  name: engine.name,
  moduleType: "ENGINE_SUBMODULE",
  parentModuleIds: engine.moduleIds || (engine.moduleId ? [engine.moduleId] : []),
  ownerProduct: "ARIA",
  domain: engine.engineType,
  inputContract: engine.contract?.input || [],
  outputContract: engine.contract?.output || [],
  operations: engine.contract?.operations || [],
  implementationStatus: "DESIGNED_NOT_IMPLEMENTED",
  productionStatus: "NOT_PRODUCTION_VERIFIED",
  executionMode: "NOT_CONNECTED"
}));
const commercialModules = commercialRegistry.records.map(item => ({
  moduleId: "ARIA-COMMERCIAL-MODULE-" + String(item.catalogEntryId),
  commercialModuleId: item.commercialModuleId,
  catalogEntryId: item.catalogEntryId,
  name: item.name,
  moduleType: "COMMERCIAL_CATALOG_MODULE",
  ownerProduct: "ARIA",
  ownerDomain: item.domain,
  parentCanonicalContractId: item.parentCanonicalContractId,
  moduleState: item.moduleState,
  commercialState: item.commercialState,
  revenueEngineState: item.revenueEngine?.state || "UNSPECIFIED",
  implementationStatus: item.moduleState === "LOCAL_WORKFLOW_AVAILABLE" ? "LOCAL_WORKFLOW_AVAILABLE_NOT_E2E_VERIFIED" : "DESIGNED_NOT_IMPLEMENTED",
  productionStatus: "NOT_PRODUCTION_VERIFIED"
}));
if (unifiedExecutionRegistry.total !== 932 || unifiedExecutionRegistry.records.length !== 932 ||
    unifiedExecutionById.size !== 932 || unifiedExecutionByLaunchId.size !== 932 || unifiedExecutionRegistry.activeLocalWorkflowCount !== 893 ||
    unifiedExecutionRegistry.lineageOnlyCount !== 39 ||
    unifiedExecutionRegistry.records.filter(x => x.executionState === "LOCAL_WORK_ITEM_ONLY").length !== 893 ||
    unifiedExecutionRegistry.records.filter(x => x.executionState === "LINEAGE_ONLY").length !== 39 ||
    unifiedExecutionRegistry.records.some(x => !x.executionContract || !Array.isArray(x.executionContract.operations) || x.executionContract.operations.length === 0) ||
    unifiedExecutionRegistry.records.some(x => x.recordType === "ENGINE_SUBMODULE" && (!x.parentModuleIds.length || x.parentModuleIds.some(id => !moduleCatalogById.has(id)))) ||
    unifiedExecutionRegistry.records.some(x => x.recordType === "COMMERCIAL_MODULE" && !canonicalModuleById.has(x.hostCanonicalContractId))) {
  throw new Error("ARIA_UNIFIED_893_EXECUTION_REGISTRY_INVALID");
}
const moduleInventory = {
  canonicalModules: canonicalModules.length,
  preservedHistoricalOverlayModules: allModuleCatalog.length,
  commercialCatalogModules: commercialModules.length,
  engineSubmodules: engineSubmodules.length,
  additionalAriaModules: replacementModuleRuntime.REGISTRY.records.length,
  ariaOwnedModuleAndSubmoduleRecords: canonicalModules.length + moduleCatalog.length + commercialModules.length + engineSubmodules.length + replacementModuleRuntime.REGISTRY.records.length,
  totalModuleAndSubmoduleRecords: canonicalModules.length + allModuleCatalog.length + commercialModules.length + engineSubmodules.length + replacementModuleRuntime.REGISTRY.records.length,
  countingRule: "Total inventory records = 639 canonical + 111 preserved overlay (72 ARIA-owned and 39 lineage-only) + 72 commercial + 71 child engines + 39 new ARIA-owned replacements = 932. ARIA-owned units = 893; the 39 sibling-product/archive lineage records remain excluded from ARIA ownership. This inventory count is not a claim of production verification."
};
const canonicalFamilyHandlers = {
  CORE: (module, goal, context) => ({ artifactType: "CORE_SYSTEM_WORKFLOW", objective: goal, stages: ["درک درخواست", "تقسیم کار", "کنترل وابستگی", "اعتبارسنجی خروجی"], context }),
  MARKETPLACE: (module, goal, context) => ({ artifactType: "MARKETPLACE_WORKFLOW", objective: goal, stages: ["تعریف عرضه و تقاضا", "اعتبارسنجی فهرست", "تطبیق مجاز", "ثبت نتیجه"], buyerSellerResponsibilitiesSeparated: true, paymentExecuted: false, context }),
  GOVERNANCE: (module, goal, context) => ({ artifactType: "GOVERNANCE_WORKFLOW", objective: goal, stages: ["تعریف سیاست", "تعیین مالک", "سطح اختیار", "تأیید انسانی", "ثبت ممیزی"], sensitiveActionsRequireApproval: true, context }),
  COMMUNICATION: (module, goal, context) => ({ artifactType: "COMMUNICATION_WORKFLOW", objective: goal, stages: ["تعیین مخاطب", "تهیه پیش‌نویس", "بازبینی لحن و صحت", "تأیید پیش از ارسال"], messageSent: false, context }),
  DISCOVERY: (module, goal, context) => ({ artifactType: "DISCOVERY_WORKFLOW", objective: goal, stages: ["تعیین پرسش", "تعریف منابع", "ارزیابی ارتباط", "ثبت یافته‌ها"], sourceVerificationRequired: true, context }),
  PLATFORM: (module, goal, context) => ({ artifactType: "PLATFORM_WORKFLOW", objective: goal, stages: ["نیازمندی", "وابستگی", "پیکربندی پیشنهادی", "کنترل سلامت", "گیت انتشار"], deploymentExecuted: false, context }),
  COMMERCE: (module, goal, context) => ({ artifactType: "COMMERCE_WORKFLOW", objective: goal, stages: ["تعریف کالا یا خدمت", "کنترل اطلاعات", "بررسی سفارش", "ثبت وضعیت"], paymentExecuted: false, context }),
  ECONOMY: (module, goal, context) => ({ artifactType: "ECONOMY_SIMULATION_WORKFLOW", objective: goal, stages: ["فرض‌های مالی", "مدل درآمد", "هزینه و ریسک", "تحلیل حساسیت"], simulationOnly: true, paymentExecuted: false, context }),
  TRUST: (module, goal, context) => ({ artifactType: "TRUST_AND_SAFETY_WORKFLOW", objective: goal, stages: ["اعتبار ورودی", "رضایت و حقوق", "ریسک", "محدودیت اقدام", "تصمیم قابل ممیزی"], unsafeActionDefault: "DENY", context }),
  RUNTIME: (module, goal, context) => ({ artifactType: "RUNTIME_WORKFLOW", objective: goal, stages: ["اعتبارسنجی درخواست", "کنترل دسترسی", "اجرای محلی", "ثبت نتیجه", "مدیریت خطا"], externalExecution: "NOT_CONNECTED", context }),
  ANALYTICS: (module, goal, context) => ({ artifactType: "ANALYTICS_WORKFLOW", objective: goal, stages: ["تعریف شاخص", "اعتبارسنجی داده", "محاسبه", "تفسیر", "گزارش"], sourceDataRequired: true, context }),
  SUPPORT: (module, goal, context) => ({ artifactType: "SUPPORT_TRIAGE_WORKFLOW", objective: goal, stages: ["ثبت درخواست", "دسته‌بندی", "اولویت‌بندی", "پیشنهاد پاسخ", "پیگیری"], responseSent: false, context }),
  AUDIT: (module, goal, context) => ({ artifactType: "AUDIT_EVIDENCE_WORKFLOW", objective: goal, stages: ["تعریف دامنه ممیزی", "جمع‌آوری شواهد", "یافتن مغایرت", "ثبت اصلاح", "بازبینی"], evidenceRequired: true, context }),
  GLOBAL_SUPER_APP: (module, goal, context) => ({ artifactType: "SUPER_APP_ORCHESTRATION_WORKFLOW", objective: goal, stages: ["انتخاب محصول و دامنه", "بررسی مالکیت قابلیت", "هماهنگی سرویس‌ها", "کنترل دسترسی", "ثبت نتیجه"], crossProductAccess: "SCOPED_AND_AUDITED", context }),
  GLOBAL_AI_SUPER_APP: (module, goal, context) => ({ artifactType: "AI_SUPER_APP_WORKFLOW", objective: goal, stages: ["فهم درخواست", "انتخاب ابزار مجاز", "تهیه خروجی", "بازبینی و تأیید", "ثبت سابقه"], externalActionsRequireConsent: true, context })
};

const domainWorkflowHandlers = {
  "workspace.orchestration": (module, goal, context) => ({ artifactType: "WORKSPACE_ACTION_PLAN", objective: goal, workstreams: ["تعریف هدف و دامنه", "اولویت‌بندی اقدام‌ها", "تعیین مسئول و موعد", "بازبینی نتیجه"], prioritySignals: ["اثر", "فوریت", "وابستگی", "ریسک"], context }),
  "learning.design": (module, goal, context) => ({ artifactType: "LEARNING_PATH_SPEC", learningGoal: goal, stages: ["ارزیابی نقطه شروع", "مسیر یادگیری", "تمرین هدایت‌شده", "سنجش و بازخورد"], assessmentRequired: true, context }),
  "trust.validation": (module, goal, context) => ({ artifactType: "TRUST_REVIEW", request: goal, checks: ["اعتبار ورودی", "مجوز و رضایت", "حدود دسترسی", "ریسک و نیاز به تأیید انسانی"], defaultDecision: "REQUIRE_APPROVAL_FOR_SENSITIVE_ACTIONS", context }),
  "creative.production_brief": (module, goal, context) => ({ artifactType: "CREATIVE_BRIEF", brief: goal, deliverables: ["شرح خلاقه", "جهت هنری", "مشخصات خروجی", "کنترل کیفیت"], rightsAndConsentCheck: "REQUIRED", providerRendering: "NOT_CONNECTED", context }),
  "media.production_brief": (module, goal, context) => ({ artifactType: "MEDIA_PRODUCTION_SPEC", brief: goal, stages: ["سناریو", "استوری‌بورد", "صدا و زیرنویس", "مشخصات رندر", "بازبینی"], mediaRendering: "NOT_CONNECTED", context }),
  "content.editorial": (module, goal, context) => ({ artifactType: "EDITORIAL_WORKFLOW", brief: goal, stages: ["طرح محتوا", "پیش‌نویس", "بازبینی factual", "ویرایش", "تقویم انتشار"], publication: "NOT_EXECUTED", context }),
  "knowledge.management": (module, goal, context) => ({ artifactType: "KNOWLEDGE_PACKAGE", request: goal, stages: ["ثبت منبع", "استخراج نکات", "خلاصه یا FAQ", "کنترل منبع", "ثبت نسخه"], sourceVerificationRequired: true, context }),
  "data.analysis": (module, goal, context) => ({ artifactType: "DATA_ANALYSIS_SPEC", objective: goal, stages: ["اعتبارسنجی داده", "پروفایل داده", "پاکسازی", "تحلیل", "گزارش"], sourceDataRequired: true, noDatasetProcessed: true, context }),
  "web.specification": (module, goal, context) => ({ artifactType: "WEB_BUILD_SPEC", objective: goal, stages: ["نیازمندی", "نقشه سایت", "مشخصات صفحه", "بازبینی موبایل و دسترس‌پذیری", "گیت انتشار"], deployment: "NOT_EXECUTED", context }),
  "automation.design": (module, goal, context) => ({ artifactType: "AUTOMATION_BLUEPRINT", objective: goal, stages: ["محرک", "گام‌ها", "شرط‌ها", "تأیید انسانی", "رسیدگی به خطا و پایش"], liveTriggers: "NOT_CONNECTED", context }),
  "business.strategy": (module, goal, context) => ({ artifactType: "BUSINESS_EXECUTION_BRIEF", objective: goal, stages: ["مسئله و مشتری", "ارزش پیشنهادی", "مدل درآمدی", "هزینه و ریسک", "آزمایش بازار"], financialExecution: "NOT_EXECUTED", context }),
  "personal.planning": (module, goal, context) => ({ artifactType: "PERSONAL_ACTION_PLAN", objective: goal, stages: ["روشن‌سازی هدف", "محدودیت‌ها و منابع", "گزینه‌های امن", "گام‌های کوچک", "بازبینی"], sensitiveAdviceGate: "REQUIRED_WHEN_APPLICABLE", context }),
  "community.operations": (module, goal, context) => ({ artifactType: "COMMUNITY_OPERATIONS_PLAN", objective: goal, stages: ["نیاز جامعه", "قواعد مشارکت", "مسیر عضویت یا فهرست", "اعتماد و رسیدگی", "سنجش نتیجه"], paymentsOrCustody: "NOT_EXECUTED", context })
};
const engineWorkflowHandlers = {
  PROBLEM_DOMAIN_ENGINE: (engine, goal) => ({ artifactType: "PROBLEM_RESOLUTION_PLAN", problemGoal: goal, operations: engine.operations, checks: ["تعریف مسئله", "بررسی گزینه‌ها", "تعیین مسئول", "اعتبارسنجی نتیجه"] }),
  HISTORICAL_CONTROL_ENGINE: (engine, goal) => ({ artifactType: "GOVERNANCE_CONTROL_PLAN", controlGoal: goal, operations: engine.operations, checks: ["دامنه اختیار", "سیاست دسترسی", "تأیید انسانی", "ثبت ممیزی"] }),
  NEW_IDEA_ENGINE: (engine, goal) => ({ artifactType: "IDEA_TO_PROTOTYPE_PLAN", ideaGoal: goal, operations: engine.operations, checks: ["اعتبارسنجی نیاز", "تعریف نمونه اولیه", "معیار پذیرش", "آزمون کاربر"] }),
  ARIA_DOMAIN_ENGINE: (engine, goal) => ({ artifactType: "DOMAIN_WORKFLOW_PLAN", domainGoal: goal, operations: engine.operations, checks: ["تعریف دامنه", "ورودی و خروجی", "وابستگی‌ها", "کیفیت و تحویل"] })
};

const overlayModuleIds = new Set(allModuleCatalog.map(item => item.moduleId));
if (engineSubmodules.some(engine => engine.parentModuleIds.length === 0 || engine.parentModuleIds.some(id => !overlayModuleIds.has(id) || !moduleCatalogById.has(id)))) {
  throw new Error("ARIA_ENGINE_SUBMODULE_HOST_MAPPING_INVALID");
}
const safeAutonomyActions = new Set(["draft", "summarize", "classify", "plan", "analyze_readonly"]);
let schemaReady = false;
let schemaPromise = null;

if (canonicalRegistry.count !== 639 || canonicalModules.length !== 639 || canonicalModuleById.size !== 639 || new Set(canonicalModules.map(x => x.canonicalId)).size !== 639 || canonicalModules.some(x => !canonicalFamilyHandlers[x.designFamily]) || commercialExecutionManifest.recordCount !== 72 || commercialExecutionManifest.records.length !== 72 || commercialExecutionById.size !== 72 || commercialExecutionManifest.records.some(x => !canonicalModuleById.has(x.parentCanonicalContractId) || !x.executionContract?.handlerKey || !domainWorkflowHandlers[x.executionContract.handlerKey] || !Array.isArray(x.executionContract.operations) || x.executionContract.operations.length === 0) || commercialRegistry.records.some(x => commercialExecutionById.get(x.commercialModuleId)?.catalogEntryId !== x.catalogEntryId || commercialExecutionById.get(x.commercialModuleId)?.parentCanonicalContractId !== x.parentCanonicalContractId) || engineSubmodules.some(x => !engineWorkflowHandlers[x.domain]) || commercialRegistry.records.length !== 72 || new Set(commercialRegistry.records.map(x => x.catalogEntryId)).size !== 72 || engineSubmodules.length !== 71 || new Set(engineSubmodules.map(x => x.moduleId)).size !== 71 || moduleInventory.totalModuleAndSubmoduleRecords !== 932 || moduleInventory.ariaOwnedModuleAndSubmoduleRecords !== 893 || replacementModuleRuntime.REGISTRY.records.length !== 39 || new Set(replacementModuleRuntime.REGISTRY.records.map(x => x.moduleId)).size !== 39 || registry.baselineCanonicalModuleCount !== 639 || registry.problems.length !== 50 ||
    registry.domains.length !== 5 || registry.candidates.length !== 4 ||
    registry.revenueModels.length !== 20 || new Set(registry.problems.map(x => x.id)).size !== 50 ||
    allModuleCatalog.length !== 111 || new Set(allModuleCatalog.map(x => x.moduleId)).size !== 111 ||
    allModuleCatalog.filter(x => x.moduleType === "HISTORICAL_PROBLEM_MODULE").length !== 50 ||
    allModuleCatalog.filter(x => x.moduleType === "NEW_IDEA_PRODUCT_MODULE").length !== 50 ||
    allModuleCatalog.filter(x => x.moduleType === "CONTROL_AND_GOVERNANCE_MODULE").length !== 4 ||
    allModuleCatalog.filter(x => x.moduleType === "MERGED_LEGACY_APP_DOMAIN_MODULE").length !== 7 ||
    moduleCatalog.length !== 72 || publicProblemRecords.length !== 39 || problemEngines.length !== 38 ||
    moduleCatalog.filter(x => x.moduleType === "NEW_IDEA_PRODUCT_MODULE").length !== 25 ||
    moduleCatalog.filter(x => x.moduleType === "CONTROL_AND_GOVERNANCE_MODULE").length !== 4 ||
    moduleCatalog.filter(x => x.moduleType === "MERGED_LEGACY_APP_DOMAIN_MODULE").length !== 4 ||
    publicDomainPacks.length !== 4 || candidateEngines.length !== 4 ||
    ownership.canonicalBaseline !== 639 || ownership.archivedOverlayTotal !== 111 ||
    ownership.publicAriaOverlayTarget !== 72 || transferredIds.size !== 36 || ownership.sharedAriaModuleIds.length !== 2 ||
    moduleRegistry.moduleCatalogSummary?.canonicalBaseline !== 639 || moduleRegistry.moduleCatalogSummary?.canonicalBaselineChanged !== false) {
  throw new Error("ARIA_PRODUCT_OWNERSHIP_MIGRATION_INVALID");
}
if (registry.problems.find(x => x.sourceProblemNumber === 48)?.aliasOf !== "problem-29") {
  throw new Error("ARIA_PET_CARE_ALIAS_INVALID");
}

async function ensureTables(pool) {
  if (schemaReady) return;
  if (!schemaPromise) schemaPromise = (async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS aria_expansion_work_items (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES aria_users(id) ON DELETE CASCADE,
      module_id TEXT NOT NULL,
      title TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'planned',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    await pool.query("CREATE INDEX IF NOT EXISTS aria_expansion_work_items_user_idx ON aria_expansion_work_items(user_id, updated_at DESC)");
    await pool.query(`CREATE TABLE IF NOT EXISTS aria_expansion_intents (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES aria_users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      contact_consent BOOLEAN NOT NULL DEFAULT FALSE,
      status TEXT NOT NULL DEFAULT 'open',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    await pool.query("CREATE INDEX IF NOT EXISTS aria_expansion_intents_user_idx ON aria_expansion_intents(user_id, created_at DESC)");
    await pool.query(`CREATE TABLE IF NOT EXISTS aria_autonomy_policies (
      id BIGSERIAL PRIMARY KEY,
      agent_id TEXT NOT NULL,
      action TEXT NOT NULL,
      decision TEXT NOT NULL CHECK (decision IN ('ALLOW','REQUIRE_APPROVAL','DENY')),
      created_by BIGINT NOT NULL REFERENCES aria_users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(agent_id, action)
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS aria_expansion_providers (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES aria_users(id) ON DELETE CASCADE,
      display_name TEXT NOT NULL,
      category TEXT NOT NULL,
      service_area TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      contact_visible BOOLEAN NOT NULL DEFAULT FALSE,
      verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending','verified','rejected')),
      verified_by BIGINT REFERENCES aria_users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    await pool.query("CREATE INDEX IF NOT EXISTS aria_expansion_providers_match_idx ON aria_expansion_providers(category, verification_status, contact_visible)");
    await pool.query(`CREATE TABLE IF NOT EXISTS aria_service_cases (
      id UUID PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES aria_users(id) ON DELETE CASCADE,
      tenant_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      status TEXT NOT NULL,
      payload JSONB NOT NULL,
      quote JSONB,
      quality JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    await pool.query("CREATE INDEX IF NOT EXISTS aria_service_cases_tenant_updated_idx ON aria_service_cases(user_id, tenant_id, updated_at DESC)");
    await pool.query(`CREATE TABLE IF NOT EXISTS aria_modular_work_items (
      id UUID PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES aria_users(id) ON DELETE CASCADE,
      tenant_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      idempotency_key TEXT NOT NULL,
      input_digest TEXT NOT NULL,
      result JSONB NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, tenant_id, module_id, idempotency_key)
    )`);
    await pool.query("CREATE INDEX IF NOT EXISTS aria_modular_work_items_user_idx ON aria_modular_work_items(user_id, tenant_id, created_at DESC)");
    schemaReady = true;
  })().catch(err => { schemaPromise = null; schemaReady = false; throw err; });
  return schemaPromise;
}

function cleanText(value, min, max) {
  if (typeof value !== "string") return null;
  const result = value.replace(/[<>]/g, "").trim();
  return result.length >= min && result.length <= max ? result : null;
}
function requireUser(req, json, res, authUser) {
  const user = authUser(req);
  if (!user) json(res, 401, { error: "برای این عملیات باید وارد حساب شوید." });
  return user;
}
function modulePlan(module, goal) {
  const steps = [
    { step: 1, title: "تعریف نیاز و قیود", tasks: [module.problem, "هدف، بودجه یا محدودیت زمانی و اطلاعات مجاز را مشخص کنید."], checkpoint: "نیاز و معیار موفقیت روشن و قابل بررسی باشد." },
    { step: 2, title: "ساخت مسیر اقدام", tasks: [module.capability, module.deliverable, "مسئول، زمان‌بندی و وابستگی‌های لازم را تعیین کنید."], checkpoint: "خروجی و مسئول هر اقدام مشخص باشد." },
    { step: 3, title: "بررسی کیفیت و اعتماد", tasks: ["منبع اطلاعات و صلاحیت ارائه‌دهنده را بررسی کنید.", "هزینه، حریم خصوصی، رضایت و شرایط لغو را مرور کنید."], checkpoint: "ریسک‌ها و اطلاعات تأییدنشده آشکار باشند." },
    { step: 4, title: "ثبت نتیجه و پیگیری", tasks: ["نتیجه را ثبت و با معیار اولیه مقایسه کنید.", "در صورت نیاز برنامه را اصلاح یا متوقف کنید."], checkpoint: "نتیجه و گام بعدی قابل پیگیری باشد." }
  ];
  return {
    planId: "aria-expansion-" + module.id + "-" + Date.now().toString(36),
    moduleId: module.moduleId || module.id, sourceProblemNumber: module.sourceProblemNumber,
    parentModuleId: module.parentModuleId, hostCanonicalContractId: module.hostCanonicalContractId || null,
    entryPointCanonicalContractId: module.entryPointCanonicalContractId || null, engine: module.engine,
    goal, steps, executionStatus: "LOCAL_PLAN_CREATED",
    externalExecution: { status: "NOT_CONNECTED", executed: false },
    revenueState: "DESIGNED_NOT_MONETIZED",
    disclaimer: "این خروجی برنامه‌ریزی محلی است؛ رزرو، پرداخت، تماس با ارائه‌دهنده یا اقدام بیرونی انجام نشده است.",
    createdAt: new Date().toISOString()
  };
}

function buildCommercialOperationPlan(module, goal, context) {
  const contract = module.executionContract;
  return {
    moduleId: "ARIA-COMMERCIAL-MODULE-" + module.catalogEntryId,
    commercialModuleId: module.commercialModuleId,
    handlerKey: contract.handlerKey,
    goal,
    context: context || {},
    domainArtifact: domainWorkflowHandlers[contract.handlerKey](module, goal, context || {}),
    executionSpec: unifiedExecutionById.get(module.commercialModuleId) || null,
    operations: contract.operations.map((operation, index) => ({ sequence: index + 1, operation, state: "READY_FOR_LOCAL_WORK_ITEM" })),
    acceptanceChecks: [
      "ورودی و هدف با قرارداد ماژول تطبیق داده شود.",
      "حقوق محتوا، رضایت، حریم خصوصی و مجوزهای لازم بررسی شود.",
      "خروجی قبل از هر اقدام بیرونی بازبینی و تأیید شود.",
      "نتیجه و خطاها در سابقه کار ثبت شوند."
    ],
    executionBoundary: contract.executionBoundary,
    providerState: contract.providerState,
    executionStatus: "LOCAL_WORK_ITEM_ONLY",
    externalExecutionPerformed: false,
    productionVerified: false
  };
}

function buildCanonicalOperationPlan(module, goal, context) {
  return {
    canonicalModuleId: module.canonicalId,
    moduleName: module.name,
    workflowEntry: module.workflowEntry,
    execution: module.execution,
    implementationState: module.implementationState,
    domainArtifact: canonicalFamilyHandlers[module.designFamily](module, goal, context || {}),
    executionSpec: unifiedExecutionById.get("ARIA-CANONICAL-MODULE-" + String(module.canonicalId).padStart(3, "0")) || null,
    goal,
    context: context || {},
    executionStatus: "LOCAL_WORK_ITEM_ONLY",
    externalExecutionPerformed: false,
    productionVerified: false,
    acceptanceChecks: [
      "ورودی با قرارداد canonical تطبیق داده شود.",
      "سیاست دسترسی و تأیید انسانی مربوط اعمال شود.",
      "خروجی با معیار پذیرش همان قرارداد بازبینی شود.",
      "نتیجه در سابقه کاربر ثبت شود."
    ]
  };
}

function simulateRevenue(model, assumptions) {
  const input = assumptions && typeof assumptions === "object" && !Array.isArray(assumptions) ? assumptions : {};
  const required = model.calculation.requiredInputs;
  for (const key of required) {
    const value = input[key];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1e12) return { error: "ورودی عددی معتبر برای " + key + " الزامی است." };
    if ((key === "conversionRate" || key === "commissionRate" || key === "royaltyRate") && value > 1) return { error: "نرخ‌ها باید بین صفر و یک باشند." };
  }
  for (const key of ["fixedCosts","variableCosts"]) {
    if (input[key] !== undefined && (typeof input[key] !== "number" || !Number.isFinite(input[key]) || input[key] < 0 || input[key] > 1e12)) return { error: "هزینه‌ها باید عددی و غیرمنفی باشند." };
  }
  const a=input; let gross=0;
  switch(model.sourceNumber){
    case 1: gross=a.activeSubscribers*a.monthlyPrice; break;
    case 2: gross=a.freeUsers*a.conversionRate*a.monthlyPrice; break;
    case 3: gross=a.grossMerchandiseValue*a.commissionRate; break;
    case 4: gross=a.orders*a.averageOrderValue; break;
    case 5: gross=a.unitsSold*a.sellingPrice; break;
    case 6: gross=a.wholesaleUnits*a.wholesalePrice; break;
    case 7: gross=a.franchisees*a.monthlyFranchiseFee+a.royaltyBase*a.royaltyRate; break;
    case 8: gross=a.activeLicenses*a.licenseFee; break;
    case 9: gross=a.clicks*a.conversionRate*a.commissionPerConversion; break;
    case 10: gross=a.impressions/1000*a.cpm; break;
    case 11: gross=a.unitsSold*a.retailPrice; break;
    case 12: gross=a.distributionVolume*a.marginPerUnit; break;
    case 13: gross=a.completedJobs*a.platformFeePerJob; break;
    case 14: gross=a.usageUnits*a.pricePerUnit; break;
    case 15: gross=a.leasedAssets*a.monthlyLeasePrice*a.months; break;
    case 16: gross=a.productsSold*a.pricePerProduct; break;
    case 17: gross=a.billableHours*a.hourlyRate; break;
    case 18: gross=a.platformTransactions*a.platformFeePerTransaction; break;
    case 19: gross=a.reportLicenses*a.pricePerReport; break;
    case 20: gross=a.payingMembers*a.monthlyMembershipFee; break;
    default: return { error: "فرمول این مدل درآمدی تعریف نشده است." };
  }
  const fixedCosts=input.fixedCosts||0, variableCosts=input.variableCosts||0;
  const round=x=>Math.round((x+Number.EPSILON)*100)/100;
  return { modelId:model.id, modelName:model.name, state:"SIMULATED_NOT_ACTUAL", grossRevenueEstimate:round(gross), fixedCosts:round(fixedCosts), variableCosts:round(variableCosts), netContributionEstimate:round(gross-fixedCosts-variableCosts), currency:null, taxesIncluded:false, paymentExecuted:false, disclaimer:"این فقط شبیه‌سازی بر اساس فرض‌های واردشده است؛ درآمد واقعی، سود قطعی، مالیات، بازپرداخت، کارمزد پرداخت و هزینه‌های اعلام‌نشده را اثبات نمی‌کند." };
}

async function handle(req, res, url, deps) {
  const { json, readJson, authUser, requireDb, pool } = deps;
  const p = url.pathname;
  if (p === "/api/aria-expansion/summary" && req.method === "GET") {
    return json(res, 200, {
      product: "ARIA", canonicalModuleCount: canonicalModules.length, canonicalCountChanged: false, moduleInventory, totalModuleInventory: moduleInventory.totalModuleAndSubmoduleRecords, commercialCatalogModules: commercialModules.length, engineSubmodules: engineSubmodules.length, localWorkflowLaunchers: canonicalModules.length + moduleCatalog.length + commercialModules.length + engineSubmodules.length + replacementModuleRuntime.REGISTRY.records.length, ariaOwnedModuleCount: moduleInventory.ariaOwnedModuleAndSubmoduleRecords, additionalAriaModules: replacementModuleRuntime.REGISTRY.records.length, lineageOnlyHistoricalRecords: allModuleCatalog.length - moduleCatalog.length,
      parentDomains: registry.domains.length, problemRecords: publicProblemRecords.length,
      historicalProblemModules: publicProblemRecords.length, ideaModules: 25, controlModules: 4, legacyAppModules: 4, totalModules: moduleCatalog.length,
      historicalOverlayModules: allModuleCatalog.length, transferredModules: transferredIds.size, archivedDomainPackages: archivedDomainIds.size, sharedAriaServices: ownership.sharedAriaModuleIds.length,
      uniqueProblemCapabilities: publicProblemRecords.length - 1,
      historicalCandidates: registry.candidates.length, engines: engineCatalog.length, ideaEngines: ideaEngines.length, legacyDomainEngines: legacyDomainEngines.length, revenueModels: registry.revenueModels.length,
      liveRevenueEnabled: false, externalExecutionEnabled: false,
      source: "docs/ARIA_TWO_IMAGES_50_PROBLEMS_20_REVENUE_MODELS_FA.md",
      notes: ["مسئله ۴۸ به قابلیت مراقبت حیوان خانگی مسئله ۲۹ متصل است و موتور جداگانه نمی‌سازد.", "۵۰ مسئله در پنج حوزه ثبت شده‌اند؛ canonical ID جدید فقط پس از crosswalk و اثبات استقلال تخصیص می‌یابد.", "۲۰ مدل درآمدی تعریف شده‌اند اما پرداخت و درآمد زنده فعال نیست."]
    });
  }
  if (p === "/api/aria-expansion/modules" && req.method === "GET") {
    const moduleBySource = new Map(moduleCatalog.filter(x => x.sourceProblemId).map(x => [x.sourceProblemId, x]));
    return json(res, 200, { parents: registry.domains, problems: publicProblemRecords.map(x => ({ ...x, moduleId: moduleBySource.get(x.id)?.moduleId, parentDomain: x.parentModuleId })), modules: moduleCatalog, mergedDomainPacks: publicDomainPacks, familyArchitecture: publicFamilyArchitecture, totalProblemRecords: publicProblemRecords.length, historicalProblemModules: publicProblemRecords.length, ideaModules: 25, controlModules: 4, legacyAppModules: publicDomainPacks.length, totalModules: moduleCatalog.length, historicalOverlayModules: allModuleCatalog.length, transferredModules: transferredIds.size, archivedDomainPackages: archivedDomainIds.size, sharedAriaServices: ownership.sharedAriaModuleIds.length, uniqueProblemCapabilities: 38, canonicalModuleCount: 639, canonicalCountChanged: false });
  }
  if (p === "/api/aria-expansion/inventory" && req.method === "GET") {
    return json(res, 200, {
      schemaVersion: "1.0.0",
      product: "ARIA",
      moduleInventory,
      canonicalRegistry: { count: 639, source: "docs/aria/ARIA_639_CANONICAL_MODULES_COMPACT_2026-11-19.csv", immutable: true },
      preservedHistoricalOverlay: allModuleCatalog,
      additionalAriaModules: replacementModuleRuntime.REGISTRY.records,
      commercialModules,
      engineSubmodules,
      transferredModuleIds: [...transferredIds].sort(),
      publicAriaModuleIds: moduleCatalog.map(x => x.moduleId).sort(),
      note: moduleInventory.countingRule
    });
  }
  if (p === "/api/aria-expansion/execution-registry" && req.method === "GET") {
    return json(res, 200, {
      product: "ARIA",
      total: unifiedExecutionRegistry.total,
      activeLocalWorkflowCount: unifiedExecutionRegistry.activeLocalWorkflowCount,
      lineageOnlyCount: unifiedExecutionRegistry.lineageOnlyCount,
      productionVerifiedCount: unifiedExecutionRegistry.productionVerifiedCount,
      counts: unifiedExecutionRegistry.counts,
      records: unifiedExecutionRegistry.records
    });
  }
  const executionSpecMatch = p.match(/^\/api\/aria-expansion\/execution-registry\/([^/]+)$/);
  if (executionSpecMatch && req.method === "GET") {
    const key = decodeURIComponent(executionSpecMatch[1]);
    const record = unifiedExecutionById.get(key) || unifiedExecutionByLaunchId.get(key);
    if (!record) return json(res, 404, { error: "قرارداد اجرایی پیدا نشد." });
    return json(res, 200, { product: "ARIA", record });
  }
  if (p === "/api/aria-expansion/canonical-modules" && req.method === "GET") {
    return json(res, 200, { product: "ARIA", total: canonicalModules.length, immutable: true, modules: canonicalModules });
  }
  if (p === "/api/aria-expansion/additional-modules" && req.method === "GET") {
    return json(res, 200, { product: "ARIA", total: replacementModuleRuntime.REGISTRY.records.length, modules: replacementModuleRuntime.REGISTRY.records, externalExecutionEnabled: false, paymentExecuted: false, productionVerified: false });
  }
  if (p === "/api/aria-expansion/commercial-modules" && req.method === "GET") {
    return json(res, 200, { product: "ARIA", total: commercialExecutionManifest.records.length, domainProfiles: commercialExecutionManifest.domainProfiles, modules: commercialExecutionManifest.records });
  }
  const canonicalRunMatch = p.match(/^\/api\/aria-expansion\/canonical-modules\/(\d+)\/run$/);
  if (canonicalRunMatch && req.method === "POST") {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    const module = canonicalModuleById.get(Number(canonicalRunMatch[1]));
    if (!module) return json(res, 404, { error: "قرارداد canonical پیدا نشد." });
    const data = await readJson(req, res); if (data === null) return true;
    const goal = cleanText(data.goal, 4, 1200);
    if (!goal) return json(res, 400, { error: "هدف باید بین ۴ تا ۱۲۰۰ نویسه باشد." });
    const context = data.context && typeof data.context === "object" && !Array.isArray(data.context) ? data.context : {};
    let details; try { details = JSON.stringify(buildCanonicalOperationPlan(module, goal, context)); } catch { return json(res, 400, { error: "زمینه ورودی معتبر نیست." }); }
    if (details.length > 12000) return json(res, 400, { error: "زمینه ورودی بیش از حد مجاز است." });
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      const q = await pool.query("INSERT INTO aria_expansion_work_items(user_id,module_id,title,details) VALUES($1,$2,$3,$4) RETURNING id,module_id,title,status,created_at", [user.sub, "ARIA-CANONICAL-" + module.canonicalId, module.name + " — " + goal.slice(0, 100), details]);
      return json(res, 201, { item: { ...q.rows[0], id: String(q.rows[0].id) }, executionStatus: "LOCAL_WORK_ITEM_CREATED", externalExecutionPerformed: false, productionVerified: false });
    } catch (err) { console.error("ARIA canonical work item failed:", err.message); return json(res, 500, { error: "ثبت گردش‌کار canonical انجام نشد." }); }
  }
  const commercialRunMatch = p.match(/^\/api\/aria-expansion\/commercial-modules\/([a-z0-9-]+)\/run$/);
  if (commercialRunMatch && req.method === "POST") {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    const module = commercialExecutionById.get(commercialRunMatch[1]);
    if (!module) return json(res, 404, { error: "ماژول تجاری پیدا نشد." });
    const data = await readJson(req, res); if (data === null) return true;
    const goal = cleanText(data.goal, 4, 1200);
    if (!goal) return json(res, 400, { error: "هدف باید بین ۴ تا ۱۲۰۰ نویسه باشد." });
    const context = data.context && typeof data.context === "object" && !Array.isArray(data.context) ? data.context : {};
    let details; try { details = JSON.stringify(buildCommercialOperationPlan(module, goal, context)); } catch { return json(res, 400, { error: "زمینه ورودی معتبر نیست." }); }
    if (details.length > 12000) return json(res, 400, { error: "زمینه ورودی بیش از حد مجاز است." });
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      const moduleId = "ARIA-COMMERCIAL-MODULE-" + module.catalogEntryId;
      const q = await pool.query("INSERT INTO aria_expansion_work_items(user_id,module_id,title,details) VALUES($1,$2,$3,$4) RETURNING id,module_id,title,status,created_at", [user.sub, moduleId, module.name + " — " + goal.slice(0, 100), details]);
      return json(res, 201, { item: { ...q.rows[0], id: String(q.rows[0].id) }, handlerKey: module.executionContract.handlerKey, executionStatus: "LOCAL_WORK_ITEM_CREATED", providerState: module.executionContract.providerState, externalExecutionPerformed: false, productionVerified: false });
    } catch (err) { console.error("ARIA commercial work item failed:", err.message); return json(res, 500, { error: "ثبت گردش‌کار تجاری انجام نشد." }); }
  }
  const engineRunMatch = p.match(/^\/api\/aria-expansion\/engines\/([^/]+)\/run$/);
  if (engineRunMatch && req.method === "POST") {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    const engineId = decodeURIComponent(engineRunMatch[1]);
    const engine = engineSubmodules.find(x => x.engineId === engineId);
    if (!engine) return json(res, 404, { error: "زیرماژول موتور پیدا نشد." });
    const data = await readJson(req, res); if (data === null) return true;
    const goal = cleanText(data.goal, 4, 1200);
    if (!goal) return json(res, 400, { error: "هدف باید بین ۴ تا ۱۲۰۰ نویسه باشد." });
    const engineHandler = engineWorkflowHandlers[engine.domain];
    if (!engineHandler) return json(res, 409, { error: "برای این موتور، handler اجرایی ثبت نشده است." });
    const details = JSON.stringify({ engineSubmoduleId: engine.moduleId, engineId: engine.engineId, parentModuleIds: engine.parentModuleIds, operations: engine.operations, inputContract: engine.inputContract, outputContract: engine.outputContract, executionSpec: unifiedExecutionById.get(engine.moduleId) || null, domainArtifact: engineHandler(engine, goal), goal, executionStatus: "LOCAL_ENGINE_WORK_ITEM_ONLY", externalExecutionPerformed: false, productionVerified: false });
    if (details.length > 12000) return json(res, 400, { error: "جزئیات ورودی بیش از حد مجاز است." });
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      const parentModuleId = engine.parentModuleIds[0];
      const q = await pool.query("INSERT INTO aria_expansion_work_items(user_id,module_id,title,details) VALUES($1,$2,$3,$4) RETURNING id,module_id,title,status,created_at", [user.sub, parentModuleId, engine.name + " — " + goal.slice(0, 100), details]);
      return json(res, 201, { item: { ...q.rows[0], id: String(q.rows[0].id) }, engineSubmoduleId: engine.moduleId, parentModuleIds: engine.parentModuleIds, executionStatus: "LOCAL_WORK_ITEM_CREATED", externalExecutionPerformed: false, productionVerified: false });
    } catch (err) { console.error("ARIA engine work item failed:", err.message); return json(res, 500, { error: "ثبت گردش‌کار موتور انجام نشد." }); }
  }
  const replacementRunMatch = p.match(/^\/api\/aria-expansion\/replacement-modules\/(ARIA-OWNED-ADDITIONAL-\d{3})\/run$/);
  if (replacementRunMatch && req.method === "POST") {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    const data = await readJson(req, res); if (data === null) return true;
    const tenantId = String(user.sub);
    let result;
    try { result = replacementModuleRuntime.executeReplacementModule(replacementRunMatch[1], data, { actorId: String(user.sub), tenantId }); }
    catch (err) {
      if (["MODULE_TENANT_REQUIRED","MODULE_ACTOR_REQUIRED","MODULE_INPUT_INVALID","MODULE_INPUT_MISSING"].includes(err.message)) return json(res, 400, { error: err.message });
      if (err.message === "ARIA_REPLACEMENT_MODULE_NOT_FOUND") return json(res, 404, { error: err.message });
      return json(res, 500, { error: "اجرای گردش‌کار محلی ماژول انجام نشد." });
    }
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      const details = JSON.stringify(result);
      const q = await pool.query("INSERT INTO aria_expansion_work_items(user_id,module_id,title,details) VALUES($1,$2,$3,$4) RETURNING id,module_id,title,status,created_at", [user.sub, result.moduleId, result.moduleName + " — " + data.goal.slice(0, 100), details]);
      return json(res, 201, { item: { ...q.rows[0], id: String(q.rows[0].id) }, executionState: "LOCAL_WORK_ITEM_CREATED", externalExecutionPerformed: false, paymentExecuted: false, productionVerified: false });
    } catch (err) {
      console.error("ARIA additional ARIA module persistence failed:", err.message);
      return json(res, 500, { error: "ذخیره گردش‌کار ماژول انجام نشد." });
    }
  }
  const overlayRunMatch = p.match(/^\/api\/aria-expansion\/modules\/(ARIA-(?:PROBLEM|IDEA|CONTROL|LEGACY-APP)-MODULE-\d{3})\/run$/);
  if (overlayRunMatch && req.method === "POST") {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    const module = moduleCatalogById.get(overlayRunMatch[1]);
    if (!module) return json(res, 404, { error: "ماژول فعال ARIA پیدا نشد؛ ممکن است سابقه منتقل‌شده یا بایگانی باشد." });
    const data = await readJson(req, res); if (data === null) return true;
    const goal = cleanText(data.goal, 4, 1200);
    if (!goal) return json(res, 400, { error: "هدف باید بین ۴ تا ۱۲۰۰ نویسه باشد." });
    const details = JSON.stringify({ moduleId: module.moduleId, moduleType: module.moduleType, executionSpec: unifiedExecutionById.get(module.moduleId) || null, ownerProduct: "ARIA", ownerDomain: module.legacyAppName || module.parentDomainName || module.domainPackId || "ARIA_GENERAL", engineId: module.engineId || null, inputContract: module.inputContract, outputContract: module.outputContract, workflow: module.workflow, acceptanceCriteria: module.acceptanceCriteria, goal, executionStatus: "LOCAL_MODULE_WORK_ITEM_ONLY", externalExecutionPerformed: false, productionVerified: false });
    if (details.length > 12000) return json(res, 400, { error: "جزئیات ورودی بیش از حد مجاز است." });
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      const q = await pool.query("INSERT INTO aria_expansion_work_items(user_id,module_id,title,details) VALUES($1,$2,$3,$4) RETURNING id,module_id,title,status,created_at", [user.sub, module.moduleId, module.name + " — " + goal.slice(0, 100), details]);
      return json(res, 201, { item: { ...q.rows[0], id: String(q.rows[0].id) }, executionStatus: "LOCAL_WORK_ITEM_CREATED", externalExecutionPerformed: false, productionVerified: false });
    } catch (err) { console.error("ARIA overlay work item failed:", err.message); return json(res, 500, { error: "ثبت گردش‌کار ماژول انجام نشد." }); }
  }
  if (p === "/api/aria-expansion/capability-matrix" && req.method === "GET") {
    const byType = Object.fromEntries(
      ["HISTORICAL_PROBLEM_MODULE", "NEW_IDEA_PRODUCT_MODULE", "CONTROL_AND_GOVERNANCE_MODULE", "MERGED_LEGACY_APP_DOMAIN_MODULE"]
        .map(type => [type, moduleCatalog.filter(item => item.moduleType === type).length])
    );
    const productionVerified = moduleCatalog.filter(item => item.productionStatus === "PRODUCTION_VERIFIED").length;
    const runtimeVerified = moduleCatalog.filter(item => ["RUNTIME_VERIFIED", "E2E_VERIFIED", "PRODUCTION_ENABLED"].includes(item.implementationStatus)).length;
    const modules = moduleCatalog.map(item => ({
      moduleId: item.moduleId,
      name: item.name,
      moduleType: item.moduleType,
      ownerProduct: "ARIA",
      ownerDomain: item.legacyAppName || item.parentDomainName || item.parentDomainId || item.domainPackId || "ARIA_GENERAL",
      engineId: item.engineId || null,
      inputContract: item.inputContract,
      outputContract: item.outputContract,
      workflow: item.workflow,
      accessPolicy: item.accessPolicy,
      acceptanceCriteria: item.acceptanceCriteria,
      canonicalMappingStatus: item.mappingStatus || "PENDING_CANONICAL_MAPPING",
      hostCanonicalContractId: item.hostCanonicalContractId || null,
      entryPointCanonicalContractId: item.entryPointCanonicalContractId || null,
      implementationStatus: item.implementationStatus,
      productionStatus: item.productionStatus,
      executionMode: "LOCAL_PLAN_ONLY",
      externalAdapterState: "NOT_CONNECTED",
      sourcePreservation: item.sourcePreservation
    }));
    return json(res, 200, {
      schemaVersion: "1.1.0",
      product: "ARIA",
      moduleInventory,
      commercialModules,
      engineSubmodules,
      additionalAriaModules: replacementModuleRuntime.REGISTRY.records,
      canonicalBaseline: 639,
      ariaOwnedModuleAndSubmoduleRecords: moduleInventory.ariaOwnedModuleAndSubmoduleRecords,
      additionalAriaModuleCount: replacementModuleRuntime.REGISTRY.records.length,
      unifiedInventoryRecords: unifiedExecutionRegistry.total,
      activeLocalWorkflowUnits: unifiedExecutionRegistry.activeLocalWorkflowCount,
      lineageOnlyUnits: unifiedExecutionRegistry.lineageOnlyCount,
      canonicalBaselineChanged: false,
      preservedHistoricalOverlay: allModuleCatalog.length,
      publicCatalog: {
        total: moduleCatalog.length,
        byType,
        localPlanAvailable: moduleCatalog.length,
        runtimeVerified,
        productionVerified,
        notProductionVerified: moduleCatalog.length - productionVerified
      },
      engines: {
        total: engineCatalog.length,
        problem: problemEngines.length,
        controls: candidateEngines.length,
        ideas: ideaEngines.length,
        internalDomains: legacyDomainEngines.length
      },
      transferredModuleIds: [...transferredIds].sort(),
      sharedAriaModuleIds: [...ownership.sharedAriaModuleIds],
      externalExecutionEnabled: false,
      liveRevenueEnabled: false,
      modules
    });
  }
  if (p === "/api/aria-expansion/engines" && req.method === "GET") {
    return json(res, 200, { engines: engineCatalog, engineSubmodules, total: engineCatalog.length, engineSubmoduleCount: engineSubmodules.length, problemEngines: problemEngines.length, candidateEngines: candidateEngines.length, ideaEngines: ideaEngines.length, legacyDomainEngines: legacyDomainEngines.length, canonicalModuleCount: 639, moduleInventory });
  }
  if (p === "/api/aria-expansion/candidates" && req.method === "GET") {
    return json(res, 200, { candidates: registry.candidates, total: 4, canonicalModuleCount: 639 });
  }
  if (p === "/api/aria-expansion/revenue-models/simulate-batch" && req.method === "POST") {
    const data = await readJson(req, res); if (data === null) return true;
    if (!Array.isArray(data.items) || data.items.length < 1 || data.items.length > 20) return json(res, 400, { error: "بین ۱ تا ۲۰ شبیه‌سازی لازم است." });
    const results = [];
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i] || {};
      const model = registry.revenueModels.find(x => x.id === cleanText(item.modelId, 1, 80));
      if (!model) return json(res, 404, { error: "مدل درآمدی در ردیف " + (i + 1) + " پیدا نشد." });
      const result = simulateRevenue(model, item.assumptions);
      if (result.error) return json(res, 400, { error: "ردیف " + (i + 1) + ": " + result.error });
      results.push(result);
    }
    return json(res, 200, { simulations: results, total: results.length, state: "SIMULATION_ONLY", paymentExecuted: false });
  }
  if (p === "/api/aria-expansion/revenue-models/simulate" && req.method === "POST") {
    const data = await readJson(req, res); if (data === null) return true;
    const modelId = cleanText(data.modelId, 1, 80);
    const model = registry.revenueModels.find(x => x.id === modelId);
    if (!model) return json(res, 404, { error: "مدل درآمدی پیدا نشد." });
    const result = simulateRevenue(model, data.assumptions);
    if (result.error) return json(res, 400, { error: result.error });
    return json(res, 200, { simulation: result });
  }
  if (p === "/api/aria-expansion/revenue-models" && req.method === "GET") {
    return json(res, 200, { models: registry.revenueModels, total: 20, state: "DESIGNED_NOT_MONETIZED", paymentProviderState: "NOT_CONNECTED", liveRevenueEnabled: false });
  }
  const planMatch = p.match(/^\/api\/aria-expansion\/modules\/(problem-\d{2}|ARIA-(?:PROBLEM|IDEA|CONTROL|LEGACY-APP)-MODULE-\d{3})\/plan$/);
  if (planMatch && req.method === "POST") {
    const legacyModule = problemById.get(planMatch[1]);
    const catalogModule = moduleCatalogById.get(planMatch[1]);
    const source = legacyModule || catalogModule;
    if (!source) return json(res, 404, { error: "ماژول پیدا نشد." });
    const data = await readJson(req, res); if (data === null) return true;
    const goal = cleanText(data.goal, 4, 1200);
    if (!goal) return json(res, 400, { error: "هدف باید بین ۴ تا ۱۲۰۰ نویسه باشد." });
    const module = legacyModule ? source : { ...source, id: source.moduleId, problem: source.sourceTitle || source.purpose, capability: source.name, deliverable: source.deliverable || source.purpose, parentModuleId: source.parentDomainId || source.domainPackId || source.legacyAppName || "aria-control-governance", engine: { id: source.engineId || source.moduleId, name: source.engineId || source.name }, sourceProblemNumber: source.sourceProblemNumber };
    return json(res, 200, { ok: true, plan: modulePlan(module, goal) });
  }
  if (p === "/api/aria-expansion/scenarios/simulate" && req.method === "POST") {
    const data = await readJson(req, res); if (data === null) return true;
    if (!Array.isArray(data.scenarios) || data.scenarios.length < 2 || data.scenarios.length > 10) return json(res, 400, { error: "بین ۲ تا ۱۰ سناریو لازم است." });
    const scenarios = data.scenarios.map((x, i) => ({ name: cleanText(x?.name, 1, 80), value: x?.value }));
    if (scenarios.some(x => !x.name || typeof x.value !== "number" || !Number.isFinite(x.value) || Math.abs(x.value) > 1e9)) return json(res, 400, { error: "نام و مقدار عددی محدود برای همه سناریوها الزامی است." });
    const values = scenarios.map(x => x.value), mean = values.reduce((a, b) => a + b, 0) / values.length;
    return json(res, 200, { results: scenarios, comparison: { min: Math.min(...values), max: Math.max(...values), mean }, assumptions: cleanText(data.assumptions || "", 0, 1000) || "", disclaimer: "این مقایسه فقط محاسبه روی ورودی‌های کاربر است؛ پیش‌بینی قطعی یا توصیه مالی نیست.", liveActionExecuted: false });
  }
  if (p === "/api/aria-expansion/autonomy/authorize" && req.method === "POST") {
    const data = await readJson(req, res); if (data === null) return true;
    const agentId = cleanText(data.agentId, 1, 100), action = cleanText(data.action, 1, 100);
    if (!agentId || !action) return json(res, 400, { error: "agentId و action معتبر الزامی است." });
    const user = authUser(req);
    if (!user || !pool) return json(res, 200, { decision: "DENY", reason: "AUTH_OR_POLICY_STORE_UNAVAILABLE", defaultPolicy: "DENY" });
    try {
      if (!await requireDb(res)) return true;
      await ensureTables(pool);
      const q = await pool.query("SELECT decision FROM aria_autonomy_policies WHERE agent_id=$1 AND action=$2",[agentId,action]);
      const policy = q.rows[0]?.decision || null;
      if (!policy) return json(res, 200, { decision: "DENY", reason: "NO_MATCHING_APPROVED_POLICY", defaultPolicy: "DENY" });
      if (policy === "ALLOW" && !safeAutonomyActions.has(action)) return json(res, 200, { decision: "REQUIRE_APPROVAL", reason: "SENSITIVE_ACTION_REQUIRES_HUMAN_APPROVAL", defaultPolicy: "DENY" });
      return json(res, 200, { decision: policy === "ALLOW" ? "ALLOW" : policy, reason: "MATCHED_OWNER_POLICY", defaultPolicy: "DENY" });
    } catch (err) {
      console.error("ARIA autonomy policy lookup failed:", err.message);
      return json(res, 200, { decision: "DENY", reason: "POLICY_STORE_ERROR", defaultPolicy: "DENY" });
    }
  }
  if (p === "/api/aria-expansion/autonomy/policies" && req.method === "POST") {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    if (!process.env.ARIA_OWNER_USER_ID || String(user.sub) !== String(process.env.ARIA_OWNER_USER_ID)) return json(res, 403, { error: "فقط مالک مجاز به تغییر سیاست‌های خودمختاری است." });
    const data = await readJson(req, res); if (data === null) return true;
    const agentId = cleanText(data.agentId, 1, 100), action = cleanText(data.action, 1, 100);
    const decision = ["ALLOW","REQUIRE_APPROVAL","DENY"].includes(data.decision) ? data.decision : null;
    if (!agentId || !action || !decision) return json(res, 400, { error: "agentId، action و decision معتبر الزامی است." });
    if (decision === "ALLOW" && !safeAutonomyActions.has(action)) return json(res, 400, { error: "برای عملیات حساس اجازه مستقیم صادر نمی‌شود؛ تأیید انسانی لازم است." });
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      const q = await pool.query(`INSERT INTO aria_autonomy_policies(agent_id,action,decision,created_by) VALUES($1,$2,$3,$4)
        ON CONFLICT(agent_id,action) DO UPDATE SET decision=EXCLUDED.decision,created_by=EXCLUDED.created_by,created_at=NOW()
        RETURNING id,agent_id,action,decision,created_at`,[agentId,action,decision,user.sub]);
      return json(res, 201, { policy: q.rows[0] });
    } catch (err) { console.error("ARIA autonomy policy write failed:",err.message); return json(res,500,{error:"ثبت سیاست انجام نشد."}); }
  }
  if (p === "/api/aria-expansion/work-items" && (req.method === "GET" || req.method === "POST")) {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      if (req.method === "GET") {
        const q=await pool.query("SELECT id,module_id,title,details,status,created_at,updated_at FROM aria_expansion_work_items WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 100",[user.sub]);
        return json(res,200,{items:q.rows.map(x=>({...x,id:String(x.id)}))});
      }
      const data=await readJson(req,res); if(data===null)return true;
      const moduleId=cleanText(data.moduleId,1,100),title=cleanText(data.title,3,160),details=cleanText(data.details||"",0,3000);
      if(!moduleId||!title||details===null||(!problemById.has(moduleId)&&!candidateById.has(moduleId)&&!moduleCatalogById.has(moduleId)))return json(res,400,{error:"moduleId معتبر و عنوان ۳ تا ۱۶۰ نویسه‌ای لازم است."});
      const q=await pool.query("INSERT INTO aria_expansion_work_items(user_id,module_id,title,details) VALUES($1,$2,$3,$4) RETURNING id,module_id,title,details,status,created_at,updated_at",[user.sub,moduleId,title,details]);
      return json(res,201,{item:{...q.rows[0],id:String(q.rows[0].id)}});
    } catch(err){console.error("ARIA expansion work item failed:",err.message);return json(res,500,{error:"ثبت کار انجام نشد."});}
  }
  const workItemMatch=p.match(/^\/api\/aria-expansion\/work-items\/(\d+)$/);
  if(workItemMatch&&req.method==="PATCH"){
    const user=requireUser(req,json,res,authUser);if(!user)return true;
    const data=await readJson(req,res);if(data===null)return true;
    const status=["planned","in_progress","blocked","done","cancelled"].includes(data.status)?data.status:null;
    if(!status)return json(res,400,{error:"وضعیت معتبر نیست."});
    if(!await requireDb(res))return true;
    try{await ensureTables(pool);const q=await pool.query("UPDATE aria_expansion_work_items SET status=$1,updated_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING id,module_id,title,details,status,created_at,updated_at",[status,workItemMatch[1],user.sub]);if(!q.rowCount)return json(res,404,{error:"کار پیدا نشد."});return json(res,200,{item:{...q.rows[0],id:String(q.rows[0].id)}});}
    catch(err){console.error("ARIA expansion work item update failed:",err.message);return json(res,500,{error:"به‌روزرسانی کار انجام نشد."});}
  }


  if (p === "/api/aria-modules/catalog" && req.method === "GET") {
    return json(res, 200, {
      product: "ARIA",
      independentBackendModuleCount: moduleRegistryRuntime.MODULES.length,
      counts: moduleRegistryRuntime.MODULE_COUNTS,
      modules: moduleRegistryRuntime.MODULES.map(module => module.manifest),
      productionVerifiedCount: 0,
      externalExecutionEnabled: false,
      paymentExecuted: false
    });
  }

  const modularActionMatch = p.match(/^\/api\/aria-modules\/([^/]+)\/work-items\/([0-9a-f-]{36})\/actions$/i);
  if (modularActionMatch && req.method === "POST") {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    const moduleId = decodeURIComponent(modularActionMatch[1]);
    const data = await readJson(req, res); if (data === null) return true;
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      const tenantId = String(user.sub);
      const current = await pool.query("SELECT result FROM aria_modular_work_items WHERE id=$1::uuid AND user_id=$2 AND tenant_id=$3 AND module_id=$4", [modularActionMatch[2], user.sub, tenantId, moduleId]);
      if (!current.rowCount) return json(res, 404, { error: "سابقه اجرای ماژول پیدا نشد." });
      const result = current.rows[0].result;
      const serviceResult = result?.artifact?.serviceResult;
      if (!serviceResult) return json(res, 409, { error: "این ماژول گردش‌کار قابل تغییر وضعیت ندارد." });
      const isOwner = Boolean(process.env.ARIA_OWNER_USER_ID && String(user.sub) === String(process.env.ARIA_OWNER_USER_ID));
      if (moduleId === "ARIA-SVC-SUPPORT") {
        if (data.action === "CHECK_SLA") {
          serviceResult.sla = serviceDelivery.evaluateSupportSla(serviceResult, data.evaluatedAt ? new Date(data.evaluatedAt) : new Date());
        } else {
          Object.assign(serviceResult, serviceDelivery.transitionSupportTicket(serviceResult, data.action, { userId: String(user.sub), tenantId }));
        }
      } else if (moduleId === "ARIA-SVC-SUCCESS" && data.action === "APPROVE_RENEWAL") {
        Object.assign(serviceResult, serviceDelivery.approveCustomerRenewal(serviceResult, { userId: String(user.sub), isOwner }));
      } else if (moduleId === "ARIA-SVC-PACKAGES") {
        Object.assign(serviceResult, serviceDelivery.transitionServicePackage(serviceResult, data.action, { userId: String(user.sub), tenantId, isOwner }));
      } else {
        return json(res, 400, { error: "اقدام برای این موتور تعریف نشده است." });
      }
      result.artifact.serviceResult = serviceResult;
      result.output.serviceResult = serviceResult;
      result.auditRecord = {
        ...(result.auditRecord || {}),
        lastAction: data.action,
        lastActionBy: String(user.sub),
        lastActionAt: new Date().toISOString()
      };
      await pool.query("UPDATE aria_modular_work_items SET result=$1::jsonb,status=$2 WHERE id=$3::uuid AND user_id=$4 AND tenant_id=$5 AND module_id=$6",
        [JSON.stringify(result), result.status, modularActionMatch[2], user.sub, tenantId, moduleId]);
      return json(res, 200, { ...result, persistence: "DATABASE_UPDATED", externalExecutionPerformed: false, paymentExecuted: false });
    } catch (err) {
      if (["SUPPORT_TICKET_INVALID","SUPPORT_SLA_INPUT_INVALID","SUPPORT_TRANSITION_NOT_ALLOWED","CUSTOMER_SUCCESS_REPORT_INVALID","OWNER_APPROVAL_REQUIRED","SERVICE_PACKAGE_INVALID","SERVICE_PACKAGE_TRANSITION_NOT_ALLOWED"].includes(err.message)) {
        return json(res, err.message === "OWNER_APPROVAL_REQUIRED" ? 403 : 400, { error: err.message });
      }
      console.error("ARIA modular action failed:", err.message);
      return json(res, 500, { error: "تغییر وضعیت موتور خدمت انجام نشد." });
    }
  }
  const modularWorkItemsMatch = p.match(/^\/api\/aria-modules\/([^/]+)\/work-items$/);
  if (modularWorkItemsMatch && req.method === "GET") {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    if (!await requireDb(res)) return true;
    const moduleId = decodeURIComponent(modularWorkItemsMatch[1]);
    if (!moduleRegistryRuntime.MODULE_BY_ID.has(moduleId)) return json(res, 404, { error: "ماژول پیدا نشد." });
    try {
      await ensureTables(pool);
      const tenantId = String(user.sub);
      const q = await pool.query("SELECT id,module_id,status,result,created_at FROM aria_modular_work_items WHERE user_id=$1 AND tenant_id=$2 AND module_id=$3 ORDER BY created_at DESC LIMIT 100", [user.sub, tenantId, moduleId]);
      return json(res, 200, { items: q.rows, tenantBoundary: "PERSONAL_ACCOUNT_SCOPE" });
    } catch (err) {
      console.error("ARIA modular work item list failed:", err.message);
      return json(res, 500, { error: "دریافت سوابق ماژول انجام نشد." });
    }
  }
  const modularExecuteMatch = p.match(/^\/api\/aria-modules\/([^/]+)\/execute$/);
  if (modularExecuteMatch && req.method === "POST") {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    const moduleId = decodeURIComponent(modularExecuteMatch[1]);
    const module = moduleRegistryRuntime.MODULE_BY_ID.get(moduleId);
    if (!module) return json(res, 404, { error: "ماژول پیدا نشد." });
    if (["ARIA-CONTROL-MODULE-002", "ARIA-CONTROL-MODULE-004"].includes(moduleId) &&
        (!process.env.ARIA_OWNER_USER_ID || String(user.sub) !== String(process.env.ARIA_OWNER_USER_ID))) {
      return json(res, 403, { error: "این کنترل مدیریتی فقط در اختیار مالک سامانه است." });
    }
    const idempotencyKey = String(req.headers?.["idempotency-key"] || "").trim();
    if (idempotencyKey.length < 8 || idempotencyKey.length > 128) {
      return json(res, 400, { error: "هدر Idempotency-Key معتبر و ۸ تا ۱۲۸ نویسه‌ای لازم است." });
    }
    const data = await readJson(req, res); if (data === null) return true;
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      const tenantId = String(user.sub);
      const existing = await pool.query("SELECT result,status FROM aria_modular_work_items WHERE user_id=$1 AND tenant_id=$2 AND module_id=$3 AND idempotency_key=$4", [user.sub, tenantId, moduleId, idempotencyKey]);
      if (existing.rowCount) return json(res, 200, { ...existing.rows[0].result, idempotentReplay: true });
      if (moduleId === "ARIA-SVC-SUPPORT") {
        if (typeof data.serviceCaseId !== "string" || !/^[0-9a-f-]{36}$/i.test(data.serviceCaseId)) {
          return json(res, 400, { error: "شناسه پرونده خدمت معتبر نیست." });
        }
        const parentCase = await pool.query("SELECT id FROM aria_service_cases WHERE id=$1::uuid AND user_id=$2 AND tenant_id=$3", [data.serviceCaseId, user.sub, tenantId]);
        if (!parentCase.rowCount) return json(res, 404, { error: "پرونده خدمت متعلق به این حساب پیدا نشد." });
      }
      const result = await moduleRegistryRuntime.executeModule(moduleId, data, { actorId: String(user.sub), tenantId });
      await pool.query("INSERT INTO aria_modular_work_items(id,user_id,tenant_id,module_id,idempotency_key,input_digest,result,status) VALUES($1::uuid,$2,$3,$4,$5,$6,$7::jsonb,$8)", [
        result.workItemId, user.sub, tenantId, moduleId, idempotencyKey,
        result.artifact.inputDigest, JSON.stringify(result), result.status
      ]);
      return json(res, 201, { ...result, persistence: "DATABASE_SAVED", idempotentReplay: false });
    } catch (err) {
      if (["MODULE_ACTOR_REQUIRED","MODULE_TENANT_REQUIRED","MODULE_INPUT_INVALID","MODULE_INPUT_MISSING","MODULE_CONSENT_REQUIRED","SUPPORT_TICKET_INPUT_INVALID","CUSTOMER_SUCCESS_INPUT_INVALID","SERVICE_PACKAGE_INPUT_INVALID","UNIT_ECONOMICS_INPUT_INVALID"].includes(err.message)) {
        return json(res, err.message === "MODULE_CONSENT_REQUIRED" ? 403 : 400, { error: err.message, missingFields: err.missingFields || [] });
      }
      if (err.code === "23505") return json(res, 409, { error: "درخواست تکراری است؛ همان Idempotency-Key قبلاً ثبت شده است." });
      console.error("ARIA modular execution failed:", err.message);
      return json(res, 500, { error: "اجرای محلی ماژول انجام نشد." });
    }
  }
  if (p === "/api/aria-expansion/service-delivery/catalog" && req.method === "GET") {
    return json(res, 200, {
      product: "ARIA", modules: serviceDelivery.SERVICE_MODULES,
      persistence: "DATABASE_BACKED_PER_USER_SCOPE",
      tenantBoundary: "PERSONAL_ACCOUNT_SCOPE_UNTIL_ORGANIZATION_TENANCY_IS_IMPLEMENTED",
      externalExecutionPerformed: false, paymentExecuted: false, productionVerified: false
    });
  }
  if (p === "/api/aria-expansion/service-cases" && (req.method === "GET" || req.method === "POST")) {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      const tenantId = String(user.sub);
      if (req.method === "GET") {
        const q = await pool.query("SELECT payload FROM aria_service_cases WHERE user_id=$1 AND tenant_id=$2 ORDER BY updated_at DESC LIMIT 100", [user.sub, tenantId]);
        return json(res, 200, { cases: q.rows.map(row => row.payload), tenantBoundary: "PERSONAL_ACCOUNT_SCOPE" });
      }
      const data = await readJson(req, res); if (data === null) return true;
      const item = serviceDelivery.createServiceCase(data, { userId: String(user.sub), tenantId });
      await pool.query("INSERT INTO aria_service_cases(id,user_id,tenant_id,module_id,status,payload) VALUES($1::uuid,$2,$3,$4,$5,$6::jsonb)",
        [item.id, user.sub, tenantId, item.moduleId, item.status, JSON.stringify(item)]);
      return json(res, 201, { case: item, persistence: "DATABASE_SAVED", externalExecutionPerformed: false });
    } catch (err) {
      if (err.message === "SERVICE_MODULE_UNKNOWN" || err.message === "SERVICE_CASE_INPUT_INVALID") return json(res, 400, { error: err.message });
      console.error("ARIA service case create failed:", err.message);
      return json(res, 500, { error: "ثبت پرونده خدمت انجام نشد." });
    }
  }
  const serviceQuoteMatch = p.match(/^\/api\/aria-expansion\/service-cases\/([0-9a-f-]{36})\/quote$/i);
  if (serviceQuoteMatch && req.method === "POST") {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    const data = await readJson(req, res); if (data === null) return true;
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      const tenantId = String(user.sub);
      const current = await pool.query("SELECT payload FROM aria_service_cases WHERE id=$1::uuid AND user_id=$2 AND tenant_id=$3", [serviceQuoteMatch[1], user.sub, tenantId]);
      if (!current.rowCount) return json(res, 404, { error: "پرونده خدمت پیدا نشد." });
      const item = current.rows[0].payload;
      if (item.status !== "QUALIFIED") return json(res, 409, { error: "برای تهیه پیشنهاد، ابتدا پرونده باید ارزیابی و تأیید شود." });
      const quote = serviceDelivery.buildQuote(data);
      const updated = serviceDelivery.transitionServiceCase(item, "ISSUE_QUOTE", { userId: String(user.sub) });
      updated.quoteState = "QUOTE_PENDING_OWNER_APPROVAL";
      updated.quote = quote;
      await pool.query("UPDATE aria_service_cases SET status=$1,payload=$2::jsonb,quote=$3::jsonb,updated_at=NOW() WHERE id=$4::uuid AND user_id=$5 AND tenant_id=$6",
        [updated.status, JSON.stringify(updated), JSON.stringify(quote), serviceQuoteMatch[1], user.sub, tenantId]);
      return json(res, 201, { case: updated, quote, paymentExecuted: false });
    } catch (err) {
      if (err.message === "QUOTE_INPUT_INVALID") return json(res, 400, { error: err.message });
      console.error("ARIA service quote failed:", err.message);
      return json(res, 500, { error: "ساخت پیشنهاد انجام نشد." });
    }
  }
  const serviceQualityMatch = p.match(/^\/api\/aria-expansion\/service-cases\/([0-9a-f-]{36})\/quality$/i);
  if (serviceQualityMatch && req.method === "POST") {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    const data = await readJson(req, res); if (data === null) return true;
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      const tenantId = String(user.sub);
      const current = await pool.query("SELECT payload FROM aria_service_cases WHERE id=$1::uuid AND user_id=$2 AND tenant_id=$3", [serviceQualityMatch[1], user.sub, tenantId]);
      if (!current.rowCount) return json(res, 404, { error: "پرونده خدمت پیدا نشد." });
      let item = current.rows[0].payload;
      if (item.status !== "IN_PROGRESS") return json(res, 409, { error: "کنترل کیفیت فقط پس از شروع تحویل قابل ثبت است." });
      item = serviceDelivery.transitionServiceCase(item, "SUBMIT_QA", { userId: String(user.sub) });
      const quality = serviceDelivery.evaluateDeliveryQuality(data);
      item = serviceDelivery.transitionServiceCase(item, quality.passed ? "PASS_QA" : "FAIL_QA", { userId: String(user.sub) });
      item.quality = quality;
      await pool.query("UPDATE aria_service_cases SET status=$1,payload=$2::jsonb,quality=$3::jsonb,updated_at=NOW() WHERE id=$4::uuid AND user_id=$5 AND tenant_id=$6",
        [item.status, JSON.stringify(item), JSON.stringify(quality), serviceQualityMatch[1], user.sub, tenantId]);
      return json(res, 200, { case: item, quality, deliverable: quality.deliverable });
    } catch (err) {
      if (err.message === "QUALITY_CHECKLIST_INVALID") return json(res, 400, { error: err.message });
      console.error("ARIA service quality failed:", err.message);
      return json(res, 500, { error: "ثبت کنترل کیفیت انجام نشد." });
    }
  }
  const serviceTransitionMatch = p.match(/^\/api\/aria-expansion\/service-cases\/([0-9a-f-]{36})\/transitions$/i);
  if (serviceTransitionMatch && req.method === "POST") {
    const user = requireUser(req, json, res, authUser); if (!user) return true;
    const data = await readJson(req, res); if (data === null) return true;
    if (!await requireDb(res)) return true;
    try {
      await ensureTables(pool);
      const tenantId = String(user.sub);
      const current = await pool.query("SELECT payload FROM aria_service_cases WHERE id=$1::uuid AND user_id=$2 AND tenant_id=$3", [serviceTransitionMatch[1], user.sub, tenantId]);
      if (!current.rowCount) return json(res, 404, { error: "پرونده خدمت پیدا نشد." });
      const isOwner = Boolean(process.env.ARIA_OWNER_USER_ID && String(user.sub) === String(process.env.ARIA_OWNER_USER_ID));
      const item = serviceDelivery.transitionServiceCase(current.rows[0].payload, data.action, { userId: String(user.sub), isOwner });
      await pool.query("UPDATE aria_service_cases SET status=$1,payload=$2::jsonb,updated_at=NOW() WHERE id=$3::uuid AND user_id=$4 AND tenant_id=$5",
        [item.status, JSON.stringify(item), serviceTransitionMatch[1], user.sub, tenantId]);
      return json(res, 200, { case: item, externalExecutionPerformed: false, paymentExecuted: false });
    } catch (err) {
      if (["SERVICE_CASE_INVALID","SERVICE_TRANSITION_NOT_ALLOWED","OWNER_APPROVAL_REQUIRED","SERVICE_ACTOR_REQUIRED"].includes(err.message)) return json(res, 403, { error: err.message });
      console.error("ARIA service transition failed:", err.message);
      return json(res, 500, { error: "تغییر وضعیت پرونده انجام نشد." });
    }
  }
  if(p==="/api/aria-expansion/providers"&&(req.method==="GET"||req.method==="POST")){
    const providerUser=req.method==="POST"?requireUser(req,json,res,authUser):null;if(req.method==="POST"&&!providerUser)return true;
    if(!await requireDb(res))return true;
    try{await ensureTables(pool);
      if(req.method==="GET"){
        const q=await pool.query("SELECT id,display_name,category,service_area,description,created_at FROM aria_expansion_providers WHERE verification_status='verified' AND contact_visible=TRUE ORDER BY created_at DESC LIMIT 100");
        return json(res,200,{providers:q.rows.map(x=>({...x,id:String(x.id)})),visibility:"VERIFIED_AND_CONSENTED_ONLY"});
      }
      const data=await readJson(req,res);if(data===null)return true;
      const displayName=cleanText(data.displayName,2,100),category=cleanText(data.category,2,80),serviceArea=cleanText(data.serviceArea,2,120),description=cleanText(data.description||"",0,1000);
      if(!displayName||!category||!serviceArea||description===null)return json(res,400,{error:"نام نمایشی، دسته، محدوده خدمت و شرح معتبر لازم است."});
      const q=await pool.query("INSERT INTO aria_expansion_providers(user_id,display_name,category,service_area,description,contact_visible) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,display_name,category,service_area,description,contact_visible,verification_status,created_at",[providerUser.sub,displayName,category,serviceArea,description,data.contactVisible===true]);
      return json(res,201,{provider:{...q.rows[0],id:String(q.rows[0].id)},notice:"پروفایل تا بررسی مالک در وضعیت pending باقی می‌ماند."});
    }catch(err){console.error("ARIA provider directory failed:",err.message);return json(res,500,{error:"ثبت یا دریافت فهرست ارائه‌دهندگان انجام نشد."});}
  }
  const providerVerifyMatch=p.match(/^\/api\/aria-expansion\/providers\/(\d+)\/verification$/);
  if(providerVerifyMatch&&req.method==="PATCH"){
    const user=requireUser(req,json,res,authUser);if(!user)return true;
    if(!process.env.ARIA_OWNER_USER_ID||String(user.sub)!==String(process.env.ARIA_OWNER_USER_ID))return json(res,403,{error:"تأیید ارائه‌دهنده فقط برای مالک مجاز است."});
    const data=await readJson(req,res);if(data===null)return true;
    const status=["verified","rejected"].includes(data.status)?data.status:null;
    if(!status)return json(res,400,{error:"وضعیت تأیید باید verified یا rejected باشد."});
    if(!await requireDb(res))return true;
    try{await ensureTables(pool);const q=await pool.query("UPDATE aria_expansion_providers SET verification_status=$1,verified_by=$2,updated_at=NOW() WHERE id=$3 RETURNING id,display_name,category,service_area,verification_status,contact_visible,updated_at",[status,user.sub,providerVerifyMatch[1]]);if(!q.rowCount)return json(res,404,{error:"ارائه‌دهنده پیدا نشد."});return json(res,200,{provider:{...q.rows[0],id:String(q.rows[0].id)}});}
    catch(err){console.error("ARIA provider verification failed:",err.message);return json(res,500,{error:"تأیید ارائه‌دهنده انجام نشد."});}
  }
  if(p==="/api/aria-expansion/intents"&&(req.method==="GET"||req.method==="POST")){
    const user=requireUser(req,json,res,authUser);if(!user)return true;
    if(!await requireDb(res))return true;
    try{await ensureTables(pool);
      if(req.method==="GET"){const q=await pool.query("SELECT id,title,description,category,contact_consent,status,created_at FROM aria_expansion_intents WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100",[user.sub]);return json(res,200,{intents:q.rows.map(x=>({...x,id:String(x.id)}))});}
      const data=await readJson(req,res);if(data===null)return true;
      const title=cleanText(data.title,4,140),description=cleanText(data.description,8,1600),category=cleanText(data.category,2,80),contactConsent=data.contactConsent===true;
      if(!title||!description||!category)return json(res,400,{error:"عنوان، شرح و دسته‌بندی معتبر الزامی است."});
      const q=await pool.query("INSERT INTO aria_expansion_intents(user_id,title,description,category,contact_consent) VALUES($1,$2,$3,$4,$5) RETURNING id,title,description,category,contact_consent,status,created_at",[user.sub,title,description,category,contactConsent]);
      return json(res,201,{intent:{...q.rows[0],id:String(q.rows[0].id)},matches:[],matchState:"NO_VERIFIED_PROVIDERS_CONNECTED"});
    }catch(err){console.error("ARIA intent write failed:",err.message);return json(res,500,{error:"ثبت قصد انجام نشد."});}
  }
  const matchesMatch=p.match(/^\/api\/aria-expansion\/intents\/(\d+)\/matches$/);
  if(matchesMatch&&req.method==="GET"){
    const user=requireUser(req,json,res,authUser);if(!user)return true;
    if(!await requireDb(res))return true;
    try{await ensureTables(pool);const q=await pool.query("SELECT id,category,contact_consent FROM aria_expansion_intents WHERE id=$1 AND user_id=$2",[matchesMatch[1],user.sub]);if(!q.rowCount)return json(res,404,{error:"درخواست پیدا نشد."});if(!q.rows[0].contact_consent)return json(res,200,{matches:[],matchState:"CONTACT_CONSENT_REQUIRED"});const providers=await pool.query("SELECT id,display_name,category,service_area,description FROM aria_expansion_providers WHERE category=$1 AND verification_status='verified' AND contact_visible=TRUE ORDER BY created_at DESC LIMIT 20",[q.rows[0].category]);return json(res,200,{matches:providers.rows.map(x=>({...x,id:String(x.id),matchReason:"CATEGORY_MATCH_VERIFIED_PROVIDER"})),matchState:providers.rowCount?"VERIFIED_CATEGORY_MATCHES_FOUND":"NO_VERIFIED_PROVIDERS_CONNECTED",contactDetailsDisclosed:false});}
    catch(err){console.error("ARIA intent matches failed:",err.message);return json(res,500,{error:"دریافت تطبیق‌ها انجام نشد."});}
  }
  if(p==="/api/aria-expansion/owner/overview"&&req.method==="GET"){
    const user=requireUser(req,json,res,authUser);if(!user)return true;
    if(!process.env.ARIA_OWNER_USER_ID||String(user.sub)!==String(process.env.ARIA_OWNER_USER_ID))return json(res,403,{error:"این بخش فقط برای مالک سامانه است."});
    if(!await requireDb(res))return true;
    try{await ensureTables(pool);
      const [work,intents,policies,providers]=await Promise.all([
        pool.query("SELECT status,COUNT(*)::int AS count FROM aria_expansion_work_items GROUP BY status"),
        pool.query("SELECT status,COUNT(*)::int AS count FROM aria_expansion_intents GROUP BY status"),
        pool.query("SELECT COUNT(*)::int AS count FROM aria_autonomy_policies"),
        pool.query("SELECT verification_status,COUNT(*)::int AS count FROM aria_expansion_providers GROUP BY verification_status")
      ]);
      return json(res,200,{canonicalModuleCount:639,expansion:{problemRecords:publicProblemRecords.length,uniqueProblemCapabilities:publicProblemRecords.length-1,historicalOverlayModules:allModuleCatalog.length,transferredModules:transferredIds.size,sharedAriaServices:ownership.sharedAriaModuleIds.length,historicalCandidates:registry.candidates.length,revenueModels:registry.revenueModels.length},workItems:work.rows,intents:intents.rows,autonomyPolicies:policies.rows[0].count,providers:providers.rows,liveRevenueEnabled:false,externalExecutionEnabled:false});
    }catch(err){console.error("ARIA owner overview failed:",err.message);return json(res,500,{error:"گزارش مالک دریافت نشد."});}
  }
  return false;
}
module.exports = { handle, registry };
