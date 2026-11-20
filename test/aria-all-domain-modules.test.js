"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { MODULES, MODULE_COUNTS } = require("../backend/modules");
const activationStatus = require("../backend/data/aria_201_domain_activation_status.json");

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
const targets = MODULES.filter(module => ["IDEA_BACKLOG_MODULE", "COMMERCIAL_CATALOG_MODULE", "CHILD_ENGINE_MODULE"].includes(module.manifest.moduleType));

test("201 ARIA modules remain independently registered with unchanged family counts", () => {
  assert.equal(MODULES.length, 201);
  assert.deepEqual(MODULE_COUNTS, { ideas: 50, governanceControls: 4, commercialCatalog: 72, childEngines: 71, serviceDeliveryEngines: 4 });
  assert.equal(new Set(MODULES.map(module => module.manifest.moduleId)).size, 201);
  assert.equal(targets.length, 193);
  assert.equal(activationStatus.inventoryCount, 201);
  assert.equal(activationStatus.records.length, 201);
  assert.deepEqual(activationStatus.counts, { DOMAIN_LOGIC_LOCAL: 158, DOMAIN_ADAPTER_LOCAL: 43, productionVerified: 0, externalExecutionEnabled: 0, paymentExecuted: 0 });
});

for (const module of targets) {
  const id = module.manifest.moduleId;
  const status = activationStatus.records.find(record => record.moduleId === id);
  if (!status) throw new Error("ACTIVATION_STATUS_RECORD_MISSING:" + id);
  if (status.productionVerified || status.externalExecutionEnabled || status.paymentExecuted) throw new Error("UNVERIFIED_CAPABILITY_MARKED_ACTIVE:" + id);
  test("domain execution: " + id + " — " + module.manifest.name, async () => {
    const result = await module.execute(inputFor(module), { actorId: "domain-test-actor", tenantId: "domain-test-tenant" });
    assert.equal(result.domainLogicExecuted, true, id);
    assert.equal(result.externalExecutionPerformed, false, id);
    assert.equal(result.paymentExecuted, false, id);
    assert.equal(result.productionVerified, false, id);
    assert.equal(result.artifact.domainResult.tenantScope, "domain-test-tenant", id);
    if (module.manifest.moduleType === "IDEA_BACKLOG_MODULE" && module.manifest.sequence <= 10) {
      assert.equal(result.artifact.domainResult.moduleSequence, module.manifest.sequence);
      assert.ok(result.artifact.domainResult.domainOutput);
    } else {
      assert.equal(result.artifact.domainResult.moduleId, id);
      assert.ok(result.artifact.domainResult.domainArtifact);
    }
    if (module.manifest.moduleType === "COMMERCIAL_CATALOG_MODULE") {
      assert.equal(result.artifact.domainResult.commercialization.billingEnabled, false);
      assert.equal(result.artifact.domainResult.commercialization.paymentExecuted, false);
    }
    if (module.manifest.moduleType === "CHILD_ENGINE_MODULE") {
      assert.ok(Array.isArray(result.artifact.domainResult.domainArtifact.executionPlan));
      assert.ok(Array.isArray(result.artifact.domainResult.domainArtifact.riskFlags));
    }
  });
  test("input validation: " + id + " rejects missing required input", async () => {
    const input = inputFor(module);
    const required = (module.manifest.requiredInputs || [])[0];
    if (!required) return;
    delete input[required];
    await assert.rejects(module.execute(input, { actorId: "domain-test-actor", tenantId: "domain-test-tenant" }), { message: "MODULE_INPUT_MISSING" });
  });
}

test("module-specific handlers reject missing tenant and actor context", async () => {
  const module = targets.find(item => item.manifest.moduleType === "CHILD_ENGINE_MODULE");
  await assert.rejects(module.execute(inputFor(module), { actorId: "actor-only" }), { message: "MODULE_TENANT_REQUIRED" });
  await assert.rejects(module.execute(inputFor(module), { tenantId: "tenant-only" }), { message: "MODULE_ACTOR_REQUIRED" });
});
