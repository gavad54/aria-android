"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {spawn}=require("node:child_process");

test("ARIA expansion catalog preserves 639 and exposes 50 needs, 4 candidates and 20 revenue models",async()=>{
 const port=33000+Math.floor(Math.random()*1000);
 const env={...process.env,PORT:String(port)};
 delete env.DATABASE_URL;delete env.ARIA_JWT_SECRET;delete env.OPENAI_API_KEY;
 const child=spawn(process.execPath,["server.js"],{env,stdio:"ignore"});
 try{
  let ready=false;
  for(let i=0;i<60;i++){try{const r=await fetch("http://127.0.0.1:"+port+"/health");if(r.ok){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,100));}
  assert.equal(ready,true,"server should start");
  const base="http://127.0.0.1:"+port;
  const summaryResponse=await fetch(base+"/api/aria-expansion/summary");
  const summary=await summaryResponse.json();
  assert.equal(summaryResponse.status,200);
  assert.equal(summary.canonicalModuleCount,639);
  assert.equal(summary.problemRecords,50);
  assert.equal(summary.uniqueProblemCapabilities,49);
  assert.equal(summary.parentDomains,5);
  assert.equal(summary.historicalCandidates,4);
  assert.equal(summary.revenueModels,20);
  assert.equal(summary.liveRevenueEnabled,false);

  const modulesResponse=await fetch(base+"/api/aria-expansion/modules");
  const modules=await modulesResponse.json();
  assert.equal(modulesResponse.status,200);
  assert.equal(modules.parents.length,5);
  assert.equal(modules.problems.length,50);
  assert.equal(new Set(modules.problems.map(x=>x.id)).size,50);
  assert.ok(modules.problems.every(x=>x.engine&&x.parentDomain&&x.sourceProblemNumber&&Number.isInteger(x.hostCanonicalContractId)));
  assert.equal(new Set(modules.problems.map(x=>x.hostCanonicalContractId)).size,5);
  const petTravel=modules.problems.find(x=>x.sourceProblemNumber===48);
  const petHome=modules.problems.find(x=>x.sourceProblemNumber===29);
  assert.equal(petTravel.aliasOf,petHome.id,"travel pet-care entry must reuse the home pet-care capability");

  const candidatesResponse=await fetch(base+"/api/aria-expansion/candidates");
  const candidates=await candidatesResponse.json();
  assert.equal(candidatesResponse.status,200);
  assert.equal(candidates.candidates.length,4);
  assert.ok(candidates.candidates.every(x=>x.engine&&x.executionBoundary));

  const revenueResponse=await fetch(base+"/api/aria-expansion/revenue-models");
  const revenue=await revenueResponse.json();
  assert.equal(revenueResponse.status,200);
  assert.equal(revenue.models.length,20);
  assert.ok(revenue.models.every(x=>x.state==="DESIGNED_NOT_MONETIZED"));

  const planResponse=await fetch(base+"/api/aria-expansion/modules/problem-01/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({goal:"پیدا کردن تعمیرکار مناسب"})});
  const plan=await planResponse.json();
  assert.equal(planResponse.status,200);
  assert.equal(plan.plan.moduleId,"problem-01");
  assert.ok(plan.plan.steps.length>=3);
  assert.equal(plan.plan.externalExecution.executed,false);

  const badPlan=await fetch(base+"/api/aria-expansion/modules/problem-01/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({goal:"x"})});
  assert.equal(badPlan.status,400);
  const unknown=await fetch(base+"/api/aria-expansion/modules/problem-99/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({goal:"یک هدف معتبر"})});
  assert.equal(unknown.status,404);

  const simResponse=await fetch(base+"/api/aria-expansion/scenarios/simulate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({scenarios:[{name:"base",value:100},{name:"optimistic",value:120},{name:"conservative",value:80}]})});
  const sim=await simResponse.json();
  assert.equal(simResponse.status,200);
  assert.equal(sim.results.length,3);
  assert.equal(sim.results[0].value,100);
  assert.equal(sim.disclaimer.length>0,true);
  assert.equal(sim.liveActionExecuted,false);

  const authzResponse=await fetch(base+"/api/aria-expansion/autonomy/authorize",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({agentId:"agent-1",action:"publish"})});
  const authz=await authzResponse.json();
  assert.equal(authzResponse.status,200);
  assert.equal(authz.decision,"DENY");
  assert.equal(authz.reason,"AUTH_OR_POLICY_STORE_UNAVAILABLE");

  const unauthWork=await fetch(base+"/api/aria-expansion/work-items");assert.equal(unauthWork.status,401);
  const unauthIntents=await fetch(base+"/api/aria-expansion/intents");assert.equal(unauthIntents.status,401);
  const unauthOwner=await fetch(base+"/api/aria-expansion/owner/overview");assert.equal(unauthOwner.status,401);
  const unauthPolicy=await fetch(base+"/api/aria-expansion/autonomy/policies",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({agentId:"agent-1",action:"draft",decision:"ALLOW"})});assert.equal(unauthPolicy.status,401);

  const home=await fetch(base+"/");const homeHtml=await home.text();assert.match(homeHtml,/id="aria-expansion"/);assert.match(homeHtml,/aria-expansion.js/);
  const expansionJs=await fetch(base+"/aria-expansion.js");assert.equal(expansionJs.status,200);assert.match(await expansionJs.text(),/api\/aria-expansion\/modules/);
 }finally{
  await new Promise(resolve=>{if(child.exitCode!==null||child.signalCode!==null)return resolve();child.once("exit",resolve);child.kill();});
 }
});
