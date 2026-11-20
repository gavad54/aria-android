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
const overlayHandlerCount=Object.keys(require("./aria-overlay-domain-handlers.cjs").STRATEGIES).length;
if(overlayRecords.length!==72||commercialRecords.length!==72||records.length!==144||BY_ID.size!==144||overlayHandlerCount!==72||overlayRecords.some(record=>!executeOverlayDomain(record,{goal:"registry validation",context:{}},{actorId:"registry-check",tenantId:"registry-check"}))) throw new Error("ARIA_144_DOMAIN_MODULE_REGISTRY_INVALID");
const REGISTRY=Object.freeze({
 product:"ARIA",baselineCanonicalModuleCount:639,addedModuleCount:144,totalProductFacingModuleCount:783,
 counts:Object.freeze({historicalOverlay:72,commercialCatalog:72}),
 executionMaturity:Object.freeze({historicalOverlayDomainLogic:overlayHandlerCount,historicalOverlayWorkItemOnly:overlayRecords.length-overlayHandlerCount,commercialCatalogContractModules:commercialRecords.length,productionVerified:0}),
 records:Object.freeze(records)
});

function validateDomainPayload(value,depth=0,seen=new WeakSet()) {
 if(depth>8) throw new Error("MODULE_INPUT_DEPTH_EXCEEDED");
 if(typeof value==="string") { if(value.length>10000) throw new Error("MODULE_INPUT_STRING_LIMIT"); return; }
 if(value===null||typeof value!=="object") return;
 if(seen.has(value)) throw new Error("MODULE_INPUT_CYCLE");
 seen.add(value);
 if(Array.isArray(value)) {
  if(value.length>500) throw new Error("MODULE_INPUT_COLLECTION_LIMIT");
  for(const entry of value) validateDomainPayload(entry,depth+1,seen);
  return;
 }
 const keys=Object.keys(value);
 if(keys.length>100) throw new Error("MODULE_INPUT_COLLECTION_LIMIT");
 for(const key of keys) {
  if(["__proto__","prototype","constructor"].includes(key)) throw new Error("MODULE_INPUT_UNSAFE_KEY");
  if(key.length>128) throw new Error("MODULE_INPUT_KEY_LIMIT");
  validateDomainPayload(value[key],depth+1,seen);
 }
}
function validateScopeIdentifier(value,errorCode) {
 if(typeof value!=="string"&&!(typeof value==="number"&&Number.isFinite(value))) throw new Error(errorCode);
 const normalized=String(value).trim();
 if(!normalized||normalized.length>128||normalized.split("").some(ch=>{const code=ch.charCodeAt(0);return code<32||code===127;})) throw new Error(errorCode);
 return normalized;
}
async function executeAriaDomainModule(moduleId,input={},context={}) {
 const record=BY_ID.get(String(moduleId));
 if(!record) throw new Error("ARIA_DOMAIN_MODULE_NOT_FOUND");
 if(!context||typeof context!=="object"||Array.isArray(context)) throw new Error("MODULE_CONTEXT_INVALID");
 if(!context.tenantId) throw new Error("MODULE_TENANT_REQUIRED");
 if(!context.actorId) throw new Error("MODULE_ACTOR_REQUIRED");
 const tenantId=validateScopeIdentifier(context.tenantId,"MODULE_TENANT_INVALID");
 const actorId=validateScopeIdentifier(context.actorId,"MODULE_ACTOR_INVALID");
 if(!input||typeof input!=="object"||Array.isArray(input)) throw new Error("MODULE_INPUT_INVALID");
 let serializedInput;
 try { serializedInput=JSON.stringify(input); } catch { throw new Error("MODULE_INPUT_INVALID"); }
 if(typeof serializedInput!=="string"||Buffer.byteLength(serializedInput,"utf8")>65536) throw new Error("MODULE_INPUT_TOO_LARGE");
 validateDomainPayload(input);
 const goal=typeof input.goal==="string"?input.goal.trim():"";
 if(goal.length<4||goal.length>1200) throw new Error("MODULE_INPUT_MISSING");
 if(record.requiredInputs.includes("consent")&&input.consent!==true) throw new Error("MODULE_CONSENT_REQUIRED");
 if(record.recordType==="COMMERCIAL_CATALOG_MODULE") {
  const backendModuleId="ARIA-CATALOG-"+record.catalogEntryId;
  const result=await modulesRuntime.executeModule(backendModuleId,input,{actorId:actorId,tenantId:tenantId});
  return Object.freeze({...result,inventoryModuleId:record.moduleId,tenantScope:tenantId,actorScope:actorId,executionState:"LOCAL_DOMAIN_LOGIC_EXECUTED",externalExecutionPerformed:false,paymentExecuted:false,productionVerified:false});
 }
 const operationPlan=record.operations.map((operation,index)=>({sequence:index+1,operation,state:"LOCAL_STEP_PREPARED",tenantScope:tenantId,requiresHumanReview:true}));
 const domainResult=executeOverlayDomain(record,input,context);
 const artifact={
  moduleId:record.moduleId,moduleName:record.name,domain:record.domain,objective:goal,
  purpose:record.sourceRecord.purpose||record.sourceRecord.deliverable||record.name,
  inputSummary:Object.keys(input).sort(),outputContract:record.outputContract,
  operationPlan,acceptanceCriteria:record.acceptanceCriteria,
  monetizationModel:record.monetizationModel,
  domainResult,
  auditRecord:{actorId:actorId,tenantId:tenantId,event:domainResult?"OVERLAY_DOMAIN_LOGIC_EXECUTED":"OVERLAY_LOCAL_WORK_ITEM_PREPARED"},
  externalExecutionPerformed:false,paymentExecuted:false,productionVerified:false
 };
 return Object.freeze({moduleId:record.moduleId,tenantScope:tenantId,actorScope:actorId,localWorkItemPrepared:true,domainLogicExecuted:Boolean(domainResult),artifact,operationPlan,executionState:domainResult?"LOCAL_DOMAIN_LOGIC_EXECUTED":"LOCAL_WORK_ITEM_ONLY",externalExecutionPerformed:false,paymentExecuted:false,productionVerified:false});
}

