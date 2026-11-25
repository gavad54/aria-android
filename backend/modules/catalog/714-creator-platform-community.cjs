"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { createCatalogDomainHandler } = require("../../aria-catalog-domain-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-714",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 714,
  "commercialModuleId": "creator-platform-community",
  "name": "موتور پلتفرم، محتوا و جامعه",
  "domain": "community",
  "description": "خدمات حرفه‌ای، محصولات دیجیتال، جامعه مشتریان، پلتفرم چندطرفه، مدل داده‌محور، محتوای اشتراکی و ارجاع؛ همراه مدیریت سازنده، کیفیت و حقوق محتوا",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#creator-platform-community",
  "hostCanonicalContractId": 12,
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
    "define_community_need",
    "design_participation_flow",
    "prepare_listing_or_program",
    "define_trust_rules",
    "review_outcomes"
  ],
  "revenueModel": "اشتراک سازنده؛ کارمزد بازارگاه؛ فروش محصول دیجیتال؛ خدمات حرفه‌ای",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "marketplace_fee_or_commission",
      "digital_goods"
    ],
    "meteringUnit": "order_or_transaction",
    "entitlementKey": "aria.module.creator-platform-community",
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
  domainHandler: createCatalogDomainHandler(714)
});
