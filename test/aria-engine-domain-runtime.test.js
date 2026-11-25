"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const runtime=require("../backend/aria-144-domain-runtime.cjs");
const modules=require("../backend/modules");

function inputFor(manifest){
 const input={goal:"Prepare a reviewable engine result",context:{},consent:true};
 for(const field of manifest.requiredInputs||[]){
  if(Object.prototype.hasOwnProperty.call(input,field))continue;
  if(field==="context"||field==="data"||field==="scope"||field==="approval_policy"||field==="policy")input[field]={};
  else if(field==="constraints"||/references|sources|participants|documents|items|tasks|steps|agenda|providers|jobs|events|records|policies/i.test(field))input[field]=[];
  else if(/count|amount|budget|score|capacity|duration|limit|quantity|price|rate|hours|minutes|days/i.test(field))input[field]=1;
  else input[field]="test input";
 }
 return input;
}
const engines=modules.MODULES.filter(x=>x.manifest.moduleType==="CHILD_ENGINE_MODULE");

test("all 71 child engines have distinct domain handlers and bounded tenant-scoped execution",async()=>{
 assert.equal(engines.length,71);
 const specializations=new Set();
 for(const module of engines){
  const result=await runtime.executeAriaEngineModule(module.manifest.moduleId,inputFor(module.manifest),{actorId:"engine-test-actor",tenantId:"engine-test-tenant"});
  assert.equal(result.domainLogicExecuted,true,module.manifest.moduleId+" must execute a dedicated handler");
  assert.equal(result.artifact.domainResult.moduleSpecificProfile.moduleId,module.manifest.moduleId);
  assert.equal(result.tenantScope,"engine-test-tenant");
  assert.equal(result.actorScope,"engine-test-actor");
  assert.equal(result.externalExecutionPerformed,false);
  assert.equal(result.paymentExecuted,false);
  assert.equal(result.productionVerified,false);
  specializations.add(result.artifact.domainResult.moduleSpecificProfile.specialization);
 }
 assert.equal(specializations.size,71);
});

test("child engine runtime rejects oversized and missing-identity requests",async()=>{
 const module=engines[0].manifest;
 await assert.rejects(runtime.executeAriaEngineModule(module.moduleId,{goal:"valid goal",context:{note:"x".repeat(70000)}},{actorId:"actor",tenantId:"tenant"}),{message:"MODULE_INPUT_TOO_LARGE"});
 await assert.rejects(runtime.executeAriaEngineModule(module.moduleId,{goal:"valid goal",context:{}},{actorId:"actor"}),{message:"MODULE_TENANT_REQUIRED"});
});
