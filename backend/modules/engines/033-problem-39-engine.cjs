"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-033",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "problem-39-engine",
  "name": "مدیریت دریافت و پیگیری پرداخت — موتور تخصصی",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-033",
  "parentModuleIds": [
    "ARIA-PROBLEM-MODULE-039"
  ],
  "inputContract": [
    "goal",
    "constraints",
    "consent",
    "sourceReferences"
  ],
  "outputContract": [
    "actionPlan",
    "checklist",
    "riskFlags",
    "followUp"
  ],
  "requiredInputs": [
    "goal",
    "constraints",
    "consent",
    "sourceReferences"
  ],
  "operations": [
    "validate_input",
    "build_local_plan",
    "quality_review",
    "track_outcome"
  ],
  "handlerKey": "engine.PROBLEM_DOMAIN_ENGINE",
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
