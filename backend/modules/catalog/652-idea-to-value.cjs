"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-652",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 652,
  "commercialModuleId": "idea-to-value",
  "name": "ایده تا ارزش",
  "domain": "workspace",
  "description": "تبدیل ایده به مراحل اجرایی قابل پیگیری",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#idea-to-value",
  "hostCanonicalContractId": 78,
  "parentModuleIds": [],
  "inputContract": [
    "goal",
    "context"
  ],
  "outputContract": [
    "domainArtifact",
    "workItem"
  ],
  "requiredInputs": [
    "goal",
    "context"
  ],
  "operations": [
    "capture_request",
    "clarify_goal",
    "prioritize_work",
    "create_action_plan",
    "record_outcome"
  ],
  "revenueModel": "اشتراک حرفه‌ای؛ بستهٔ اعتبار",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "prepaid_credits"
    ],
    "meteringUnit": "completed_task_or_seat",
    "entitlementKey": "aria.module.idea-to-value",
    "price": {
      "amount": null,
      "currency": null,
      "policy": "OWNER_CONFIGURED"
    },
    "freeTier": {
      "enabled": false,
      "quota": null,
      "policy": "OWNER_CONFIGURED"
    },
    "usageLimits": {
      "policy": "OWNER_CONFIGURED"
    },
    "refundPolicy": "OWNER_CONFIGURED",
    "taxAndFeeDisclosureRequired": true,
    "providerRequired": false,
    "paymentProviderState": "NOT_CONNECTED",
    "externalProviderState": "NOT_REQUIRED_FOR_LOCAL_WORKFLOW",
    "revenueRecognition": "RECORD_ONLY_AFTER_VERIFIED_PAYMENT_OR_PROVIDER_EVENT",
    "antiAbuse": "RATE_LIMIT_QUOTA_IDEMPOTENCY_AND_AUDIT_REQUIRED"
  },
  "commercialState": "NOT_LIVE",
  "accessPolicy": [
    "tenant_isolation",
    "least_privilege",
    "audit_log",
    "idempotency",
    "rate_limit"
  ],
  "assumptions": [
    "No payment or external provider is executed by this local module handler."
  ],
  "productionVerified": false
});
