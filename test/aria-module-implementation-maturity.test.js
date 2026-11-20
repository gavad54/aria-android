"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { MODULES } = require("../backend/modules");
const { classifyModule, buildMaturityReport } = require("../backend/aria-module-maturity.cjs");

test("201-module maturity report distinguishes domain-specific handlers from family adapters", () => {
  const report = buildMaturityReport(MODULES);
  assert.equal(report.total, 201);
  assert.deepEqual(report.counts, {
    DOMAIN_LOGIC_LOCAL: 158,
    DOMAIN_ADAPTER_LOCAL: 43
  });
  assert.equal(report.productionVerifiedCount, 0);
  assert.equal(report.externalExecutionEnabledCount, 0);
  assert.equal(report.paymentExecutedCount, 0);
});

test("service engines are classified only when a dedicated service function is called", () => {
  const services = MODULES.filter(module => module.manifest.moduleType === "SERVICE_DELIVERY_ENGINE");
  const controls = MODULES.filter(module => module.manifest.moduleType === "GOVERNANCE_CONTROL_MODULE");
  assert.equal(services.length, 4);
  assert.equal(controls.length, 4);
  for (const module of [...services, ...controls]) assert.equal(classifyModule(module).implementationState, "DOMAIN_LOGIC_LOCAL");
});

test("all idea, control, catalog, child-engine and service modules have domain handlers", () => {
  const generic = MODULES.filter(module => !["SERVICE_DELIVERY_ENGINE", "GOVERNANCE_CONTROL_MODULE"].includes(module.manifest.moduleType));
  assert.equal(generic.length, 193);
  const target = generic.filter(module => ["IDEA_BACKLOG_MODULE", "COMMERCIAL_CATALOG_MODULE", "CHILD_ENGINE_MODULE"].includes(module.manifest.moduleType));
  assert.equal(target.length, 193);
  for (const module of target) {
    const expected = (module.manifest.moduleType === "IDEA_BACKLOG_MODULE" && module.manifest.sequence <= 50) || (module.manifest.moduleType === "COMMERCIAL_CATALOG_MODULE" && module.manifest.catalogEntryId <= 690) || (module.manifest.moduleType === "CHILD_ENGINE_MODULE" && Number(module.manifest.moduleId.split("-").pop()) <= 60) ? "DOMAIN_LOGIC_LOCAL" : "DOMAIN_ADAPTER_LOCAL";
    assert.equal(classifyModule(module).implementationState, expected, module.manifest.moduleId);
  }
});
