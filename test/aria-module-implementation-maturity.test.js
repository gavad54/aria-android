"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { MODULES } = require("../backend/modules");
const { classifyModule, buildMaturityReport } = require("../backend/aria-module-maturity.cjs");

test("201-module maturity report distinguishes shared-runtime handlers from dedicated service logic", () => {
  const report = buildMaturityReport(MODULES);
  assert.equal(report.total, 201);
  assert.deepEqual(report.counts, {
    SHARED_RUNTIME_CONTRACT_ONLY: 197,
    DOMAIN_LOGIC_LOCAL: 4
  });
  assert.equal(report.productionVerifiedCount, 0);
  assert.equal(report.externalExecutionEnabledCount, 0);
  assert.equal(report.paymentExecutedCount, 0);
});

test("service engines are classified only when a dedicated service function is called", () => {
  const services = MODULES.filter(module => module.manifest.moduleType === "SERVICE_DELIVERY_ENGINE");
  assert.equal(services.length, 4);
  for (const module of services) assert.equal(classifyModule(module).implementationState, "DOMAIN_LOGIC_LOCAL");
});

test("idea, control, catalog and child-engine records are not misreported as domain-complete", () => {
  const generic = MODULES.filter(module => module.manifest.moduleType !== "SERVICE_DELIVERY_ENGINE");
  assert.equal(generic.length, 197);
  for (const module of generic) {
    assert.equal(classifyModule(module).implementationState, "SHARED_RUNTIME_CONTRACT_ONLY");
  }
});
