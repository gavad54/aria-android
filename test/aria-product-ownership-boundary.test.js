"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const commercialization = JSON.parse(fs.readFileSync(
  path.join(root, "backend/data/aria_893_commercialization_registry.json"), "utf8"
));
const ownership = JSON.parse(fs.readFileSync(
  path.join(root, "backend/data/aria_product_ownership_migration.json"), "utf8"
));

test("ARIA commercialization catalog remains ARIA-owned and excludes ARIANA accounting domains", () => {
  assert.equal(commercialization.product, "ARIA");
  assert.equal(commercialization.registryType, "COMMERCIAL_ENTITLEMENT_REGISTRY");
  assert.equal(commercialization.ownedUnitCount, 893);
  assert.equal(commercialization.records.length, 893);
  assert.ok(commercialization.records.every(record => record.ownerProduct === "ARIA"));

  const outOfBoundary = commercialization.records.filter(record =>
    /\b(?:accounting|ERP|tax)\b/i.test(JSON.stringify(record))
  );
  assert.deepEqual(outOfBoundary.map(record => record.moduleId), []);
});

test("ARIANA remains outside ARIA's product and public domain-pack ownership", () => {
  assert.equal(ownership.products.ARIANA, undefined);
  assert.equal(ownership.publicAriaDomainPackIds.includes("ARIANA"), false);
  assert.equal(ownership.sharedServices.some(service =>
    service.ownerProduct === "ARIANA" || service.consumers?.includes("ARIANA")
  ), false);
});
