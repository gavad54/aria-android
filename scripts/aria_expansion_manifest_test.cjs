"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const registry=JSON.parse(fs.readFileSync(path.join(root,"backend/data/aria_expansion_registry.json"),"utf8"));
assert.equal(registry.baselineCanonicalModuleCount,639);
assert.equal(registry.problems.length,50);
assert.ok(registry.problems.every(x=>x.engine.contract&&x.engine.contract.operations.length===4));
assert.equal(new Set(registry.problems.map(x=>x.id)).size,50);
assert.equal(registry.domains.length,5);
assert.equal(registry.candidates.length,4);
assert.ok(registry.candidates.every(x=>x.engine.contract&&x.engine.contract.operations.length===4));
assert.equal(new Set(registry.problems.map(x=>x.engine.id)).size,49);
assert.equal(registry.revenueModels.length,20);
const p29=registry.problems.find(x=>x.sourceProblemNumber===29);
const p48=registry.problems.find(x=>x.sourceProblemNumber===48);
assert.ok(p29&&p48);
assert.equal(p48.aliasOf,p29.id);
assert.equal(p48.engine.id,p29.engine.id);
const expectedHosts={"life-home-assistant":237,"smart-shopping-household":11,"family-health-wellbeing":233,"career-learning-productivity":169,"travel-leisure-planner":235};
for(const item of registry.problems){assert.equal(item.hostCanonicalContractId,expectedHosts[item.parentModuleId]);}
const revenueHosts={1:8,2:8,3:8,4:8,5:8,6:8,7:8,8:8,9:8,10:8,11:8,12:8,13:8,14:8,15:8,16:12,17:26,18:12,19:87,20:12};
for(const item of registry.revenueModels){assert.equal(item.hostCanonicalContractId,revenueHosts[item.sourceNumber]);}
assert.ok(registry.candidates.every(x=>Array.isArray(x.candidateHostContractIds)&&x.candidateHostContractIds.length>0));
assert.equal(registry.guardrails.liveRevenueEnabled,false);
assert.equal(registry.guardrails.externalExecutionEnabled,false);
assert.equal(registry.guardrails.canonicalCountChanges,false);
console.log("ARIA_EXPANSION_MANIFEST_PASS canonical=639 problem_records=50 unique_problem_capabilities=49 domains=5 candidates=4 revenue_models=20");
