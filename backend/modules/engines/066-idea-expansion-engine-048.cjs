"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { createEngineDomainHandler } = require("../../aria-engine-domain-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-066",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "idea-expansion-engine-048",
  "name": "چک‌لیست بازرسی ایمنی عملیات — موتور تخصصی",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-066",
  "parentModuleIds": [
    "ARIA-IDEA-MODULE-048"
  ],
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "site_id",
    "inspection_template",
    "observations",
    "responsible_owner"
  ],
  "outputContract": [
    "inspection_record",
    "corrective_action",
    "closure_evidence"
  ],
  "requiredInputs": [
    "site_id",
    "inspection_template",
    "observations",
    "responsible_owner"
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
  domainHandler: createEngineDomainHandler(66)
});
