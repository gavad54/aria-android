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

test("custom CA is accepted without disabling certificate verification", () => {
  const ca = "-----BEGIN CERTIFICATE-----\\nexample\\n-----END CERTIFICATE-----";
  assert.deepEqual(databaseSslConfig({ DATABASE_SSL: "true", DATABASE_SSL_CA: ca }), {
    rejectUnauthorized: true,
    ca
  });
});
