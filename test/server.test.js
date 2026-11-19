"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const {once}=require("node:events");
test("ARIA API health, modules, validation, planning and auth boundaries",async()=>{
 const port=32000+Math.floor(Math.random()*1000);
 const env={...process.env,PORT:String(port)};
 delete env.DATABASE_URL;delete env.ARIA_JWT_SECRET;delete env.OPENAI_API_KEY;
 const child=spawn(process.execPath,["server.js"],{env,stdio:"ignore"});
 try{
  let ready=false;
  for(let i=0;i<50;i++){try{const r=await fetch("http://127.0.0.1:"+port+"/health");if(r.ok){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,100));}
  assert.equal(ready,true,"server should start");
  const base="http://127.0.0.1:"+port;
  const h=await fetch(base+"/api/health");const hd=await h.json();assert.equal(h.status,200);assert.equal(hd.ok,true);assert.equal(hd.databaseConfigured,false);
  const home=await fetch(base+"/");const homeHtml=await home.text();assert.equal(home.status,200);const csp=home.headers.get("content-security-policy")||"";assert.match(csp,/script-src 'self'/);assert.doesNotMatch(csp,/script-src[^;]*unsafe-inline/);assert.match(homeHtml,/<script src="\/app\.js" defer><\/script>/);
  const appJs=await fetch(base+"/app.js");assert.equal(appJs.status,200);assert.match(appJs.headers.get("content-type")||"",/javascript/);assert.match(await appJs.text(),/page-generate/);
  const m=await fetch(base+"/api/modules");const md=await m.json();assert.equal(m.status,200);assert.equal(md.catalogVersion,"web-prototype-0.5.0");assert.equal(md.modules.length,72);
  const moduleIds=md.modules.map(x=>x.id);assert.equal(new Set(moduleIds).size,moduleIds.length,"module IDs must be unique");
  assert.ok(md.modules.every(x=>!Object.prototype.hasOwnProperty.call(x,"legacyProduct")),"retired product labels must not leak into the public API");
  assert.doesNotMatch(JSON.stringify(md.modules),/ARVAND|CHARSU|GANJINEH|NEGAH|SEPEHR|NAMA|PAYAM/i,"retired sub-product names must not appear in the public API");
  assert.ok(md.modules.every(x=>x.product==="ARIA"&&x.domain!=="unclassified"),"every current module must have an ARIA domain");
  assert.ok(md.modules.every(x=>x.status==="active"&&x.runtimeState==="ACTIVE_LOCAL_WORKFLOW"),"all catalog local workflows must be active");
  assert.ok(md.modules.every(x=>Number.isInteger(x.catalogEntryId)&&x.catalogEntryId>=651&&x.catalogEntryId<=722),"every catalog record must have a stable catalog entry ID");
  assert.equal(new Set(md.modules.map(x=>x.catalogEntryId)).size,72,"catalog entry IDs must be unique");
  assert.ok(md.modules.every(x=>Number.isInteger(x.capabilityContractId)&&x.capabilityContractId>=1&&x.capabilityContractId<=647),"every catalog record must resolve to one of the 639 canonical contracts");
  assert.ok(md.modules.every(x=>x.aliasOfContractId===x.capabilityContractId),"catalog aliases must resolve to their canonical contract");
  assert.ok(md.modules.every(x=>["foundation","prototype","planned"].includes(x.catalogMaturity)),"original catalog maturity must remain visible");
  const activePlan=await fetch(base+"/api/modules/651/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({command:"برای کسب‌وکارم برنامه اقدام بساز"})});
  const activePlanData=await activePlan.json();assert.equal(activePlan.status,200);assert.equal(activePlanData.ok,true);assert.equal(activePlanData.plan.catalogEntryId,651);assert.equal(activePlanData.plan.capabilityContractId,md.modules[0].capabilityContractId);assert.equal(activePlanData.plan.executionStatus,"COMPLETED_LOCAL_WORKFLOW");assert.ok(activePlanData.plan.steps.length>=3);
  assert.equal(activePlanData.plan.externalExecution.executed,false);
  const invalidCatalogPlan=await fetch(base+"/api/modules/651/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({command:"x"})});assert.equal(invalidCatalogPlan.status,400);
  const unknownCatalogPlan=await fetch(base+"/api/modules/9999/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({command:"برنامه اقدام بساز"})});assert.equal(unknownCatalogPlan.status,404);
  const summaryResponse=await fetch(base+"/api/modules/summary");const summary=await summaryResponse.json();assert.equal(summaryResponse.status,200);assert.equal(summary.product,"ARIA");assert.equal(summary.total,72);assert.equal(summary.linkedCatalogRecords,72);assert.equal(summary.contractCount,639);assert.equal(summary.catalogEntryCount,72);assert.equal(summary.aliasCount,72);assert.equal(summary.uniqueAliasTargets,47);assert.deepEqual(summary.catalogEntryIdRange,[651,722]);assert.deepEqual(summary.executionStates,{foundation:2,prototype:5,planned:65});assert.deepEqual(summary.runtimeStates,{ACTIVE_LOCAL_WORKFLOW:72});assert.equal(Object.values(summary.domains).reduce((a,b)=>a+b,0),72);assert.ok(summary.limitations.some(x=>x.includes("External actions remain gated")));
  const bad=await fetch(base+"/api/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:" "})});assert.equal(bad.status,400);
  const long=await fetch(base+"/api/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:"x".repeat(2001)})});assert.equal(long.status,400);
  const plan=await fetch(base+"/api/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:"برای ایده کسب و کار من برنامه بده"})});
  const pd=await plan.json();assert.equal(plan.status,200);assert.equal(pd.ok,true);assert.equal(pd.plan.phases.length,3);assert.equal(pd.plan.category,"business");assert.equal(pd.plan.source,"rule-based");
  const legacy=await fetch(base+"/api/intent",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({intent:"برنامه‌ریزی"})});assert.equal(legacy.status,200);assert.equal((await legacy.json()).accepted,true);
  const unauth=await fetch(base+"/api/plans");assert.equal(unauth.status,401);
  const pagesUnauth=await fetch(base+"/api/pages");assert.equal(pagesUnauth.status,401);
  const createPageUnauth=await fetch(base+"/api/pages",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({prompt:"برای فروشگاه پوشاک صفحه بساز"})});assert.equal(createPageUnauth.status,401);
  const invalidEmail=await fetch(base+"/api/auth/register",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"not-an-email",password:"123456789012"})});assert.equal(invalidEmail.status,400);
  const register=await fetch(base+"/api/auth/register",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"test@example.com",password:"123456789012"})});assert.equal(register.status,503);
  const malformed=await fetch(base+"/api/plan",{method:"POST",headers:{"content-type":"application/json"},body:"{bad json"});assert.equal(malformed.status,400);
  const notFound=await fetch(base+"/api/nope");assert.equal(notFound.status,404);
 }finally{await new Promise(resolve=>{if(child.exitCode!==null||child.signalCode!==null)return resolve();child.once("exit",resolve);child.kill();});}
});
