"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const runtime=require("../backend/aria_expansion_runtime.cjs");
const canonical=require("../backend/data/aria_639_canonical_execution_registry.json");
const commercial=require("../backend/data/aria_commercial_execution_manifest.json");

test("all 639 canonical units execute through their declared family handler",()=>{
 assert.equal(canonical.records.length,639);
 for(const module of canonical.records){
  const plan=runtime.buildCanonicalOperationPlan(module,"Verify canonical family behavior",{});
  assert.equal(plan.canonicalModuleId,module.canonicalId);
  assert.ok(plan.domainArtifact&&plan.domainArtifact.artifactType);
  assert.equal(plan.executionStatus,"LOCAL_WORK_ITEM_ONLY");
  assert.equal(plan.externalExecutionPerformed,false);
 }
});

test("all 72 commercial units execute through their declared domain profile",()=>{
 assert.equal(commercial.records.length,72);
 for(const module of commercial.records){
  const plan=runtime.buildCommercialOperationPlan(module,"Verify commercial domain behavior",{});
  assert.equal(plan.commercialModuleId,module.commercialModuleId);
  assert.ok(plan.domainArtifact&&plan.domainArtifact.artifactType);
  assert.equal(plan.handlerKey,module.executionContract.handlerKey);
  assert.equal(plan.executionStatus,"LOCAL_WORK_ITEM_ONLY");
  assert.equal(plan.externalExecutionPerformed,false);
 }
});

test("all 71 engine submodules execute through their declared engine-family handler",()=>{
 assert.equal(runtime.engineSubmodules.length,71);
 for(const engine of runtime.engineSubmodules){
  const result=runtime.buildEngineOperationPlan(engine,"Verify engine-family behavior",{});
  assert.equal(result.engineSubmoduleId,engine.moduleId);
  assert.equal(result.engineFamily,engine.domain);
  assert.ok(result.domainArtifact&&result.domainArtifact.artifactType);
  assert.equal(result.operationResults.length,engine.operations.length);
  assert.equal(result.externalExecutionPerformed,false);
  assert.equal(result.productionVerified,false);
 }
});
