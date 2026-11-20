"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const runtime=require("../backend/aria_expansion_runtime.cjs");
const overlay=require("../backend/data/aria_111_module_expansion_registry.json");
const ownership=require("../backend/data/aria_product_ownership_migration.json");
const transferred=new Set(Object.values(ownership.products).flatMap(x=>x.ownedModuleIds));
const archived=new Set(ownership.archivedDomainModuleIds);
const active=overlay.moduleCatalog.filter(x=>!transferred.has(x.moduleId)&&!archived.has(x.moduleId));

test("all 72 ARIA-owned overlay modules execute through a mapped engine-family adapter",()=>{
 assert.equal(active.length,72);
 for(const module of active){
  const execution=runtime.buildOverlayEngineExecution(module,"Validate overlay domain behavior",{});
  assert.ok(execution.length>0,module.moduleId+" must resolve an engine adapter");
  assert.ok(execution.every(x=>x.executionMode==="ENGINE_FAMILY_ADAPTER"));
  assert.ok(execution.every(x=>x.operationResults.length===x.operations.length));
  assert.ok(execution.every(x=>x.operationResults.every(step=>step.status==="EXECUTED_LOCAL")));
  assert.ok(execution.every(x=>x.externalExecutionPerformed===false&&x.productionVerified===false));
 }
});
