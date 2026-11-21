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


test("runtime rejects a domain handler result for a different module", async () => {
  const module = createDomainModule({
    moduleId: "ARIA.TEST.SECURITY",
    name: "Runtime security test",
    inputContract: [],
    outputContract: [],
    operations: [],
    domainHandler: async (_input, context) => ({
      moduleId: "ARIA.OTHER.MODULE",
      tenantScope: context.tenantId,
      actorScope: context.actorId
    })
  });
  await assert.rejects(
    module.execute({}, { actorId: "actor-1", tenantId: "tenant-1" }),
    { message: "MODULE_DOMAIN_HANDLER_IDENTITY_MISMATCH" }
  );
});

test("runtime rejects a domain handler result that changes tenant or actor scope", async () => {
  const module = createDomainModule({
    moduleId: "ARIA.TEST.SECURITY",
    name: "Runtime security test",
    inputContract: [],
    outputContract: [],
    operations: [],
    domainHandler: async () => ({
      moduleId: "ARIA.TEST.SECURITY",
      tenantScope: "attacker-tenant",
      actorScope: "attacker-actor"
    })
  });
  await assert.rejects(
    module.execute({}, { actorId: "actor-1", tenantId: "tenant-1" }),
    { message: "MODULE_DOMAIN_HANDLER_SCOPE_MISMATCH" }
  );
});
