"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-705",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 705,
  "commercialModuleId": "ai-sales-assistant",
  "name": "دستیار فروش هوشمند",
  "domain": "business",
  "description": "پیش‌نویس پیگیری مشتری و پیشنهاد بعدی با تأیید انسان و ثبت سوابق",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#ai-sales-assistant",
  "hostCanonicalContractId": 34,
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
  "revenueModel": "اشتراک تیم فروش؛ هزینه راه‌اندازی",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "pay_per_output_or_setup"
    ],
    "meteringUnit": "order_or_transaction",
    "entitlementKey": "aria.module.ai-sales-assistant",
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
