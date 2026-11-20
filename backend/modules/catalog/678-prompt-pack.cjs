"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-678",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 678,
  "commercialModuleId": "prompt-pack",
  "name": "ساخت و فروش پک پرامپت",
  "domain": "content",
  "description": "بسته‌بندی، نسخه‌بندی و فروش پرامپت‌های اصیل",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#prompt-pack",
  "hostCanonicalContractId": 209,
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
  "revenueModel": "کارمزد بازارگاه",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "marketplace_fee_or_commission"
    ],
    "meteringUnit": "order_or_transaction",
    "entitlementKey": "aria.module.prompt-pack",
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
