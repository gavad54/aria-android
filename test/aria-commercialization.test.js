"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const commercial=require("../backend/aria-commercialization-runtime.cjs");
test("all 893 ARIA-owned units have unique commercial entitlements",()=>{
 assert.equal(commercial.REGISTRY.ownedUnitCount,893);
 assert.equal(commercial.REGISTRY.records.length,893);
 assert.equal(new Set(commercial.REGISTRY.records.map(x=>x.moduleId)).size,893);
 assert.equal(new Set(commercial.REGISTRY.records.filter(x=>x.separatelyBillable).map(x=>x.entitlementKey)).size,822);
 assert.deepEqual(commercial.REGISTRY.counts,{canonical:639,overlay:72,commercial:72,engines:71,additional:39,separatelyBillable:822,inheritedEntitlements:71});
 assert.ok(commercial.REGISTRY.records.every(x=>x.ownerProduct==="ARIA"&&x.revenueEngine.billingEnabled===false&&x.revenueEngine.paymentExecuted===false));
});
test("engine submodules inherit parent entitlement and cannot be billed twice",()=>{
 const engines=commercial.REGISTRY.records.filter(x=>x.recordType==="ENGINE_SUBMODULE");
 assert.equal(engines.length,71);
 assert.ok(engines.every(x=>x.separatelyBillable===false&&x.revenueEngine.state==="INHERITED_NOT_SEPARATELY_MONETIZED"));
 assert.ok(engines.every(x=>commercial.BY_ID.has(x.parentModuleIds[0])));
});
test("usage preview is tenant scoped, idempotency-keyed, and never charges",()=>{
 const item=commercial.REGISTRY.records.find(x=>x.recordType==="COMMERCIAL_MODULE");
 const event=commercial.prepareUsageEvent(item.moduleId,{quantity:2,idempotencyKey:"test-usage-001"},{actorId:"actor-a",tenantId:"tenant-a"});
 assert.equal(event.tenantScope,"tenant-a");
 assert.equal(event.quantity,2);
 assert.equal(event.billable,false);
 assert.equal(event.paymentExecuted,false);
 assert.equal(event.revenueRecognized,false);
 assert.equal(event.state,"USAGE_PREVIEW_ONLY");
});
test("usage preview rejects missing identity, invalid quantity, and missing idempotency key",()=>{
 const id=commercial.REGISTRY.records[0].moduleId;
 assert.throws(()=>commercial.prepareUsageEvent(id,{idempotencyKey:"12345678"},{tenantId:"t"}),{message:"ARIA_COMMERCIAL_ACTOR_REQUIRED"});
 assert.throws(()=>commercial.prepareUsageEvent(id,{idempotencyKey:"12345678"},{actorId:"a"}),{message:"ARIA_COMMERCIAL_TENANT_REQUIRED"});
 assert.throws(()=>commercial.prepareUsageEvent(id,{quantity:0,idempotencyKey:"12345678"},{actorId:"a",tenantId:"t"}),{message:"ARIA_USAGE_QUANTITY_INVALID"});
 assert.throws(()=>commercial.prepareUsageEvent(id,{quantity:1},{actorId:"a",tenantId:"t"}),{message:"ARIA_USAGE_IDEMPOTENCY_REQUIRED"});
});
