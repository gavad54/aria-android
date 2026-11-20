"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { MODULES } = require("../backend/modules");
function valueFor(field) {
  if (field === "context" || field === "data" || field === "constraints") return {};
  if (field === "consent") return true;
  if (/references|sources|participants|documents|items|tasks|steps|agenda/i.test(field)) return [];
  return "آزمون محلی ماژول";
}
test("all 193 idea, commercial and child-engine modules emit unique module-specific execution profiles", async () => {
  const targets = MODULES.filter(module => ["IDEA_BACKLOG_MODULE", "COMMERCIAL_CATALOG_MODULE", "CHILD_ENGINE_MODULE"].includes(module.manifest.moduleType));
  assert.equal(targets.length, 193);
  const profileIds = new Set();
  const ideaArtifactTypes = new Set();
  for (const module of targets) {
    const input = Object.fromEntries(module.manifest.requiredInputs.map(field => [field, valueFor(field)]));
    if (module.manifest.accessPolicy?.some(policy => ["consent_and_purpose_limitation", "explicit_contact_consent"].includes(policy))) input.consent = true;
    const result = await module.execute(input, { actorId: "module-test-actor", tenantId: "tenant-module-test" });
    assert.equal(result.domainLogicExecuted, true, module.manifest.moduleId);
    assert.equal(result.externalExecutionPerformed, false);
    assert.equal(result.paymentExecuted, false);
    assert.equal(result.productionVerified, false);
    const domainResult = result.artifact.domainResult;
    const profile = domainResult.moduleSpecificProfile || domainResult.domainArtifact?.moduleSpecificProfile;
    assert.ok(profile, module.manifest.moduleId);
    if (module.manifest.moduleType === "IDEA_BACKLOG_MODULE") ideaArtifactTypes.add(domainResult.artifactType || domainResult.domainArtifact?.artifactType);
    assert.equal(profile.moduleId, module.manifest.moduleId);
    assert.equal(profile.profileId, "PROFILE:" + module.manifest.moduleId);
    assert.equal(profile.executionBoundary, "TENANT_SCOPED_LOCAL_ONLY");
    assert.equal(profile.externalExecution, false);
    assert.ok(profile.operationPlan.length > 0, module.manifest.moduleId);
    assert.ok(profile.inputSchema.length > 0, module.manifest.moduleId);
    profileIds.add(profile.profileId);
    if (module.manifest.moduleType === "COMMERCIAL_CATALOG_MODULE") {
      assert.equal(profile.commercialContract.state, "DESIGNED_NOT_MONETIZED");
      assert.equal(profile.commercialContract.billingEnabled, false);
      assert.equal(profile.commercialContract.paymentExecuted, false);
    }
  }
  assert.equal(profileIds.size, 193);
  assert.equal(ideaArtifactTypes.size, 50);
});
test("module-specific profiles are tenant-scoped and do not claim verified production", async () => {
  const module = MODULES.find(item => item.manifest.moduleType === "COMMERCIAL_CATALOG_MODULE");
  const input = Object.fromEntries(module.manifest.requiredInputs.map(field => [field, valueFor(field)]));
  const result = await module.execute(input, { actorId: "actor-a", tenantId: "tenant-a" });
  const domainResult = result.artifact.domainResult;
  const profile = domainResult.moduleSpecificProfile || domainResult.domainArtifact?.moduleSpecificProfile;
  assert.equal(profile.moduleId, module.manifest.moduleId);
  assert.equal(domainResult.tenantScope, "tenant-a");
  assert.equal(profile.productionVerified, false);
  assert.equal(domainResult.commercialization.paymentExecuted, false);
  await assert.rejects(module.execute(input, { actorId: "actor-a" }), { message: "MODULE_TENANT_REQUIRED" });
});
