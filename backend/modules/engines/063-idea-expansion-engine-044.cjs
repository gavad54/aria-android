"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-063",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "idea-expansion-engine-044",
  "name": "دفتر منشأ و مالکیت دارایی فکری — موتور تخصصی",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-063",
  "parentModuleIds": [
    "ARIA-IDEA-MODULE-044"
  ],
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "work_id",
    "contributors",
    "source_files",
    "rights_evidence"
  ],
  "outputContract": [
    "provenance_record",
    "contributor_graph",
    "rights_summary"
  ],
  "requiredInputs": [
    "work_id",
    "contributors",
    "source_files",
    "rights_evidence"
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
