"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-717",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 717,
  "commercialModuleId": "market-intelligence",
  "name": "هوشمندی بازار و کشف فرصت",
  "domain": "community",
  "description": "کشف نیاز و دسته‌بندی بازار، مقایسه عرضه و تقاضا، تحلیل رقبا و جایگاه‌یابی، امتیازدهی فرصت با شواهد، ساخت فهرست فروشندگان و خریداران و ارجاع کنترل‌شده به ARMIN MARKET بدون تکرار یا تصاحب بازارگاه مستقل",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#market-intelligence",
  "hostCanonicalContractId": 87,
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
  "revenueModel": "اشتراک تحلیل بازار؛ گزارش رقابتی؛ سرنخ تجاری با رضایت و افشای منبع",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription"
    ],
    "meteringUnit": "order_or_transaction",
    "entitlementKey": "aria.module.market-intelligence",
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
