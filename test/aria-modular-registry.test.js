"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { MODULES, MODULE_BY_ID, executeModule } = require("../backend/modules");

test("all 197 requested modules have unique independent IDs and executable handlers", () => {
  assert.equal(MODULES.length, 201);
  assert.equal(new Set(MODULES.map(x => x.moduleId)).size, 197);
  assert.equal(MODULE_BY_ID.size, 201);
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
  const result = await executeModule(module.manifest.moduleId, { goal: "test", context: {} }, { actorId: "user-1", tenantId: "tenant-1" });
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
