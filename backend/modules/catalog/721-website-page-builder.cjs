"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-721",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 721,
  "commercialModuleId": "website-page-builder",
  "name": "سایت‌ساز و صفحه‌ساز",
  "domain": "web-builder",
  "description": "تبدیل نیاز کسب‌وکار به ساختار سایت، تولید صفحه فارسی و چندزبانه، ویرایش بلوکی، قالب و مؤلفه، پیش‌نمایش موبایل، بررسی دسترس‌پذیری و SEO، نسخه‌بندی و انتشار کنترل‌شده با دامنه تأییدشده و امکان بازگشت نسخه",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#website-page-builder",
  "hostCanonicalContractId": 55,
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
    "capture_site_requirements",
    "create_sitemap",
    "prepare_page_specification",
    "review_responsive_accessibility",
    "publication_readiness_check"
  ],
  "revenueModel": "اشتراک سایت‌ساز؛ فروش قالب؛ میزبانی و دامنه با هزینه شفاف؛ خدمات راه‌اندازی",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "digital_goods"
    ],
    "meteringUnit": "order_or_transaction",
    "entitlementKey": "aria.module.website-page-builder",
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
