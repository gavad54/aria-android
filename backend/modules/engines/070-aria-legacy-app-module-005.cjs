"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-070",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "ARIA-LEGACY-APP-MODULE-005",
  "name": "زیرساخت ابری و دارایی دیجیتال — موتور دامنه",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-070",
  "parentModuleIds": [
    "ARIA-LEGACY-APP-MODULE-005"
  ],
  "inputContract": [
    "tenant_context",
    "file_metadata",
    "storage_policy",
    "retention_policy",
    "sharing_grant"
  ],
  "outputContract": [
    "asset_reference",
    "version_history",
    "access_audit",
    "quota_report",
    "backup_restore_evidence"
  ],
  "requiredInputs": [
    "file_metadata",
    "storage_policy",
    "retention_policy",
    "sharing_grant"
  ],
  "operations": [
    "validate_tenant_and_permissions",
    "validate_inputs_and_consent",
    "execute_internal_workflow",
    "quality_and_policy_review",
    "record_audit_and_outcome"
  ],
  "handlerKey": "engine.ARIA_DOMAIN_ENGINE",
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
