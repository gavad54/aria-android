"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  AdapterRuntime,
  AdapterRuntimeError,
  FAMILY_CONTRACTS,
  MANIFEST,
  moduleToFamily
} = require("../backend/integrations/adapter-runtime.cjs");

function makeRuntime(overrides = {}) {
  const events = [];
  const runtime = new AdapterRuntime({
    authorize: async () => true,
    audit: async (event) => { events.push(event); },
    timeoutMs: 150,
    clock: () => "2026-11-20T00:00:00.000Z",
    ...overrides
  });
  return { runtime, events };
}

const baseRequest = {
  moduleId: 244,
  operation: "generate",
  tenantId: "tenant-1",
  actorId: "actor-1",
  requestId: "request-1",
  consent: true,
  payload: { prompt: "test" }
};

test("manifest maps all 191 unique adapter-demand module IDs into 14 executable contract families", () => {
  assert.equal(MANIFEST.totalRequirements, 191);
  assert.equal(moduleToFamily.size, 191);
  assert.equal(new Set(moduleToFamily.keys()).size, 191);
  assert.equal(Object.keys(MANIFEST.families).length, 14);
  assert.equal(Object.keys(FAMILY_CONTRACTS).length, 14);
  assert.equal(Object.values(MANIFEST.families).reduce((n, ids) => n + ids.length, 0), 191);
  assert.equal(moduleToFamily.get(244), "AI_MODEL_AND_AGENT_RUNTIME");
  assert.equal(moduleToFamily.get(633), "PAYMENT_AND_FINANCIAL_RAILS");
});

test("all providers start unconfigured and execution fails closed", async () => {
  const { runtime } = makeRuntime();
  assert.equal(runtime.listFamilies().length, 14);
  assert.ok(runtime.listFamilies().every((x) => x.providerState === "NOT_CONFIGURED_FAIL_CLOSED"));
  await assert.rejects(runtime.execute(baseRequest), (e) =>
    e instanceof AdapterRuntimeError && e.code === "PROVIDER_NOT_CONFIGURED_FAIL_CLOSED");
});

test("module-family ownership and operation allowlist are enforced", async () => {
  const { runtime } = makeRuntime();
  runtime.registerProvider({
    family: "AI_MODEL_AND_AGENT_RUNTIME",
    providerId: "mock-ai",
    execute: async () => ({ ok: true })
  });
  await assert.rejects(
    runtime.execute({ ...baseRequest, moduleId: 633 }),
    (e) => e.code === "OPERATION_NOT_ALLOWED"
  );
  await assert.rejects(
    runtime.execute({ ...baseRequest, moduleId: 9999 }),
    (e) => e.code === "MODULE_ADAPTER_NOT_MAPPED"
  );
});

test("writes require idempotency and every execution requires explicit consent", async () => {
  const { runtime } = makeRuntime();
  runtime.registerProvider({
    family: "COMMERCE_AND_CATALOG",
    providerId: "mock-commerce",
    execute: async () => ({ accepted: true })
  });
  const write = {
    ...baseRequest,
    moduleId: 247,
    operation: "create_order"
  };
  await assert.rejects(runtime.execute(write), (e) => e.code === "IDEMPOTENCY_KEY_REQUIRED");
  await assert.rejects(runtime.execute({ ...write, idempotencyKey: "idem-1", consent: false }),
    (e) => e.code === "USER_CONSENT_REQUIRED");
});

test("tenant authorization is checked before provider execution", async () => {
  let called = false;
  const { runtime } = makeRuntime({ authorize: async () => false });
  runtime.registerProvider({
    family: "AI_MODEL_AND_AGENT_RUNTIME",
    providerId: "mock-ai",
    execute: async () => { called = true; return {}; }
  });
  await assert.rejects(runtime.execute(baseRequest), (e) => e.code === "ACCESS_DENIED");
  assert.equal(called, false);
});

test("sensitive families reject mock-only execution", async () => {
  const { runtime } = makeRuntime();
  runtime.registerProvider({
    family: "PAYMENT_AND_FINANCIAL_RAILS",
    providerId: "mock-payments",
    execute: async () => ({ ok: true })
  });
  await assert.rejects(
    runtime.execute({
      ...baseRequest,
      moduleId: 633,
      operation: "get_payment_status"
    }),
    (e) => e.code === "SENSITIVE_MOCK_EXECUTION_BLOCKED"
  );
});

test("sandbox provider executes only with evidence and always reports productionVerified=false", async () => {
  const { runtime, events } = makeRuntime();
  runtime.registerProvider({
    family: "AI_MODEL_AND_AGENT_RUNTIME",
    providerId: "sandbox-ai",
    approval: "SANDBOX_APPROVED",
    evidenceId: "sandbox-evidence-1",
    execute: async ({ operation, signal }) => ({ operation, aborted: signal.aborted })
  });
  const result = await runtime.execute(baseRequest);
  assert.equal(result.activationState, "SANDBOX_APPROVED");
  assert.equal(result.productionVerified, false);
  assert.equal(events.length, 2);
  assert.equal(events[0].event, "ADAPTER_EXECUTION_REQUESTED");
  assert.equal(events[1].event, "ADAPTER_EXECUTION_SUCCEEDED");
});

test("sandbox approval without evidence and production approval are rejected", () => {
  const { runtime } = makeRuntime();
  assert.throws(() => runtime.registerProvider({
    family: "AI_MODEL_AND_AGENT_RUNTIME",
    providerId: "sandbox-ai",
    approval: "SANDBOX_APPROVED",
    execute: async () => ({})
  }), (e) => e.code === "SANDBOX_EVIDENCE_REQUIRED");
  assert.throws(() => runtime.registerProvider({
    family: "AI_MODEL_AND_AGENT_RUNTIME",
    providerId: "prod-ai",
    approval: "PRODUCTION_APPROVED",
    evidenceId: "owner-approval-1",
    execute: async () => ({})
  }), (e) => e.code === "PRODUCTION_PROVIDER_REGISTRATION_BLOCKED");
});

test("provider timeout aborts the in-flight request and writes a failure audit event", async () => {
  let observedSignal;
  const { runtime, events } = makeRuntime({ timeoutMs: 100 });
  runtime.registerProvider({
    family: "AI_MODEL_AND_AGENT_RUNTIME",
    providerId: "slow-ai",
    approval: "SANDBOX_APPROVED",
    evidenceId: "sandbox-evidence-2",
    execute: ({ signal }) => new Promise((resolve) => {
      observedSignal = signal;
      signal.addEventListener("abort", () => resolve({ aborted: true }), { once: true });
    })
  });
  await assert.rejects(runtime.execute(baseRequest), (e) => e.code === "PROVIDER_TIMEOUT");
  assert.equal(observedSignal.aborted, true);
  assert.equal(events.at(-1).event, "ADAPTER_EXECUTION_FAILED");
});
