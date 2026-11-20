"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-695",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 695,
  "commercialModuleId": "landing-page",
  "name": "صفحه‌ساز هوشمند",
  "domain": "web-builder",
  "description": "ساخت پیش‌نویس صفحهٔ فرود فارسی، ویرایش متن و پیش‌نمایش؛ انتشار عمومی هنوز فعال نیست",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#landing-page",
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
  "revenueModel": "اشتراک حرفه‌ای؛ قالب‌های تخصصی",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription"
    ],
    "meteringUnit": "site_or_published_page",
    "entitlementKey": "aria.module.landing-page",
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
