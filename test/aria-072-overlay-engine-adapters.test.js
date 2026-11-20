"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const runtime=require("../backend/aria-144-domain-runtime.cjs");
const registry=require("../backend/data/aria_893_module_execution_registry.json");
const overlay=require("../backend/data/aria_111_module_expansion_registry.json");
const ownership=require("../backend/data/aria_product_ownership_migration.json");
const transferred=new Set(Object.values(ownership.products).flatMap(x=>x.ownedModuleIds));
const archived=new Set(ownership.archivedDomainModuleIds);
const active=overlay.moduleCatalog.filter(x=>!transferred.has(x.moduleId)&&!archived.has(x.moduleId));
const executionById=new Map(registry.records.map(x=>[x.unitId,x]));

test("all 72 ARIA-owned overlays execute their dedicated domain handler",async()=>{
 assert.equal(active.length,72);
 for(const module of active){
  const result=await runtime.executeAriaDomainModule(module.moduleId,{goal:"Validate overlay domain behavior",context:{},consent:true},{actorId:"test-actor",tenantId:"tenant-overlay"});
  assert.equal(result.domainLogicExecuted,true,module.moduleId+" must use unit-specific logic");
  assert.equal(result.executionState,"LOCAL_DOMAIN_LOGIC_EXECUTED");
  assert.ok(result.artifact.domainResult.domainOutput,module.moduleId+" must return a domain output");
  assert.equal(result.artifact.domainResult.tenantScope,"tenant-overlay");
  assert.equal(result.externalExecutionPerformed,false);
  assert.equal(result.paymentExecuted,false);
  assert.equal(result.productionVerified,false);
  const entry=executionById.get(module.moduleId);
  assert.equal(entry.implementationState,"UNIT_SPECIFIC_DOMAIN_LOGIC");
  assert.equal(entry.workflowEntry,"UNIT_SPECIFIC_DOMAIN_HANDLER");
  assert.equal(entry.executionContract.handlerKey,"aria.overlay."+module.moduleId);
 }
});
