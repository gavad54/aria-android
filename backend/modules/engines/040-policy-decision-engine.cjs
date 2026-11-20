"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { createEngineDomainHandler } = require("../../aria-engine-domain-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-040",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "policy-decision-engine",
  "name": "Policy Decision & Capability Grant Engine",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-040",
  "parentModuleIds": [
    "ARIA-CONTROL-MODULE-002"
  ],
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "request_payload",
    "policy_or_assumptions"
  ],
  "outputContract": [
    "decision_or_result",
    "audit_record",
    "explainability"
  ],
  "requiredInputs": [
    "request_payload",
    "policy_or_assumptions"
  ],
  "operations": [
    "validate",
    "authorize_or_simulate",
    "record_evidence",
    "review"
  ],
  "handlerKey": "engine.HISTORICAL_CONTROL_ENGINE",
  "hostCanonicalContractId": null,
  "accessPolicy": [
    "tenant_isolation",
    "least_privilege",
    "audit_log"
  ],
  "executionState": "LOCAL_WORK_ITEM_ONLY",
  "productionVerified": false,
  domainHandler: createEngineDomainHandler(40)
});
