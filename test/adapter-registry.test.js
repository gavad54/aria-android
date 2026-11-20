"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { AdapterRegistry, AdapterError, FAMILY_NAMES } = require("../backend/integrations/adapterRegistry");

test("registers the 14 proposed families as fail-closed contracts", () => {
  const registry = new AdapterRegistry();
  assert.equal(FAMILY_NAMES.length, 14);
  const families = registry.listFamilies();
  assert.equal(families.length, 14);
  assert.ok(families.every(item => item.providerState === "NOT_CONFIGURED_FAIL_CLOSED"));
});

test("does not execute a capability without a provider", async () => {
  const registry = new AdapterRegistry();
  await assert.rejects(
    registry.execute({
      family: "AI_MODEL_AND_AGENT_RUNTIME",
      operation: "generate",
      tenantId: "tenant-a",
      actorId: "actor-a",
      requestId: "req-1",
      payload: { prompt: "test" }
    }),
    error => error instanceof AdapterError && error.code === "PROVIDER_NOT_CONFIGURED_FAIL_CLOSED"
  );
});

test("enforces tenant, operation and idempotency boundaries", async () => {
  const registry = new AdapterRegistry();
  let received;
  registry.registerProvider({
    family: "COMMERCE_AND_CATALOG",
    providerId: "mock-commerce",
    approvalState: "MOCK_ONLY",
    execute: async input => { received = input; return { accepted: true }; }
  });
  const output = await registry.execute({
    family: "COMMERCE_AND_CATALOG",
    operation: "sync_catalog",
    tenantId: "tenant-42",
    actorId: "owner-1",
    requestId: "req-42",
    idempotencyKey: "idem-42",
    payload: { catalogId: "catalog-1" }
  });
  assert.equal(received.tenantId, "tenant-42");
  assert.equal(received.idempotencyKey, "idem-42");
  assert.equal(output.productionVerified, false);
  await assert.rejects(registry.execute({
    family: "COMMERCE_AND_CATALOG", operation: "sync_catalog",
    actorId: "owner-1", requestId: "req-43", idempotencyKey: "idem-43"
  }), /TENANT_REQUIRED/);
  await assert.rejects(registry.execute({
    family: "COMMERCE_AND_CATALOG", operation: "drop_database",
    tenantId: "tenant-42", actorId: "owner-1", requestId: "req-44",
    idempotencyKey: "idem-44"
  }), /OPERATION_NOT_ALLOWED/);
});

test("blocks mock execution for sensitive families", async () => {
  const registry = new AdapterRegistry();
  registry.registerProvider({
    family: "PAYMENT_AND_FINANCIAL_RAILS",
    providerId: "mock-psp",
    approvalState: "MOCK_ONLY",
    execute: async () => ({ ok: true })
  });
  await assert.rejects(registry.execute({
    family: "PAYMENT_AND_FINANCIAL_RAILS",
    operation: "create_payment_intent",
    tenantId: "tenant-a",
    actorId: "actor-a",
    requestId: "req-pay",
    idempotencyKey: "pay-1",
    payload: { amount: 100 }
  }), /SENSITIVE_MOCK_EXECUTION_BLOCKED/);
});

test("never labels injected provider execution as production verified", async () => {
  const registry = new AdapterRegistry();
  registry.registerProvider({
    family: "AI_MODEL_AND_AGENT_RUNTIME",
    providerId: "mock-model",
    approvalState: "MOCK_ONLY",
    execute: async ({ tenantId }) => ({ tenantId })
  });
  const result = await registry.execute({
    family: "AI_MODEL_AND_AGENT_RUNTIME",
    operation: "generate",
    tenantId: "tenant-b",
    actorId: "actor-b",
    requestId: "req-model",
    payload: { input: "hello" }
  });
  assert.equal(result.result.tenantId, "tenant-b");
  assert.equal(result.productionVerified, false);
});
