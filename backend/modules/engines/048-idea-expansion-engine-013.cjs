"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-048",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "idea-expansion-engine-013",
  "name": "مدیریت ادعای ضمانت سازمانی — موتور تخصصی",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-048",
  "parentModuleIds": [
    "ARIA-IDEA-MODULE-013"
  ],
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "order_reference",
    "warranty_terms",
    "evidence"
  ],
  "outputContract": [
    "warranty_case",
    "decision",
    "service_history"
  ],
  "requiredInputs": [
    "order_reference",
    "warranty_terms",
    "evidence"
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
