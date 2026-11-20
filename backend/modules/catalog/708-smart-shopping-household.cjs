"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-708",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 708,
  "commercialModuleId": "smart-shopping-household",
  "name": "خرید هوشمند و مدیریت هزینه",
  "domain": "personal",
  "description": "مقایسه قیمت و ارزش خرید، بررسی اصالت و کیفیت، بودجه‌بندی، فهرست خرید، بازگشت کالا، هدیه و بازیافت؛ متصل به بازارگاه و موتور داده",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#smart-shopping-household",
  "hostCanonicalContractId": 11,
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
    "capture_personal_goal",
    "identify_constraints",
    "prepare_options",
    "create_safe_action_plan",
    "review_progress"
  ],
  "revenueModel": "اشتراک خرید هوشمند؛ کمیسیون افشاشده همکاری در فروش؛ خدمات فروشندگان",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "marketplace_fee_or_commission"
    ],
    "meteringUnit": "order_or_transaction",
    "entitlementKey": "aria.module.smart-shopping-household",
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
  domainHandler: true
});
