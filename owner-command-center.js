"use strict";
const OWNER_IDS = new Set(String(process.env.ARIA_OWNER_USER_IDS || "").split(",").map(x=>x.trim()).filter(Boolean));
function send(res,status,payload){res.writeHead(status,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"});res.end(JSON.stringify(payload));}
async function body(req){let raw="";for await(const c of req){raw+=c;if(raw.length>32768)throw new Error("BODY_TOO_LARGE");}return raw?JSON.parse(raw):{};}
async function initOwnerCenter(pool){
 await pool.query(`CREATE TABLE IF NOT EXISTS aria_product_modules(
 id BIGSERIAL PRIMARY KEY,module_key TEXT NOT NULL UNIQUE,name TEXT NOT NULL,description TEXT NOT NULL DEFAULT '',
 category TEXT NOT NULL DEFAULT 'general',version TEXT NOT NULL DEFAULT '1.0.0',
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','validating','enabled','suspended','deprecated')),
 manifest JSONB NOT NULL DEFAULT '{}'::jsonb,dependencies JSONB NOT NULL DEFAULT '[]'::jsonb,
 created_by BIGINT NOT NULL,approved_by BIGINT,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
 await pool.query(`CREATE TABLE IF NOT EXISTS aria_revenue_engines(
 id BIGSERIAL PRIMARY KEY,engine_key TEXT NOT NULL UNIQUE,name TEXT NOT NULL,description TEXT NOT NULL DEFAULT '',
 revenue_model TEXT NOT NULL,pricing_unit TEXT NOT NULL,pricing_config JSONB NOT NULL DEFAULT '{}'::jsonb,
 billing_period TEXT NOT NULL DEFAULT 'one_time',currency TEXT NOT NULL DEFAULT 'IRR',
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','validating','enabled','suspended','deprecated')),
 linked_module_keys JSONB NOT NULL DEFAULT '[]'::jsonb,created_by BIGINT NOT NULL,approved_by BIGINT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
 await pool.query(`CREATE TABLE IF NOT EXISTS aria_owner_audit(
 id BIGSERIAL PRIMARY KEY,actor_id BIGINT NOT NULL,action TEXT NOT NULL,target_type TEXT NOT NULL,target_id TEXT NOT NULL,
 before_state JSONB,after_state JSONB,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 )`);
 await pool.query(`CREATE TABLE IF NOT EXISTS aria_ai_findings(
 id BIGSERIAL PRIMARY KEY,severity TEXT NOT NULL,category TEXT NOT NULL,target_type TEXT NOT NULL,target_id TEXT NOT NULL,
 evidence JSONB NOT NULL DEFAULT '{}'::jsonb,root_cause TEXT NOT NULL,proposed_fix TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'detected' CHECK(status IN ('detected','triaged','approved','testing','resolved','rejected')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),resolved_at TIMESTAMPTZ
 )`);
}
function isOwner(user){return Boolean(user && OWNER_IDS.has(String(user.sub)));}
async function handleOwnerCenter(req,res,url,pool,user){
 const p=url.pathname;
 if(!p.startsWith("/api/owner/")&&!p.startsWith("/api/ai-command/"))return false;
 if(!["GET","POST","PATCH"].includes(req.method)){send(res,405,{error:"روش درخواست پشتیبانی نمی‌شود."});return true;}
 if(!user){send(res,401,{error:"ابتدا وارد حساب شوید."});return true;}
 if(!isOwner(user)){send(res,403,{error:"این بخش فقط برای مالک تأییدشده فعال است."});return true;}
 if(!pool){send(res,503,{error:"پایگاه داده پیکربندی نشده است."});return true;}
 try{
  if(p==="/api/owner/profile"&&req.method==="GET"){send(res,200,{product:"ARIA",ownerUserId:String(user.sub),email:user.email||null,capabilities:["modules.manage","revenue.manage","ai.review","audit.read"]});return true;}
  if(p==="/api/owner/modules"&&req.method==="GET"){const q=await pool.query("SELECT id,module_key,name,description,category,version,status,manifest,dependencies,created_at,updated_at FROM aria_product_modules ORDER BY id DESC");send(res,200,{modules:q.rows});return true;}
  if(p==="/api/owner/modules"&&req.method==="POST"){
   const d=await body(req);const key=String(d.module_key||"").trim().toLowerCase();
   if(!/^[a-z][a-z0-9-]{2,63}$/.test(key)||!String(d.name||"").trim()||!String(d.description||"").trim()) {send(res,400,{error:"شناسه معتبر، نام و شرح ماژول الزامی است."});return true;}
   const q=await pool.query("INSERT INTO aria_product_modules(module_key,name,description,category,version,manifest,dependencies,created_by) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8) RETURNING *",[key,String(d.name).slice(0,120),String(d.description).slice(0,1000),String(d.category||"general").slice(0,60),String(d.version||"1.0.0").slice(0,30),JSON.stringify(d.manifest||{}),JSON.stringify(Array.isArray(d.dependencies)?d.dependencies:[]),user.sub]);
   await pool.query("INSERT INTO aria_owner_audit(actor_id,action,target_type,target_id,after_state) VALUES($1,'module.created','module',$2,$3::jsonb)",[user.sub,key,JSON.stringify(q.rows[0])]);send(res,201,{module:q.rows[0]});return true;
  }
  const mod=p.match(/^\/api\/owner\/modules\/([a-z][a-z0-9-]{2,63})$/);
  if(mod&&req.method==="PATCH"){
   const d=await body(req);const status=String(d.status||"");
   if(!["validating","enabled","suspended","deprecated"].includes(status)){send(res,400,{error:"وضعیت نامعتبر است."});return true;}
   if(status==="enabled"&&d.owner_approved!==true){send(res,409,{error:"فعال‌سازی نیازمند تأیید صریح مالک است."});return true;}
   const q=await pool.query("UPDATE aria_product_modules SET status=$1,approved_by=CASE WHEN $1='enabled' THEN $2 ELSE approved_by END,updated_at=NOW() WHERE module_key=$3 RETURNING *",[status,user.sub,mod[1]]);
   if(!q.rowCount){send(res,404,{error:"ماژول یافت نشد."});return true;}
   await pool.query("INSERT INTO aria_owner_audit(actor_id,action,target_type,target_id,after_state) VALUES($1,$2,'module',$3,$4::jsonb)",[user.sub,"module."+status,mod[1],JSON.stringify(q.rows[0])]);send(res,200,{module:q.rows[0]});return true;
  }
  if(p==="/api/owner/revenue-engines"&&req.method==="GET"){const q=await pool.query("SELECT * FROM aria_revenue_engines ORDER BY id DESC");send(res,200,{revenueEngines:q.rows});return true;}
  if(p==="/api/owner/revenue-engines"&&req.method==="POST"){
   const d=await body(req),key=String(d.engine_key||"").trim().toLowerCase(),linked=Array.isArray(d.linked_module_keys)?d.linked_module_keys:[];
   if(!/^[a-z][a-z0-9-]{2,63}$/.test(key)||!String(d.name||"").trim()||!String(d.revenue_model||"").trim()||!String(d.pricing_unit||"").trim()){send(res,400,{error:"شناسه، نام، مدل درآمد و واحد قیمت‌گذاری الزامی است."});return true;}
   if(linked.length){const q=await pool.query("SELECT module_key FROM aria_product_modules WHERE module_key=ANY($1::text[])",[linked]);if(q.rowCount!==new Set(linked).size){send(res,422,{error:"همه ماژول‌های مرتبط باید قبلاً ثبت شده باشند."});return true;}}
   const q=await pool.query("INSERT INTO aria_revenue_engines(engine_key,name,description,revenue_model,pricing_unit,pricing_config,billing_period,currency,linked_module_keys,created_by) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9::jsonb,$10) RETURNING *",[key,String(d.name).slice(0,120),String(d.description||"").slice(0,1000),String(d.revenue_model).slice(0,80),String(d.pricing_unit).slice(0,40),JSON.stringify(d.pricing_config||{}),String(d.billing_period||"one_time"),String(d.currency||"IRR"),JSON.stringify(linked),user.sub]);
   await pool.query("INSERT INTO aria_owner_audit(actor_id,action,target_type,target_id,after_state) VALUES($1,'revenue.created','revenue_engine',$2,$3::jsonb)",[user.sub,key,JSON.stringify(q.rows[0])]);send(res,201,{revenueEngine:q.rows[0]});return true;
  }
  const rev=p.match(/^\/api\/owner\/revenue-engines\/([a-z][a-z0-9-]{2,63})$/);
  if(rev&&req.method==="PATCH"){const d=await body(req),status=String(d.status||"");if(!["validating","enabled","suspended","deprecated"].includes(status)){send(res,400,{error:"وضعیت نامعتبر است."});return true;}if(status==="enabled"&&d.owner_approved!==true){send(res,409,{error:"فعال‌سازی موتور درآمدی نیازمند تأیید مالک است."});return true;}const q=await pool.query("UPDATE aria_revenue_engines SET status=$1,approved_by=CASE WHEN $1='enabled' THEN $2 ELSE approved_by END,updated_at=NOW() WHERE engine_key=$3 RETURNING *",[status,user.sub,rev[1]]);if(!q.rowCount){send(res,404,{error:"موتور درآمدی یافت نشد."});return true;}await pool.query("INSERT INTO aria_owner_audit(actor_id,action,target_type,target_id,after_state) VALUES($1,$2,'revenue_engine',$3,$4::jsonb)",[user.sub,"revenue."+status,rev[1],JSON.stringify(q.rows[0])]);send(res,200,{revenueEngine:q.rows[0]});return true;}
  if(p==="/api/ai-command/overview"&&req.method==="GET"){const [m,r,f]=await Promise.all([pool.query("SELECT status,COUNT(*)::int count FROM aria_product_modules GROUP BY status"),pool.query("SELECT status,COUNT(*)::int count FROM aria_revenue_engines GROUP BY status"),pool.query("SELECT severity,COUNT(*)::int count FROM aria_ai_findings WHERE status NOT IN ('resolved','rejected') GROUP BY severity")]);send(res,200,{product:"ARIA",modules:m.rows,revenueEngines:r.rows,openFindings:f.rows,autonomousProductionChanges:false});return true;}
  if(p==="/api/ai-command/findings"&&req.method==="GET"){const q=await pool.query("SELECT * FROM aria_ai_findings ORDER BY id DESC LIMIT 100");send(res,200,{findings:q.rows});return true;}
  if(p==="/api/ai-command/analyze"&&req.method==="POST"){
   const [mods,revs]=await Promise.all([pool.query("SELECT module_key,status,dependencies FROM aria_product_modules"),pool.query("SELECT engine_key,status,linked_module_keys FROM aria_revenue_engines")]);const keys=new Set(mods.rows.map(x=>x.module_key));const findings=[];
   for(const m of mods.rows){for(const dep of (m.dependencies||[])){if(!keys.has(dep))findings.push({severity:"medium",category:"dependency",target_type:"module",target_id:m.module_key,root_cause:"وابستگی ثبت‌شده وجود ندارد: "+dep,proposed_fix:"ابتدا ماژول وابسته را ثبت کنید یا manifest را اصلاح کنید.",evidence:{dependency:dep}});}}
   for(const e of revs.rows){for(const dep of (e.linked_module_keys||[])){if(!keys.has(dep))findings.push({severity:"high",category:"revenue_dependency",target_type:"revenue_engine",target_id:e.engine_key,root_cause:"موتور درآمدی به ماژول ناموجود متصل است: "+dep,proposed_fix:"ارتباط را اصلاح کنید؛ موتور را فعال نکنید.",evidence:{module:dep}});}}
   for(const f of findings){await pool.query("INSERT INTO aria_ai_findings(severity,category,target_type,target_id,evidence,root_cause,proposed_fix) VALUES($1,$2,$3,$4,$5::jsonb,$6,$7)",[f.severity,f.category,f.target_type,f.target_id,JSON.stringify(f.evidence),f.root_cause,f.proposed_fix]);}
   send(res,200,{analyzed:true,findingsCreated:findings.length,findings});return true;
  }
  if(p==="/api/owner/audit"&&req.method==="GET"){const q=await pool.query("SELECT * FROM aria_owner_audit ORDER BY id DESC LIMIT 200");send(res,200,{events:q.rows});return true;}
  send(res,404,{error:"مسیر مرکز مالک/هوش مصنوعی پیدا نشد."});return true;
 }catch(err){if(err.message==="BODY_TOO_LARGE"){send(res,413,{error:"حجم درخواست بیش از حد مجاز است."});return true;}if(err instanceof SyntaxError){send(res,400,{error:"JSON درخواست معتبر نیست."});return true;}if(err.code==="23505"){send(res,409,{error:"این شناسه قبلاً ثبت شده است."});return true;}console.error("ARIA owner center:",err.message);send(res,500,{error:"عملیات مرکز مالک/هوش مصنوعی انجام نشد."});return true;}
}
module.exports={initOwnerCenter,handleOwnerCenter};
