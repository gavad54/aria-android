"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { MODULES, MODULE_COUNTS } = require("../backend/modules");

function valueFor(key) {
  if (key === "context" || key === "data") return {};
  if (key === "constraints") return [];
  if (key === "sourceReferences" || key === "source_references" || key === "participants" || key === "items") return [];
  if (key === "consent") return true;
  if (/count|amount|budget|score|capacity|duration|limit|quantity|price|rate/i.test(key)) return 1;
  return "test input";
}
function inputFor(module) {
  const input = {};
  for (const key of module.manifest.requiredInputs || []) input[key] = valueFor(key);
  input.goal ??= "Create a testable local outcome";
  input.context ??= { objective: "test", constraints: [], data: { baseline: 1, target: 2 } };
  input.consent = true;
  return input;
}

test("all 201 ARIA modules are independently registered and preserve family counts", () => {
  assert.equal(MODULES.length, 201);
  assert.deepEqual(MODULE_COUNTS, {
    ideas: 50,
    governanceControls: 4,
    commercialCatalog: 72,
    childEngines: 71,
    serviceDeliveryEngines: 4
  });
  assert.equal(new Set(MODULES.map(module => module.manifest.moduleId)).size, 201);
});

test("all 183 remaining ideas, catalog modules and child engines execute dedicated local domain logic", async () => {
  const targets = MODULES.filter(module => ["IDEA_BACKLOG_MODULE", "COMMERCIAL_CATALOG_MODULE", "CHILD_ENGINE_MODULE"].includes(module.manifest.moduleType));
  assert.equal(targets.length, 193);
  let passed = 0;
  for (const module of targets) {
    const result = await module.execute(inputFor(module), { actorId: "domain-test-actor", tenantId: "domain-test-tenant" });
    assert.equal(result.domainLogicExecuted, true, module.manifest.moduleId);
    assert.equal(result.externalExecutionPerformed, false, module.manifest.moduleId);
    assert.equal(result.paymentExecuted, false, module.manifest.moduleId);
    assert.equal(result.productionVerified, false, module.manifest.moduleId);
    assert.equal(result.artifact.domainResult.tenantScope, "domain-test-tenant", module.manifest.moduleId);
    if (module.manifest.sequence <= 10 && module.manifest.moduleType === "IDEA_BACKLOG_MODULE") {
      assert.equal(result.artifact.domainResult.moduleSequence, module.manifest.sequence);
      assert.ok(result.artifact.domainResult.domainOutput);
    } else {
      assert.equal(result.artifact.domainResult.moduleId, module.manifest.moduleId);
      assert.ok(result.artifact.domainResult.domainArtifact, module.manifest.moduleId);
    }
    if (module.manifest.moduleType === "COMMERCIAL_CATALOG_MODULE") {
      assert.equal(result.artifact.domainResult.monetization.billingEnabled, false);
      assert.equal(result.artifact.domainResult.monetization.paymentExecuted, false);
    }
    if (module.manifest.moduleType === "CHILD_ENGINE_MODULE") {
      assert.ok(Array.isArray(result.artifact.domainResult.domainArtifact.executionPlan));
      assert.ok(Array.isArray(result.artifact.domainResult.domainArtifact.riskFlags));
    }
    passed++;
  }
  assert.equal(passed, 193);
});

test("module-specific handlers reject missing tenant and actor context", async () => {
  const module = MODULES.find(item => item.manifest.moduleType === "CHILD_ENGINE_MODULE");
  await assert.rejects(module.execute(inputFor(module), { actorId: "actor-only" }), { message: "MODULE_TENANT_REQUIRED" });
  await assert.rejects(module.execute(inputFor(module), { tenantId: "tenant-only" }), { message: "MODULE_ACTOR_REQUIRED" });
});
