"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-683",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 683,
  "commercialModuleId": "resume-portfolio",
  "name": "رزومه و پورتفولیو",
  "domain": "content",
  "description": "تولید رزومه و نمونه‌کار از اطلاعات واقعی کاربر",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#resume-portfolio",
  "hostCanonicalContractId": 44,
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
  "revenueModel": "خروجی پولی؛ اشتراک",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "pay_per_output_or_setup"
    ],
    "meteringUnit": "completed_task_or_seat",
    "entitlementKey": "aria.module.resume-portfolio",
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
