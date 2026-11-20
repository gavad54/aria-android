"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
const { createCatalogDomainHandler } = require("../../aria-catalog-domain-handlers.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-712",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 712,
  "commercialModuleId": "business-model-studio",
  "name": "استودیو طراحی مدل کسب‌وکار",
  "domain": "business",
  "description": "انتخاب و ترکیب ۲۰ مدل درآمدی، تحلیل مشتری و کانال، قیمت‌گذاری، هزینه متغیر، حاشیه سود، سناریو و آزمایش بازار؛ بدون وعده درآمد قطعی",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#business-model-studio",
  "hostCanonicalContractId": 41,
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
    "define_business_model",
    "map_opportunities",
    "model_revenue_assumptions",
    "review_risks",
    "prepare_execution_plan"
  ],
  "revenueModel": "اشتراک کارآفرینی؛ گزارش امکان‌سنجی پولی؛ خدمات مشاوره",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription",
      "premium_service"
    ],
    "meteringUnit": "document_or_analysis_job",
    "entitlementKey": "aria.module.business-model-studio",
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
  domainHandler: createCatalogDomainHandler(712)
});
