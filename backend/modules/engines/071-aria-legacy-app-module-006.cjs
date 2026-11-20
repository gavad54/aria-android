"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-ENGINE-MODULE-071",
  "moduleType": "CHILD_ENGINE_MODULE",
  "sourceId": "ARIA-LEGACY-APP-MODULE-006",
  "name": "سایت‌ساز و صفحه‌ساز — موتور دامنه",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-ENGINE-MODULE-071",
  "parentModuleIds": [
    "ARIA-LEGACY-APP-MODULE-006"
  ],
  "inputContract": [
    "site_brief",
    "brand_kit",
    "page_content",
    "domain_authorization",
    "publish_approval"
  ],
  "outputContract": [
    "site_draft",
    "page_tree",
    "form_schema",
    "publish_manifest",
    "seo_report",
    "analytics_summary"
  ],
  "requiredInputs": [
    "site_brief",
    "brand_kit",
    "page_content",
    "domain_authorization",
    "publish_approval"
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
