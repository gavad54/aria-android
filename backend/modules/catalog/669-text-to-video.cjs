"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-669",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 669,
  "commercialModuleId": "text-to-video",
  "name": "تبدیل متن به ویدئو",
  "domain": "media",
  "description": "تبدیل سناریو به کلیپ با کنترل حقوق محتوا",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#text-to-video",
  "hostCanonicalContractId": 177,
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
    "capture_media_brief",
    "prepare_script_or_storyboard",
    "prepare_caption_or_transcript",
    "define_render_specification",
    "quality_review"
  ],
  "revenueModel": "اعتبار ویدئو",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "prepaid_credits"
    ],
    "meteringUnit": "video_minute_or_output",
    "entitlementKey": "aria.module.text-to-video",
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
  "productionVerified": false,
  domainHandler: true
});
