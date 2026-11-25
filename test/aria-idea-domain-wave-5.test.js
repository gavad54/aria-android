"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { MODULES } = require("../backend/modules");
const cases = [
 ["041",{client:"Acme",scope:["Discovery","Implementation"],deliverables:["Plan","Report"],assumptions:["Client supplies data"],exclusions:["Third-party fees"],milestones:[{name:"Kickoff",date:"2026-12-01"}]},"proposalDraft",x=>x.sections.length>=4&&x.approvalState==="OWNER_REVIEW_REQUIRED"&&x.contractExecuted===false],
 ["042",{consent:true,customer:{id:"c1",name:"Customer A"},interactions:[{id:"i1",type:"support",summary:"Asked about setup",occurredAt:"2026-11-01"}]},"customerProfile",x=>x.customerId==="c1"&&x.interactions.length===1&&x.consentRecorded],
 ["043",{requiredAssets:["product-page","pricing","case-study","contact"],providedAssets:["product-page","contact"]},"readinessAssessment",x=>x.gaps.length===2&&x.score===50&&x.launchState==="NOT_APPROVED"],
 ["044",{feedback:[{id:"f1",rating:5,comment:"Fast response",sentiment:"positive"},{id:"f2",rating:2,comment:"Slow resolution",sentiment:"negative"}]},"experienceReport",x=>x.feedbackCount===2&&x.averageRating===3.5&&x.actions.length>=1],
 ["045",{products:[{id:"p1",name:"Notebook",sku:"N-1",price:12,currency:"USD",attributes:{pages:100}},{id:"p2",name:"Pen",sku:"P-2",price:2,currency:"USD"}],requiredFields:["name","sku","price","currency"]},"productCatalog",x=>x.products.length===2&&x.products[0].completeness===1&&x.publishState==="DRAFT_ONLY"],
 ["046",{quotes:[{supplierId:"s1",supplierName:"Supplier A",sku:"X",quantity:10,unitPrice:5,currency:"USD",leadDays:7},{supplierId:"s2",supplierName:"Supplier B",sku:"X",quantity:10,unitPrice:4,currency:"USD",leadDays:12}]},"supplierComparison",x=>x.comparableGroups.length===1&&x.comparableGroups[0].quotes.length===2&&x.purchaseOrderCreated===false],
 ["047",{team:[{id:"u1",skills:["design"],capacityHours:20},{id:"u2",skills:["engineering"],capacityHours:10}],assignments:[{id:"a1",personId:"u1",hours:15,skill:"design"},{id:"a2",personId:"u1",hours:10,skill:"design"}]},"capacityPlan",x=>x.members.length===2&&x.overallocatedMembers.includes("u1")&&x.assignments.length===2],
 ["048",{signals:[{id:"s1",topic:"solar",sourceId:"report-1",observedAt:"2026-11-01",strength:3},{id:"s2",topic:"solar",sourceId:"report-2",observedAt:"2026-11-05",strength:4},{id:"s3",topic:"storage",sourceId:"report-3",strength:2}]},"opportunityRadar",x=>x.opportunities.length===2&&x.opportunities[0].evidenceCount===2&&x.forecastClaim==="NOT_ESTABLISHED"],
 ["049",{knowledge:[{id:"k1",title:"Account setup",body:"Open settings and choose profile",sourceId:"doc-1"},{id:"k2",title:"Billing",body:"Invoices are available monthly",sourceId:"doc-2"}],topics:["setup","billing"]},"helpCenterDraft",x=>x.articles.length===2&&x.articles.every(a=>a.sourceIds.length>0)&&x.publishState==="DRAFT_ONLY"],
 ["050",{metrics:[{name:"resolution_time",before:10,after:6,unit:"hours"},{name:"satisfaction",before:3,after:4,unit:"score"}]},"valueMeasurement",x=>x.results.length===2&&x.results[0].absoluteChange===-4&&x.causalImpactClaim==="NOT_ESTABLISHED"]
];
for(const [sequence,context,key,predicate] of cases){
 test("ARIA-IDEA-BACKLOG-"+sequence+" runs a dedicated domain workflow",async()=>{
  const id="ARIA-IDEA-BACKLOG-"+sequence;
  const module=MODULES.find(x=>x.manifest.moduleId===id);assert.ok(module,id);
  const result=await module.execute({goal:"Prepare a reviewable domain result for "+id,context,consent:true},{actorId:"wave-five-actor",tenantId:"wave-five-tenant"});
  const domain=result.artifact.domainResult;
  assert.equal(result.domainLogicExecuted,true);
  assert.equal(domain.tenantScope,"wave-five-tenant");
  assert.ok(domain.domainOutput&&domain.domainOutput[key],"missing "+key);
  assert.equal(predicate(domain.domainOutput[key]),true,"incomplete "+key);
  assert.equal(domain.moduleSpecificProfile.specialization,domain.artifactType);
  assert.equal(result.externalExecutionPerformed,false);
  assert.equal(result.paymentExecuted,false);
  assert.equal(result.productionVerified,false);
 });
}
test("wave-five handlers reject invalid goal and missing tenant",async()=>{
 const module=MODULES.find(x=>x.manifest.moduleId==="ARIA-IDEA-BACKLOG-041");
 await assert.rejects(module.execute({goal:"",context:{},consent:true},{actorId:"a",tenantId:"t"}),{message:"MODULE_INPUT_MISSING"});
 await assert.rejects(module.execute({goal:"Draft proposal",context:{}},{actorId:"a"}),{message:"MODULE_TENANT_REQUIRED"});
});
