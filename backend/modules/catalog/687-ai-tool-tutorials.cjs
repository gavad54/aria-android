"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-687",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 687,
  "commercialModuleId": "ai-tool-tutorials",
  "name": "آموزش ابزارهای هوش مصنوعی",
  "domain": "learning",
  "description": "راهنمای گام‌به‌گام و به‌روز ابزارها",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#ai-tool-tutorials",
  "hostCanonicalContractId": 232,
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
  "revenueModel": "اشتراک؛ دورهٔ پولی",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "digital_goods"
    ],
    "meteringUnit": "course_or_learning_plan",
    "entitlementKey": "aria.module.ai-tool-tutorials",
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
  domainHandler: true
});
