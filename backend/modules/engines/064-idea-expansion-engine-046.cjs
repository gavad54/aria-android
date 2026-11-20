"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-064",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "idea-expansion-engine-046",
  "name": "ماتریس مهارت و شایستگی نقش — موتور تخصصی",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-064",
  "parentModuleIds": [
    "ARIA-IDEA-MODULE-046"
  ],
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "role_profile",
    "skill_framework",
    "evidence",
    "employee_consent"
  ],
  "outputContract": [
    "competency_matrix",
    "skill_gap",
    "development_plan"
  ],
  "requiredInputs": [
    "role_profile",
    "skill_framework",
    "evidence",
    "employee_consent"
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
  "productionVerified": false,
  domainHandler: true
});
