"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-065",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "idea-expansion-engine-047",
  "name": "برنامه پوشش شیفت و ظرفیت نیروی کار — موتور تخصصی",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-065",
  "parentModuleIds": [
    "ARIA-IDEA-MODULE-047"
  ],
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "shift_demand",
    "availability",
    "role_requirements",
    "constraints"
  ],
  "outputContract": [
    "shift_roster",
    "coverage_gaps",
    "conflict_alerts"
  ],
  "requiredInputs": [
    "shift_demand",
    "availability",
    "role_requirements",
    "constraints"
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
