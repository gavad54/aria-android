"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-706",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 706,
  "commercialModuleId": "ai-voiceover",
  "name": "گویندگی و نریشن با AI",
  "domain": "media",
  "description": "تبدیل متن مجاز به نریشن با رضایت و مجوز صدای لازم",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#ai-voiceover",
  "hostCanonicalContractId": 117,
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
  "revenueModel": "دقیقهٔ تولید؛ اشتراک",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "metered_usage"
    ],
    "meteringUnit": "audio_minute",
    "entitlementKey": "aria.module.ai-voiceover",
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
  domainHandler: true
});
