"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-684",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 684,
  "commercialModuleId": "translation-localization",
  "name": "ترجمه و بومی‌سازی",
  "domain": "content",
  "description": "ترجمهٔ متن و بومی‌سازی متناسب با بازار مقصد",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#translation-localization",
  "hostCanonicalContractId": 52,
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
    "capture_content_brief",
    "create_outline",
    "prepare_draft",
    "revise_content",
    "prepare_publication_calendar"
  ],
  "revenueModel": "اعتبار متنی؛ طرح سازمانی",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "prepaid_credits"
    ],
    "meteringUnit": "completed_task_or_seat",
    "entitlementKey": "aria.module.translation-localization",
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
  "productionVerified": false,
  domainHandler: true
});
