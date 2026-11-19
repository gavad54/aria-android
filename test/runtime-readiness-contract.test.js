"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { inspectRuntimeReadiness } = require("../backend/runtime-readiness.cjs");

test("required database missing keeps runtime not ready", async () => {
  const result = await inspectRuntimeReadiness({ databaseRequired: true, databaseConfigured: false });
  assert.equal(result.ready, false);
  assert.deepEqual(result.database, {
    required: true,
    configured: false,
    connected: false,
    errorCode: "DATABASE_URL_MISSING"
  });
});

test("database probe success marks runtime database-ready", async () => {
  let probes = 0;
  const result = await inspectRuntimeReadiness({
    databaseRequired: true,
    databaseConfigured: true,
    databaseProbe: async () => { probes += 1; }
  });
  assert.equal(probes, 1);
  assert.equal(result.ready, true);
  assert.equal(result.database.connected, true);
  assert.equal(result.database.errorCode, null);
});

test("database failures are normalized and never leak driver messages", async () => {
  const result = await inspectRuntimeReadiness({
    databaseRequired: true,
    databaseConfigured: true,
    databaseProbe: async () => { throw new Error("postgres://user:secret@db.example"); }
  });
  assert.equal(result.ready, false);
  assert.equal(result.database.errorCode, "DATABASE_UNAVAILABLE");
  assert.doesNotMatch(JSON.stringify(result), /secret|postgres:|db\.example/);
});

test("required provider must be configured and pass its health probe", async () => {
  const missing = await inspectRuntimeReadiness({
    databaseRequired: false,
    databaseConfigured: false,
    providers: [{ name: "openai", required: true, configured: false }]
  });
  assert.equal(missing.ready, false);
  assert.equal(missing.providers[0].errorCode, "PROVIDER_CREDENTIALS_MISSING");

  const failing = await inspectRuntimeReadiness({
    databaseRequired: false,
    databaseConfigured: false,
    providers: [{ name: "openai", required: true, configured: true, probe: async () => { throw new Error("secret"); } }]
  });
  assert.equal(failing.ready, false);
  assert.equal(failing.providers[0].errorCode, "PROVIDER_UNAVAILABLE");
  assert.doesNotMatch(JSON.stringify(failing), /secret/);
});

test("optional provider without credentials does not block database readiness", async () => {
  const result = await inspectRuntimeReadiness({
    databaseRequired: true,
    databaseConfigured: true,
    databaseProbe: async () => {},
    providers: [{ name: "openai", required: false, configured: false }]
  });
  assert.equal(result.ready, true);
});