async function executeAriaEngineModule(moduleId,input={},context={}) {
 const module=modulesRuntime.MODULE_BY_ID.get(String(moduleId));
 if(!module||module.manifest.moduleType!=="CHILD_ENGINE_MODULE") throw new Error("ARIA_ENGINE_MODULE_NOT_FOUND");
 if(!context||typeof context!=="object"||Array.isArray(context)) throw new Error("MODULE_CONTEXT_INVALID");
 if(!context.tenantId) throw new Error("MODULE_TENANT_REQUIRED");
 if(!context.actorId) throw new Error("MODULE_ACTOR_REQUIRED");
 const tenantId=validateScopeIdentifier(context.tenantId,"MODULE_TENANT_INVALID");
 const actorId=validateScopeIdentifier(context.actorId,"MODULE_ACTOR_INVALID");
 if(!input||typeof input!=="object"||Array.isArray(input)) throw new Error("MODULE_INPUT_INVALID");
 let serializedInput;
 try { serializedInput=JSON.stringify(input); } catch { throw new Error("MODULE_INPUT_INVALID"); }
 if(typeof serializedInput!=="string"||Buffer.byteLength(serializedInput,"utf8")>65536) throw new Error("MODULE_INPUT_TOO_LARGE");
 validateDomainPayload(input);
 const goal=typeof input.goal==="string"?input.goal.trim():"";
 if(goal.length<4||goal.length>1200) throw new Error("MODULE_INPUT_MISSING");
 const result=await modulesRuntime.executeModule(String(moduleId),input,{actorId,tenantId});
 return Object.freeze({...result,tenantScope:tenantId,actorScope:actorId,executionState:"LOCAL_DOMAIN_LOGIC_EXECUTED",externalExecutionPerformed:false,paymentExecuted:false,productionVerified:false});
}

module.exports={REGISTRY,BY_ID,executeAriaDomainModule,executeAriaEngineModule};
