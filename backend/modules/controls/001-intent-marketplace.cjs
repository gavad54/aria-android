"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { intentMarketplace } = require("../../aria-governance-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CONTROL-MODULE-001",
  "moduleType": "GOVERNANCE_CONTROL_MODULE",
  "name": "بازار هوشمند نیازها و قصدها",
  "sourceId": "ARIA-CONTROL-MODULE-001",
  "sourceLineage": "backend/data/aria_893_module_execution_registry.json#ARIA-CONTROL-MODULE-001",
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
    "policy_or_assumptions",
    "consent"
  ],
  "operations": [
    "validate",
    "authorize_or_simulate",
    "record_evidence",
    "review"
  ],
  "accessPolicy": [
    "explicit_contact_consent",
    "deny_by_default",
    "least_privilege",
    "human_approval_for_sensitive_actions",
    "immutable_audit"
  ],
  "safety": [
    "تماس فقط با رضایت صریح",
    "ضداسپم و کنترل نرخ",
    "عدم نمایش اطلاعات خصوصی پیش‌فرض"
  ],
  "executionBoundary": "ثبت قصد، تطبیق توضیح‌پذیر، پاسخ و نتیجه؛ بدون تکرار بازارگاه و Lead Market",
  "productionVerified": false,
  domainHandler: intentMarketplace
});
