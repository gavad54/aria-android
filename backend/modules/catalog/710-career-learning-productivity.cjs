"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-710",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 710,
  "commercialModuleId": "career-learning-productivity",
  "name": "رشد شغلی و بهره‌وری",
  "domain": "learning",
  "description": "مسیر شغلی و مهارتی، مدیریت زمان و تمرکز، تولید محتوای حرفه‌ای، وب‌سایت، شبکه اجتماعی، گزارش و تحلیل عملکرد، دریافت وجه و پیگیری نتیجه",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#career-learning-productivity",
  "hostCanonicalContractId": 169,
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
    "define_learning_goal",
    "build_learning_path",
    "create_practice",
    "assess_progress",
    "revise_plan"
  ],
  "revenueModel": "اشتراک حرفه‌ای؛ اعتبار تولید محتوا؛ فروش قالب و خدمات تخصصی",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "prepaid_credits",
      "digital_goods"
    ],
    "meteringUnit": "order_or_transaction",
    "entitlementKey": "aria.module.career-learning-productivity",
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
