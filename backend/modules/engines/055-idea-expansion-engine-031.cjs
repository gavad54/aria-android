"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-055",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "idea-expansion-engine-031",
  "name": "کیوریشن دانش سازمانی — موتور تخصصی",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-055",
  "parentModuleIds": [
    "ARIA-IDEA-MODULE-031"
  ],
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "documents",
    "owners",
    "classification",
    "access_policy"
  ],
  "outputContract": [
    "knowledge_article",
    "source_lineage",
    "review_status"
  ],
  "requiredInputs": [
    "documents",
    "owners",
    "classification",
    "access_policy"
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
