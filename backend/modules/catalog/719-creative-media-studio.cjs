"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { createCatalogDomainHandler } = require("../../aria-catalog-domain-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-719",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 719,
  "commercialModuleId": "creative-media-studio",
  "name": "استودیوی خلاقیت و رسانه",
  "domain": "creative",
  "description": "تبدیل بریف به ایده و هویت بصری، طراحی لوگو و اقلام برند، تصویر محصول، بنر، پست، استوری، سناریوی ریلز، ویدئو و کاتالوگ؛ مدیریت نسخه‌ها، حقوق رسانه، رضایت افراد و کنترل کیفیت خروجی",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#creative-media-studio",
  "hostCanonicalContractId": 58,
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
  "revenueModel": "اعتبار تصویر و ویدئو؛ بسته طراحی؛ اشتراک سازنده؛ فروش قالب اصیل",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "prepaid_credits",
      "digital_goods"
    ],
    "meteringUnit": "image_output",
    "entitlementKey": "aria.module.creative-media-studio",
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
  domainHandler: createCatalogDomainHandler(719)
});
