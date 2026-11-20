"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const read = (name) => require(path.join(__dirname, "..", "backend", "data", name));

const execution = read("aria_893_module_execution_registry.json");
const commercial = read("aria_893_commercialization_registry.json");
const additional = read("aria_039_replacement_module_registry.json");

test("all 893 ARIA-owned units have unique, complete, addressable execution contracts", () => {
  const owned = execution.records.filter((x) => x.ownerStatus === "OWNED" && x.ownerProduct === "ARIA");
  const lineage = execution.records.filter((x) => x.ownerStatus !== "OWNED");
  assert.equal(execution.total, 932);
  assert.equal(execution.records.length, 932);
  assert.equal(owned.length, 893);
  assert.equal(lineage.length, 39);
  assert.equal(new Set(owned.map((x) => x.unitId)).size, 893);
  assert.equal(new Set(owned.map((x) => x.launchId)).size, 893);
  assert.ok(owned.every((x) => x.executionState === "LOCAL_WORK_ITEM_ONLY"));
  assert.ok(owned.every((x) => typeof x.name === "string" && x.name.trim().length > 0));
  assert.ok(owned.every((x) => x.executionContract &&
    typeof x.executionContract.handlerKey === "string" &&
    x.executionContract.handlerKey.length > 0 &&
    Array.isArray(x.executionContract.operations) &&
    x.executionContract.operations.length > 0 &&
    Array.isArray(x.executionContract.inputContract) &&
    x.executionContract.inputContract.length > 0 &&
    Array.isArray(x.executionContract.outputContract) &&
    x.executionContract.outputContract.length > 0));
  assert.deepEqual(
    Object.fromEntries(["CANONICAL_MODULE","HISTORICAL_OVERLAY_MODULE","COMMERCIAL_MODULE","ENGINE_SUBMODULE","NEW_OWNED_DOMAIN_MODULE"].map((type) => [type, owned.filter((x) => x.recordType === type).length])),
    { CANONICAL_MODULE: 639, HISTORICAL_OVERLAY_MODULE: 72, COMMERCIAL_MODULE: 72, ENGINE_SUBMODULE: 71, NEW_OWNED_DOMAIN_MODULE: 39 }
  );
});

test("all 71 child engines resolve to an ARIA parent and inherit its entitlement", () => {
  const owned = new Map(execution.records.filter((x) => x.ownerStatus === "OWNED").map((x) => [x.unitId, x]));
  const entitlements = new Map(commercial.records.map((x) => [x.moduleId, x]));
  const engines = commercial.records.filter((x) => x.recordType === "ENGINE_SUBMODULE");
  assert.equal(engines.length, 71);
  for (const engine of engines) {
    assert.equal(engine.separatelyBillable, false);
    assert.equal(engine.revenueEngine.state, "INHERITED_NOT_SEPARATELY_MONETIZED");
    assert.ok(engine.parentModuleIds.length >= 1);
    const parentId = engine.parentModuleIds[0];
    assert.equal(owned.get(engine.moduleId)?.parentModuleIds[0], parentId);
    assert.ok(owned.has(parentId));
    assert.equal(engine.entitlementKey, entitlements.get(parentId)?.entitlementKey);
  }
});

test("all 822 billable entitlements are unique and fail closed", () => {
  const billable = commercial.records.filter((x) => x.separatelyBillable);
  assert.equal(commercial.ownedUnitCount, 893);
  assert.equal(commercial.records.length, 893);
  assert.equal(billable.length, 822);
  assert.equal(new Set(billable.map((x) => x.entitlementKey)).size, 822);
  assert.equal(commercial.counts.separatelyBillable, 822);
  assert.equal(commercial.counts.inheritedEntitlements, 71);
  assert.equal(commercial.liveBillingEnabled, false);
  assert.equal(commercial.paymentExecuted, false);
  assert.equal(commercial.productionVerifiedCount, 0);
  assert.ok(commercial.records.every((x) => x.ownerProduct === "ARIA" &&
    x.revenueEngine.billingEnabled === false &&
    x.revenueEngine.paymentExecuted === false &&
    x.revenueEngine.productionVerified === false));
});

test("all 39 newly owned modules have explicit semantic scope and crosswalk", () => {
  assert.equal(additional.count, 39);
  assert.equal(additional.records.length, 39);
  assert.equal(new Set(additional.records.map((x) => x.moduleId)).size, 39);
  assert.ok(additional.records.every((x) => x.scopeBoundary &&
    Array.isArray(x.relatedExistingModules) &&
    x.semanticDeduplicationStatus === "DISTINCT_SCOPE_CROSSWALK_RECORDED"));
});
