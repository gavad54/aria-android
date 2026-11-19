"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-069",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "ARIA-LEGACY-APP-MODULE-004",
  "name": "استودیوی خلاقیت و رسانه — موتور دامنه",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-069",
  "parentModuleIds": [
    "ARIA-LEGACY-APP-MODULE-004"
  ],
  "inputContract": [
    "creative_brief",
    "brand_guidelines",
    "audience",
    "channel",
    "asset_rights",
    "approval_constraints"
  ],
  "outputContract": [
    "creative_concepts",
    "draft_assets",
    "content_variants",
    "approval_package",
    "rights_manifest"
  ],
  "requiredInputs": [
    "creative_brief",
    "brand_guidelines",
    "audience",
    "channel",
    "asset_rights",
    "approval_constraints"
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
});
