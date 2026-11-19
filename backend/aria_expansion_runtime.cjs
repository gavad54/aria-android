"use strict";
const fs = require("node:fs");
const path = require("node:path");
const registry = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "aria_expansion_registry.json"), "utf8"));
const problemById = new Map(registry.problems.map(x => [x.id, x]));
const candidateById = new Map(registry.candidates.map(x => [x.moduleId, x]));
const safeAutonomyActions = new Set(["draft", "summarize", "classify", "plan", "analyze_readonly"]);
let schemaReady = false;
let schemaPromise = null;

if (registry.baselineCanonicalModuleCount !== 639 || registry.problems.length !== 50 ||
    registry.domains.length !== 5 || registry.candidates.length !== 4 ||
    registry.revenueModels.length !== 20 || new Set(registry.problems.map(x => x.id)).size !== 50) {
  throw new Error("ARIA_EXPANSION_REGISTRY_INVALID");
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
    moduleId: module.id, sourceProblemNumber: module.sourceProblemNumber,
    parentModuleId: module.parentModuleId, engine: module.engine,
    goal, steps, executionStatus: "LOCAL_PLAN_CREATED",
    externalExecution: { status: "NOT_CONNECTED", executed: false },
    revenueState: "DESIGNED_NOT_MONETIZED",
    disclaimer: "این خروجی برنامه‌ریزی محلی است؛ رزرو، پرداخت، تماس با ارائه‌دهنده یا اقدام بیرونی انجام نشده است.",
    createdAt: new Date().toISOString()
  };
}

async function handle(req, res, url, deps) {
  const { json, readJson, authUser, requireDb, pool } = deps;
  const p = url.pathname;
  if (p === "/api/aria-expansion/summary" && req.method === "GET") {
    return json(res, 200, {
      product: "ARIA", canonicalModuleCount: 639, canonicalCountChanged: false,
      parentDomains: registry.domains.length, problemRecords: registry.problems.length,
      uniqueProblemCapabilities: registry.problems.length - 1,
      historicalCandidates: registry.candidates.length, revenueModels: registry.revenueModels.length,
      liveRevenueEnabled: false, externalExecutionEnabled: false,
      source: "docs/ARIA_TWO_IMAGES_50_PROBLEMS_20_REVENUE_MODELS_FA.md",
      notes: ["مسئله ۴۸ به قابلیت مراقبت حیوان خانگی مسئله ۲۹ متصل است و موتور جداگانه نمی‌سازد.", "۵۰ مسئله در پنج حوزه ثبت شده‌اند؛ canonical ID جدید فقط پس از crosswalk و اثبات استقلال تخصیص می‌یابد.", "۲۰ مدل درآمدی تعریف شده‌اند اما پرداخت و درآمد زنده فعال نیست."]
    });
  }
  if (p === "/api/aria-expansion/modules" && req.method === "GET") {
    return json(res, 200, { parents: registry.domains, problems: registry.problems.map(x => ({ ...x, parentDomain: x.parentModuleId })), totalProblemRecords: 50, uniqueProblemCapabilities: 49, canonicalModuleCount: 639 });
  }
  if (p === "/api/aria-expansion/candidates" && req.method === "GET") {
    return json(res, 200, { candidates: registry.candidates, total: 4, canonicalModuleCount: 639 });
  }
  if (p === "/api/aria-expansion/revenue-models" && req.method === "GET") {
    return json(res, 200, { models: registry.revenueModels, total: 20, state: "DESIGNED_NOT_MONETIZED", paymentProviderState: "NOT_CONNECTED", liveRevenueEnabled: false });
  }
  const planMatch = p.match(/^\/api\/aria-expansion\/modules\/(problem-\d{2})\/plan$/);
  if (planMatch && req.method === "POST") {
    const module = problemById.get(planMatch[1]);
    if (!module) return json(res, 404, { error: "زیرماژول پیدا نشد." });
    const data = await readJson(req, res); if (data === null) return true;
    const goal = cleanText(data.goal, 4, 1200);
    if (!goal) return json(res, 400, { error: "هدف باید بین ۴ تا ۱۲۰۰ نویسه باشد." });
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
      if(!moduleId||!title||details===null||(!problemById.has(moduleId)&&!candidateById.has(moduleId)))return json(res,400,{error:"moduleId معتبر و عنوان ۳ تا ۱۶۰ نویسه‌ای لازم است."});
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
    try{await ensureTables(pool);const q=await pool.query("SELECT id,contact_consent FROM aria_expansion_intents WHERE id=$1 AND user_id=$2",[matchesMatch[1],user.sub]);if(!q.rowCount)return json(res,404,{error:"درخواست پیدا نشد."});return json(res,200,{matches:[],matchState:q.rows[0].contact_consent?"NO_VERIFIED_PROVIDERS_CONNECTED":"CONTACT_CONSENT_REQUIRED"});}
    catch(err){console.error("ARIA intent matches failed:",err.message);return json(res,500,{error:"دریافت تطبیق‌ها انجام نشد."});}
  }
  if(p==="/api/aria-expansion/owner/overview"&&req.method==="GET"){
    const user=requireUser(req,json,res,authUser);if(!user)return true;
    if(!process.env.ARIA_OWNER_USER_ID||String(user.sub)!==String(process.env.ARIA_OWNER_USER_ID))return json(res,403,{error:"این بخش فقط برای مالک سامانه است."});
    if(!await requireDb(res))return true;
    try{await ensureTables(pool);
      const [work,intents,policies]=await Promise.all([
        pool.query("SELECT status,COUNT(*)::int AS count FROM aria_expansion_work_items GROUP BY status"),
        pool.query("SELECT status,COUNT(*)::int AS count FROM aria_expansion_intents GROUP BY status"),
        pool.query("SELECT COUNT(*)::int AS count FROM aria_autonomy_policies")
      ]);
      return json(res,200,{canonicalModuleCount:639,expansion:{problemRecords:50,uniqueProblemCapabilities:49,historicalCandidates:4,revenueModels:20},workItems:work.rows,intents:intents.rows,autonomyPolicies:policies.rows[0].count,liveRevenueEnabled:false,externalExecutionEnabled:false});
    }catch(err){console.error("ARIA owner overview failed:",err.message);return json(res,500,{error:"گزارش مالک دریافت نشد."});}
  }
  return false;
}
module.exports = { handle, registry };
