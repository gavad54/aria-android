"use strict";
const fs=require("node:fs");
const path=require("node:path");
const REGISTRY=JSON.parse(fs.readFileSync(path.join(__dirname,"data","aria_893_commercialization_registry.json"),"utf8"));

const additionalManifest=JSON.parse(fs.readFileSync(path.join(__dirname,"data","aria_039_replacement_module_registry.json"),"utf8"));
const additionalById=new Map(additionalManifest.records.map(x=>[x.moduleId,x]));
for(const record of REGISTRY.records){const additional=additionalById.get(record.moduleId);if(additional)record.name=additional.name;}
const BY_ID=new Map(REGISTRY.records.map(x=>[x.moduleId,x]));
if(REGISTRY.ownedUnitCount!==893||REGISTRY.records.length!==893||BY_ID.size!==893||
 REGISTRY.records.some(x=>x.ownerProduct!=="ARIA"||x.revenueEngine?.billingEnabled!==false||x.revenueEngine?.paymentExecuted!==false||x.revenueEngine?.productionVerified!==false)||
 REGISTRY.records.filter(x=>x.recordType==="ENGINE_SUBMODULE"&&x.separatelyBillable!==false).length!==0) {
 throw new Error("ARIA_COMMERCIALIZATION_REGISTRY_INVALID");
}
function getCommercialContract(moduleId){
 const record=BY_ID.get(String(moduleId));
 if(!record) throw new Error("ARIA_COMMERCIAL_CONTRACT_NOT_FOUND");
 return record;
}
function prepareUsageEvent(moduleId,input={},context={}){
 const record=getCommercialContract(moduleId);
 if(!context.actorId) throw new Error("ARIA_COMMERCIAL_ACTOR_REQUIRED");
 if(!context.tenantId) throw new Error("ARIA_COMMERCIAL_TENANT_REQUIRED");
 const quantity=input.quantity===undefined?1:input.quantity;
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>1000000) throw new Error("ARIA_USAGE_QUANTITY_INVALID");
 const idempotencyKey=typeof input.idempotencyKey==="string"?input.idempotencyKey.trim():"";
 if(idempotencyKey.length<8||idempotencyKey.length>128) throw new Error("ARIA_USAGE_IDEMPOTENCY_REQUIRED");
 return Object.freeze({
  eventId:"usage-preview:"+idempotencyKey,moduleId:record.moduleId,tenantScope:String(context.tenantId),actorScope:String(context.actorId),
  entitlementKey:record.entitlementKey,meteringUnit:record.revenueEngine.meteringUnit,quantity,
  billable:record.revenueEngine.billingEnabled===true,paymentExecuted:false,revenueRecognized:false,
  state:"USAGE_PREVIEW_ONLY",commercialState:record.revenueEngine.state,
  disclaimer:"Usage preview only. No charge, payment, invoice settlement, or revenue recognition was performed."
 });
}
module.exports={REGISTRY,BY_ID,getCommercialContract,prepareUsageEvent};
