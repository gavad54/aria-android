"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-658",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 658,
  "commercialModuleId": "image-editing",
  "name": "ادیت و روتوش عکس",
  "domain": "creative",
  "description": "ویرایش تصویر با حفظ رضایت و حقوق صاحب تصویر",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#image-editing",
  "hostCanonicalContractId": 90,
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
  "revenueModel": "اعتبار تصویر",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "prepaid_credits"
    ],
    "meteringUnit": "image_output",
    "entitlementKey": "aria.module.image-editing",
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
