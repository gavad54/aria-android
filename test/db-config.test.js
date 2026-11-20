"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { databaseSslConfig } = require("../db-config");

test("database TLS verifies server certificates when SSL is enabled", () => {
  assert.deepEqual(databaseSslConfig({ DATABASE_SSL: "true" }), {
    rejectUnauthorized: true
  });
});

test("database TLS accepts an explicitly configured CA without disabling verification", () => {
  assert.deepEqual(databaseSslConfig({
    DATABASE_SSL: "true",
    DATABASE_SSL_CA: "-----BEGIN CERTIFICATE-----\\nexample\\n-----END CERTIFICATE-----"
  }), {
    rejectUnauthorized: true,
    ca: "-----BEGIN CERTIFICATE-----\\nexample\\n-----END CERTIFICATE-----"
  });
});

test("database TLS remains disabled unless explicitly enabled", () => {
  assert.equal(databaseSslConfig({ DATABASE_SSL: "false" }), undefined);
  assert.equal(databaseSslConfig({}), undefined);
});
