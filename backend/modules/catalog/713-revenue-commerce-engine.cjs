"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-713",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 713,
  "commercialModuleId": "revenue-commerce-engine",
  "name": "موتور درآمد، تجارت و تسویه",
  "domain": "business",
  "description": "پیکربندی اشتراک، فریمیوم، بازارگاه، تجارت الکترونیک، فروش مستقیم و عمده، تبلیغات، همکاری در فروش، مجوز، فرانچایز، خرده‌فروشی، توزیع، پرداخت مصرفی، اجاره و لیزینگ؛ نیازمند قرارداد، پرداخت و کنترل مالی",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#revenue-commerce-engine",
  "hostCanonicalContractId": 8,
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
  "revenueModel": "کارمزد تراکنش شفاف؛ اشتراک فروشنده؛ هزینه راه‌اندازی؛ هزینه خدمات و تسویه",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "pay_per_output_or_setup",
      "marketplace_fee_or_commission"
    ],
    "meteringUnit": "order_or_transaction",
    "entitlementKey": "aria.module.revenue-commerce-engine",
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
