"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { createDomainModule } = require("../backend/aria-module-runtime.cjs");

function moduleUnderTest() {
  return createDomainModule({
    moduleId: "ARIA.TEST.SECURITY",
    name: "Runtime security test",
    inputContract: [],
    outputContract: [],
    operations: []
  });
}

test("runtime rejects non-string tenant and actor identifiers", async () => {
  const module = moduleUnderTest();
  await assert.rejects(
    module.execute({}, { actorId: "actor-1", tenantId: 42 }),
    { message: "MODULE_TENANT_INVALID" }
  );
  await assert.rejects(
    module.execute({}, { actorId: { id: "actor-1" }, tenantId: "tenant-1" }),
    { message: "MODULE_ACTOR_INVALID" }
  );
});

test("runtime rejects caller-supplied reserved identity and tenant inputs", async () => {
  const module = moduleUnderTest();
  await assert.rejects(
    module.execute({ tenant_context: { tenantId: "other-tenant" } }, {
      actorId: "actor-1",
      tenantId: "tenant-1"
    }),
    { message: "MODULE_RESERVED_INPUT_FORBIDDEN" }
  );
});
