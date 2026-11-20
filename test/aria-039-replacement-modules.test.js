"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const replacement=require("../backend/aria-039-replacement-runtime.cjs");
const canonical=require("../backend/data/aria_639_canonical_execution_registry.json");
const overlay=require("../backend/data/aria_111_module_expansion_registry.json");
const ownership=require("../backend/data/aria_product_ownership_migration.json");
const commercial=require("../backend/data/aria_commercial_module_registry.json");
const unified=require("../backend/data/aria_893_module_execution_registry.json");

test("ARIA has 893 owned module and engine units without reclaiming 39 sibling lineage records",()=>{
 const transferred=new Set(Object.values(ownership.products).flatMap(p=>p.ownedModuleIds));
 const archived=new Set(ownership.archivedDomainModuleIds);
 const ariaOverlay=overlay.moduleCatalog.filter(m=>!transferred.has(m.moduleId)&&!archived.has(m.moduleId));
 assert.equal(canonical.records.length,639);
 assert.equal(ariaOverlay.length,72);
 assert.equal(commercial.records.length,72);
 assert.equal(unified.records.filter(x=>x.recordType==="ENGINE_SUBMODULE"&&x.ownerProduct==="ARIA").length,71);
 assert.equal(replacement.REGISTRY.records.length,39);
 assert.equal(639+ariaOverlay.length+commercial.records.length+71+replacement.REGISTRY.records.length,893);
 assert.equal(transferred.size+archived.size,39);
 assert.ok(replacement.REGISTRY.records.every(x=>x.ownerProduct==="ARIA"));
 assert.ok(replacement.REGISTRY.records.every(x=>x.revenueEngine?.state==="DESIGNED_NOT_MONETIZED"&&x.revenueEngine.price.policy==="OWNER_CONFIGURED"&&x.revenueEngine.paymentProviderState==="NOT_CONNECTED"));
 assert.ok(replacement.REGISTRY.records.every(x=>x.commercialization.billingEnabled===false&&x.commercialization.paymentExecuted===false));
 assert.ok(unified.records.filter(x=>x.ownerStatus!=="OWNED").length===39);
});

for(const module of replacement.REGISTRY.records){
 test("additional ARIA module executes a tenant-scoped local workflow: "+module.moduleId,()=>{
  const result=replacement.executeReplacementModule(module.moduleId,{goal:"Validate the local module workflow",context:{}},{actorId:"test-actor",tenantId:"tenant-a"});
  assert.equal(result.domainLogicExecuted,true);
  assert.equal(result.tenantScope,"tenant-a");
  assert.equal(result.operationPlan.length,module.operations.length);
  assert.equal(result.externalExecutionPerformed,false);
  assert.equal(result.paymentExecuted,false);
  assert.equal(result.productionVerified,false);
 });
}
test("additional ARIA modules reject missing actor and tenant",()=>{
 const id=replacement.REGISTRY.records[0].moduleId;
 assert.throws(()=>replacement.executeReplacementModule(id,{goal:"test goal"},{actorId:"a"}),{message:"MODULE_TENANT_REQUIRED"});
 assert.throws(()=>replacement.executeReplacementModule(id,{goal:"test goal"},{tenantId:"t"}),{message:"MODULE_ACTOR_REQUIRED"});
});
