"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { createCatalogDomainHandler } = require("../../aria-catalog-domain-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-709",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 709,
  "commercialModuleId": "family-health-wellbeing",
  "name": "سلامت و رفاه خانواده",
  "domain": "personal",
  "description": "برنامه‌ریزی وعده غذایی، عادت‌های سالم، خواب، ورزش، استرس، مراقبت کودک و حیوان خانگی و یادگیری زبان؛ ابزارهای عمومی رفاهی نه تشخیص یا درمان پزشکی",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#family-health-wellbeing",
  "hostCanonicalContractId": 233,
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
  "revenueModel": "اشتراک خانوادگی؛ محتوای آموزشی پولی؛ ارجاع شفاف به خدمات مجاز",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "digital_goods"
    ],
    "meteringUnit": "course_or_learning_plan",
    "entitlementKey": "aria.module.family-health-wellbeing",
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
  "productionVerified": false,
  domainHandler: createCatalogDomainHandler(709)
});
