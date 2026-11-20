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
  else if(field==="constraints"||/references|sources|participants|documents|items|tasks|steps|agenda/i.test(field)) input[field]=[];
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
 assert.deepEqual(runtime.REGISTRY.executionMaturity,{historicalOverlayDomainLogic:72,historicalOverlayWorkItemOnly:0,commercialCatalogContractModules:72,productionVerified:0});
 assert.ok(runtime.REGISTRY.records.every(x=>x.ownerProduct==="ARIA"&&x.operations.length>0));
});
for(const item of runtime.REGISTRY.records) {
 test("domain workflow is tenant-scoped and bounded: "+item.moduleId,async()=>{
  const backendModule=item.recordType==="COMMERCIAL_CATALOG_MODULE"?modules.MODULE_BY_ID.get("ARIA-CATALOG-"+item.catalogEntryId):null;
  const input=backendModule?inputFor(backendModule.manifest):{goal:"آزمون گردش‌کار محلی ماژول",context:{},consent:true};
  const result=await runtime.executeAriaDomainModule(item.moduleId,input,{actorId:"test-actor",tenantId:"tenant-144"});
  assert.equal(result.tenantScope,"tenant-144");
  assert.equal(result.externalExecutionPerformed,false);
  assert.equal(result.paymentExecuted,false);
  assert.equal(result.productionVerified,false);
  if(item.recordType==="COMMERCIAL_CATALOG_MODULE") assert.equal(result.domainLogicExecuted,true);
  else assert.equal(result.localWorkItemPrepared,true);
 });
}
test("rejects missing tenant, actor, required input, and consent",async()=>{
 const item=runtime.REGISTRY.records.find(x=>x.recordType==="HISTORICAL_OVERLAY_MODULE"&&x.requiredInputs.includes("consent"));
 await assert.rejects(runtime.executeAriaDomainModule(item.moduleId,{goal:"test goal"},{actorId:"a"}),{message:"MODULE_TENANT_REQUIRED"});
 await assert.rejects(runtime.executeAriaDomainModule(item.moduleId,{goal:"test goal"},{tenantId:"t"}),{message:"MODULE_ACTOR_REQUIRED"});
 await assert.rejects(runtime.executeAriaDomainModule(item.moduleId,{goal:"test goal",consent:false},{actorId:"a",tenantId:"t"}),{message:"MODULE_CONSENT_REQUIRED"});
});

test("rejects oversized domain payloads before handler execution",async()=>{
 const item=runtime.REGISTRY.records[0];
 await assert.rejects(runtime.executeAriaDomainModule(item.moduleId,{goal:"valid goal",context:{note:"x".repeat(70000)},consent:true},{actorId:"actor",tenantId:"tenant"}),{message:"MODULE_INPUT_TOO_LARGE"});
});
test("rejects deeply nested domain payloads",async()=>{
 const item=runtime.REGISTRY.records[0];let nested={value:"ok"};for(let i=0;i<10;i++)nested={child:nested};
 await assert.rejects(runtime.executeAriaDomainModule(item.moduleId,{goal:"valid goal",context:nested,consent:true},{actorId:"actor",tenantId:"tenant"}),{message:"MODULE_INPUT_DEPTH_EXCEEDED"});
});
test("rejects prototype-pollution keys in domain payloads",async()=>{
 const item=runtime.REGISTRY.records[0];
 const context=JSON.parse('{"__proto__":{"polluted":true}}');
 await assert.rejects(runtime.executeAriaDomainModule(item.moduleId,{goal:"valid goal",context,consent:true},{actorId:"actor",tenantId:"tenant"}),{message:"MODULE_INPUT_UNSAFE_KEY"});
 assert.equal({}.polluted,undefined);
});
test("rejects excessive array and object cardinality",async()=>{
 const item=runtime.REGISTRY.records[0];
 await assert.rejects(runtime.executeAriaDomainModule(item.moduleId,{goal:"valid goal",context:{items:Array.from({length:501},(_,i)=>i)},consent:true},{actorId:"actor",tenantId:"tenant"}),{message:"MODULE_INPUT_COLLECTION_LIMIT"});
});
test("rejects malformed actor and tenant identifiers",async()=>{
 const item=runtime.REGISTRY.records[0];
 await assert.rejects(runtime.executeAriaDomainModule(item.moduleId,{goal:"valid goal",context:{},consent:true},{actorId:"\u0000bad",tenantId:"tenant"}),{message:"MODULE_ACTOR_INVALID"});
 await assert.rejects(runtime.executeAriaDomainModule(item.moduleId,{goal:"valid goal",context:{},consent:true},{actorId:"actor",tenantId:"x".repeat(129)}),{message:"MODULE_TENANT_INVALID"});
});
