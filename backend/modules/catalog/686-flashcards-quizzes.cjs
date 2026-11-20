"use strict";
const { createDomainModule } = require("../../aria-module-runtime.cjs");
module.exports = createDomainModule({
  "moduleId": "ARIA-CATALOG-686",
  "moduleType": "COMMERCIAL_CATALOG_MODULE",
  "catalogEntryId": 686,
  "commercialModuleId": "flashcards-quizzes",
  "name": "فلش‌کارت و آزمون",
  "domain": "learning",
  "description": "تولید پرسش، آزمون و فلش‌کارت از منابع کاربر",
  "sourceLineage": "backend/data/aria_commercial_module_registry.json#flashcards-quizzes",
  "hostCanonicalContractId": 301,
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
  "revenueModel": "اشتراک آموزشی",
  "revenueEngine": {
    "state": "DESIGNED_NOT_MONETIZED",
    "billingModes": [
      "subscription"
    ],
    "meteringUnit": "course_or_learning_plan",
    "entitlementKey": "aria.module.flashcards-quizzes",
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
