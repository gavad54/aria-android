"use strict";
const fs = require("node:fs");
const path = require("node:path");
const registry = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "aria_expansion_registry.json"), "utf8"));
const moduleRegistry = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "aria_111_module_expansion_registry.json"), "utf8"));
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
const problemEngines = [...new Map(publicProblemRecords.map(x => [x.engine.id, { ...x.engine, moduleIds: publicProblemRecords.filter(p => p.engine.id === x.engine.id).map(p => p.id), engineType: "PROBLEM_DOMAIN_ENGINE" }])).values()];
const candidateEngines = registry.candidates.map(x => ({ ...x.engine, moduleId: x.moduleId, engineType: "HISTORICAL_CONTROL_ENGINE" }));
const ideaEngines = moduleCatalog.filter(x => x.moduleType === "NEW_IDEA_PRODUCT_MODULE").map(x => ({ id: x.engineId, name: x.name + " — موتور تخصصی", moduleId: x.moduleId, engineType: "NEW_IDEA_ENGINE", contract: { input: x.inputContract, output: x.outputContract, operations: x.workflow, metrics: x.kpis, runtimeMode: "DESIGN_ONLY", externalAdapterState: "NOT_CONNECTED" } }));
const legacyDomainEngines = moduleCatalog.filter(x => x.moduleType === "MERGED_LEGACY_APP_DOMAIN_MODULE").map(x => ({ id: x.engineId || x.moduleId, name: x.name + " — موتور دامنه", moduleId: x.moduleId, engineType: "ARIA_DOMAIN_ENGINE", contract: { input: x.inputContract, output: x.outputContract, operations: x.workflow, metrics: x.kpis, runtimeMode: "DESIGN_ONLY", externalAdapterState: "NOT_CONNECTED" } }));
const publicDomainPacks = moduleRegistry.mergedDomainPacks.filter(x => ownership.publicAriaDomainPackIds.includes(x.id)).map(x => ({ ...x, moduleIds: x.moduleIds.filter(id => moduleCatalogById.has(id)) }));
const publicFamilyArchitecture = { parent: "VAYRO", product: "ARIA", directProduct: true, accountingErpOwner: "ARIANA", role: "General AI assistant and digital work environment" };
const engineCatalog = [...problemEngines, ...candidateEngines, ...ideaEngines, ...legacyDomainEngines];
const safeAutonomyActions = new Set(["draft", "summarize", "classify", "plan", "analyze_readonly"]);
let schemaReady = false;
let schemaPromise = null;

if (registry.baselineCanonicalModuleCount !== 639 || registry.problems.length !== 50 ||
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
    ownership.publicAriaOverlayTarget !== 72 ||
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
      product: "ARIA", canonicalModuleCount: 639, canonicalCountChanged: false,
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
  if (p === "/api/aria-expansion/engines" && req.method === "GET") {
    return json(res, 200, { engines: engineCatalog, total: engineCatalog.length, problemEngines: problemEngines.length, candidateEngines: candidateEngines.length, ideaEngines: ideaEngines.length, legacyDomainEngines: legacyDomainEngines.length, canonicalModuleCount: 639 });
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
      return json(res,200,{canonicalModuleCount:639,expansion:{problemRecords:50,uniqueProblemCapabilities:49,historicalCandidates:4,revenueModels:20},workItems:work.rows,intents:intents.rows,autonomyPolicies:policies.rows[0].count,providers:providers.rows,liveRevenueEnabled:false,externalExecutionEnabled:false});
    }catch(err){console.error("ARIA owner overview failed:",err.message);return json(res,500,{error:"گزارش مالک دریافت نشد."});}
  }
  return false;
}
module.exports = { handle, registry };
