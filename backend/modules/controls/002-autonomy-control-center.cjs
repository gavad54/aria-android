"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { autonomyControl } = require("../../aria-governance-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CONTROL-MODULE-002",
  "moduleType": "GOVERNANCE_CONTROL_MODULE",
  "name": "مرکز کنترل خودمختاری عامل‌ها",
  "sourceId": "ARIA-CONTROL-MODULE-002",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-CONTROL-MODULE-002",
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
    "عامل حق افزایش اختیار خود را ندارد",
    "اقدامات حساس نیازمند تأیید انسانی",
    "لغو فوری اختیار و ثبت ممیزی"
  ],
  "executionBoundary": "سیاست و مجوز پیش از اجرای عامل؛ deny-by-default و حداقل دسترسی",
  "productionVerified": false,
  domainHandler: autonomyControl
});
