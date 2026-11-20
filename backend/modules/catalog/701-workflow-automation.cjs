"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { createCatalogDomainHandler } = require("../../aria-catalog-domain-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-701",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 701,
  "commercialModuleId": "workflow-automation",
  "name": "طراحی گردش‌کار و اتوماسیون",
  "domain": "automation",
  "description": "اتصال مراحل تکراری با ثبت مجوز، گزارش و تأیید انسانی",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#workflow-automation",
  "hostCanonicalContractId": 647,
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
    "capture_trigger",
    "design_workflow_graph",
    "define_approval_gate",
    "define_failure_handling",
    "prepare_monitoring_spec"
  ],
  "revenueModel": "اشتراک تیمی؛ راه‌اندازی سازمانی",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription"
    ],
    "meteringUnit": "task_or_api_call",
    "entitlementKey": "aria.module.workflow-automation",
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
  domainHandler: createCatalogDomainHandler(701)
});
