"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { createEngineDomainHandler } = require("../../aria-engine-domain-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-051",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "idea-expansion-engine-026",
  "name": "کنترل وابستگی و نقاط عطف — موتور تخصصی",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-051",
  "parentModuleIds": [
    "ARIA-IDEA-MODULE-026"
  ],
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "work_breakdown",
    "dependencies",
    "milestones"
  ],
  "outputContract": [
    "dependency_graph",
    "critical_path",
    "change_impact"
  ],
  "requiredInputs": [
    "work_breakdown",
    "dependencies",
    "milestones"
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
  domainHandler: createEngineDomainHandler(51)
});
