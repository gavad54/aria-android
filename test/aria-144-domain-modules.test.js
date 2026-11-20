"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const runtime = require("../backend/aria-144-domain-runtime.cjs");

test("preserves the 639 baseline and adds exactly 144 ARIA-owned modules", () => {
  assert.equal(runtime.REGISTRY.baselineCanonicalModuleCount, 639);
  assert.equal(runtime.REGISTRY.addedModuleCount, 144);
  assert.equal(runtime.REGISTRY.totalProductFacingModuleCount, 783);
  assert.equal(runtime.REGISTRY.records.length, 144);
  assert.equal(new Set(runtime.REGISTRY.records.map(x => x.moduleId)).size, 144);
  assert.deepEqual(runtime.REGISTRY.counts, { historicalOverlay: 72, commercialCatalog: 72 });
  assert.ok(runtime.REGISTRY.records.every(x => x.ownerProduct === "ARIA"));
  assert.ok(runtime.REGISTRY.records.every(x => x.operations.length > 0));
});

test("runs a tenant-scoped local domain workflow without claiming external execution", async () => {
  const item = runtime.REGISTRY.records[0];
  const result = await runtime.executeAriaDomainModule(item.moduleId, {
    goal: "آزمون اجرای محلی قابلیت",
    context: {},
    consent: true
  }, { actorId: "test-actor", tenantId: "test-tenant" });
  assert.equal(result.moduleId, item.moduleId);
  assert.equal(result.tenantScope, "test-tenant");
  assert.equal(result.domainLogicExecuted, true);
  assert.equal(result.externalExecutionPerformed, false);
  assert.equal(result.paymentExecuted, false);
  assert.equal(result.productionVerified, false);
  assert.equal(result.operationPlan.length, item.operations.length);
});

test("rejects missing tenant, actor, required input, and consent", async () => {
  const item = runtime.REGISTRY.records.find(x => x.requiredInputs.includes("consent"));
  await assert.rejects(runtime.executeAriaDomainModule(item.moduleId, { goal: "test" }, { actorId: "a" }), { message: "ARIA_DOMAIN_TENANT_REQUIRED" });
  await assert.rejects(runtime.executeAriaDomainModule(item.moduleId, { goal: "test" }, { tenantId: "t" }), { message: "ARIA_DOMAIN_ACTOR_REQUIRED" });
  await assert.rejects(runtime.executeAriaDomainModule(item.moduleId, {}, { actorId: "a", tenantId: "t" }), { message: "ARIA_DOMAIN_INPUT_REQUIRED" });
  await assert.rejects(runtime.executeAriaDomainModule(item.moduleId, { goal: "test", consent: false }, { actorId: "a", tenantId: "t" }), { message: "ARIA_DOMAIN_CONSENT_REQUIRED" });
});

test("keeps commercial modules in non-live payment state until a real PSP is configured", () => {
  const commercial = runtime.REGISTRY.records.filter(x => x.recordType === "COMMERCIAL_CATALOG_MODULE");
  assert.equal(commercial.length, 72);
  assert.ok(commercial.every(x => x.commercialization.billingEnabled === false));
  assert.ok(commercial.every(x => x.commercialization.paymentProviderState === "NOT_CONNECTED"));
  assert.ok(commercial.every(x => x.commercialization.state === "DESIGNED_NOT_MONETIZED"));
});
