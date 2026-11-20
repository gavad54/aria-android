"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-061",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "idea-expansion-engine-042",
  "name": "ممیزی دسترس‌پذیری محصول — موتور تخصصی",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-061",
  "parentModuleIds": [
    "ARIA-IDEA-MODULE-042"
  ],
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "ui_routes",
    "accessibility_standard",
    "test_evidence"
  ],
  "outputContract": [
    "audit_report",
    "issues",
    "remediation_status"
  ],
  "requiredInputs": [
    "ui_routes",
    "accessibility_standard",
    "test_evidence"
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
