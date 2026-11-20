"use strict";
const fs=require("node:fs");
const path=require("node:path");
const modulesRuntime=require("./modules");
const {executeOverlayDomain}=require("./aria-overlay-domain-handlers.cjs");
const overlaySource=JSON.parse(fs.readFileSync(path.join(__dirname,"data","aria_111_module_expansion_registry.json"),"utf8"));
const ownership=JSON.parse(fs.readFileSync(path.join(__dirname,"data","aria_product_ownership_migration.json"),"utf8"));
const commercialSource=JSON.parse(fs.readFileSync(path.join(__dirname,"data","aria_commercial_execution_manifest.json"),"utf8"));
const transferred=new Set(Object.values(ownership.products).flatMap(p=>p.ownedModuleIds));
const archived=new Set(ownership.archivedDomainModuleIds);
const overlayRecords=overlaySource.moduleCatalog.filter(x=>!transferred.has(x.moduleId)&&!archived.has(x.moduleId)).map(x=>({
 moduleId:x.moduleId,recordType:"HISTORICAL_OVERLAY_MODULE",ownerProduct:"ARIA",name:x.name,domain:x.parentDomainId||x.domainPackId||"aria-general",
 requiredInputs:x.inputContract||[],operations:x.workflow||[],outputContract:x.outputContract||[],acceptanceCriteria:x.acceptanceCriteria||[],
 monetizationModel:x.monetizationModel||"OWNER_CONFIGURED_AFTER_VALIDATION",sourceRecord:x
}));
const commercialRecords=commercialSource.records.map(x=>({
 moduleId:"ARIA-COMMERCIAL-MODULE-"+x.catalogEntryId,recordType:"COMMERCIAL_CATALOG_MODULE",ownerProduct:"ARIA",name:x.name,domain:x.domain,
 requiredInputs:Object.keys(x.executionContract.acceptedInput||{}),operations:x.executionContract.operations,outputContract:x.executionContract.resultShape,
 acceptanceCriteria:["input_contract_validated","tenant_boundary_enforced","result_reviewed","audit_record_created"],
 monetizationModel:x.revenueModel,revenueEngine:x.revenueEngine,commercialModuleId:x.commercialModuleId,catalogEntryId:x.catalogEntryId
}));
const records=[...overlayRecords,...commercialRecords];
const BY_ID=new Map(records.map(x=>[x.moduleId,x]));
if(overlayRecords.length!==72||commercialRecords.length!==72||records.length!==144||BY_ID.size!==144) throw new Error("ARIA_144_DOMAIN_MODULE_REGISTRY_INVALID");
const REGISTRY=Object.freeze({
 product:"ARIA",baselineCanonicalModuleCount:639,addedModuleCount:144,totalProductFacingModuleCount:783,
 counts:Object.freeze({historicalOverlay:72,commercialCatalog:72}),records:Object.freeze(records)
});
async function executeAriaDomainModule(moduleId,input={},context={}) {
 const record=BY_ID.get(String(moduleId));
 if(!record) throw new Error("ARIA_DOMAIN_MODULE_NOT_FOUND");
 if(!context.tenantId) throw new Error("MODULE_TENANT_REQUIRED");
 if(!context.actorId) throw new Error("MODULE_ACTOR_REQUIRED");
 if(!input||typeof input!=="object"||Array.isArray(input)) throw new Error("MODULE_INPUT_INVALID");
 const goal=typeof input.goal==="string"?input.goal.trim():"";
 if(goal.length<4||goal.length>1200) throw new Error("MODULE_INPUT_MISSING");
 if(record.requiredInputs.includes("consent")&&input.consent!==true) throw new Error("MODULE_CONSENT_REQUIRED");
 if(record.recordType==="COMMERCIAL_CATALOG_MODULE") {
  const backendModuleId="ARIA-CATALOG-"+record.catalogEntryId;
  const result=await modulesRuntime.executeModule(backendModuleId,input,{actorId:String(context.actorId),tenantId:String(context.tenantId)});
  return Object.freeze({...result,inventoryModuleId:record.moduleId,tenantScope:String(context.tenantId),actorScope:String(context.actorId),executionState:"LOCAL_DOMAIN_LOGIC_EXECUTED",externalExecutionPerformed:false,paymentExecuted:false,productionVerified:false});
 }
 const operationPlan=record.operations.map((operation,index)=>({sequence:index+1,operation,state:"LOCAL_STEP_PREPARED",tenantScope:String(context.tenantId),requiresHumanReview:true}));
 const domainResult=executeOverlayDomain(record,input,context);
 const artifact={
  moduleId:record.moduleId,moduleName:record.name,domain:record.domain,objective:goal,
  purpose:record.sourceRecord.purpose||record.sourceRecord.deliverable||record.name,
  inputSummary:Object.keys(input).sort(),outputContract:record.outputContract,
  operationPlan,acceptanceCriteria:record.acceptanceCriteria,
  monetizationModel:record.monetizationModel,
  domainResult,
  auditRecord:{actorId:String(context.actorId),tenantId:String(context.tenantId),event:domainResult?"OVERLAY_DOMAIN_LOGIC_EXECUTED":"OVERLAY_LOCAL_WORK_ITEM_PREPARED"},
  externalExecutionPerformed:false,paymentExecuted:false,productionVerified:false
 };
 return Object.freeze({moduleId:record.moduleId,tenantScope:String(context.tenantId),actorScope:String(context.actorId),localWorkItemPrepared:true,domainLogicExecuted:Boolean(domainResult),artifact,operationPlan,executionState:domainResult?"LOCAL_DOMAIN_LOGIC_EXECUTED":"LOCAL_WORK_ITEM_ONLY",externalExecutionPerformed:false,paymentExecuted:false,productionVerified:false});
}
module.exports={REGISTRY,BY_ID,executeAriaDomainModule};
