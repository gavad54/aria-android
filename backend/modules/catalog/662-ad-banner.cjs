"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-662",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 662,
  "commercialModuleId": "ad-banner",
  "name": "بنر تبلیغاتی",
  "domain": "creative",
  "description": "طراحی بنر با اندازه‌های کانال‌های تبلیغاتی",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#ad-banner",
  "hostCanonicalContractId": 40,
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
  "revenueModel": "اعتبار؛ اشتراک",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "prepaid_credits"
    ],
    "meteringUnit": "image_output",
    "entitlementKey": "aria.module.ad-banner",
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
