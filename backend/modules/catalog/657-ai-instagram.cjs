"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-657",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 657,
  "commercialModuleId": "ai-instagram",
  "name": "ساخت کاور اینستاگرام با AI",
  "domain": "creative",
  "description": "طراحی کاور و قالب‌های برندمحور؛ خروجی نهایی نیازمند اتصال تولید تصویر",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#ai-instagram",
  "hostCanonicalContractId": 36,
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
    "capture_creative_brief",
    "define_visual_direction",
    "prepare_asset_specification",
    "check_rights_and_consent",
    "quality_review"
  ],
  "revenueModel": "اعتبار تصویر؛ اشتراک حرفه‌ای",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "prepaid_credits"
    ],
    "meteringUnit": "image_output",
    "entitlementKey": "aria.module.ai-instagram",
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
    "providerRequired": true,
    "paymentProviderState": "NOT_CONNECTED",
    "externalProviderState": "NOT_CONNECTED",
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
