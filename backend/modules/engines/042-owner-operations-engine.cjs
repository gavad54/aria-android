"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-042",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "owner-operations-engine",
  "name": "Owner Operations & Release-Gate Engine",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-042",
  "parentModuleIds": [
    "ARIA-CONTROL-MODULE-004"
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
  domainHandler: true
});
