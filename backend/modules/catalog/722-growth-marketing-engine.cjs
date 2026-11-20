"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-722",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 722,
  "commercialModuleId": "growth-marketing-engine",
  "name": "موتور بازاریابی و رشد",
  "domain": "content",
  "description": "تقسیم‌بندی مخاطب با داده مجاز، طراحی کمپین، تقویم محتوا، متن و پیشنهاد، فرم جذب سرنخ، مدیریت رضایت و لغو عضویت، تحلیل قیف و گزارش عملکرد؛ ارسال یا انتشار فقط از API رسمی، با مجوز کاربر و محدودیت نرخ",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#growth-marketing-engine",
  "hostCanonicalContractId": 35,
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
    "capture_content_brief",
    "create_outline",
    "prepare_draft",
    "revise_content",
    "prepare_publication_calendar"
  ],
  "revenueModel": "اشتراک بازاریابی؛ اعتبار تحلیل؛ بسته کمپین؛ خدمات مدیریت رشد با شاخص‌های قابل سنجش",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "prepaid_credits"
    ],
    "meteringUnit": "order_or_transaction",
    "entitlementKey": "aria.module.growth-marketing-engine",
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
