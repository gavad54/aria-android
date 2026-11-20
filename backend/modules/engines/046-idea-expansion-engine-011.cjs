"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-046",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "idea-expansion-engine-011",
  "name": "ثبت کیفیت سری تولید — موتور تخصصی",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-046",
  "parentModuleIds": [
    "ARIA-IDEA-MODULE-011"
  ],
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "batch",
    "inspection_plan",
    "test_results"
  ],
  "outputContract": [
    "quality_record",
    "nonconformance",
    "corrective_action"
  ],
  "requiredInputs": [
    "batch",
    "inspection_plan",
    "test_results"
  ],
  "operations": [
    "validate_input",
    "authorize_tenant_and_role",
    "check_consent_and_policy",
    "execute_scoped_workflow",
    "quality_review",
    "record_audit_and_outcome"
  ],
  "handlerKey": "engine.NEW_IDEA_ENGINE",
  "hostCanonicalContractId": null,
  "accessPolicy": [
    "tenant_isolation",
    "least_privilege",
    "audit_log"
  ],
  "executionState": "LOCAL_WORK_ITEM_ONLY",
  "productionVerified": false
  domainHandler: true
});
