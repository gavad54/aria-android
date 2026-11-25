"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { MODULES, MODULE_BY_ID, MODULE_COUNTS, MANIFEST, executeModule } = require("../backend/modules");

test("all 201 requested modules have unique independent IDs and executable handlers", () => {
  assert.equal(MODULES.length, 201);
  assert.equal(MANIFEST.independentBackendModuleCount, 201);
  assert.equal(MANIFEST.canonicalBaselinePreserved, 639);
  assert.equal(new Set(MODULES.map(x => x.manifest.moduleId)).size, 201);
  assert.equal(MODULE_BY_ID.size, 201);
  assert.deepEqual(MODULE_COUNTS, { ideas: 50, governanceControls: 4, commercialCatalog: 72, childEngines: 71, serviceDeliveryEngines: 4 });
  for (const module of MODULES) {
    assert.equal(typeof module.execute, "function", module.manifest.moduleId);
    assert.equal(module.manifest.productionVerified, false);
    assert.equal(module.manifest.externalExecutionEnabled, false);
    assert.equal(module.manifest.paymentExecuted, false);
  }
});

test("module execution requires actor and tenant context and returns an auditable local artifact", async () => {
  const module = MODULES.find(x => x.manifest.moduleId === "ARIA-IDEA-BACKLOG-001");
  assert.ok(module);
  await assert.rejects(() => executeModule(module.manifest.moduleId, { goal: "test", context: {} }, {}), /MODULE_ACTOR_REQUIRED/);
  const result = await executeModule(module.manifest.moduleId, { goal: "test", context: {}, consent: true }, { actorId: "user-1", tenantId: "tenant-1" });
  assert.equal(result.moduleId, module.manifest.moduleId);
  assert.equal(result.tenantId, "tenant-1");
  assert.equal(result.status, "LOCAL_RESULT_READY");
  assert.equal(result.externalExecutionPerformed, false);
  assert.ok(result.auditRecord);
});

test("module execution rejects cross-tenant context mismatch and missing required inputs", async () => {
  const module = MODULES.find(x => x.manifest.moduleId === "ARIA-CONTROL-MODULE-002");
  assert.ok(module);
  await assert.rejects(() => executeModule(module.manifest.moduleId, {}, { actorId: "user-1" }), /MODULE_TENANT_REQUIRED/);
  await assert.rejects(() => executeModule(module.manifest.moduleId, {}, { actorId: "user-1", tenantId: "tenant-1" }), /MODULE_INPUT_MISSING/);
});

test("four service delivery engines execute their domain functions through the module registry", async () => {
  const { executeModule } = require("../backend/modules");
  const actor = { actorId: "user-1", tenantId: "tenant-1" };
  const support = await executeModule("ARIA-SVC-SUPPORT", {
    serviceCaseId: "case-1", title: "پیگیری", description: "پیگیری وضعیت تحویل", priority: "normal", responseHours: 24
  }, actor);
  assert.equal(support.artifact.serviceResult.status, "OPEN");
  assert.equal(support.artifact.serviceResult.externalNotificationSent, false);
  const success = await executeModule("ARIA-SVC-SUCCESS", {
    period: "2026-11", activeDays: 12, completedTasks: 30, targetTasks: 25, unresolvedTickets: 1
  }, actor);
  assert.equal(success.artifact.serviceResult.renewalExecuted, false);
  const pack = await executeModule("ARIA-SVC-PACKAGES", {
    name: "بسته محتوا", version: 1, serviceModuleIds: ["ARIA-SVC-INTAKE"], steps: ["دریافت brief"], currency: "IRR"
  }, actor);
  assert.equal(pack.artifact.serviceResult.entitlementActivated, false);
  const economics = await executeModule("ARIA-SVC-UNIT-ECONOMICS", {
    currency: "IRR", platformRevenue: 100000, principalFunds: 500000,
    costs: { provider: 10000, model: 5000, storage: 1000, support: 2000, payment: 1000 }
  }, actor);
  assert.equal(economics.artifact.serviceResult.contributionMargin, 81000);
  assert.equal(economics.artifact.serviceResult.principalRevenueRecognized, false);
});

test("every independent module accepts its declared contract and returns a local artifact", async () => {
  for (const module of MODULES) {
    if (module.manifest.moduleType === "SERVICE_DELIVERY_ENGINE" || module.manifest.moduleId.startsWith("ARIA-CONTROL-MODULE-")) continue;
    const input = Object.fromEntries(module.manifest.requiredInputs.map(key => [key, key === "consent" ? true : "sample-value"]));
    if (module.manifest.accessPolicy?.includes("consent_and_purpose_limitation") || module.manifest.accessPolicy?.includes("explicit_contact_consent")) input.consent = true;
    const result = await module.execute(input, { actorId: "test-user", tenantId: "test-tenant" });
    assert.equal(result.moduleId, module.manifest.moduleId);
    assert.equal(result.status, "LOCAL_RESULT_READY");
    assert.equal(result.externalExecutionPerformed, false);
    assert.equal(result.paymentExecuted, false);
    assert.equal(result.productionVerified, false);
  }
});
