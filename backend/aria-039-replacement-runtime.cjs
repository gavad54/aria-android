"use strict";
const fs = require("node:fs");
const path = require("node:path");
const domainHandlers = require("./aria-039-domain-handlers.cjs");
const REGISTRY = JSON.parse(fs.readFileSync(path.join(__dirname,"data","aria_039_replacement_module_registry.json"),"utf8"));
const BY_ID = new Map(REGISTRY.records.map(x=>[x.moduleId,x]));
if(REGISTRY.count!==39||REGISTRY.records.length!==39||BY_ID.size!==39||REGISTRY.records.some(x=>x.ownerProduct!=="ARIA"||x.ownerStatus!=="OWNED"||!x.operations?.length||!x.acceptanceCriteria?.length)) throw new Error("ARIA_REPLACEMENT_REGISTRY_INVALID");
function executeReplacementModule(moduleId,input={},context={}) {
 const module=BY_ID.get(String(moduleId));
 if(!module) throw new Error("ARIA_REPLACEMENT_MODULE_NOT_FOUND");
 if(!context.tenantId) throw new Error("MODULE_TENANT_REQUIRED");
 if(!context.actorId) throw new Error("MODULE_ACTOR_REQUIRED");
 if(!input||typeof input!=="object"||Array.isArray(input)) throw new Error("MODULE_INPUT_INVALID");
 const goal=typeof input.goal==="string"?input.goal.trim():"";
 if(goal.length<4||goal.length>1200) throw new Error("MODULE_INPUT_MISSING");
 const payloadBytes=Buffer.byteLength(JSON.stringify(input.context||{}),"utf8");
 if(payloadBytes>12000) throw new Error("MODULE_INPUT_INVALID");
 const operationPlan=module.operations.map((operation,index)=>({sequence:index+1,operation,state:"LOCAL_STEP_PREPARED",tenantScope:String(context.tenantId),requiresHumanReview:true}));
 const domainExecution=domainHandlers.executeDomainModule(module,input,context);
 const domainArtifact={moduleId:module.moduleId,name:module.name,domain:module.domain,objective:goal,description:module.description,inputSummary:Object.keys(input).sort(),dataEntities:module.dataEntities,operationPlan,domainExecution,domainResult:domainExecution.result,deliverable:module.outputContract,acceptanceCriteria:module.acceptanceCriteria,kpis:module.kpis,monetizationModel:module.monetizationModel,revenueEngine:module.revenueEngine,commercialization:module.commercialization,auditRecord:{actorId:String(context.actorId),tenantId:String(context.tenantId),event:"LOCAL_DOMAIN_WORK_ITEM_PREPARED"},externalExecutionPerformed:false,paymentExecuted:false,productionVerified:false};
 return Object.freeze({moduleId:module.moduleId,moduleName:module.name,tenantScope:String(context.tenantId),actorScope:String(context.actorId),domainLogicExecuted:true,domainExecution,artifact:domainArtifact,operationPlan,executionState:"LOCAL_DOMAIN_LOGIC_EXECUTED",externalExecutionPerformed:false,paymentExecuted:false,productionVerified:false});
}
module.exports={REGISTRY,BY_ID,executeReplacementModule};
