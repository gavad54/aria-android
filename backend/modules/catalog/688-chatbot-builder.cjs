"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { createCatalogDomainHandler } = require("../../aria-catalog-domain-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-688",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 688,
  "commercialModuleId": "chatbot-builder",
  "name": "ساخت چت‌بات پاسخ‌گو",
  "domain": "knowledge",
  "description": "ساخت دستیار مبتنی بر دانش تأییدشدهٔ کسب‌وکار",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#chatbot-builder",
  "hostCanonicalContractId": 56,
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
    "register_source",
    "summarize_knowledge",
    "build_faq_or_response",
    "check_source_quality",
    "record_version"
  ],
  "revenueModel": "اشتراک SaaS؛ مصرف API",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "metered_usage"
    ],
    "meteringUnit": "task_or_api_call",
    "entitlementKey": "aria.module.chatbot-builder",
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
  domainHandler: createCatalogDomainHandler(688)
});
