"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { databaseSslConfig } = require("../db-config");

test("database TLS is disabled unless explicitly requested", () => {
  assert.equal(databaseSslConfig({}), undefined);
  assert.equal(databaseSslConfig({ DATABASE_SSL: "false" }), undefined);
});

test("database TLS verifies the server certificate when enabled", () => {
  assert.deepEqual(databaseSslConfig({ DATABASE_SSL: "true" }), { rejectUnauthorized: true });
});

test("custom CA escaped line breaks are normalized without disabling verification", () => {
  const ca = "-----BEGIN CERTIFICATE-----\\nexample\\n-----END CERTIFICATE-----";
  assert.deepEqual(databaseSslConfig({ DATABASE_SSL: "true", DATABASE_SSL_CA: ca }), {
    rejectUnauthorized: true,
    ca: "-----BEGIN CERTIFICATE-----\nexample\n-----END CERTIFICATE-----"
  });
});

test("database TLS requires the exact explicit opt-in value", () => {
  for (const value of ["TRUE", "1", "yes", " true ", ""]) {
    assert.equal(databaseSslConfig({ DATABASE_SSL: value }), undefined);
  }
});

test("blank CA values are ignored while certificate verification remains enabled", () => {
  assert.deepEqual(databaseSslConfig({
    DATABASE_SSL: "true",
    DATABASE_SSL_CA: "   "
  }), {
    rejectUnauthorized: true
  });
});
