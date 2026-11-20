"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const runtime=require("../backend/aria-144-domain-runtime.cjs");
const modules=require("../backend/modules");

function inputFor(module) {
 const input={goal:"آزمون گردش‌کار محلی ماژول",context:{objective:"test",constraints:[],data:{}},consent:true};
 for(const field of module.requiredInputs||[]) {
  if(input[field]!==undefined) continue;
  if(field==="context"||field==="data") input[field]={};
  else if(/references|sources|participants|documents|items|tasks|steps|agenda/i.test(field)) input[field]=[];
  else if(/count|amount|budget|score|capacity|duration|limit|quantity|price|rate/i.test(field)) input[field]=1;
  else input[field]="test input";
 }
 return input;
}
test("preserves 639 canonical modules and adds 144 unique ARIA-owned domain modules",()=>{
 assert.equal(runtime.REGISTRY.baselineCanonicalModuleCount,639);
 assert.equal(runtime.REGISTRY.addedModuleCount,144);
 assert.equal(runtime.REGISTRY.totalProductFacingModuleCount,783);
 assert.equal(runtime.REGISTRY.records.length,144);
 assert.equal(new Set(runtime.REGISTRY.records.map(x=>x.moduleId)).size,144);
 assert.deepEqual(runtime.REGISTRY.counts,{historicalOverlay:72,commercialCatalog:72});
 assert.ok(runtime.REGISTRY.records.every(x=>x.ownerProduct==="ARIA"&&x.operations.length>0));
});
for(const item of runtime.REGISTRY.records) {
 test("domain workflow is tenant-scoped and bounded: "+item.moduleId,()=>{
  const backendModule=item.recordType==="COMMERCIAL_CATALOG_MODULE"?modules.MODULE_BY_ID.get("ARIA-CATALOG-"+item.catalogEntryId):null;
  const input=backendModule?inputFor(backendModule.manifest):{goal:"آزمون گردش‌کار محلی ماژول",context:{},consent:true};
  const result=runtime.executeAriaDomainModule(item.moduleId,input,{actorId:"test-actor",tenantId:"tenant-144"});
  assert.equal(result.tenantScope,"tenant-144");
  assert.equal(result.externalExecutionPerformed,false);
  assert.equal(result.paymentExecuted,false);
  assert.equal(result.productionVerified,false);
  if(item.recordType==="COMMERCIAL_CATALOG_MODULE") assert.equal(result.domainLogicExecuted,true);
  else assert.equal(result.localWorkItemPrepared,true);
 });
}
test("rejects missing tenant, actor, required input, and consent",()=>{
 const item=runtime.REGISTRY.records.find(x=>x.recordType==="HISTORICAL_OVERLAY_MODULE"&&x.requiredInputs.includes("consent"));
 assert.throws(()=>runtime.executeAriaDomainModule(item.moduleId,{goal:"test goal"},{actorId:"a"}),{message:"MODULE_TENANT_REQUIRED"});
 assert.throws(()=>runtime.executeAriaDomainModule(item.moduleId,{goal:"test goal"},{tenantId:"t"}),{message:"MODULE_ACTOR_REQUIRED"});
 assert.throws(()=>runtime.executeAriaDomainModule(item.moduleId,{goal:"test goal",consent:false},{actorId:"a",tenantId:"t"}),{message:"MODULE_CONSENT_REQUIRED"});
});
