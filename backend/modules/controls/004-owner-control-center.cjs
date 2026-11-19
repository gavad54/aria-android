"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CONTROL-MODULE-004",
  "moduleType": "GOVERNANCE_CONTROL_MODULE",
  "name": "مرکز فرمان مالک",
  "sourceId": "ARIA-CONTROL-MODULE-004",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-CONTROL-MODULE-004",
  "domain": "governance",
  "parentModuleIds": [],
  "hostCanonicalContractId": null,
  "inputContract": [
    "authenticated_actor",
    "tenant_context",
    "request_payload",
    "policy_or_assumptions"
  ],
  "outputContract": [
    "decision_or_result",
    "audit_record",
    "explainability"
  ],
  "requiredInputs": [
    "request_payload",
    "policy_or_assumptions"
  ],
  "operations": [
    "validate",
    "authorize_or_simulate",
    "record_evidence",
    "review"
  ],
  "accessPolicy": [
    "deny_by_default",
    "least_privilege",
    "human_approval_for_sensitive_actions",
    "immutable_audit"
  ],
  "safety": [
    "MFA و حداقل دسترسی",
    "تأیید دوگانه برای تغییر حساس",
    "عدم نمایش secrets در UI"
  ],
  "executionBoundary": "نمایش سلامت، ممیزی دسترسی، کنترل انتشار و اقتصاد مالک؛ بدون افشای کلیدها",
  "productionVerified": false
});
