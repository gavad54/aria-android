"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { MODULES } = require("../backend/modules");

const ideaModules = MODULES.filter(module =>
  module.manifest.moduleType === "IDEA_BACKLOG_MODULE" &&
  module.manifest.sequence >= 1 && module.manifest.sequence <= 10
);

test("first ten idea modules execute distinct local domain strategies", async () => {
  assert.equal(ideaModules.length, 10);
  const kinds = new Set();
  for (const module of ideaModules) {
    const result = await module.execute(
      { goal: "Prepare a clear user outcome", context: { tasks: ["review"], sourceLanguage: "en", targetLanguage: "fa" }, consent: true },
      { actorId: "test-actor", tenantId: "tenant-test" }
    );
    assert.equal(result.domainLogicExecuted, true, module.manifest.moduleId);
    assert.equal(result.externalExecutionPerformed, false);
    assert.equal(result.paymentExecuted, false);
    assert.equal(result.productionVerified, false);
    assert.equal(result.artifact.domainResult.tenantScope, "tenant-test");
    assert.ok(result.artifact.domainResult.artifactType);
    assert.equal(result.artifact.domainResult.commercialization.state, "DESIGNED_NOT_MONETIZED");
    assert.equal(result.artifact.domainResult.commercialization.billingEnabled, false);
    assert.equal(result.artifact.domainResult.commercialization.paymentExecuted, false);
    assert.ok(result.artifact.domainResult.commercialization.entitlementKey.startsWith("aria.idea."));
    kinds.add(result.artifact.domainResult.artifactType);
  }
  assert.equal(kinds.size, 10);
});

test("idea modules reject missing consent and invalid goal input", async () => {
  const module = ideaModules[0];
  await assert.rejects(
    module.execute({ goal: "Remember this", context: {} }, { actorId: "a", tenantId: "t" }),
    { message: "MODULE_CONSENT_REQUIRED" }
  );
  await assert.rejects(
    module.execute({ goal: "", context: {}, consent: true }, { actorId: "a", tenantId: "t" }),
    { message: "MODULE_INPUT_MISSING" }
  );
});
