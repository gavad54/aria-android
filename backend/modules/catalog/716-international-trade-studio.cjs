"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-716",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 716,
  "commercialModuleId": "international-trade-studio",
  "name": "استودیوی تجارت بین‌الملل",
  "domain": "business",
  "description": "تحلیل بازار و کشور مقصد، غربال فرصت‌های صادرات و واردات، چک‌لیست اسناد، مقایسه تأمین‌کننده، برآورد سناریویی هزینه و ریسک، آماده‌سازی پیش‌نویس پیشنهاد تجاری و پیگیری معامله؛ قیمت و مقررات باید از منبع معتبر و تاریخ‌دار تأیید شوند",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#international-trade-studio",
  "hostCanonicalContractId": 88,
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
    "define_business_model",
    "map_opportunities",
    "model_revenue_assumptions",
    "review_risks",
    "prepare_execution_plan"
  ],
  "revenueModel": "اشتراک حرفه‌ای تجارت؛ گزارش بازار پولی؛ اعتبار تحلیل؛ خدمات راه‌اندازی سازمانی",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "prepaid_credits",
      "premium_service"
    ],
    "meteringUnit": "order_or_transaction",
    "entitlementKey": "aria.module.international-trade-studio",
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
