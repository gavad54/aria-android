"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {MODULES}=require("../backend/modules");
const cases=[
 ["ARIA-CATALOG-651",{goal:"Coordinate product launch",context:{requests:[{id:"r1",type:"release",urgency:"high"},{id:"r2",type:"support",urgency:"low"}]}},"commandCenter",x=>x.workItems.length===2&&x.priorityOrder[0]==="r1"],
 ["ARIA-CATALOG-652",{goal:"Launch local tutoring service",context:{idea:"Tutoring marketplace",resources:["two tutors"],risks:["seasonality"]}},"ideaToValue",x=>x.stages.length>=4&&x.assumptions.length===1],
 ["ARIA-CATALOG-653",{goal:"Prioritize expansion",context:{opportunities:[{id:"o1",value:9,effort:3,evidenceCount:2},{id:"o2",value:5,effort:8,evidenceCount:0}]}},"opportunityPortfolio",x=>x.rankings.length===2&&x.rankings[0].id==="o1"],
 ["ARIA-CATALOG-654",{goal:"Teach spreadsheet basics",context:{learningObjectives:["format cells","use formulas"],learnerLevel:"beginner",lessons:[{id:"l1",objective:"format cells"},{id:"l2",objective:"use formulas"}]}},"learningProgram",x=>x.modules.length===2&&x.objectiveCoverage===1],
 ["ARIA-CATALOG-655",{goal:"Onboard a customer",context:{steps:[{id:"a",dependsOn:[]},{id:"b",dependsOn:["a"]},{id:"c",dependsOn:["b"]}]}},"workflowGraph",x=>x.valid===true&&x.executionOrder.join(",")==="a,b,c"],
 ["ARIA-CATALOG-656",{goal:"Review risky action",context:{action:{type:"external_publish",dataClass:"confidential",consent:false},policies:[{id:"p1",when:"external_publish",requiresConsent:true}]}},"trustDecision",x=>x.decision==="DENY"&&x.riskFlags.length>0],
 ["ARIA-CATALOG-657",{goal:"Create Instagram cover",context:{platform:"instagram",format:"cover",brandColors:["#111111","#ffffff"],message:"New collection",consent:true}},"creativeBrief",x=>x.assetSpec.aspectRatio==="1:1"&&x.rightsGate==="CONSENT_RECORDED"],
 ["ARIA-CATALOG-658",{goal:"Retouch supplied photo",context:{sourceAssetId:"asset-1",editGoals:["remove dust","correct exposure"],ownershipConfirmed:true,consent:true}},"imageEditPlan",x=>x.edits.length===2&&x.originalPreservation==="REQUIRED"],
 ["ARIA-CATALOG-659",{goal:"Prepare professional profile portrait",context:{useCase:"professional profile",background:"neutral",consent:true,sourceAssetId:"portrait-1"}},"portraitBrief",x=>x.outputFormats.length>=2&&x.consentState==="RECORDED"],
 ["ARIA-CATALOG-660",{goal:"Prepare product hero photo",context:{productId:"sku-1",productName:"Ceramic mug",background:"light neutral",views:["front","detail"],ownershipConfirmed:true}},"productPhotoPlan",x=>x.shots.length===2&&x.productFidelity==="MUST_PRESERVE"]
];
for(const [id,input,key,predicate] of cases){
 test(id+" executes a dedicated commercial domain workflow",async()=>{
  const module=MODULES.find(m=>m.manifest.moduleId===id);assert.ok(module,id);
  const result=await module.execute(input,{actorId:"catalog-wave1-actor",tenantId:"catalog-wave1-tenant"});
  const domain=result.artifact.domainResult;
  assert.equal(result.domainLogicExecuted,true);
  assert.equal(domain.tenantScope,"catalog-wave1-tenant");
  assert.ok(domain.domainOutput&&domain.domainOutput[key],"missing "+key);
  assert.equal(predicate(domain.domainOutput[key]),true,"incomplete "+key);
  assert.equal(domain.commercialization.billingEnabled,false);
  assert.equal(domain.paymentExecuted,false);
  assert.equal(domain.productionVerified,false);
 });
}
