"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-052",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "idea-expansion-engine-027",
  "name": "تخصیص ظرفیت منابع تیمی — موتور تخصصی",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-052",
  "parentModuleIds": [
    "ARIA-IDEA-MODULE-027"
  ],
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "team_capacity",
    "work_demand",
    "skills",
    "availability"
  ],
  "outputContract": [
    "capacity_plan",
    "utilization_view",
    "shortage_alerts"
  ],
  "requiredInputs": [
    "team_capacity",
    "work_demand",
    "skills",
    "availability"
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
});
