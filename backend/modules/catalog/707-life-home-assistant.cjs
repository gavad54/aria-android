"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { createCatalogDomainHandler } = require("../../aria-catalog-domain-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-707",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 707,
  "commercialModuleId": "life-home-assistant",
  "name": "دستیار خانه و زندگی",
  "domain": "personal",
  "description": "زیرماژول‌های تعمیر و نگهداری خانه، مدیریت کارهای روزمره، نظافت، جابه‌جایی، باغبانی، نصب و تعمیرات و برنامه‌ریزی غذای سالم؛ متصل به گردش‌کارها و بازار خدمات",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#life-home-assistant",
  "hostCanonicalContractId": 237,
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
  "revenueModel": "اشتراک خانوادگی؛ کارمزد معرفی متخصص پس از احراز و رضایت؛ خدمات ممتاز",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "marketplace_fee_or_commission",
      "premium_service"
    ],
    "meteringUnit": "qualified_lead_or_booking",
    "entitlementKey": "aria.module.life-home-assistant",
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
  domainHandler: createCatalogDomainHandler(707)
});
