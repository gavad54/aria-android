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
  assert.equal(summary.ideaModules,50);
  assert.equal(summary.controlModules,4);
  assert.equal(summary.totalModules,54);
  assert.equal(summary.uniqueProblemCapabilities,49);
  assert.equal(summary.parentDomains,5);
  assert.equal(summary.historicalCandidates,4);
  assert.equal(summary.revenueModels,20);
  assert.equal(summary.engines,53);
  assert.equal(summary.liveRevenueEnabled,false);

  const modulesResponse=await fetch(base+"/api/aria-expansion/modules");
  const modules=await modulesResponse.json();
  assert.equal(modulesResponse.status,200);
  assert.equal(modules.parents.length,5);
  assert.equal(modules.problems.length,50);
  assert.equal(modules.modules.length,54);
  assert.equal(modules.ideaModules,50);
  assert.equal(modules.controlModules,4);
  assert.equal(modules.totalModules,54);
  assert.equal(modules.mergedDomainPacks.length,7);
  assert.deepEqual(modules.mergedDomainPacks.map(x=>x.id),["ARVAND","CHARSU","GANJINEH","NEGAH","SEPEHR","NAMA","PAYAM"]);
  assert.equal(new Set(modules.modules.map(x=>x.moduleId)).size,54);
  assert.equal(modules.modules.filter(x=>x.moduleType==="IDEA_DERIVED_PRODUCT_MODULE").length,50);
  assert.equal(modules.modules.filter(x=>x.moduleType==="CONTROL_AND_GOVERNANCE_MODULE").length,4);
  assert.equal(new Set(modules.problems.map(x=>x.id)).size,50);
  assert.ok(modules.problems.every(x=>x.engine&&x.parentDomain&&x.sourceProblemNumber&&Number.isInteger(x.hostCanonicalContractId)));
  assert.equal(new Set(modules.problems.map(x=>x.hostCanonicalContractId)).size,5);
  const petTravel=modules.problems.find(x=>x.sourceProblemNumber===48);
  const petHome=modules.problems.find(x=>x.sourceProblemNumber===29);
  assert.equal(petTravel.aliasOf,petHome.id,"travel pet-care entry must reuse the home pet-care capability");
  const petTravelModule=modules.modules.find(x=>x.sourceProblemNumber===48);
  const petHomeModule=modules.modules.find(x=>x.sourceProblemNumber===29);
  assert.notEqual(petTravelModule.moduleId,petHomeModule.moduleId,"all 50 idea entries retain distinct module IDs");
  assert.equal(petTravelModule.engineSharing,"SHARED_WITH_IDEA_029_DISTINCT_TRAVEL_ENTRYPOINT");
  assert.equal(petTravelModule.hostCanonicalContractId,233);
  assert.equal(petTravelModule.entryPointCanonicalContractId,235);
  assert.equal(petTravel.hostCanonicalContractId,petHome.hostCanonicalContractId);
  assert.equal(petTravel.entryPointCanonicalContractId,235);

  const enginesResponse=await fetch(base+"/api/aria-expansion/engines");
  const engines=await enginesResponse.json();
  assert.equal(enginesResponse.status,200);
  assert.equal(engines.engines.length,53);
  assert.equal(engines.problemEngines,49);
  assert.equal(engines.candidateEngines,4);
  assert.ok(engines.engines.every(x=>x.contract&&Array.isArray(x.contract.operations)));

  const candidatesResponse=await fetch(base+"/api/aria-expansion/candidates");
  const candidates=await candidatesResponse.json();
  assert.equal(candidatesResponse.status,200);
  assert.equal(candidates.candidates.length,4);
  assert.ok(candidates.candidates.every(x=>x.engine&&x.executionBoundary));

  const subscriptionSimulation=await fetch(base+"/api/aria-expansion/revenue-models/simulate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({modelId:"revenue-model-01",assumptions:{activeSubscribers:10,monthlyPrice:5,fixedCosts:10,variableCosts:5}})});
  const subscriptionData=await subscriptionSimulation.json();
  assert.equal(subscriptionSimulation.status,200);
  assert.equal(subscriptionData.simulation.grossRevenueEstimate,50);
  assert.equal(subscriptionData.simulation.netContributionEstimate,35);
  assert.equal(subscriptionData.simulation.paymentExecuted,false);
  const invalidRate=await fetch(base+"/api/aria-expansion/revenue-models/simulate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({modelId:"revenue-model-02",assumptions:{freeUsers:100,conversionRate:2,monthlyPrice:10}})});
  assert.equal(invalidRate.status,400);
  const unknownRevenueModel=await fetch(base+"/api/aria-expansion/revenue-models/simulate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({modelId:"revenue-model-99",assumptions:{}})});
  assert.equal(unknownRevenueModel.status,404);

  const revenueResponse=await fetch(base+"/api/aria-expansion/revenue-models");
  const revenue=await revenueResponse.json();
  assert.equal(revenueResponse.status,200);
  assert.equal(revenue.models.length,20);
  assert.ok(revenue.models.every(x=>x.state==="DESIGNED_NOT_MONETIZED"));
  const simulationItems=revenue.models.map(model=>{const assumptions={};for(const key of model.calculation.requiredInputs){if(key.toLowerCase().includes("rate"))assumptions[key]=0.1;else if(key==="cpm")assumptions[key]=8;else if(key==="months")assumptions[key]=1;else if(key.toLowerCase().includes("price")||key.toLowerCase().includes("fee")||key.toLowerCase().includes("commission"))assumptions[key]=10;else assumptions[key]=100;}return {modelId:model.id,assumptions};});
  const batchResponse=await fetch(base+"/api/aria-expansion/revenue-models/simulate-batch",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({items:simulationItems})});
  const batchResult=await batchResponse.json();
  assert.equal(batchResponse.status,200);
  assert.equal(batchResult.total,20);
  assert.ok(batchResult.simulations.every(x=>x.state==="SIMULATED_NOT_ACTUAL"&&x.paymentExecuted===false&&Number.isFinite(x.grossRevenueEstimate)));


  const planResponse=await fetch(base+"/api/aria-expansion/modules/problem-01/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({goal:"پیدا کردن تعمیرکار مناسب"})});
  const plan=await planResponse.json();
  assert.equal(planResponse.status,200);
  assert.equal(plan.plan.moduleId,"problem-01");
  assert.ok(plan.plan.steps.length>=3);
  assert.equal(plan.plan.externalExecution.executed,false);

  const newModulePlanResponse=await fetch(base+"/api/aria-expansion/modules/ARIA-IDEA-MODULE-001/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({goal:"بررسی و انتخاب تعمیرکار مطمئن"})});
  const newModulePlan=await newModulePlanResponse.json();
  assert.equal(newModulePlanResponse.status,200);
  assert.equal(newModulePlan.plan.moduleId,"ARIA-IDEA-MODULE-001");
  assert.equal(newModulePlan.plan.hostCanonicalContractId,237);
  const controlPlanResponse=await fetch(base+"/api/aria-expansion/modules/ARIA-CONTROL-MODULE-001/plan",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({goal:"تطبیق نیاز و عرضه‌کننده با رضایت"})});
  const controlPlan=await controlPlanResponse.json();
  assert.equal(controlPlanResponse.status,200);
  assert.equal(controlPlan.plan.moduleId,"ARIA-CONTROL-MODULE-001");

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
  const unauthWorkItems=await fetch(base+"/api/aria-expansion/work-items",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({moduleId:"problem-01",title:"Plan title"})});assert.equal(unauthWorkItems.status,401);
    const unauthProvider=await fetch(base+"/api/aria-expansion/providers",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({displayName:"Provider",category:"repair",serviceArea:"Baku"})});assert.equal(unauthProvider.status,401);
  const unauthProviderVerify=await fetch(base+"/api/aria-expansion/providers/1/verification",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({status:"verified"})});assert.equal(unauthProviderVerify.status,401);
  const unauthMatches=await fetch(base+"/api/aria-expansion/intents/1/matches");assert.equal(unauthMatches.status,401);
  const unauthPolicy=await fetch(base+"/api/aria-expansion/autonomy/policies",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({agentId:"agent-1",action:"draft",decision:"ALLOW"})});assert.equal(unauthPolicy.status,401);

  const home=await fetch(base+"/");const homeHtml=await home.text();assert.match(homeHtml,/id="aria-expansion"/);assert.match(homeHtml,/aria-expansion.js/);
  const expansionJs=await fetch(base+"/aria-expansion.js");assert.equal(expansionJs.status,200);const expansionSource=await expansionJs.text();assert.ok(expansionSource.includes("/api/aria-expansion/revenue-models/simulate"));assert.ok(expansionSource.includes("/api/aria-expansion/modules"));
 }finally{
  await new Promise(resolve=>{if(child.exitCode!==null||child.signalCode!==null)return resolve();child.once("exit",resolve);child.kill();});
 }
});
